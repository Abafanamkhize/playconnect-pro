const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3010;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mock data for web testing
const mockUsers = [
  {
    id: '1',
    email: 'player@test.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'player',
    isVerified: true,
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'scout@test.com',
    firstName: 'David',
    lastName: 'Smith',
    role: 'scout',
    isVerified: true,
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: '3',
    email: 'admin@test.com',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    isVerified: true,
    isActive: true,
    lastLogin: new Date().toISOString()
  }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'User Management Service Running',
    port: PORT,
    accessible: true,
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/users - Get all users',
      'GET /api/users/stats - User statistics',
      'GET /api/users/profile/me - User profile'
    ]
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json({
    message: 'Users retrieved successfully',
    count: mockUsers.length,
    users: mockUsers
  });
});

// Get user statistics
app.get('/api/users/stats', (req, res) => {
  const stats = {
    totalUsers: mockUsers.length,
    usersByRole: mockUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}),
    activeUsers: mockUsers.filter(u => u.isActive).length,
    verifiedUsers: mockUsers.filter(u => u.isVerified).length
  };
  
  res.json(stats);
});

// Get user profile
app.get('/api/users/profile/me', (req, res) => {
  // Return first user for demo
  res.json({
    user: mockUsers[0]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`👥 User Management Service running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Network: http://${require('os').hostname()}:${PORT}`);
});
