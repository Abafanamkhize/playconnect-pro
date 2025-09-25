import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/playconnect-federations'
    );
    console.log(`🏛️ Federation Service MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Import models
import Federation from './src/models/Federation.js';

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Federation Service',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Get all federations
app.get('/api/federations', async (req, res) => {
  try {
    const { region, sport, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (region) query.region = region;
    if (sport) query['sports.sport'] = sport;
    
    const federations = await Federation.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Federation.countDocuments(query);
    
    res.json({
      federations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch federations' });
  }
});

// Get federation by ID
app.get('/api/federations/:id', async (req, res) => {
  try {
    const federation = await Federation.findById(req.params.id);
    if (!federation) {
      return res.status(404).json({ error: 'Federation not found' });
    }
    res.json({ federation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch federation' });
  }
});

// Create new federation
app.post('/api/federations', async (req, res) => {
  try {
    const federation = new Federation(req.body);
    await federation.save();
    res.status(201).json({ federation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update federation
app.put('/api/federations/:id', async (req, res) => {
  try {
    const federation = await Federation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!federation) {
      return res.status(404).json({ error: 'Federation not found' });
    }
    res.json({ federation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🏛️ Federation Service running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
};

startServer();

export default app;
