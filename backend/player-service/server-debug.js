const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Joi = require('joi');
const db = require('../models');

const app = express();
const PORT = process.env.PORT || 3002;

console.log('🔧 Starting Player Service in debug mode...');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// JWT verification middleware (simplified for now)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // For now, we'll just pass through - in production, verify JWT
  req.user = { 
    role: 'federation_admin',
    federationId: '550e8400-e29b-41d4-a716-446655440000'
  };
  next();
};

// Require federation admin role
const requireFederationAdmin = (req, res, next) => {
  if (req.user.role !== 'federation_admin') {
    return res.status(403).json({ error: 'Federation admin access required' });
  }
  next();
};

// Validation schemas
const playerCreateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  dateOfBirth: Joi.date().max('now').required(),
  nationality: Joi.string().min(2).max(50).required(),
  primaryPosition: Joi.string().required(),
  secondaryPositions: Joi.array().items(Joi.string()),
  sport: Joi.string().required(),
  height: Joi.number().positive().optional(),
  weight: Joi.number().positive().optional()
});

// Create Player (Federation Admin Only)
app.post('/api/players', authenticateToken, requireFederationAdmin, async (req, res) => {
  console.log('📝 Player creation attempt');
  try {
    // Validate input
    const { error, value } = playerCreateSchema.validate(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log('✅ Input validated, creating player...');
    
    // Create player with federation verification
    const player = await db.Player.create({
      ...value,
      verifiedBy: req.user.federationId,
      verificationStatus: 'verified',
      isActive: true
    });

    console.log('✅ Player created:', player.id);
    
    res.status(201).json({
      message: 'Player created successfully',
      player: {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        nationality: player.nationality,
        primaryPosition: player.primaryPosition,
        sport: player.sport,
        verificationStatus: player.verificationStatus,
        verifiedBy: player.verifiedBy
      }
    });
  } catch (error) {
    console.error('❌ Player creation error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get All Players (with filtering and pagination)
app.get('/api/players', async (req, res) => {
  console.log('📋 Get players request');
  try {
    const { page = 1, limit = 10, position, sport, nationality } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for filters
    const whereClause = { isActive: true };
    if (position) whereClause.primaryPosition = position;
    if (sport) whereClause.sport = sport;
    if (nationality) whereClause.nationality = nationality;

    console.log('🔍 Querying players with filters:', whereClause);
    
    const players = await db.Player.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.Federation,
        as: 'federation',
        attributes: ['id', 'name', 'country']
      }]
    });

    console.log('✅ Found', players.count, 'players');
    
    res.json({
      players: players.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(players.count / limit),
        totalPlayers: players.count,
        hasNext: offset + players.rows.length < players.count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Get players error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Health Check
app.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      status: 'Player Service Running - Database Connected', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Player Service Running - Database Error', 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection established');
    console.log(`👤 Player service running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

module.exports = app;
