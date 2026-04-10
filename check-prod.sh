#!/bin/bash

# Quick status and logs viewer for production cv-run
# Usage: ./check-prod.sh [--logs|--env|--restart]

SERVER_HOST="112.124.30.51"
SERVER_USER="root"
SERVER_PASS="xyy7608955A"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_status() {
  echo -e "${YELLOW}📊 PM2 Status:${NC}"
  sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "pm2 status cv-run" 2>/dev/null || echo "Process not found"
}

show_logs() {
  echo -e "${YELLOW}📋 Recent Logs (last 50 lines):${NC}"
  sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "pm2 logs cv-run --lines 50 --nostream" 2>/dev/null
}

show_env() {
  echo -e "${YELLOW}🔑 Environment Variables:${NC}"
  sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "pm2 env 11 2>/dev/null | grep -E 'AI_PROVIDER|DEEPSEEK|KV_' || echo 'Process not running'" 2>/dev/null
}

restart() {
  echo -e "${YELLOW}🔄 Restarting PM2...${NC}"
  sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "cd /var/www/cv-run && pm2 delete cv-run 2>/dev/null; pm2 start ecosystem.config.js && sleep 2 && pm2 status cv-run" 2>/dev/null
}

check_online() {
  echo -e "${YELLOW}🌐 Checking online status:${NC}"
  if curl -s https://cv-run.vinex.top > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is ONLINE${NC}"
  else
    echo -e "${RED}✗ Server is OFFLINE${NC}"
  fi
}

case "$1" in
  --logs)
    show_logs
    ;;
  --env)
    show_env
    ;;
  --restart)
    restart
    ;;
  *)
    check_online
    echo ""
    show_status
    echo ""
    show_env
    ;;
esac
