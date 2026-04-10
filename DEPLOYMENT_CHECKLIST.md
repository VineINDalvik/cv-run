# CV-Run 部署检查清单

## ✅ PDF 问题永久解决方案已完成

### 1. 根本原因分析
- **问题**: `@napi-rs/canvas` 等原生 Node.js 模块平台相关，macOS 版本无法在 Linux 服务器运行
- **症状**: 每次部署后 PDF 解析失败，错误信息 "Cannot find module '@napi-rs/canvas'" 或 "Failed to load native binding"

### 2. 实施的修复

#### 2.1 修改部署脚本 (`deploy-prod.sh`)
**从**: 部署本地编译的 node_modules（macOS 版本）
**到**: 在服务器上运行 `npm ci --production` 重新编译（Linux 版本）

```bash
# 第3步 - 部署
echo "  → Deploying package files..."
sshpass -p "$SERVER_PASS" rsync -avz package.json package-lock.json ...

echo "  → Installing dependencies on Linux server..."
sshpass -p "$SERVER_PASS" ssh root@112.124.30.51 \
  "cd /var/www/cv-run && rm -rf node_modules && npm ci --production"
```

#### 2.2 修复 server-with-env.js
**从**: `require('./server.js')`
**到**: `require('./.next/standalone/server.js')`

Next.js Standalone 模式将完整的服务器输出到 `.next/standalone/server.js`，必须正确指向这个路径。

#### 2.3 Polyfill 配置 (lib/pdf-parse.ts)
确保 DOMMatrix, ImageData, Path2D 这些浏览器 API 在 pdf-parse 加载前被定义：
```typescript
if (typeof (globalThis as Record<string, unknown>).DOMMatrix === 'undefined') {
  (globalThis as Record<string, unknown>).DOMMatrix = class DOMMatrix { ... }
}
// 同理 ImageData 和 Path2D
const { PDFParse } = require('pdf-parse')  // 在 polyfill 之后
```

#### 2.4 部署流程完整性 (deploy-prod.sh)
```
✓ Step 1: npm run build (本地编译)
✓ Step 2: Optional local test
✓ Step 3: Deployment
  ✓ 部署 .next/standalone/
  ✓ 部署 package.json 和 package-lock.json
  ✓ 在服务器上运行 npm ci --production  ← KEY FIX
  ✓ 部署 .next/static/
  ✓ 部署 public/
  ✓ 部署 lib/ (runtime polyfills)
  ✓ 部署配置文件 (.env.local, ecosystem.config.js, server-with-env.js)
✓ Step 4: PM2 restart
✓ Step 5: Verification
```

### 3. 服务隔离确认

#### 3.1 端口配置
- **cv-run**: 端口 3002 (via PM2)
  - PM2 配置: `ecosystem.config.js`
  - 环境变量: `PORT=3002`
  - Nginx 反向代理: localhost:3002
  
- **ignite**: (各自独立端口)
- **clare**: (各自独立端口)

#### 3.2 环境变量隔离
- 每个服务有独立的 `.env.local` 文件
- `server-with-env.js` 确保 .env.local 在 Next.js 启动前加载
- 不依赖其他服务的环境变量

#### 3.3 进程隔离
- PM2 独立管理每个服务
- 每个服务在单独的进程中运行
- 日志分开存储在 `/root/.pm2/logs/`

### 4. 文档和记录
- ✅ `PDF_SOLUTION_FINAL.md` — 详细的技术说明
- ✅ `DEPLOYMENT_CHECKLIST.md` — 本文件
- ✅ Git commit 已保存所有修复

### 5. 部署命令

**快速部署** (跳过本地测试):
```bash
./deploy-prod.sh --skip-test
```

**完整部署** (包含本地测试):
```bash
./deploy-prod.sh
```

### 6. 验证方法

#### 6.1 检查 PDF 依赖是否可用
```bash
ssh root@112.124.30.51
cd /var/www/cv-run
node -e "require('pdf-parse'); console.log('✓ pdf-parse loaded')"
```

#### 6.2 检查 PM2 状态
```bash
ssh root@112.124.30.51
pm2 status
pm2 logs cv-run
```

#### 6.3 测试 PDF 上传功能
1. 打开 https://cv-run.vinex.top/build
2. 上传 PDF 文件
3. 点击 "Parse & Structure"
4. 应该成功解析为 Step 2

### 7. 故障排查

**如果 npm ci 失败**:
```bash
# 检查服务器磁盘空间
df -h

# 检查网络连接
curl -I https://registry.npmjs.org/

# 手动运行 npm ci 查看详细错误
cd /var/www/cv-run
npm ci --production
```

**如果 PDF 解析仍然失败**:
1. 检查 `.next/standalone/server.js` 是否存在
2. 检查 `lib/pdf-parse.ts` 中的 polyfills 定义
3. 检查服务器日志: `pm2 logs cv-run`

### 8. 长期维护

- **每次部署** 都会自动处理 npm ci，不需要手动操作
- **原生模块** 始终在目标操作系统上编译
- **版本控制** package-lock.json 确保依赖一致性

---

**状态**: ✅ PDF 问题永久解决  
**最后更新**: 2026-04-09  
**相关文件**: PDF_SOLUTION_FINAL.md, deploy-prod.sh, server-with-env.js, lib/pdf-parse.ts
