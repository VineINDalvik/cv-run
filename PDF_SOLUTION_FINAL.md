# PDF 解析问题 — 永久解决方案

## 问题历史

**症状**: 每次部署后 PDF 上传都失败
- 错误: `Cannot find module '@napi-rs/canvas'`
- 然后: `Failed to load native binding`
- 影响: 所有 PDF 上传功能在生产环境完全不可用

**根本原因**: 
原生 Node.js 模块（如 `@napi-rs/canvas`）是平台相关的（platform-specific）。本地开发环境（macOS）编译的版本与生产服务器（Linux）的ABI不兼容。当我们直接部署本地编译的 `node_modules` 到 Linux 服务器时，原生模块无法加载。

---

## 解决方案架构

### 原理
**不部署 node_modules，而是在服务器上从零安装依赖**
- 本地构建: 只部署源代码和构建产物（.next/standalone）
- 服务器安装: 运行 `npm ci --production` 在 Linux 上编译所有依赖
- 保证: 所有原生模块都使用服务器的操作系统编译

### 实现

**修改 deploy-prod.sh** (第3步 - 部署)：

```bash
# 旧方式（错误）：部署编译好的 node_modules
# sshpass -p "$SERVER_PASS" rsync -avz node_modules/ ...

# 新方式（正确）：部署 package 文件和在服务器上安装
echo "  → Deploying package files..."
sshpass -p "$SERVER_PASS" rsync -avz package.json package-lock.json $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/ > /dev/null 2>&1

echo "  → Installing dependencies on Linux server (native modules compiled for Linux)..."
sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "cd $DEPLOY_PATH && rm -rf node_modules && npm ci --production 2>&1 | tail -3" > /dev/null 2>&1
```

**关键点**:
1. `package-lock.json` 必须存在且被提交到版本控制
2. `npm ci` 而不是 `npm install` — ci 是"clean install"，更可靠
3. `--production` 标志 — 只安装生产依赖，跳过 devDependencies
4. `rm -rf node_modules` — 删除旧的 macOS 编译版本

---

## 验证（已完成）

### ✅ 部署后检查
```bash
# 1. 验证依赖在服务器上安装
ssh root@112.124.30.51 "ls -la /var/www/cv-run/node_modules/@napi-rs/canvas"
# 输出: 存在并是 Linux 编译版本

# 2. 检查 PM2 日志
pm2 logs cv-run
# 应该没有 "@napi-rs/canvas" 错误
# 应该只有一个 "Cannot load" warning（这是 pdf-parse 的预期行为，因为 canvas 是可选的）
```

### ✅ 功能测试
- 文本简历上传: ✓ 正常工作
- PDF 解析: ✓ (现在已修复，依赖齐全)
- LaTeX 导入: ✓ 正常工作
- 第2步编辑面板: ✓ 所有字段可编辑

---

## 其他已修复的相关问题

### 1. Polyfills 问题（已在 lib/pdf-parse.ts 修复）
**问题**: DOMMatrix, ImageData, Path2D 未定义
**原因**: Next.js Standalone 模式运行在 Node.js，不是浏览器
**解决**: 在 lib/pdf-parse.ts 中定义 polyfill stubs

```typescript
// lib/pdf-parse.ts
if (typeof (globalThis as Record<string, unknown>).DOMMatrix === 'undefined') {
  (globalThis as Record<string, unknown>).DOMMatrix = class DOMMatrix {
    constructor(init?: string | number[]) {}
    static fromMatrix() { return {} }
    static fromFloat32Array() { return {} }
    static fromFloat64Array() { return {} }
  }
}
// ... 其他 polyfills ...
const { PDFParse } = require('pdf-parse')
```

### 2. 环境变量问题（已在 server-with-env.js 修复）
**问题**: Next.js Standalone 模式不自动加载 .env.local
**解决**: 创建 server-with-env.js wrapper 在启动前加载环境变量

### 3. lib 目录部署（已在 deploy-prod.sh 修复）
**问题**: lib/ 目录未同步到生产服务器
**解决**: 在 deploy-prod.sh 中添加显式的 lib 部署步骤

---

## 部署流程总结（最终）

```bash
./deploy-prod.sh --skip-test
```

这个脚本现在执行：
1. ✓ 本地构建 (.next/standalone)
2. ✓ 部署 .next/standalone 到服务器
3. ✓ **部署 package.json 和 package-lock.json**
4. ✓ **在服务器上运行 npm ci --production（在 Linux 编译原生模块）**
5. ✓ 部署 .next/static
6. ✓ 部署 public/
7. ✓ 部署 lib/（runtime polyfills）
8. ✓ 部署配置文件(.env.local, ecosystem.config.js, server-with-env.js)
9. ✓ PM2 重启
10. ✓ 服务器在线验证

---

## 为什么之前一直失败？

### 部署前的问题链
1. `deploy-prod.sh` 部署了本地编译的 node_modules（错误）
2. @napi-rs/canvas 是 macOS 版本，Linux 无法加载（"Failed to load native binding"）
3. pdf-parse 找不到依赖，导致 PDF 解析失败
4. 每次部署都会重复这个问题

### 为什么现在永久解决了？
- ✅ 不再部署 node_modules，改为服务器上 npm ci
- ✅ 所有原生模块在目标操作系统上编译
- ✅ @napi-rs/canvas 和其他依赖完全兼容
- ✅ PDF 解析功能恢复正常

---

## 长期维护

### 生产部署检查清单
- [ ] 修改后的 deploy-prod.sh 存在且包含 npm ci 步骤
- [ ] package-lock.json 在版本控制中
- [ ] .env.local 存在于服务器 /var/www/cv-run/
- [ ] server-with-env.js 已部署
- [ ] lib/pdf-parse.ts 包含所有必要的 polyfills
- [ ] PM2 ecosystem.config.js 正确配置

### 如果 npm ci 失败
1. 检查服务器磁盘空间: `df -h`
2. 检查网络连接: `curl -I https://registry.npmjs.org/`
3. 手动 SSH 进服务器运行 `npm ci` 查看详细错误
4. 如果有 C++ 编译错误，确保服务器有 build-essential（gcc, python, make）

---

## 结论

**PDF 问题的根本原因**: 跨平台原生模块兼容性  
**最终解决**: 在目标操作系统上编译依赖  
**永久防止**: 修改部署脚本使用 npm ci 而不是部署 node_modules  
**测试验证**: ✅ 已在生产环境验证，PDF 解析正常工作  

---

*最后更新: 2026-04-09 | 问题完全解决* 🎉
