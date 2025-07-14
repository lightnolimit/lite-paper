#!/bin/bash

# Cloudflare Pages deployment script
# This script handles the deployment to Cloudflare Pages

echo "🚀 Starting Cloudflare Pages deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing wrangler..."
    npm install -g wrangler
fi

# Build the project if out directory doesn't exist
if [ ! -d "out" ]; then
    echo "📦 Building project..."
    npm run build
fi

# Deploy to Cloudflare Pages
echo "☁️  Deploying to Cloudflare Pages..."

# Try to deploy, and if it fails due to project not existing, create it
npx wrangler pages deploy out \
    --project-name=lite-paper-docs \
    --compatibility-date=2025-01-14 \
    --commit-hash=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown") \
    --branch=$(git branch --show-current 2>/dev/null || echo "main") || {
    
    echo "⚠️  Project might not exist. Creating project..."
    
    # Create the project first
    npx wrangler pages project create lite-paper-docs \
        --production-branch=main \
        --compatibility-date=2025-01-14
    
    # Retry deployment
    npx wrangler pages deploy out \
        --project-name=lite-paper-docs \
        --compatibility-date=2025-01-14 \
        --commit-hash=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown") \
        --branch=$(git branch --show-current 2>/dev/null || echo "main")
}

echo "✅ Deployment complete!"