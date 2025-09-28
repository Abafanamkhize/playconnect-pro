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

console.log('🔧 Starting server in debug mode...');

// Database configuration
try {
  const config = require('../config/config.json').development;
  console.log('📊 Database config loaded:', config.database);
  
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: console.log
  });

  // Import models manually
  console.log('📦 Loading models...');
  const Player = require('../models/player')(sequelize, DataTypes);
  const Federation = require('../models/federation')(sequelize, DataTypes);
  const User = require('../models/user')(sequelize, DataTypes);

  // Set up associations
  console.log('🔗 Setting up associations...');
  Player.associate({ Federation });
  Federation.associate({ Player });
  User.associate({ Federation });

  console.log('✅ Models loaded successfully');

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

  // Simple registration without federationId for testing
  app.post('/api/auth/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['federation_admin', 'scout', 'player'])
  ], validateRequest, async (req, res) => {
    console.log('📝 Registration attempt:', req.body.email);
    try {
      const { email, password, role } = req.body;

      // Check if user already exists
      console.log('🔍 Checking existing user...');
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log('❌ User already exists');
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      console.log('🔐 Hashing password...');
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      console.log('👤 Creating user...');
      const user = await User.create({
        email,
        passwordHash,
        role,
        isActive: true
      });

      console.log('✅ User created:', user.id);

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
      console.error('❌ Registration error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  });

  // User Login Endpoint
  app.post('/api/auth/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ], validateRequest, async (req, res) => {
    console.log('🔑 Login attempt:', req.body.email);
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log('❌ User not found');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.isActive) {
        console.log('❌ User inactive');
        return res.status(401).json({ error: 'Account deactivated' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
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

      console.log('✅ Login successful for:', user.email);
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
      console.error('❌ Login error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  });

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
      console.log('🔌 Connecting to database...');
      await sequelize.authenticate();
      console.log('✅ Database connection established');
      
      console.log('🔄 Syncing database...');
      await sequelize.sync({ force: false });
      console.log('✅ Database synchronized');
      
      console.log(`🔐 Authentication service running on port ${PORT}`);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
    }
  });

} catch (error) {
  console.error('❌ Server startup error:', error);
  process.exit(1);
}

module.exports = app;
