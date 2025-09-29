const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Service configuration
const services = {
  auth: 'http://localhost:3001',
  players: 'http://localhost:3002',
  federation: 'http://localhost:3003'
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway running',
    timestamp: new Date().toISOString(),
    port: PORT,
    services: Object.keys(services)
  });
});

// Service status endpoint
app.get('/api/status', async (req, res) => {
  const serviceStatus = {};
  
  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) {
        serviceStatus[name] = { status: 'online', url };
      } else {
        serviceStatus[name] = { status: 'error', url, error: 'Health check failed' };
      }
    } catch (error) {
      serviceStatus[name] = { status: 'offline', url, error: error.message };
    }
  }
  
  res.json({
    gateway: 'running',
    services: serviceStatus
  });
});

// Proxy middleware for each service
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api'
  },
  onError: (err, req, res) => {
    console.error('Auth service error:', err);
    res.status(503).json({ error: 'Authentication service unavailable' });
  }
}));

app.use('/api/players', createProxyMiddleware({
  target: services.players,
  changeOrigin: true,
  pathRewrite: {
    '^/api/players': '/api/players'
  },
  onError: (err, req, res) => {
    console.error('Player service error:', err);
    res.status(503).json({ error: 'Player service unavailable' });
  }
}));

app.use('/api/federation', createProxyMiddleware({
  target: services.federation,
  changeOrigin: true,
  pathRewrite: {
    '^/api/federation': '/api'
  },
  onError: (err, req, res) => {
    console.error('Federation service error:', err);
    res.status(503).json({ error: 'Federation service unavailable' });
  }
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log('📡 Available services:', Object.keys(services));
  console.log('📍 Gateway health: http://localhost:3000/health');
  console.log('📍 Services status: http://localhost:3000/api/status');
  console.log('🔐 Auth endpoints: http://localhost:3000/api/auth/*');
  console.log('👤 Player endpoints: http://localhost:3000/api/players/*');
  console.log('🏛️  Federation endpoints: http://localhost:3000/api/federation/*');
});
