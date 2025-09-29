const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route handling
  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      service: 'PlayConnect Minimal API',
      timestamp: new Date().toISOString()
    }));
  }
  else if (req.url === '/api/players' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
      { id: 1, firstName: 'Lionel', lastName: 'Messi', position: 'Forward', age: 36 },
      { id: 2, firstName: 'Test', lastName: 'Player', position: 'Midfielder', age: 25 }
    ]));
  }
  else if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        token: 'minimal-jwt-token',
        user: { id: 1, email: 'admin@test.com', role: 'admin' }
      }));
    });
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Minimal PlayConnect server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`👥 Players: http://localhost:${PORT}/api/players`);
});
