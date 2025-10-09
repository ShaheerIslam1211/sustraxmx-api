#!/bin/bash

# Deployment script for Vercel and other platforms
echo "🚀 Starting deployment build process..."

# Install dependencies (build scripts auto-approved via .pnpmrc)
echo "📥 Installing dependencies..."
pnpm install

# Build the application
echo "🔨 Building application..."
pnpm run build

echo "✅ Build completed successfully!"
