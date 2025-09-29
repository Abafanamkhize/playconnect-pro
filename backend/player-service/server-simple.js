const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Joi = require('joi');
const db = require('../models');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple auth for development
const authenticateToken = (req, res, next) => {
  req.user = { 
    role: 'federation_admin',
    federationId: '550e8400-e29b-41d4-a716-446655440000'
  };
  next();
};

// Validation schema
const playerCreateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  dateOfBirth: Joi.date().max('now').required(),
  nationality: Joi.string().min(2).max(50).required(),
  primaryPosition: Joi.string().required(),
  sport: Joi.string().required(),
  height: Joi.number().positive().optional(),
  weight: Joi.number().positive().optional()
});

// Create Player
app.post('/api/players', authenticateToken, async (req, res) => {
  try {
    const { error, value } = playerCreateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const player = await db.Player.create({
      ...value,
      verifiedBy: req.user.federationId,
      verificationStatus: 'verified',
      isActive: true
    });

    res.status(201).json({
      message: 'Player created successfully',
      player: {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        nationality: player.nationality,
        primaryPosition: player.primaryPosition,
        sport: player.sport
      }
    });
  } catch (error) {
    console.error('Player creation error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get All Players
app.get('/api/players', async (req, res) => {
  try {
    const players = await db.Player.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });

    res.json({ players });
  } catch (error) {
    console.error('Get players error:', error);
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
