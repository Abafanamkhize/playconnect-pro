const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Service discovery and routing
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
  players: process.env.PLAYER_SERVICE_URL || 'http://localhost:3003',
  search: process.env.SEARCH_SERVICE_URL || 'http://localhost:3004',
  federation: process.env.FEDERATION_SERVICE_URL || 'http://localhost:3005'
};

const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
  players: process.env.PLAYER_SERVICE_URL || 'http://localhost:3003',
  search: process.env.SEARCH_SERVICE_URL || 'http://localhost:3004',
  federation: process.env.FEDERATION_SERVICE_URL || 'http://localhost:3005',
  cache: process.env.CACHE_SERVICE_URL || 'http://localhost:3006'  // Add this line
};

app.use('/api/cache', createProxyMiddleware({
  target: services.cache,
  changeOrigin: true,
  pathRewrite: {
    '^/api/cache': ''
  },
  onError: (err, req, res) => {
    console.error('Cache service error:', err);
    res.status(503).json({ error: 'Cache service unavailable' });
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'API Gateway running',
    timestamp: new Date().toISOString(),
    services: Object.keys(services)
  });
});

// Proxy middleware for each service
app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth'
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

app.use('/api/search', createProxyMiddleware({
  target: services.search,
  changeOrigin: true,
  pathRewrite: {
    '^/api/search': '/api/search'
  },
  onError: (err, req, res) => {
    console.error('Search service error:', err);
    res.status(503).json({ error: 'Search service unavailable' });
  }
}));

app.use('/api/federation', createProxyMiddleware({
  target: services.federation,
  changeOrigin: true,
  pathRewrite: {
    '^/api/federation': '/api/federation'
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Available services:', Object.keys(services));
});
