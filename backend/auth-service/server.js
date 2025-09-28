const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'playconnect_secret_key_2024';

// Database configuration
const config = require('../config/config.json').development;
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false
});

// Import models manually
const Player = require('../models/player')(sequelize, DataTypes);
const Federation = require('../models/federation')(sequelize, DataTypes);
const User = require('../models/user')(sequelize, DataTypes);

// Set up associations
Player.associate({ Federation });
Federation.associate({ Player });
User.associate({ Federation });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Input validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// JWT verification middleware
const authenticateToken = (req, res, next) => {
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
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// User Registration Endpoint
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['federation_admin', 'scout', 'player']),
  body('federationId').optional().isUUID()
], validateRequest, async (req, res) => {
  try {
    const { email, password, role, federationId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      role,
      federationId: role === 'federation_admin' ? federationId : null,
      isActive: true
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        federationId: user.federationId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        federationId: user.federationId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login Endpoint
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        federationId: user.federationId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        federationId: user.federationId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected Test Route
app.get('/api/auth/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: req.user 
  });
});

// Federation Admin Only Route
app.get('/api/auth/federation-only', 
  authenticateToken, 
  requireRole(['federation_admin']),
  (req, res) => {
    res.json({ 
      message: 'Access granted to federation admin route',
      user: req.user 
    });
  }
);

// Health Check
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'Auth Service Running - Database Connected', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Auth Service Running - Database Error', 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    await sequelize.sync();
    console.log('✅ Database synchronized');
    console.log(`🔐 Authentication service running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

module.exports = app;
