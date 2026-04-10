# CV-RUN 部署指南

## 快速开始

### 一键部署到公网

```bash
./deploy-prod.sh
```

这个脚本会自动执行以下步骤：
1. ✅ 构建 Next.js 项目
2. ✅ （可选）本地测试
3. ✅ 部署到服务器
4. ✅ 重启 PM2 进程
5. ✅ 验证服务状态

**跳过本地测试加速部署：**
```bash
./deploy-prod.sh --skip-test
```

---

## 快速检查服务器状态

### 查看概览（默认）
```bash
./check-prod.sh
```
显示：
- 🌐 在线状态
- 📊 PM2 进程状态
- 🔑 环境变量

### 查看实时日志
```bash
./check-prod.sh --logs
```

### 查看环境变量
```bash
./check-prod.sh --env
```

### 手动重启服务
```bash
./check-prod.sh --restart
```

---

## 部署架构

### 环境变量加载流程

```
server-with-env.js
    ↓
读取 .env.local
    ↓
设置所有环境变量
    ↓
启动 server.js (Next.js)
```

### 关键文件

| 文件 | 用途 |
|------|------|
| `server-with-env.js` | 环境变量加载器 + Next.js 启动器 |
| `.env.local` | 敏感配置（AI_PROVIDER, API_KEY 等） |
| `ecosystem.config.js` | PM2 进程管理配置 |
| `deploy-prod.sh` | 完整部署脚本 |
| `check-prod.sh` | 状态检查脚本 |

---

## 配置说明

### `.env.local` 环境变量

```bash
# AI 提供商（deepseek 便宜快速）
AI_PROVIDER=deepseek

# DeepSeek API
DEEPSEEK_API_KEY=sk-xxx

# Anthropic API（备用）
ANTHROPIC_API_KEY=sk-xxx

# Vercel KV / Upstash Redis
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=xxx
```

**当前配置：** ✅ DeepSeek（公网 api.deepseek.com）

---

## 常见问题

### Q: 部署后服务器为什么不在线？
A: 给 PM2 10 秒启动时间。检查：
```bash
./check-prod.sh --logs
```

### Q: 怎么确认用的是 DeepSeek？
A: 
```bash
./check-prod.sh --env | grep AI_PROVIDER
```

### Q: 能否更新 API Key 但不部署代码？
A: 可以，只部署 `.env.local`：
```bash
sshpass -p xyy7608955A rsync -avz .env.local root@112.124.30.51:/var/www/cv-run/
sshpass -p xyy7608955A ssh root@112.124.30.51 "cd /var/www/cv-run && pm2 restart cv-run"
```

---

## 服务器连接信息

- **主机**: 112.124.30.51
- **用户**: root
- **密码**: xyy7608955A (在脚本中使用 sshpass)
- **部署路径**: /var/www/cv-run
- **PM2 进程**: cv-run
- **公网地址**: https://cv-run.vinex.top

---

## 监控命令

```bash
# 实时日志
sshpass -p xyy7608955A ssh root@112.124.30.51 "pm2 logs cv-run"

# PM2 进程列表
sshpass -p xyy7608955A ssh root@112.124.30.51 "pm2 list"

# 强制重启
sshpass -p xyy7608955A ssh root@112.124.30.51 "pm2 restart cv-run"

# 查看进程详情
sshpass -p xyy7608955A ssh root@112.124.30.51 "pm2 show cv-run"
```

---

## 更新部署流程

**以后每次更新只需：**

```bash
./deploy-prod.sh --skip-test
```

就完成了：
- 本地构建
- 文件同步
- PM2 重启
- 在线验证

无需再手动处理环境变量、rsync、SSH 等细节！
