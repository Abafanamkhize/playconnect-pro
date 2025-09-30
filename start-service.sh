#!/bin/bash
cd ~/playconnect-pro/backend/player-service
pkill -f "node server.js"
nohup npm start > service.log 2>&1 &
echo "Player Service started in background"
echo "Check logs: tail -f service.log"
echo "Check health: curl http://localhost:3002/health"
