const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory player store for testing
const players = [];

// Mock authentication middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = {
    federationId: 'test-federation-001',
    role: 'federation_admin'
  };
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Player Service Running', 
    port: PORT,
    timestamp: new Date().toISOString(),
    playersCount: players.length
  });
});

// Create a new player (Federation only)
app.post('/api/players', mockAuthMiddleware, (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, position, height, weight, skills } = req.body;

    // Validation
    if (!firstName || !lastName || !dateOfBirth || !position) {
      return res.status(400).json({ 
        error: 'First name, last name, date of birth, and position are required' 
      });
    }

    // Create player
    const player = {
      id: uuidv4(),
      firstName,
      lastName,
      dateOfBirth,
      position,
      height: height || null,
      weight: weight || null,
      skills: skills || {},
      federationId: req.user.federationId,
      verificationStatus: 'pending',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    players.push(player);

    res.status(201).json({
      message: 'Player created successfully',
      player
    });

  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all players with filtering and pagination
app.get('/api/players', (req, res) => {
  try {
    const { page = 1, limit = 10, position, verificationStatus } = req.query;
    const offset = (page - 1) * limit;

    // Filter players
    let filteredPlayers = players.filter(p => p.isActive);
    
    if (position) {
      filteredPlayers = filteredPlayers.filter(p => p.position === position);
    }
    
    if (verificationStatus) {
      filteredPlayers = filteredPlayers.filter(p => p.verificationStatus === verificationStatus);
    }

    // Paginate
    const paginatedPlayers = filteredPlayers.slice(offset, offset + parseInt(limit));
    const total = filteredPlayers.length;

    res.json({
      players: paginatedPlayers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player by ID
app.get('/api/players/:id', (req, res) => {
  try {
    const { id } = req.params;

    const player = players.find(p => p.id === id && p.isActive);

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ player });

  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update player (Federation only)
app.put('/api/players/:id', mockAuthMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const playerIndex = players.findIndex(p => p.id === id && p.isActive);

    if (playerIndex === -1) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if player belongs to user's federation
    if (players[playerIndex].federationId !== req.user.federationId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update player
    players[playerIndex] = {
      ...players[playerIndex],
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      message: 'Player updated successfully',
      player: players[playerIndex]
    });

  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete/archive player (Federation only)
app.delete('/api/players/:id', mockAuthMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const playerIndex = players.findIndex(p => p.id === id && p.isActive);

    if (playerIndex === -1) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if player belongs to user's federation
    if (players[playerIndex].federationId !== req.user.federationId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Archive player (soft delete)
    players[playerIndex].isActive = false;
    players[playerIndex].updatedAt = new Date();

    res.json({
      message: 'Player archived successfully'
    });

  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify player (Federation admin only)
app.patch('/api/players/:id/verify', mockAuthMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "verified" or "rejected"' });
    }

    const playerIndex = players.findIndex(p => p.id === id && p.isActive);

    if (playerIndex === -1) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if player belongs to user's federation
    if (players[playerIndex].federationId !== req.user.federationId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update verification status
    players[playerIndex].verificationStatus = status;
    players[playerIndex].updatedAt = new Date();

    res.json({
      message: `Player ${status} successfully`,
      player: players[playerIndex]
    });

  } catch (error) {
    console.error('Verify player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add some sample players for testing
players.push(
  {
    id: uuidv4(),
    firstName: 'Lionel',
    lastName: 'Mess',
    dateOfBirth: '1987-06-24',
    position: 'Forward',
    height: 170,
    weight: 72,
    skills: { speed: 90, dribbling: 95, shooting: 92 },
    federationId: 'test-federation-001',
    verificationStatus: 'verified',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    firstName: 'Virgil',
    lastName: 'Van Dijk',
    dateOfBirth: '1991-07-08',
    position: 'Defender',
    height: 193,
    weight: 92,
    skills: { strength: 90, tackling: 88, heading: 85 },
    federationId: 'test-federation-001',
    verificationStatus: 'verified',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`👤 Player Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Sample players loaded: ${players.length}`);
  console.log('✅ Player endpoints ready:');
  console.log('   POST   /api/players - Create player (federation only)');
  console.log('   GET    /api/players - Get all players with filtering');
  console.log('   GET    /api/players/:id - Get player by ID');
  console.log('   PUT    /api/players/:id - Update player (federation only)');
  console.log('   DELETE /api/players/:id - Archive player (federation only)');
  console.log('   PATCH  /api/players/:id/verify - Verify player (federation admin)');
});
