const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3010;

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'playconnect-secret-key-2024';

// In-memory user database (replace with real DB later)
const users = [
  {
    id: 1,
    email: 'federation@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'federation',
    name: 'National Football Federation'
  },
  {
    id: 2, 
    email: 'scout@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'scout',
    name: 'Professional Scout'
  }
];

// Player database (same as before)
const players = [
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
    videoUrl: '/videos/messi.mp4',
    talentScore: 82,
    potential: 71,
    createdBy: 1, // Federation ID
    verificationStatus: 'verified'
  },
  // ... other players (same as before)
];

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Role-based authorization middleware
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Requires ${role} role` });
    }
    next();
  };
}

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // In real app, use bcrypt.compare
  const validPassword = password === 'password'; // Simplified for demo
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

// Health endpoint (public)
app.get('/health', (req, res) => {
  res.json({
    status: 'PLAYCONNECT SECURE API - RUNNING',
    port: PORT,
    timestamp: new Date().toISOString(),
    features: ['authentication', 'role-based-access', 'federation-control']
  });
});

// Get players (public read, but shows verification status)
app.get('/players', (req, res) => {
  const publicPlayers = players.map(p => ({
    ...p,
    // Hide sensitive federation data for public
    createdBy: undefined
  }));
  
  res.json({
    players: publicPlayers,
    total: publicPlayers.length,
    message: 'Public player data - login for full access'
  });
});

// Get players with full data (authenticated only)
app.get('/api/players', authenticateToken, (req, res) => {
  res.json({
    players: players,
    total: players.length,
    user: req.user
  });
});

// Create player (federation only)
app.post('/api/players', authenticateToken, requireRole('federation'), (req, res) => {
  const { firstName, lastName, position, age, height, weight, nationality, team, skills } = req.body;
  
  const newPlayer = {
    id: players.length + 1,
    firstName,
    lastName,
    position,
    age,
    height,
    weight, 
    nationality,
    team,
    skills: skills || {},
    physical: {},
    value: 0,
    highlights: [],
    talentScore: 0,
    potential: 0,
    createdBy: req.user.id,
    verificationStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  players.push(newPlayer);
  
  res.status(201).json({
    message: 'Player created successfully',
    player: newPlayer,
    user: req.user
  });
});

// Update player verification (federation only)
app.put('/api/players/:id/verify', authenticateToken, requireRole('federation'), (req, res) => {
  const playerId = parseInt(req.params.id);
  const { status } = req.body;
  
  const player = players.find(p => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  
  player.verificationStatus = status;
  player.verifiedAt = new Date().toISOString();
  player.verifiedBy = req.user.id;
  
  res.json({
    message: `Player verification status updated to ${status}`,
    player: player
  });
});

// User profile endpoint
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user,
    permissions: {
      canCreatePlayers: req.user.role === 'federation',
      canVerifyPlayers: req.user.role === 'federation',
      canViewFullData: true
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 PLAYCONNECT SECURE API RUNNING ON PORT ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🔑 Login: POST http://localhost:${PORT}/auth/login`);
  console.log(`👥 Players (public): http://localhost:${PORT}/players`);
  console.log(`👥 Players (secure): http://localhost:${PORT}/api/players`);
  console.log(`⚡ Demo credentials: federation@example.com / password`);
});
