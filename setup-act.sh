#!/usr/bin/env bash

set -e  # Stop on any error

echo "🚀 Starting act + Docker setup..."

# -------------------------
# Fix Yarn GPG error (if Yarn repo exists)
# -------------------------
YARN_LIST="/etc/apt/sources.list.d/yarn.list"
if [ -f "$YARN_LIST" ]; then
    echo "🔧 Fixing Yarn GPG key..."
    sudo mkdir -p /usr/share/keyrings
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo gpg --dearmor -o /usr/share/keyrings/yarn.gpg
    echo "deb [signed-by=/usr/share/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee "$YARN_LIST" > /dev/null
fi

# -------------------------
# Update apt safely
# -------------------------
echo "🔄 Updating package lists..."
sudo apt update || echo "⚠️ apt update had warnings, continuing..."

# -------------------------
# Install act via official fallback (skip broken .deb)
# -------------------------
echo "📦 Installing act via official installer..."
curl -sSL https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Move binary to global path if needed
if [ -f "$HOME/bin/act" ]; then
    sudo mv "$HOME/bin/act" /usr/local/bin/act
fi

# -------------------------
# Ensure act is in PATH
# -------------------------
if ! command -v act &> /dev/null; then
    echo "⚠️ Adding act to PATH..."
    echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc
fi

# -------------------------
# Verify installation
# -------------------------
echo "✅ act version:"
act --version || echo "❌ act not found"

# -------------------------
# Install Docker (if missing)
# -------------------------
echo "🐳 Installing Docker..."
sudo apt install -y docker.io || echo "⚠️ Docker install skipped"

# Start Docker (Codespaces safe)
if command -v systemctl &> /dev/null; then
    sudo systemctl start docker || true
    sudo systemctl enable docker || true
else
    sudo service docker start || true
fi

# Test Docker
echo "🔍 Testing Docker..."
docker run hello-world || echo "⚠️ Docker test failed (may need permissions)"

# -------------------------
# Completion message
# -------------------------
echo "🎉 Setup complete!"
echo ""
echo "👉 Usage:"
echo "   act -l      # list workflows"
echo "   act         # run workflows"
