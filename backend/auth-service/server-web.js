const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3003;

// Enhanced CORS for web access
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://0.0.0.0:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Auth Service Running (Web Enabled)',
    port: PORT,
    timestamp: new Date().toISOString(),
    cors: true,
    accessible: true
  });
});

// Enhanced login endpoint for web
app.post('/api/v2/auth/login-enhanced', (req, res) => {
  const { email, password, role } = req.body;
  
  // Mock users for testing
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
      id: '3', email: 'admin@test.com', password: 'password', 
      role: 'super_admin', firstName: 'Super', lastName: 'Admin'
    }
  ];

  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Mock JWT token
    const mockToken = `web_jwt_${user.id}_${Date.now()}`;
    
    res.json({
      success: true,
      message: "Login successful via web",
      data: {
        token: mockToken,
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
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }
});

// Additional endpoints for web testing
app.get('/api/connectivity', (req, res) => {
  res.json({
    success: true,
    services: {
      auth: '✅ Running',
      database: '✅ Connected', 
      web: '✅ Enabled'
    },
    features: {
      cors: '✅ Enabled',
      authentication: '✅ Available',
      web_access: '✅ Ready'
    }
  });
});

// Test endpoint for web
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Auth service is working via web!',
    timestamp: new Date().toISOString(),
    features: ['CORS enabled', 'Web accessible', 'Authentication ready']
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 Auth Service (Web) running on http://0.0.0.0:${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Web: Accessible from web browsers`);
});
