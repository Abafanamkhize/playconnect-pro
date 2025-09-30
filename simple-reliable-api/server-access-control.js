const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3012;

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'playconnect-secret-key-2024';

// Complete user database with all 5 roles
const users = [
  {
    id: 1,
    email: 'superadmin@playconnect.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'super_admin',
    name: 'System Administrator',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    email: 'federation@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'federation_admin',
    name: 'National Football Federation',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3, 
    email: 'coach@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'team_coach',
    name: 'Professional Team Coach',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    email: 'scout@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'talent_scout',
    name: 'Professional Scout',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 5,
    email: 'player@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'player',
    name: 'Professional Player',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Comprehensive permission matrix for all 5 roles
const permissions = {
  super_admin: [
    '*', // Wildcard - access to everything
  ],
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
    'view_profile', 'update_profile', 'upload_videos', 'view_own_stats',
    'view_team_players'
  ]
};

// Player database for testing permissions
let players = [
  {
    id: 1,
    firstName: 'Lionel',
    lastName: 'Messi',
    position: 'Forward',
    team: 'Inter Miami',
    createdBy: 2, // Federation admin
    verificationStatus: 'verified',
    visibility: 'public'
  },
  {
    id: 2,
    firstName: 'Team',
    lastName: 'Player',
    position: 'Midfielder', 
    team: 'Demo Team',
    createdBy: 3, // Team coach
    verificationStatus: 'pending',
    visibility: 'team_only'
  }
];

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      code: 'TOKEN_REQUIRED'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
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
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permission,
        userRole: req.user.role,
        userPermissions: userPermissions
      });
    }
  };
}

// Role-based route protection
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        error: `Requires ${role} role`,
        code: 'ROLE_REQUIRED',
        userRole: req.user.role,
        requiredRole: role
      });
    }
    next();
  };
}

// Route permission guards
const routeGuards = {
  players: {
    view: ['view_players', 'manage_players', '*'],
    create: ['manage_players', '*'],
    update: ['manage_players', '*'],
    delete: ['manage_players', '*']
  },
  analytics: {
    view: ['view_analytics', '*']
  },
  users: {
    manage: ['manage_users', '*']
  },
  videos: {
    upload: ['upload_videos', '*']
  }
};

// Login endpoint with enhanced role info
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Simplified password check for demo
  const validPassword = password === 'password';
  if (!validPassword) {
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
      permissions: permissions[user.role],
      roleDescription: getRoleDescription(user.role)
    }
  });
});

function getRoleDescription(role) {
  const descriptions = {
    super_admin: 'Full system access and administration',
    federation_admin: 'Manage players, verify talent, oversee federations',
    team_coach: 'Team management and player development',
    talent_scout: 'Player discovery and assessment',
    player: 'Personal profile and performance tracking'
  };
  return descriptions[role] || 'User';
}

// Protected routes with permission checks

// Players endpoint - different access based on role
app.get('/api/players', authenticateToken, (req, res) => {
  let accessiblePlayers = players;
  
  // Team coaches can only see their team players + public players
  if (req.user.role === 'team_coach') {
    accessiblePlayers = players.filter(p => 
      p.visibility === 'public' || p.createdBy === req.user.id
    );
  }
  
  // Players can only see public players and themselves
  if (req.user.role === 'player') {
    accessiblePlayers = players.filter(p => p.visibility === 'public');
  }

  res.json({
    players: accessiblePlayers,
    total: accessiblePlayers.length,
    userRole: req.user.role,
    permissions: permissions[req.user.role]
  });
});

// Create player - federation admins only
app.post('/api/players', authenticateToken, requirePermission('manage_players'), (req, res) => {
  const { firstName, lastName, position, team } = req.body;

  const newPlayer = {
    id: players.length + 1,
    firstName,
    lastName,
    position,
    team,
    createdBy: req.user.id,
    verificationStatus: 'pending',
    visibility: 'public',
    createdAt: new Date().toISOString()
  };

  players.push(newPlayer);

  res.status(201).json({
    message: 'Player created successfully',
    player: newPlayer,
    createdBy: req.user.name
  });
});

// Analytics endpoint - requires analytics permission
app.get('/api/analytics', authenticateToken, requirePermission('view_analytics'), (req, res) => {
  res.json({
    analytics: {
      totalPlayers: players.length,
      verifiedPlayers: players.filter(p => p.verificationStatus === 'verified').length,
      playersByPosition: groupBy(players, 'position'),
      userRole: req.user.role
    },
    accessibleTo: ['federation_admin', 'team_coach', 'talent_scout', 'super_admin']
  });
});

// User management - super admin and federation admins only
app.get('/api/users', authenticateToken, requirePermission('manage_users'), (req, res) => {
  const userList = users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    name: u.name,
    isActive: u.isActive,
    lastLogin: u.lastLogin
  }));

  res.json({
    users: userList,
    total: userList.length,
    managedBy: req.user.role
  });
});

// Video upload simulation - requires upload permission
app.post('/api/videos/upload', authenticateToken, requirePermission('upload_videos'), (req, res) => {
  const { playerId, videoType } = req.body;

  res.json({
    message: 'Video upload initiated',
    uploadId: 'vid_' + Date.now(),
    playerId,
    videoType,
    uploadedBy: req.user.name,
    role: req.user.role,
    status: 'processing'
  });
});

// Role testing endpoint - check permissions for current user
app.get('/api/permissions/test', authenticateToken, (req, res) => {
  const userPermissions = permissions[req.user.role] || [];
  
  const permissionTests = {
    can_view_players: userPermissions.includes('view_players') || userPermissions.includes('*'),
    can_manage_players: userPermissions.includes('manage_players') || userPermissions.includes('*'),
    can_view_analytics: userPermissions.includes('view_analytics') || userPermissions.includes('*'),
    can_manage_users: userPermissions.includes('manage_users') || userPermissions.includes('*'),
    can_upload_videos: userPermissions.includes('upload_videos') || userPermissions.includes('*')
  };

  res.json({
    user: {
      id: req.user.id,
      role: req.user.role,
      name: req.user.name
    },
    permissions: userPermissions,
    permissionTests,
    roleDescription: getRoleDescription(req.user.role)
  });
});

// Unauthorized access handling demonstration
app.get('/api/admin/secret', authenticateToken, (req, res) => {
  // This route doesn't have explicit permission check
  // It will be handled by the generic error handler
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Super admin access required',
      code: 'SUPER_ADMIN_REQUIRED',
      userRole: req.user.role
    });
  }

  res.json({
    secret: 'This is super admin only data',
    timestamp: new Date().toISOString()
  });
});

// Health endpoint with role information
app.get('/health', (req, res) => {
  res.json({
    status: 'PLAYCONNECT ACCESS CONTROL API - RUNNING',
    port: PORT,
    timestamp: new Date().toISOString(),
    features: [
      '5-role-system',
      'permission-management',
      'route-guards',
      'role-based-access',
      'unauthorized-handling'
    ],
    availableRoles: Object.keys(permissions),
    userCount: users.length
  });
});

// Helper function
function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const val = item[key];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('🛡️  PLAYCONNECT ACCESS CONTROL API RUNNING ON PORT 3012');
  console.log('📍 Health: http://localhost:3012/health');
  console.log('🔑 Login: POST http://localhost:3012/auth/login');
  console.log('👥 Test Permissions: GET http://localhost:3012/api/permissions/test');
  console.log('');
  console.log('🎯 AVAILABLE ROLES & PERMISSIONS:');
  console.log('   super_admin     - Full system access');
  console.log('   federation_admin - Manage players, verify talent');
  console.log('   team_coach      - Team management');
  console.log('   talent_scout    - Player discovery');
  console.log('   player          - Personal profile');
  console.log('');
  console.log('⚡ Demo Credentials:');
  console.log('   super_admin: superadmin@playconnect.com / password');
  console.log('   federation: federation@example.com / password');
  console.log('   coach: coach@example.com / password');
  console.log('   scout: scout@example.com / password');
  console.log('   player: player@example.com / password');
});
