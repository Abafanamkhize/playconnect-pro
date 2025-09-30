// Simple backend server without external dependencies
const http = require('http');

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

const mockPlayers = [
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
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Set JSON header
  res.setHeader('Content-Type', 'application/json');

  // Route handling
  if (req.method === 'GET' && url.pathname === '/api/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: '🎯 PlayConnect Backend Running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: {
        auth: '✅ Running',
        database: '✅ Mock Data',
        api: '✅ Active'
      }
    }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/players') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockPlayers
    }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'playconnect-backend',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { email, password, role } = JSON.parse(body);
        console.log('Login attempt:', { email, role });
        
        const user = users[email];
        
        if (user && user.role === role) {
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful',
            data: {
              token: 'jwt-token-' + Date.now(),
              user: user
            }
          }));
        } else {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid credentials or role mismatch'
          }));
        }
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request body'
        }));
      }
    });
    return;
  }

  // 404 for unknown routes
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Route not found',
    path: url.pathname
  }));
});

const PORT = 3006;
server.listen(PORT, () => {
  console.log('🚀 ==========================================');
  console.log('🎯 PLAYCONNECT BACKEND SERVER RUNNING');
  console.log('🚀 ==========================================');
  console.log(`📍 Backend API: http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
  console.log(`🔐 Auth: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`👥 Players: http://localhost:${PORT}/api/players`);
  console.log('');
  console.log('✅ Ready for frontend connections!');
  console.log('✅ No external dependencies required!');
  console.log('');
});
