#!/bin/bash
echo "🚀 Starting PlayConnect Services from correct directories..."

# Start Auth Service
cd backend/auth-service
node server-complete.js &
AUTH_PID=$!
echo "✅ Auth Service started (PID: $AUTH_PID) on port 3002"

# Start Player Service  
cd ../player-service
node server.js &
PLAYER_PID=$!
echo "✅ Player Service started (PID: $PLAYER_PID) on port 3003"

# Start Integration Service
cd ../integration-service
node server.js &
INTEGRATION_PID=$!
echo "✅ Integration Service started (PID: $INTEGRATION_PID) on port 3007"

# Start File Service
cd ../file-service
node server.js &
FILE_PID=$!
echo "✅ File Service started (PID: $FILE_PID) on port 3006"

# Start AI Service
cd ../ai-service
node server.js &
AI_PID=$!
echo "✅ AI Service started (PID: $AI_PID) on port 3009"

# Start Video Service
cd ../video-service
node server.js &
VIDEO_PID=$!
echo "✅ Video Service started (PID: $VIDEO_PID) on port 3008"

echo "🎉 All 6 services started!"
echo "📊 Service Endpoints:"
echo "   - Auth: http://localhost:3002"
echo "   - Player: http://localhost:3003" 
echo "   - Integration: http://localhost:3007"
echo "   - File: http://localhost:3006"
echo "   - AI: http://localhost:3009"
echo "   - Video: http://localhost:3008"

# Save PIDs to file
echo "$AUTH_PID $PLAYER_PID $INTEGRATION_PID $FILE_PID $AI_PID $VIDEO_PID" > ../services.pid
