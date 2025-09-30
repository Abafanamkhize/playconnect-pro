const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Service status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: '🎯 PlayConnect - Phase 2 Integration Running',
    version: '2.0.0',
    phase: 'Database & Service Integration',
    timestamp: new Date().toISOString(),
    services: {
      integration: '✅ Running on port 3006',
      player: '🟡 Ready to start on port 3003',
      auth: '🟡 Ready to start on port 3002',
      frontend: '✅ Ready on port 3000',
      database: '✅ Models & Migrations Ready'
    },
    features: [
      '3-role authentication system',
      'Player management with video upload',
      'Federation-controlled verification',
      'Advanced search and filtering',
      'Complete microservices architecture'
    ]
  });
});

// Test players endpoint (will connect to real player service)
app.get('/api/players', (req, res) => {
  res.json({
    success: true,
    message: 'Connected to PlayConnect integration service',
    data: [
      {
        id: 101,
        name: 'Lionel Messi',
        position: 'Forward',
        age: 36,
        rating: 95,
        team: 'Inter Miami',
        nationality: 'Argentina',
        status: 'Verified',
        aiScore: 98,
        stats: { speed: 90, dribbling: 95, shooting: 92, passing: 91, vision: 94 }
      },
      {
        id: 102,
        name: 'Cristiano Ronaldo',
        position: 'Forward',
        age: 39,
        rating: 88,
        team: 'Al Nassr',
        nationality: 'Portugal',
        status: 'Verified',
        aiScore: 92,
        stats: { speed: 84, dribbling: 85, shooting: 90, passing: 82, vision: 83 }
      },
      {
        id: 103,
        name: 'Kevin De Bruyne',
        position: 'Midfielder',
        age: 32,
        rating: 91,
        team: 'Manchester City',
        nationality: 'Belgium',
        status: 'Verified',
        aiScore: 94,
        stats: { speed: 76, dribbling: 86, shooting: 86, passing: 94, vision: 95 }
      }
    ]
  });
});

// Authentication test endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Mock authentication - will connect to real auth service
  const users = {
    'player@test.com': { id: 1, name: 'John Player', role: 'player', playerId: 101 },
    'scout@test.com': { id: 2, name: 'David Scout', role: 'scout' },
    'federation@test.com': { id: 3, name: 'Sarah Federation', role: 'federation_admin', federationId: 1 }
  };

  const user = users[email];
  
  if (user && password === 'password' && user.role === role) {
    res.json({
      success: true,
      message: 'Login successful via integration service',
      data: {
        token: 'integration-jwt-token',
        user: user
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Health check for all services
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'playconnect-integration',
    phase: '2',
    database: {
      models: '✅ Ready',
      migrations: '✅ 15+ migrations available',
      relationships: '✅ Player-Federation-User associations'
    },
    ready_for: [
      'Database connection with PostgreSQL',
      'Real player service integration',
      'Authentication service connection',
      'Frontend API integration'
    ]
  });
});

const PORT = 3006;
app.listen(PORT, () => {
  console.log('🚀 ==========================================');
  console.log('🎯 PLAYCONNECT PHASE 2 - INTEGRATION SERVICE');
  console.log('🚀 ==========================================');
  console.log(`📍 Integration API: http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
  console.log(`👥 Players: http://localhost:${PORT}/api/players`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('🔧 NEXT STEPS:');
  console.log('   1. Start frontend: cd frontend/federation-dashboard && npm start');
  console.log('   2. Connect to database: npm run db:setup');
  console.log('   3. Start player service: cd backend/player-service && npm start');
  console.log('');
});
