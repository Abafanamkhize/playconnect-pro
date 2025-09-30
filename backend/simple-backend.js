const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
const users = {
  'player@test.com': { 
    id: 1, 
    name: 'John Player', 
    role: 'player', 
    playerId: 101,
    email: 'player@test.com'
  },
  'scout@test.com': { 
    id: 2, 
    name: 'David Scout', 
    role: 'scout',
    email: 'scout@test.com'
  },
  'federation@test.com': { 
    id: 3, 
    name: 'Sarah Federation', 
    role: 'federation_admin', 
    federationId: 1,
    email: 'federation@test.com'
  }
};

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  console.log('Login attempt:', { email, role });
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = users[email];
  
  if (user && user.role === role) {
    // Successful login
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: user
      }
    });
  } else {
    // Failed login
    res.status(401).json({
      success: false,
      message: 'Invalid credentials or role mismatch'
    });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: '🎯 PlayConnect Backend Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      auth: '✅ Running',
      database: '✅ Mock Data',
      api: '✅ Active'
    }
  });
});

// Players endpoint
app.get('/api/players', (req, res) => {
  res.json({
    success: true,
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
      }
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'playconnect-simple-backend',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = 3006;
app.listen(PORT, () => {
  console.log('🚀 ==========================================');
  console.log('🎯 PLAYCONNECT SIMPLE BACKEND RUNNING');
  console.log('🚀 ==========================================');
  console.log(`📍 Backend API: http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`👥 Players: http://localhost:${PORT}/api/players`);
  console.log('');
  console.log('✅ Ready for frontend connections!');
  console.log('');
});
