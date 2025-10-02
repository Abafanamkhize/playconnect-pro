#!/bin/bash

echo "🎯 COMPREHENSIVE ACCESS CONTROL TEST - ALL 5 ROLES"
echo "=================================================="

BASE_URL="http://localhost:3016"

test_role() {
    local email=$1
    local password=$2
    local role_name=$3
    
    echo ""
    echo "=== TESTING $role_name ==="
    
    # Login
    RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Login failed for $role_name"
        return
    fi
    
    echo "✅ Logged in as $role_name"
    
    # Test endpoints
    echo "   Players access:"
    curl -s $BASE_URL/api/players -H "Authorization: Bearer $TOKEN" | grep -o '"total":[0-9]*\|"userRole":"[^"]*'
    
    echo "   Analytics access:"
    curl -s $BASE_URL/api/analytics -H "Authorization: Bearer $TOKEN" | grep -o '"analytics\|"error":"[^"]*'
    
    echo "   Users access:"
    curl -s $BASE_URL/api/users -H "Authorization: Bearer $TOKEN" | grep -o '"users"\|"error":"[^"]*'
    
    echo "   Permissions:"
    curl -s $BASE_URL/api/permissions/test -H "Authorization: Bearer $TOKEN" | grep -o '"permissions":\[[^]]*\]'
}

# Test all 5 roles
test_role "superadmin@playconnect.com" "password" "SUPER ADMIN"
test_role "federation@example.com" "password" "FEDERATION ADMIN" 
test_role "coach@example.com" "password" "TEAM COACH"
test_role "scout@example.com" "password" "TALENT SCOUT"
test_role "player@example.com" "password" "PLAYER"

echo ""
echo "🎉 ACCESS CONTROL TESTING COMPLETE!"
echo "==================================="
