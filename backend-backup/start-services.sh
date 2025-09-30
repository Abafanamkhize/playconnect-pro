#!/bin/bash
echo "🚀 Starting PlayConnect Backend Services..."

# Kill any existing node processes
pkill -f "node server.js" 2>/dev/null || true
sleep 2

# Start services
echo "✅ Starting API Gateway (Port 3000)..."
cd api-gateway
node server.js &
GATEWAY_PID=$!
echo "API Gateway PID: $GATEWAY_PID"

echo "✅ Starting Auth Service (Port 3001)..."
cd ../auth-service
node server.js &
AUTH_PID=$!
echo "Auth Service PID: $AUTH_PID"

echo "✅ Starting Player Service (Port 3003)..."
cd ../player-service
node server.js &
PLAYER_PID=$!
echo "Player Service PID: $PLAYER_PID"

echo "✅ Starting Federation Service (Port 3004)..."
cd ../federation-service
node server.js &
FEDERATION_PID=$!
echo "Federation Service PID: $FEDERATION_PID"

cd ..

# Save PIDs
echo $GATEWAY_PID > services.pid
echo $AUTH_PID >> services.pid
echo $PLAYER_PID >> services.pid
echo $FEDERATION_PID >> services.pid

echo "🎉 All services started!"
echo "📊 Service Status:"
echo "   - API Gateway: http://localhost:3000"
echo "   - Auth Service: http://localhost:3001"
echo "   - Player Service: http://localhost:3003"
echo "   - Federation Service: http://localhost:3004"

# Wait and test
sleep 3
curl -s http://localhost:3000/api/health || echo "❌ Gateway not ready yet"
