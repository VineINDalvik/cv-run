#!/bin/bash

# One-click deployment script for cv-run to production
# Usage: ./deploy-prod.sh [--skip-test]

set -e

SERVER_HOST="112.124.30.51"
SERVER_USER="root"
SERVER_PASS="xyy7608955A"
DEPLOY_PATH="/var/www/cv-run"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 CV-RUN ONE-CLICK DEPLOYMENT${NC}"
echo "================================"

# Step 1: Build locally
echo -e "\n${YELLOW}📦 Step 1: Building Next.js project...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"

# Step 2: Optional local test (skip with --skip-test)
if [[ "$1" != "--skip-test" ]]; then
  echo -e "\n${YELLOW}🧪 Step 2: Testing locally...${NC}"
  echo "Starting local server on port 3000..."
  timeout 30 npm start &
  sleep 5

  # Test if server is responding
  if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Local test passed${NC}"
  else
    echo -e "${RED}⚠ Local test returned no response (server may still be starting)${NC}"
  fi

  # Kill the local server
  pkill -f "npm start" 2>/dev/null || true
fi

# Step 3: Deploy to production
echo -e "\n${YELLOW}📤 Step 3: Deploying to ${SERVER_HOST}...${NC}"

echo "  → Deploying .next/standalone..."
sshpass -p "$SERVER_PASS" rsync -avz --delete .next/standalone/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/ > /dev/null 2>&1

echo "  → Deploying package files..."
sshpass -p "$SERVER_PASS" rsync -avz package.json package-lock.json $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/ > /dev/null 2>&1

echo "  → Installing dependencies on Linux server (native modules compiled for Linux)..."
sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "cd $DEPLOY_PATH && rm -rf node_modules && npm ci --production 2>&1 | tail -3" > /dev/null 2>&1

echo "  → Copying native modules to .next/standalone..."
sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "cd $DEPLOY_PATH && test -d .next/standalone/node_modules && cp -r node_modules/@napi-rs .next/standalone/node_modules/ 2>/dev/null; echo 'Done'" > /dev/null 2>&1

echo "  → Deploying .next/static..."
sshpass -p "$SERVER_PASS" rsync -avz --delete .next/static/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/.next/static/ > /dev/null 2>&1

echo "  → Deploying public files..."
sshpass -p "$SERVER_PASS" rsync -avz public/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/public/ > /dev/null 2>&1

echo "  → Deploying lib (runtime files for PDF parsing)..."
sshpass -p "$SERVER_PASS" rsync -avz lib/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/lib/ > /dev/null 2>&1

echo "  → Deploying config files..."
sshpass -p "$SERVER_PASS" rsync -avz server-with-env.js $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/ > /dev/null 2>&1
sshpass -p "$SERVER_PASS" rsync -avz .env.local $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/ > /dev/null 2>&1
sshpass -p "$SERVER_PASS" rsync -avz ecosystem.config.js $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/ > /dev/null 2>&1

echo -e "${GREEN}✓ Deployment complete${NC}"

# Step 4: Restart PM2
echo -e "\n${YELLOW}🔄 Step 4: Restarting PM2 process...${NC}"
# CRITICAL: Only restart cv-run, do NOT touch other services (ignite, clare, work-doubao)
# Using 'pm2 delete all' or 'pm2 restart all' will break other production services
sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_HOST "cd $DEPLOY_PATH && pm2 delete cv-run 2>/dev/null; pm2 start ecosystem.config.js && sleep 2" > /dev/null 2>&1
echo -e "${GREEN}✓ PM2 restarted (cv-run only)${NC}"

# Step 5: Verify deployment
echo -e "\n${YELLOW}✅ Step 5: Verifying deployment...${NC}"
sleep 3

if curl -s https://cv-run.vinex.top > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Server is online and responding${NC}"
  echo -e "\n${GREEN}🎉 DEPLOYMENT SUCCESSFUL${NC}"
  echo -e "👉 Visit: ${GREEN}https://cv-run.vinex.top${NC}"
else
  echo -e "${YELLOW}⚠ Server may still be starting, check logs in a moment${NC}"
  echo -e "  Run: ${YELLOW}sshpass -p xyy7608955A ssh root@112.124.30.51 'pm2 logs cv-run'${NC}"
fi

echo ""
