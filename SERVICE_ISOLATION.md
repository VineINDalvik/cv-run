# 🔒 Service Isolation & Deployment Safety

## 问题历史
在一次cv-run部署中，使用了 `pm2 delete all` 导致所有服务（cv-run、ignite、clare、work-doubao）都被清除。这是严重的生产事故。

## 解决方案

### ✅ 部署脚本 (deploy-prod.sh) 的安全设计

```bash
# 只删除和重启 cv-run，绝不触及其他服务
pm2 delete cv-run 2>/dev/null
pm2 start ecosystem.config.js
```

**严禁** 的操作：
- ❌ `pm2 delete all` — 删除所有服务
- ❌ `pm2 restart all` — 重启所有服务
- ❌ `pm2 stop all` — 停止所有服务
- ❌ `pm2 kill` — 杀死 PM2 守护进程（会影响所有进程）

### 📋 生产环境服务清单

| 服务 | 端口 | 配置 | 状态 |
|------|------|------|------|
| **cv-run** | 3002 | `/var/www/cv-run/ecosystem.config.js` | ✅ 线上 |
| **ignite** | 3001 | 独立配置 | ✅ 线上 |
| **clare** | 3000 | 独立配置 | ✅ 线上 |
| **work-doubao** | 其他 | 独立配置 | ✅ 线上 |

### 🛡️ 部署前检查清单

每次部署 cv-run 前：

- [ ] 确认 `deploy-prod.sh` 只包含 `pm2 delete cv-run`（不是 delete all）
- [ ] 确认 `deploy-prod.sh` 只会启动 `ecosystem.config.js`（只有 cv-run）
- [ ] 测试过脚本 —— 验证其他服务不会受影响
- [ ] 准备回滚方案

### 📝 部署命令

```bash
# 安全的部署（只影响cv-run）
./deploy-prod.sh --skip-test

# 验证其他服务仍在线
ssh root@112.124.30.51 "pm2 status"
```

### 🚨 应急恢复

如果不小心删除了其他服务：

```bash
# 1. SSH进服务器
ssh root@112.124.30.51

# 2. 查看PM2状态
pm2 status

# 3. 恢复已知的配置（如果有ecosystem.config.js）
pm2 start /path/to/ignite/ecosystem.config.js
pm2 start /path/to/clare/ecosystem.config.js

# 4. 验证
pm2 status
```

---

**最后更新**: 2026-04-09  
**责任**: 防止生产服务中断
**规则**: 重启一个服务，绝不影响其他服务
