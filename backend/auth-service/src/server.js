import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { testConnection } from './config/database.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
testConnection().then(async (connected) => {
  if (!connected) {
    console.log('❌ Database connection failed - stopping server');
    process.exit(1);
  }
  console.log('✅ Database connection verified');

  // Sync database models with error handling for permissions
  try {
    await User.sync({ force: false });
    console.log('✅ User model synchronized with database');
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError' && error.parent?.code === '42501') {
      console.log('⚠️  Permission issue with table creation. Table may already exist.');
      console.log('⚠️  Continuing with existing table structure...');
    } else {
      console.error('❌ Error syncing User model:', error.message);
    }
  }
});

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Authentication Service',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to check if users table is accessible
app.get('/api/auth/test-db', async (req, res) => {
  try {
    const userCount = await User.count();
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database access error',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Auth Service error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔐 Authentication Service running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/auth`);
});

export default app;
