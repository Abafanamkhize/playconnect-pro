#!/bin/bash
echo "🚀 Starting PlayConnect for Web Access..."

# Get IP address
MY_IP=$(hostname -I | awk '{print $1}')
echo "Your local IP: $MY_IP"

# Kill any existing services
pkill -f "node server"
pkill -f "ngrok"
pkill -f "localtunnel"

# Start backend services
cd backend/auth-service
node server-enhanced.js &
AUTH_PID=$!
echo "✅ Auth Service: http://localhost:3003 | http://$MY_IP:3003"

cd ../user-management-service
node server.js &
USER_PID=$!
echo "✅ User Service: http://localhost:3010 | http://$MY_IP:3010"

# Start frontend server
cd ../../frontend/federation-dashboard
python3 -m http.server 8000 --directory public &
FRONTEND_PID=$!
echo "✅ Frontend: http://localhost:8000 | http://$MY_IP:8000"

# Save PIDs
echo $AUTH_PID $USER_PID $FRONTEND_PID > ../services.pid

echo ""
echo "🌐 ACCESS URLs:"
echo "   Local: http://localhost:8000/network-test.html"
echo "   Network: http://$MY_IP:8000/network-test.html"
echo ""
echo "📱 Test on mobile: Connect to same WiFi and visit:"
echo "   http://$MY_IP:8000/network-test.html"
echo ""
echo "Press Ctrl+C to stop all services"
