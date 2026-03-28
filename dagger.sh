#!/usr/bin/env bash

# --- 1. Robust Auto-Installation ---
if ! command -v dagger &> /dev/null; then
    echo "⚠️ Dagger not found! Installing now..."
    cd /tmp && curl -L https://dl.dagger.io/dagger/install.sh | sh
    sudo mv bin/dagger /usr/local/bin/ && rm -rf bin && cd - > /dev/null
    echo "✅ Dagger installed!"
fi

# --- 2. Run the Unified Pipeline ---
echo "🧪 Running Master Pipeline..."
dagger run npx tsx dagger-pipeline.ts
