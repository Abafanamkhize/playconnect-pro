const express = require('express');
<<<<<<< HEAD
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

// Auth Service: /api/auth/* -> /api/*
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api'
  }
}));

// Player Service: /api/players/* -> /api/players/*
app.use('/api/players', createProxyMiddleware({
  target: services.players,
  changeOrigin: true
}));

// Federation Service: /api/federation/* -> /*
app.use('/api/federation', createProxyMiddleware({
  target: services.federation,
  changeOrigin: true,
  pathRewrite: {
    '^/api/federation': ''
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
=======
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway', port: PORT });
});

app.get('/api/players', (req, res) => {
  res.json([{ id: 1, name: 'Test Player' }]);
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
>>>>>>> c914a42f12460edeffad269d875cffed32852c9b
});
