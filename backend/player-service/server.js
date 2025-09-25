import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/playconnect-players'
    );
    console.log(`👤 Player Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Import routes
import playerRoutes from './src/routes/playerRoutes.js';

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Player Service',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Use player routes
app.use('/api/players', playerRoutes);

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`👤 Player Service running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
};

startServer();

export default app;
