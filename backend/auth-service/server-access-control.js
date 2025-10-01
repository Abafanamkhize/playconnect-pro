const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('../config/database'); // Fixed import
const authRoutes = require('./routes/auth-enhanced');
const { authenticateToken } = require('./middleware/authMiddleware');
const { roleMiddleware, superAdminOnly, federationAdminOnly } = require('./middleware/roleMiddleware');
const { hasPermission } = require('./middleware/permissionMiddleware');

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected for Access Control'))
  .catch(err => console.error('❌ Database connection failed:', err));

// Public routes
app.use('/api/auth', authRoutes);

// Protected admin routes - testing access control
app.get('/api/admin/users', authenticateToken, superAdminOnly, (req, res) => {
  res.json({ 
    message: 'Super admin access granted',
    user: req.user,
    data: ['user1', 'user2', 'user3']
  });
});

app.get('/api/federation/players', authenticateToken, federationAdminOnly, (req, res) => {
  res.json({
    message: 'Federation admin access granted',
    user: req.user,
    data: ['player1', 'player2']
  });
});

// Permission-based routes
app.get('/api/players', authenticateToken, hasPermission('view_players'), (req, res) => {
  res.json({
    message: 'Player view access granted',
    user: req.user,
    data: ['player1', 'player2']
  });
});

// Health check with access control info
app.get('/health', (req, res) => {
  res.json({
    status: 'Auth Service with Access Control Running',
    port: PORT,
    timestamp: new Date().toISOString(),
    features: [
      'JWT Authentication',
      'Role-Based Access Control',
      'Permission Management',
      '5 User Roles',
      'Protected Routes'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service with Access Control running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 Access Control Features:`);
  console.log(`   - Super Admin Only: http://localhost:${PORT}/api/admin/users`);
  console.log(`   - Federation Admin: http://localhost:${PORT}/api/federation/players`);
  console.log(`   - Player View: http://localhost:${PORT}/api/players`);
});
