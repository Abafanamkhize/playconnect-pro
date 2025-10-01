const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

// Mock data
const users = [
  { id: 1, name: 'Super Admin', email: 'admin@playconnect.com', role: 'super_admin', isActive: true },
  { id: 2, name: 'Federation Admin', email: 'federation@playconnect.com', role: 'federation_admin', isActive: true },
  { id: 3, name: 'John Player', email: 'player@playconnect.com', role: 'player', isActive: true }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'User Management Service Running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json({
    message: 'Users retrieved successfully',
    count: users.length,
    users
  });
});

// Get user stats
app.get('/api/users/stats', (req, res) => {
  res.json({
    totalUsers: users.length,
    usersByRole: {
      super_admin: 1,
      federation_admin: 1,
      player: 1
    },
    activeUsers: users.filter(u => u.isActive).length
  });
});

// Get user profile
app.get('/api/users/profile/me', (req, res) => {
  res.json({
    user: users[0] // Return first user for testing
  });
});

app.listen(PORT, () => {
  console.log(`🚀 User Management Service running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`👥 Users: http://localhost:${PORT}/api/users`);
});
