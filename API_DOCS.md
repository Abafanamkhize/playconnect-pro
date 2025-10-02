# Player Service API Documentation

## Endpoints:
- GET /health - Service status
- GET /players - List all players (with pagination)
- GET /players/:id - Get specific player
- POST /players - Create new player (federation only)
- PUT /players/:id - Update player (federation only)
- DELETE /players/:id - Archive player

## Sample Player Data:
{
  "id": "uuid",
  "firstName": "Lionel",
  "lastName": "Messi", 
  "position": "Forward",
  "skills": {"speed": 90, "dribbling": 95, "shooting": 92}
}
