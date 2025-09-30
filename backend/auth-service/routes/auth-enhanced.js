const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Enhanced login that connects to existing player database
router.post('/login-enhanced', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Connect to existing user database
    const users = [
      {
        id: '1', email: 'player@test.com', password: 'password', 
        role: 'player', firstName: 'John', lastName: 'Doe',
        playerId: 101, federationId: 1
      },
      {
        id: '2', email: 'scout@test.com', password: 'password',
        role: 'scout', firstName: 'David', lastName: 'Smith'
      },
      {
        id: '3', email: 'federation@test.com', password: 'password',
        role: 'federation_admin', firstName: 'Sarah', lastName: 'Johnson',
        federationId: 1
      }
    ];

    const user = users.find(u => u.email === email && u.role === role);
    
    if (!user || password !== 'password') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        name: `${user.firstName} ${user.lastName}`,
        playerId: user.playerId,
        federationId: user.federationId
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          playerId: user.playerId,
          federationId: user.federationId
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get players from existing player service
router.get('/players', (req, res) => {
  // This would connect to the existing player service
  const players = [
    {
      id: 101,
      name: 'Lionel Messi',
      position: 'Forward',
      age: 36,
      rating: 95,
      team: 'Inter Miami',
      nationality: 'Argentina',
      value: '$50,000,000',
      stats: { speed: 90, dribbling: 95, shooting: 92, passing: 91, vision: 94 },
      status: 'Verified',
      aiScore: 98,
      videos: 3,
      lastMatch: '2024-03-15',
      federationId: 1
    },
    {
      id: 102,
      name: 'Cristiano Ronaldo',
      position: 'Forward', 
      age: 39,
      rating: 88,
      team: 'Al Nassr',
      nationality: 'Portugal',
      value: '$40,000,000',
      stats: { speed: 84, dribbling: 85, shooting: 90, passing: 82, vision: 83 },
      status: 'Verified',
      aiScore: 92,
      videos: 4,
      lastMatch: '2024-03-14',
      federationId: 1
    }
  ];

  res.json({
    success: true,
    data: players
  });
});

module.exports = router;
