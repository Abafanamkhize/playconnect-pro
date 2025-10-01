#!/bin/bash

echo "🔧 PLAYCONNECT SERVICE FIX SCRIPT"
echo "=================================="

fix_service() {
    local service=$1
    local path=$2
    
    echo ""
    echo "🔄 Fixing $service..."
    
    if [ ! -d "$path" ]; then
        echo "❌ Directory not found: $path"
        return 1
    fi
    
    cd "$path"
    
    # Remove node_modules and reinstall
    echo "📦 Reinstalling dependencies for $service..."
    rm -rf node_modules package-lock.json
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ $service dependencies fixed"
    else
        echo "❌ $service dependencies failed"
    fi
    
    cd ../..
}

# Fix problematic services
fix_service "Authentication" "backend/auth-service"
fix_service "Integration" "backend/integration-service"

echo ""
echo "🎯 FIXES APPLIED!"
echo "Run ./test-playconnect.sh to verify services are working."
