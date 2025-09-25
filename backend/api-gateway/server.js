import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    microservices: {
      auth: 'http://localhost:3001',
      players: 'Coming soon',
      federations: 'Coming soon',
      ai: 'Coming soon'
    }
  });
});

// Proxy middleware for authentication service
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  },
  onError: (err, req, res) => {
    console.error('Auth service error:', err);
    res.status(503).json({ error: 'Authentication service unavailable' });
  }
}));

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'PlayConnect API Gateway',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    },
    documentation: 'https://github.com/Abafanamkhize/playconnect-pro'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth service: http://localhost:${PORT}/api/auth`);
});
