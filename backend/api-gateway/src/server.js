import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3000;

app.use(express.json());

// Service endpoints
const services = {
  auth: 'http://localhost:3001',
  players: 'http://localhost:3002', 
  federations: 'http://localhost:3003'
};

// SIMPLE PROXY - Map to whatever endpoints actually exist
app.use('/api/auth', createProxyMiddleware({ 
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': ''  // Remove /api/auth prefix - route to service root
  }
}));

app.use('/api/players', createProxyMiddleware({ 
  target: services.players,
  changeOrigin: true,
  pathRewrite: {
    '^/api/players': ''  // Remove /api/players prefix
  }
}));

app.use('/api/federations', createProxyMiddleware({ 
  target: services.federations,
  changeOrigin: true,
  pathRewrite: {
    '^/api/federations': ''  // Remove /api/federations prefix
  }
}));

// Direct health check endpoints
app.get('/health/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/health/auth': '/health'  // Map to service's /health
  }
}));

app.get('/health/players', createProxyMiddleware({
  target: services.players, 
  changeOrigin: true,
  pathRewrite: {
    '^/health/players': '/health'
  }
}));

app.get('/health/federations', createProxyMiddleware({
  target: services.federations,
  changeOrigin: true,
  pathRewrite: {
    '^/health/federations': '/health'
  }
}));

// Gateway health
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Root with simple instructions
app.get('/', (req, res) => {
  res.json({
    message: 'PlayConnect API Gateway - Simple Proxy Mode',
    instructions: 'Using path rewriting to match actual service endpoints',
    testEndpoints: {
      authHealth: '/health/auth',
      playersHealth: '/health/players', 
      federationsHealth: '/health/federations',
      createPlayer: 'POST /api/players with JSON body'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🌐 API Gateway (Simple Mode) on port ${PORT}`);
});
