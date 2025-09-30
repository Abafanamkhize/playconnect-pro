const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3016; // Changed to 3016

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'playconnect-secret-key-2024';

// [PASTE THE ENTIRE server-access-complete.js CONTENT HERE]
// Complete 5-role user system
const users = [
  {
    id: 1,
    email: 'superadmin@playconnect.com',
    password: 'password',
    role: 'super_admin',
    name: 'System Administrator'
  },
  {
    id: 2,
    email: 'federation@example.com',
    password: 'password',
    role: 'federation_admin',
    name: 'National Football Federation'
  },
  {
    id: 3,
    email: 'coach@example.com',
    password: 'password',
    role: 'team_coach',
    name: 'Professional Team Coach'
  },
  {
    id: 4,
    email: 'scout@example.com',
    password: 'password',
    role: 'talent_scout',
    name: 'Professional Scout'
  },
  {
    id: 5,
    email: 'player@example.com',
    password: 'password',
    role: 'player',
    name: 'Professional Player'
  }
];

// Complete permission matrix for all 5 roles
const permissions = {
  super_admin: ['*'],
  federation_admin: ['view_players', 'manage_players', 'verify_players', 'upload_videos', 'view_analytics', 'manage_users', 'export_data', 'bulk_operations'],
  team_coach: ['view_players', 'manage_team', 'view_analytics', 'create_reports', 'compare_players', 'track_performance'],
  talent_scout: ['view_players', 'create_reports', 'view_analytics', 'compare_players', 'shortlist_players', 'export_reports'],
  player: ['view_profile', 'update_profile', 'upload_videos', 'view_own_stats']
};

// Sample players database
const players = [
  { id: 1, firstName: 'Lionel', lastName: 'Messi', position: 'Forward', team: 'Inter Miami', visibility: 'public', createdBy: 2 },
  { id: 2, firstName: 'Team', lastName: 'Player', position: 'Midfielder', team: 'Demo Team', visibility: 'team_only', createdBy: 3 },
  { id: 3, firstName: 'Private', lastName: 'Prospect', position: 'Defender', team: 'Scout Find', visibility: 'private', createdBy: 4 }
];

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Permission middleware  
function requirePermission(permission) {
  return (req, res, next) => {
    const userPermissions = permissions[req.user.role] || [];
    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions', required: permission, userRole: req.user.role });
    }
  };
}

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'PLAYCONNECT ACCESS CONTROL - COMPLETE',
    port: PORT,
    timestamp: new Date().toISOString(),
    features: ['5-roles', 'permission-system', 'protected-routes'],
    roles: Object.keys(permissions)
  });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name, permissions: permissions[user.role] }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name, permissions: permissions[user.role] } });
});

// Test permissions endpoint
app.get('/api/permissions/test', authenticateToken, (req, res) => {
  res.json({ user: req.user, permissions: permissions[req.user.role] });
});

// Players endpoint
app.get('/api/players', authenticateToken, (req, res) => {
  let accessiblePlayers = players;
  switch(req.user.role) {
    case 'super_admin': break;
    case 'federation_admin': accessiblePlayers = players.filter(p => p.visibility !== 'private'); break;
    case 'team_coach': accessiblePlayers = players.filter(p => p.visibility === 'public' || p.visibility === 'team_only'); break;
    case 'talent_scout': accessiblePlayers = players.filter(p => p.visibility === 'public'); break;
    case 'player': accessiblePlayers = players.filter(p => p.visibility === 'public' && p.id === 1); break;
  }
  res.json({ players: accessiblePlayers, total: accessiblePlayers.length, userRole: req.user.role });
});

// Analytics endpoint
app.get('/api/analytics', authenticateToken, requirePermission('view_analytics'), (req, res) => {
  res.json({ analytics: { totalPlayers: players.length }, accessedBy: req.user.role });
});

// User management
app.get('/api/users', authenticateToken, requirePermission('manage_users'), (req, res) => {
  res.json({ users: users.map(u => ({ id: u.id, email: u.email, role: u.role, name: u.name })), managedBy: req.user.role });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛡️ PLAYCONNECT ACCESS CONTROL RUNNING ON PORT ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});
