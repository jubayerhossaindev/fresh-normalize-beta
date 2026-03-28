#!/bin/bash

# 1. Clean up broken repos
echo "Cleaning up broken package repositories..."
sudo rm -f /etc/apt/sources.list.d/yarn.list

# 2. Update
echo "Updating system packages..."
sudo apt update -y

# 3. Install corrected dependencies for Ubuntu 24.04 (Noble)
# Removed specific version numbers that were causing "Unable to locate package" errors.
echo "Installing browser system dependencies..."
sudo apt install -y --no-install-recommends \
    libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libpango-1.0-0 libcairo2 libasound2t64 libgtk-3-0t64 \
    libxslt1.1 libwayland-client0 libwayland-server0 libmanette-0.2-0 libflite1 \
    libgtk-4-1 libvulkan1 libgraphene-1.0-0 libopus0 \
    libgstreamer1.0-0 libgstreamer-plugins-base1.0-0 \
    libgstreamer-plugins-bad1.0-0 gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good gstreamer1.0-gl \
    libwebpdemux2 libavif16 libharfbuzz-icu0 libwebpmux3 \
    libenchant-2-2 libhyphen0 libgles2 libx264-164

# 4. Final Playwright install (this will catch any tiny stragglers)
echo "Downloading Playwright browsers..."
pnpm exec playwright install --with-deps

echo "------------------------------------------"
echo "✅ Setup Complete! Running tests..."
pnpm run test:e2e
echo "------------------------------------------"
