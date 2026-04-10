#!/bin/bash

# Deployment script for cv.run
# Usage: ./deploy.sh

HOST="112.124.30.51"
USER="root"
DEPLOY_PATH="/var/www/cv-run"

echo "🚀 Starting deployment to $HOST..."

# Deploy .next/standalone
echo "📦 Deploying .next/standalone..."
rsync -avz --delete .next/standalone/ $USER@$HOST:$DEPLOY_PATH/

# Deploy .next/static
echo "📦 Deploying .next/static..."
rsync -avz --delete .next/static/ $USER@$HOST:$DEPLOY_PATH/.next/static/

# Deploy public files
echo "📦 Deploying public files..."
rsync -avz public/ $USER@$HOST:$DEPLOY_PATH/public/

# Deploy server wrapper and config files
echo "📦 Deploying server wrapper and config..."
rsync -avz server-with-env.js $USER@$HOST:$DEPLOY_PATH/
rsync -avz .env.local $USER@$HOST:$DEPLOY_PATH/
rsync -avz ecosystem.config.js $USER@$HOST:$DEPLOY_PATH/

# Restart PM2
echo "🔄 Restarting PM2 process..."
ssh $USER@$HOST "cd $DEPLOY_PATH && pm2 delete cv-run; pm2 start ecosystem.config.js"

echo "✅ Deployment complete!"
echo "🌍 Check: https://cv-run.vinex.top"
