const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3007;

// Database connection
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/playconnect',
  {
    dialect: 'postgres',
    logging: false
  }
);

// Import models from existing structure
const Player = require('../models/Player');
const User = require('../models/User');
const Federation = require('../player-service/src/models/Federation');

// Middleware
app.use(cors());
app.use(express.json());

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || "playconnect-super-secret-key-2024";
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Integration Service Running",
    port: PORT,
    timestamp: new Date().toISOString(),
    services: {
      auth: "http://localhost:3002",
      player: "http://localhost:3003",
      file: "http://localhost:3006"
    }
  });
});

// Unified player search with advanced filtering
app.get("/api/search/players", authenticateToken, async (req, res) => {
  try {
    const { query, position, ageMin, ageMax, skills, federationId, page = 1, limit = 10 } = req.query;
    
    const whereClause = {};
    
    // Text search
    if (query) {
      whereClause.name = { [Sequelize.Op.iLike]: `%${query}%` };
    }
    
    // Filter by position
    if (position) {
      whereClause.position = position;
    }
    
    // Filter by age range
    if (ageMin || ageMax) {
      whereClause.age = {};
      if (ageMin) whereClause.age[Sequelize.Op.gte] = parseInt(ageMin);
      if (ageMax) whereClause.age[Sequelize.Op.lte] = parseInt(ageMax);
    }
    
    // Filter by federation
    if (federationId) {
      whereClause.federationId = federationId;
    }

    const offset = (page - 1) * limit;

    const players = await Player.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Federation,
        as: 'federation',
        attributes: ['id', 'name']
      }]
    });

    res.json({
      success: true,
      data: {
        players: players.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: players.count,
          pages: Math.ceil(players.count / limit)
        }
      }
    });

  } catch (error) {
    console.error("Search players error:", error);
    res.status(500).json({ 
      success: false,
      error: "Search failed" 
    });
  }
});

// Get player analytics
app.get("/api/analytics/players/:playerId", authenticateToken, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.playerId, {
      include: [{
        model: Federation,
        as: 'federation'
      }]
    });

    if (!player) {
      return res.status(404).json({ 
        success: false,
        error: "Player not found" 
      });
    }

    // Mock analytics data - would be calculated from real data
    const analytics = {
      playerId: player.id,
      performanceTrend: [
        { date: '2024-01-01', rating: 85 },
        { date: '2024-02-01', rating: 87 },
        { date: '2024-03-01', rating: 90 }
      ],
      skillBreakdown: {
        speed: player.stats?.speed || 0,
        dribbling: player.stats?.dribbling || 0,
        shooting: player.stats?.shooting || 0,
        passing: player.stats?.passing || 0,
        vision: player.stats?.vision || 0
      },
      comparison: {
        positionAverage: 82,
        topPercentile: 95
      },
      recommendations: [
        "Focus on speed training",
        "Improve defensive positioning",
        "Enhance passing accuracy under pressure"
      ]
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error("Player analytics error:", error);
    res.status(500).json({ 
      success: false,
      error: "Analytics failed" 
    });
  }
});

// Get federation analytics
app.get("/api/analytics/federations/:federationId", authenticateToken, async (req, res) => {
  try {
    const federation = await Federation.findByPk(req.params.federationId, {
      include: [{
        model: Player,
        as: 'players'
      }]
    });

    if (!federation) {
      return res.status(404).json({ 
        success: false,
        error: "Federation not found" 
      });
    }

    const analytics = {
      federationId: federation.id,
      totalPlayers: federation.players?.length || 0,
      playerDistribution: {
        forward: federation.players?.filter(p => p.position === 'Forward').length || 0,
        midfielder: federation.players?.filter(p => p.position === 'Midfielder').length || 0,
        defender: federation.players?.filter(p => p.position === 'Defender').length || 0,
        goalkeeper: federation.players?.filter(p => p.position === 'Goalkeeper').length || 0
      },
      averageRatings: {
        overall: 84,
        forward: 86,
        midfielder: 83,
        defender: 82,
        goalkeeper: 85
      },
      talentPipeline: {
        emerging: 12,
        developing: 8,
        established: 15,
        elite: 5
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error("Federation analytics error:", error);
    res.status(500).json({ 
      success: false,
      error: "Analytics failed" 
    });
  }
});

// Unified data sync endpoint
app.get("/api/sync/data", authenticateToken, async (req, res) => {
  try {
    const [players, federations, users] = await Promise.all([
      Player.findAll({
        limit: 50,
        order: [['updatedAt', 'DESC']],
        include: [{
          model: Federation,
          as: 'federation',
          attributes: ['id', 'name']
        }]
      }),
      Federation.findAll({
        limit: 10,
        order: [['name', 'ASC']]
      }),
      User.findAll({
        where: { isActive: true },
        attributes: ['id', 'email', 'firstName', 'lastName', 'role'],
        limit: 20
      })
    ]);

    res.json({
      success: true,
      data: {
        players,
        federations,
        users,
        lastSync: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Data sync error:", error);
    res.status(500).json({ 
      success: false,
      error: "Data sync failed" 
    });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("🔄 Integration Service running on port " + PORT);
    console.log("📍 Health check: http://localhost:" + PORT + "/health");
    console.log("✅ Integration endpoints ready:");
    console.log("   GET  /api/search/players - Advanced player search");
    console.log("   GET  /api/analytics/players/:id - Player analytics");
    console.log("   GET  /api/analytics/federations/:id - Federation analytics");
    console.log("   GET  /api/sync/data - Unified data sync");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
