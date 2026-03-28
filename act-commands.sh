#!/usr/bin/env bash

set -euo pipefail

# -------------------------
# Ensure Git repo exists
# -------------------------
if [ ! -d ".git" ]; then
    echo "📂 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for act"
fi

# -------------------------
# Set default runner images for act
# -------------------------
ACT_CONFIG_DIR="$HOME/.config/act"
mkdir -p "$ACT_CONFIG_DIR"
ACTRC_FILE="$ACT_CONFIG_DIR/actrc"

if [ ! -f "$ACTRC_FILE" ]; then
    echo "⚡ Setting default runner images for act..."
    cat > "$ACTRC_FILE" <<EOL
-P ubuntu-latest=ubuntu:22.04
-P ubuntu-20.04=ubuntu:20.04
-P node-lts=node:18
EOL
fi

# -------------------------
# Preload smaller, official images (faster & safer)
# -------------------------
echo "⏳ Pulling safe Docker images for act..."
IMAGES=(
    "ubuntu:22.04"
    "ubuntu:20.04"
    "node:18"
)
for img in "${IMAGES[@]}"; do
    echo "📥 Pulling $img ..."
    docker pull "$img" || echo "⚠️ Failed to pull $img"
done

# -------------------------
# Optional: skip huge CodeQL layers locally
# -------------------------
SKIP_CODEQL=${SKIP_CODEQL:-true}
if [ "$SKIP_CODEQL" = "true" ]; then
    echo "⚡ Skipping CodeQL Security analysis locally (use GitHub Actions for full scan)"
    export ACT_SKIP_WORKFLOWS="CodeQL Security/Analyze"
fi

# -------------------------
# List all workflows
# -------------------------
echo "📋 Listing workflows:"
act -l

# -------------------------
# Run push workflows
# -------------------------
echo "🚀 Running workflows for push event..."
act push -P ubuntu-latest=ubuntu:22.04 -v || echo "⚠️ Some workflows failed"

# -------------------------
# Run pull_request workflows
# -------------------------
echo "🚀 Running workflows for pull_request event..."
act pull_request -P ubuntu-latest=ubuntu:22.04 -v || echo "⚠️ Some workflows failed"

echo "🎉 All act commands executed!"
