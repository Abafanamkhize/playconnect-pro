#!/bin/bash
echo "🔍 GITHUB REPOSITORY VERIFICATION"
echo "=================================="

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Not a git repository"
    exit 1
fi

echo "✅ In git repository"

# Check remote
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Remote configured: $REMOTE_URL"
else
    echo "❌ No remote configured"
    exit 1
fi

# Check for uncommitted changes
if git diff-index --quiet HEAD --; then
    echo "✅ No uncommitted changes"
else
    echo "⚠️  There are uncommitted changes:"
    git status --porcelain
fi

# Check last commit
LAST_COMMIT=$(git log -1 --oneline 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Last commit: $LAST_COMMIT"
else
    echo "❌ No commits found"
fi

# Check if we can communicate with remote
if git fetch --dry-run > /dev/null 2>&1; then
    echo "✅ Can communicate with remote repository"
else
    echo "❌ Cannot communicate with remote"
fi

# Check key files
echo ""
echo "📁 KEY FILES CHECK:"
FILES=(
    "backend/working-server.js"
    "frontend/federation-dashboard/src/components/ProfessionalDashboard.js" 
    "frontend/federation-dashboard/src/App.js"
    "PROJECT_STATUS.md"
    "DEPLOYMENT.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        if git ls-files --error-unmatch "$file" > /dev/null 2>&1; then
            echo "✅ $file (tracked)"
        else
            echo "⚠️  $file (exists but not tracked)"
        fi
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "🎯 VERIFICATION COMPLETE"
