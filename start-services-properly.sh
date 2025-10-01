#!/bin/bash
echo "🚀 Starting PlayConnect Services (Fixed Version)..."

# Kill any existing node processes
pkill -f "node server" 2>/dev/null
sleep 2

# Start Auth Service (from correct directory)
cd backend/auth-service
node server-enhanced.js &
AUTH_PID=$!
echo "✅ Auth Service started (PID: $AUTH_PID) on port 3002"
sleep 2

# Start Player Service (using simple version to avoid ESM issues)
cd ../player-service
node server-simple.js &
PLAYER_PID=$!
echo "✅ Player Service started (PID: $PLAYER_PID) on port 3003"
sleep 2

# Start File Service
cd ../file-service
node server.js &
FILE_PID=$!
echo "✅ File Service started (PID: $FILE_PID) on port 3006"
sleep 2

# Start AI Service
cd ../ai-service
node server.js &
AI_PID=$!
echo "✅ AI Service started (PID: $AI_PID) on port 3009"
sleep 2

# Start Video Service
cd ../video-service
node server.js &
VIDEO_PID=$!
echo "✅ Video Service started (PID: $VIDEO_PID) on port 3008"
sleep 2

echo "🎉 Core services started!"
echo "📊 Service Endpoints:"
echo "   - Auth: http://localhost:3002"
echo "   - Player: http://localhost:3003"
echo "   - File: http://localhost:3006"
echo "   - AI: http://localhost:3009"
echo "   - Video: http://localhost:3008"

# Save PIDs
echo "$AUTH_PID $PLAYER_PID $FILE_PID $AI_PID $VIDEO_PID" > services.pid
