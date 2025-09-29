const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/database');

// Only load security middleware if not in test environment
let securityMiddleware = {};
if (process.env.NODE_ENV !== 'test') {
  securityMiddleware = require('./config/security');
}

const app = express();

// Security middleware (only in non-test environments)
if (process.env.NODE_ENV !== 'test') {
  app.use(securityMiddleware.securityHeaders);
  app.use(cors());

  // Rate limiting
  app.use('/api/auth/login', securityMiddleware.authLimiter);
  app.use('/api/auth/register', securityMiddleware.authLimiter);
  app.use('/api/', securityMiddleware.apiLimiter);
} else {
  app.use(cors());
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Auth service running', 
    timestamp: new Date().toISOString() 
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3002;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
}

// Export for testing
module.exports = { app, sequelize };
