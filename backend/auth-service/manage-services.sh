#!/bin/bash

case $1 in
  "start")
    echo "Starting PlayConnect services..."
    cd backend/auth-service && node server-complete.js &
    cd backend/player-service && node server.js &
    cd backend/integration-service && node server.js &
    cd backend/file-service && node server.js &
    cd backend/ai-service && node server.js &
    cd backend/video-service && node server.js &
    echo "Services started. Check health endpoints."
    ;;
  "stop")
    echo "Stopping PlayConnect services..."
    pkill -f "node server"
    echo "All services stopped."
    ;;
  "status")
    echo "PlayConnect Services Status:"
    curl -s http://localhost:3002/health | jq '.status' || echo "Auth: Not running"
    curl -s http://localhost:3003/health | jq '.status' || echo "Player: Not running"
    curl -s http://localhost:3007/health | jq '.status' || echo "Integration: Not running"
    curl -s http://localhost:3006/health | jq '.status' || echo "File: Not running"
    curl -s http://localhost:3009/health | jq '.status' || echo "AI: Not running"
    curl -s http://localhost:3008/health | jq '.status' || echo "Video: Not running"
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    ;;
esac
