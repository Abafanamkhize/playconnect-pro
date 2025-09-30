#!/bin/bash

echo "🔐 TESTING ACCESS CONTROL SYSTEM"
echo "================================"

# Test health
echo "1. Testing health endpoint:"
curl -s http://localhost:3016/health | jq '.'

echo ""
echo "2. Testing SUPER ADMIN:"
SUPER_RESPONSE=$(curl -s -X POST http://localhost:3016/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@playconnect.com","password":"password"}')

echo "$SUPER_RESPONSE" | jq '.'
SUPER_TOKEN=$(echo "$SUPER_RESPONSE" | jq -r '.token')

echo ""
echo "3. Testing SUPER ADMIN endpoints:"
echo "   Permissions:"
curl -s http://localhost:3016/api/permissions/test -H "Authorization: Bearer $SUPER_TOKEN" | jq '.'
echo "   Players:"
curl -s http://localhost:3016/api/players -H "Authorization: Bearer $SUPER_TOKEN" | jq '.'
echo "   Analytics:"
curl -s http://localhost:3016/api/analytics -H "Authorization: Bearer $SUPER_TOKEN" | jq '.'
echo "   Users:"
curl -s http://localhost:3016/api/users -H "Authorization: Bearer $SUPER_TOKEN" | jq '.'

echo ""
echo "4. Testing PLAYER (limited access):"
PLAYER_RESPONSE=$(curl -s -X POST http://localhost:3016/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@example.com","password":"password"}')

echo "$PLAYER_RESPONSE" | jq '.'
PLAYER_TOKEN=$(echo "$PLAYER_RESPONSE" | jq -r '.token')

echo ""
echo "5. Testing PLAYER endpoints:"
echo "   Players (limited view):"
curl -s http://localhost:3016/api/players -H "Authorization: Bearer $PLAYER_TOKEN" | jq '.'
echo "   Analytics (should fail):"
curl -s http://localhost:3016/api/analytics -H "Authorization: Bearer $PLAYER_TOKEN" | jq '.'
echo "   Users (should fail):"
curl -s http://localhost:3016/api/users -H "Authorization: Bearer $PLAYER_TOKEN" | jq '.'

echo ""
echo "✅ ACCESS CONTROL TESTING COMPLETE"
