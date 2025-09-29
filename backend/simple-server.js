const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/federation-dashboard/build')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'PlayConnect API',
    timestamp: new Date().toISOString()
  });
});

// Mock data endpoints
app.get('/api/players', (req, res) => {
  res.json([
    { id: 1, firstName: 'Lionel', lastName: 'Messi', position: 'Forward', age: 36 },
    { id: 2, firstName: 'Test', lastName: 'Player', position: 'Midfielder', age: 25 }
  ]);
});

app.get('/api/federations', (req, res) => {
  res.json([
    { id: 1, name: 'SAFA', country: 'South Africa', playerCount: 1247 }
  ]);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ 
    token: 'mock-jwt-token', 
    user: { 
      id: 1, 
      email: email, 
      role: 'admin',
      federationId: 1 
    } 
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/federation-dashboard/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 PlayConnect server running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`👥 Players API: http://localhost:${PORT}/api/players`);
});
