const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3015;

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'playconnect-secret-key-2024';

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
  super_admin: ['*'], // Wildcard - access to everything
  
  federation_admin: [
    'view_players', 'manage_players', 'verify_players', 'upload_videos',
    'view_analytics', 'manage_users', 'export_data', 'bulk_operations'
  ],
  
  team_coach: [
    'view_players', 'manage_team', 'view_analytics', 'create_reports',
    'compare_players', 'track_performance'
  ],
  
  talent_scout: [
    'view_players', 'create_reports', 'view_analytics', 'compare_players', 
    'shortlist_players', 'export_reports'
  ],
  
  player: [
    'view_profile', 'update_profile', 'upload_videos', 'view_own_stats'
  ]
};

// Sample players database
const players = [
  {
    id: 1,
    firstName: 'Lionel',
    lastName: 'Messi',
    position: 'Forward',
    team: 'Inter Miami',
    visibility: 'public',
    createdBy: 2
  },
  {
    id: 2, 
    firstName: 'Team',
    lastName: 'Player',
    position: 'Midfielder',
    team: 'Demo Team', 
    visibility: 'team_only',
    createdBy: 3
  },
  {
    id: 3,
    firstName: 'Private',
    lastName: 'Prospect',
    position: 'Defender',
    team: 'Scout Find',
    visibility: 'private', 
    createdBy: 4
  }
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
      return res.status(403).json({ error: 'Invalid token' });
    }
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
      res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission,
        userRole: req.user.role,
        userPermissions: userPermissions
      });
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
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name,
      permissions: permissions[user.role]
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: permissions[user.role]
    }
  });
});

// Test permissions endpoint
app.get('/api/permissions/test', authenticateToken, (req, res) => {
  const userPermissions = permissions[req.user.role] || [];
  
  res.json({
    user: req.user,
    permissions: userPermissions,
    roleDescription: getRoleDescription(req.user.role),
    accessLevel: getAccessLevel(req.user.role)
  });
});

function getRoleDescription(role) {
  const descriptions = {
    super_admin: 'Full system administration',
    federation_admin: 'Player management and verification',
    team_coach: 'Team management and development', 
    talent_scout: 'Player discovery and assessment',
    player: 'Personal profile management'
  };
  return descriptions[role] || 'User';
}

function getAccessLevel(role) {
  const levels = {
    super_admin: 'FULL_ACCESS',
    federation_admin: 'HIGH_ACCESS', 
    team_coach: 'MEDIUM_ACCESS',
    talent_scout: 'MEDIUM_ACCESS',
    player: 'BASIC_ACCESS'
  };
  return levels[role] || 'RESTRICTED';
}

// Players endpoint with role-based filtering
app.get('/api/players', authenticateToken, (req, res) => {
  let accessiblePlayers = players;
  
  // Role-based filtering
  switch(req.user.role) {
    case 'super_admin':
      // See all players
      break;
    case 'federation_admin':
      // See public and federation players
      accessiblePlayers = players.filter(p => p.visibility !== 'private');
      break;
    case 'team_coach':
      // See public and team players
      accessiblePlayers = players.filter(p => 
        p.visibility === 'public' || p.visibility === 'team_only'
      );
      break;
    case 'talent_scout':
      // See public players only
      accessiblePlayers = players.filter(p => p.visibility === 'public');
      break;
    case 'player':
      // Very limited view
      accessiblePlayers = players.filter(p => 
        p.visibility === 'public' && p.id === 1 // Demo: only see Messi
      );
      break;
  }

  res.json({
    players: accessiblePlayers,
    total: accessiblePlayers.length,
    userRole: req.user.role,
    accessLevel: getAccessLevel(req.user.role),
    visiblePlayers: accessiblePlayers.length,
    totalPlayers: players.length
  });
});

// Analytics endpoint - requires permission
app.get('/api/analytics', authenticateToken, requirePermission('view_analytics'), (req, res) => {
  res.json({
    analytics: {
      totalPlayers: players.length,
      byPosition: players.reduce((acc, p) => {
        acc[p.position] = (acc[p.position] || 0) + 1;
        return acc;
      }, {}),
      accessGrantedTo: ['super_admin', 'federation_admin', 'team_coach', 'talent_scout']
    },
    accessedBy: req.user.role
  });
});

// User management - admin only
app.get('/api/users', authenticateToken, requirePermission('manage_users'), (req, res) => {
  res.json({
    users: users.map(u => ({
      id: u.id,
      email: u.email, 
      role: u.role,
      name: u.name
    })),
    managedBy: req.user.role
  });
});

// Video upload simulation
app.post('/api/videos/upload', authenticateToken, requirePermission('upload_videos'), (req, res) => {
  res.json({
    message: 'Video upload successful',
    uploadedBy: req.user.name,
    role: req.user.role,
    uploadId: 'vid_' + Date.now()
  });
});

// Demo unauthorized access
app.get('/api/admin/secret', authenticateToken, (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Super admin access required',
      userRole: req.user.role,
      requiredRole: 'super_admin'
    });
  }

  res.json({
    secret: 'Super admin confidential data',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🛡️  PLAYCONNECT ACCESS CONTROL SYSTEM RUNNING ON PORT 3015');
  console.log('📍 Health: http://localhost:3015/health');
  console.log('🔑 Login: POST http://localhost:3015/auth/login');
  console.log('🧪 Test: GET http://localhost:3015/api/permissions/test');
  console.log('');
  console.log('🎯 ROLE-BASED ACCESS DEMO:');
  console.log('   super_admin     - Full system access (all endpoints)');
  console.log('   federation_admin - Manage players, analytics, users');
  console.log('   team_coach      - Team management, limited analytics');
  console.log('   talent_scout    - Player discovery, basic analytics');
  console.log('   player          - Personal profile only');
  console.log('');
  console.log('⚡ Test Credentials (password: password):');
  console.log('   superadmin@playconnect.com');
  console.log('   federation@example.com');
  console.log('   coach@example.com'); 
  console.log('   scout@example.com');
  console.log('   player@example.com');
});
