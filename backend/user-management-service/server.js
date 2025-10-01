const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('../config/database');
const { authenticateToken } = require('../auth-service/middleware/authMiddleware');
const { superAdminOnly, federationAdminOnly, managementRoles } = require('../auth-service/middleware/roleMiddleware');

const app = express();
const PORT = process.env.PORT || 3010;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Import models
const { User, Player, Federation } = require('../models');

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
      'GET /api/users/:id - Get user by ID',
      'PUT /api/users/:id - Update user',
      'DELETE /api/users/:id - Delete user (Admin only)',
      'GET /api/users/profile/me - Get current user profile',
      'GET /api/users/stats - Get user statistics (Admin only)'
    ]
  });
});

// GET /api/users - Get all users (Super Admin only)
app.get('/api/users', authenticateToken, superAdminOnly, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { 
        exclude: ['passwordHash', 'verificationToken', 'resetPasswordToken'] 
      },
      include: [
        {
          model: Federation,
          as: 'federation',
          attributes: ['id', 'name', 'country']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
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
    const totalUsers = await User.count();
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    const verifiedUsers = await User.count({ where: { isVerified: true } });
    const activeUsers = await User.count({ where: { isActive: true } });

    res.json({
      totalUsers,
      usersByRole,
      verifiedUsers,
      activeUsers,
      verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) + '%' : '0%'
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve user statistics' });
  }
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { 
        exclude: ['passwordHash', 'verificationToken', 'resetPasswordToken'] 
      },
      include: [
        {
          model: Federation,
          as: 'federation',
          attributes: ['id', 'name', 'country']
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'super_admin' && req.user.userId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// GET /api/users/profile/me - Get current user profile
app.get('/api/users/profile/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { 
        exclude: ['passwordHash', 'verificationToken', 'resetPasswordToken'] 
      },
      include: [
        {
          model: Federation,
          as: 'federation',
          attributes: ['id', 'name', 'country']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Users can only update their own profile unless they're super admin
    if (req.user.role !== 'super_admin' && req.user.userId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allowedFields = ['firstName', 'lastName', 'email'];
    const updateData = {};
    
    // Filter allowed fields for non-admin users
    if (req.user.role === 'super_admin') {
      Object.assign(updateData, req.body);
    } else {
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
    }

    await user.update(updateData);
    
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash', 'verificationToken', 'resetPasswordToken'] }
    });

    res.json({ 
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user (Super Admin only)
app.delete('/api/users/:id', authenticateToken, superAdminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent self-deletion
    if (req.user.userId === user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await user.destroy();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`👥 User Management Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 User statistics: http://localhost:${PORT}/api/users/stats`);
  console.log(`👤 User endpoints: http://localhost:${PORT}/api/users`);
});
