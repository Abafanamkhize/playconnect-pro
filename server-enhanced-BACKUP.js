const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3008;

app.use(cors());
app.use(express.json());

console.log(`🚀 STARTING PLAYCONNECT ENHANCED API ON PORT ${PORT}`);

// Enhanced player database with more data
let players = [
  {
    id: 1,
    firstName: 'Lionel',
    lastName: 'Messi',
    position: 'Forward',
    age: 36,
    height: 170,
    weight: 72,
    nationality: 'Argentina',
    skills: { speed: 90, dribbling: 95, shooting: 92, passing: 91, vision: 94 },
    physical: { agility: 92, balance: 90, stamina: 85 },
    team: 'Inter Miami',
    value: 50000000,
    highlights: ['World Cup Winner', '7x Ballon d\'Or'],
    videoUrl: '/videos/messi.mp4'
  },
  {
    id: 2, 
    firstName: 'Virgil',
    lastName: 'Van Dijk',
    position: 'Defender', 
    age: 32,
    height: 193,
    weight: 92,
    nationality: 'Netherlands',
    skills: { strength: 90, tackling: 88, heading: 85, positioning: 89, passing: 82 },
    physical: { agility: 75, balance: 85, stamina: 87 },
    team: 'Liverpool',
    value: 35000000,
    highlights: ['UEFA Champion', 'PFA Player of the Year'],
    videoUrl: '/videos/vandijk.mp4'
  },
  {
    id: 3,
    firstName: 'Kevin',
    lastName: 'De Bruyne',
    position: 'Midfielder',
    age: 32, 
    height: 181,
    weight: 68,
    nationality: 'Belgium',
    skills: { passing: 94, vision: 95, shooting: 87, dribbling: 88, crossing: 93 },
    physical: { agility: 86, balance: 84, stamina: 89 },
    team: 'Manchester City',
    value: 60000000,
    highlights: ['Premier League Champion', 'UEFA Best Midfielder'],
    videoUrl: '/videos/debruyne.mp4'
  },
  {
    id: 4,
    firstName: 'Kylian',
    lastName: 'Mbappé',
    position: 'Forward',
    age: 25,
    height: 178,
    weight: 73,
    nationality: 'France',
    skills: { speed: 95, dribbling: 89, shooting: 88, passing: 80, finishing: 90 },
    physical: { agility: 93, balance: 88, stamina: 90 },
    team: 'Paris Saint-Germain',
    value: 180000000,
    highlights: ['World Cup Winner', 'Youngest Ballon d\'Or Nominee'],
    videoUrl: '/videos/mbappe.mp4'
  },
  {
    id: 5,
    firstName: 'Erling',
    lastName: 'Haaland',
    position: 'Forward',
    age: 23,
    height: 194,
    weight: 88,
    nationality: 'Norway',
    skills: { shooting: 94, strength: 89, heading: 85, positioning: 90, finishing: 95 },
    physical: { agility: 80, balance: 85, stamina: 88 },
    team: 'Manchester City',
    value: 170000000,
    highlights: ['Premier League Record', 'Champions League Top Scorer'],
    videoUrl: '/videos/haaland.mp4'
  }
];

// Calculate talent score (0-100)
function calculateTalentScore(player) {
  const skillAvg = Object.values(player.skills).reduce((a, b) => a + b, 0) / Object.values(player.skills).length;
  const physicalAvg = Object.values(player.physical).reduce((a, b) => a + b, 0) / Object.values(player.physical).length;
  const ageFactor = player.age <= 25 ? 1.1 : player.age <= 30 ? 1.0 : 0.9;
  
  return Math.round((skillAvg * 0.6 + physicalAvg * 0.4) * ageFactor);
}

// Add talent scores to all players
players.forEach(player => {
  player.talentScore = calculateTalentScore(player);
  player.potential = player.talentScore + (25 - player.age); // Younger players have more potential
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'PLAYCONNECT ENHANCED API - RUNNING',
    port: PORT,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    playersCount: players.length,
    features: ['talent-scoring', 'advanced-filtering', 'player-comparison']
  });
});

// Get all players with enhanced filtering
app.get('/players', (req, res) => {
  const { position, minAge, maxAge, minHeight, maxHeight, skill, team, nationality, minScore } = req.query;
  
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
  if (nationality) results = results.filter(p => p.nationality.toLowerCase().includes(nationality.toLowerCase()));
  if (skill) results = results.filter(p => p.skills[skill] > 80);
  if (minScore) results = results.filter(p => p.talentScore >= parseInt(minScore));
  
  // Sort by talent score (highest first)
  results.sort((a, b) => b.talentScore - a.talentScore);
  
  res.json({
    players: results,
    total: results.length,
    filters: req.query,
    averageTalentScore: Math.round(results.reduce((sum, p) => sum + p.talentScore, 0) / results.length) || 0
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

// Search players
app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }
  
  const results = players.filter(p => 
    p.firstName.toLowerCase().includes(q.toLowerCase()) ||
    p.lastName.toLowerCase().includes(q.toLowerCase()) ||
    p.team.toLowerCase().includes(q.toLowerCase()) ||
    p.nationality.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    query: q,
    players: results,
    total: results.length
  });
});

// Compare two players
app.get('/compare/:id1/:id2', (req, res) => {
  const player1 = players.find(p => p.id == req.params.id1);
  const player2 = players.find(p => p.id == req.params.id2);
  
  if (!player1 || !player2) {
    return res.status(404).json({ error: 'One or both players not found' });
  }
  
  const comparison = {
    player1: player1,
    player2: player2,
    comparison: {
      talentScore: { player1: player1.talentScore, player2: player2.talentScore },
      age: { player1: player1.age, player2: player2.age },
      value: { player1: player1.value, player2: player2.value },
      skills: {}
    }
  };
  
  // Compare each skill
  Object.keys(player1.skills).forEach(skill => {
    if (player2.skills[skill]) {
      comparison.comparison.skills[skill] = {
        player1: player1.skills[skill],
        player2: player2.skills[skill],
        difference: player1.skills[skill] - player2.skills[skill]
      };
    }
  });
  
  res.json(comparison);
});

// Get top talents
app.get('/top-talents', (req, res) => {
  const { limit = 5 } = req.query;
  const topPlayers = [...players]
    .sort((a, b) => b.talentScore - a.talentScore)
    .slice(0, parseInt(limit));
  
  res.json({
    topTalents: topPlayers,
    limit: parseInt(limit),
    criteria: 'talent-score'
  });
});

// Get players by potential (young high-scorers)
app.get('/high-potential', (req, res) => {
  const highPotential = players
    .filter(p => p.age <= 25 && p.talentScore >= 80)
    .sort((a, b) => b.potential - a.potential);
  
  res.json({
    highPotentialPlayers: highPotential,
    total: highPotential.length,
    criteria: 'age<=25 & talent-score>=80'
  });
});

// Start enhanced server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 PLAYCONNECT ENHANCED API RUNNING ON PORT ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`👥 All Players: http://localhost:${PORT}/players`);
  console.log(`🏆 Top Talents: http://localhost:${PORT}/top-talents`);
  console.log(`⭐ High Potential: http://localhost:${PORT}/high-potential`);
  console.log(`🔍 Compare: http://localhost:${PORT}/compare/1/4`);
  console.log(`⚡ Enhanced features: Talent scoring, Player comparison, Advanced filtering`);
});

// Keep alive forever
process.on('uncaughtException', (error) => {
  console.log('🛡️  Uncaught Exception - Staying alive:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('🛡️  Unhandled Rejection - Staying alive:', reason);
});
