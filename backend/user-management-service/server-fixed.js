const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize } = require('sequelize');
const { authenticateToken } = require('../auth-service/middleware/authMiddleware');
const { superAdminOnly } = require('../auth-service/middleware/roleMiddleware');

const app = express();
const PORT = process.env.PORT || 3010;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple database connection for user management
const sequelize = new Sequelize(
  process.env.DB_NAME || "playconnect",
  process.env.DB_USER || "playconnect_user", 
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('✅ User Management Service - Database connected'))
  .catch(err => console.error('❌ Database connection failed:', err));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'User Management Service Running',
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/users - Get all users (Admin only)',
      'GET /api/users/stats - Get user statistics (Admin only)',
      'GET /api/users/profile/me - Get current user profile'
    ]
  });
});

// Mock user data for testing
const mockUsers = [
  {
    id: '1',
    email: 'superadmin@playconnect.com',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    isVerified: true,
    isActive: true,
    lastLogin: new Date()
  },
  {
    id: '2', 
    email: 'federation@playconnect.com',
    firstName: 'Federation',
    lastName: 'Admin',
    role: 'federation_admin',
    isVerified: true,
    isActive: true,
    lastLogin: new Date()
  },
  {
    id: '3',
    email: 'player@playconnect.com',
    firstName: 'John',
    lastName: 'Player',
    role: 'player',
    isVerified: true,
    isActive: true,
    lastLogin: new Date()
  }
];

// GET /api/users - Get all users (Super Admin only)
app.get('/api/users', authenticateToken, superAdminOnly, async (req, res) => {
  try {
    // For now, return mock data - will integrate with real database later
    const users = mockUsers.map(user => ({
      ...user,
      // Exclude sensitive fields
      passwordHash: undefined,
      verificationToken: undefined,
      resetPasswordToken: undefined
    }));
    
    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET /api/users/stats - Get user statistics (Admin only)
app.get('/api/users/stats', authenticateToken, superAdminOnly, async (req, res) => {
  try {
    const totalUsers = mockUsers.length;
    const usersByRole = mockUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const verifiedUsers = mockUsers.filter(user => user.isVerified).length;
    const activeUsers = mockUsers.filter(user => user.isActive).length;

    res.json({
      totalUsers,
      usersByRole: Object.entries(usersByRole).map(([role, count]) => ({ role, count })),
      verifiedUsers,
      activeUsers,
      verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) + '%' : '0%'
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve user statistics' });
  }
});

// GET /api/users/profile/me - Get current user profile
app.get('/api/users/profile/me', authenticateToken, async (req, res) => {
  try {
    // Find user in mock data - in real implementation, query database
    const user = mockUsers.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        ...user,
        // Exclude sensitive fields
        passwordHash: undefined,
        verificationToken: undefined, 
        resetPasswordToken: undefined
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`👥 User Management Service (Fixed) running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 User statistics: http://localhost:${PORT}/api/users/stats`);
  console.log(`👤 User endpoints: http://localhost:${PORT}/api/users`);
});
