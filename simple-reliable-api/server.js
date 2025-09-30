const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

console.log(`🚀 STARTING PLAYCONNECT SIMPLE API ON PORT ${PORT}`);

// In-memory database (replace with real DB later)
let players = [
  {
    id: 1,
    firstName: 'Lionel',
    lastName: 'Messi',
    position: 'Forward',
    age: 36,
    height: 170,
    skills: { speed: 90, dribbling: 95, shooting: 92, passing: 91 },
    team: 'Inter Miami',
    value: 50000000
  },
  {
    id: 2, 
    firstName: 'Virgil',
    lastName: 'Van Dijk',
    position: 'Defender', 
    age: 32,
    height: 193,
    skills: { strength: 90, tackling: 88, heading: 85, positioning: 89 },
    team: 'Liverpool',
    value: 35000000
  },
  {
    id: 3,
    firstName: 'Kevin',
    lastName: 'De Bruyne',
    position: 'Midfielder',
    age: 32, 
    height: 181,
    skills: { passing: 94, vision: 95, shooting: 87, dribbling: 88 },
    team: 'Manchester City',
    value: 60000000
  }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'PLAYCONNECT SIMPLE API - RUNNING',
    port: PORT,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    playersCount: players.length
  });
});

// Get all players with filtering
app.get('/players', (req, res) => {
  const { position, minAge, maxAge, minHeight, maxHeight, skill, team } = req.query;
  
  let results = [...players];
  
  // Apply filters
  if (position) {
    results = results.filter(p => p.position.toLowerCase().includes(position.toLowerCase()));
  }
  
  if (minAge) results = results.filter(p => p.age >= parseInt(minAge));
  if (maxAge) results = results.filter(p => p.age <= parseInt(maxAge));
  if (minHeight) results = results.filter(p => p.height >= parseInt(minHeight));
  if (maxHeight) results = results.filter(p => p.height <= parseInt(maxHeight));
  if (team) results = results.filter(p => p.team.toLowerCase().includes(team.toLowerCase()));
  if (skill) results = results.filter(p => p.skills[skill] > 80);
  
  res.json({
    players: results,
    total: results.length,
    filters: req.query
  });
});

// Get player by ID
app.get('/players/:id', (req, res) => {
  const player = players.find(p => p.id == req.params.id);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json({ player });
});

// Search players by name
app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }
  
  const results = players.filter(p => 
    p.firstName.toLowerCase().includes(q.toLowerCase()) ||
    p.lastName.toLowerCase().includes(q.toLowerCase()) ||
    p.team.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    query: q,
    players: results,
    total: results.length
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 PLAYCONNECT SIMPLE API RUNNING ON PORT ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`👥 All Players: http://localhost:${PORT}/players`);
  console.log(`🔍 Search: http://localhost:${PORT}/search?q=messi`);
  console.log(`🎯 Filter: http://localhost:${PORT}/players?position=Forward`);
  console.log(`📊 Filter: http://localhost:${PORT}/players?minAge=30&maxAge=40`);
  console.log(`⚡ Server started at: ${new Date().toISOString()}`);
});

// Keep alive forever
process.on('uncaughtException', (error) => {
  console.log('🛡️  Uncaught Exception - Staying alive:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('🛡️  Unhandled Rejection - Staying alive:', reason);
});
