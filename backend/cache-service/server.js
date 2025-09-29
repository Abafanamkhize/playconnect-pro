const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

// Cache player data
app.post('/cache/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const playerData = req.body;
    
    await redisClient.setEx(
      `player:${id}`, 
      3600, // 1 hour expiry
      JSON.stringify(playerData)
    );
    
    res.json({ message: 'Player data cached successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cached player data
app.get('/cache/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cachedData = await redisClient.get(`player:${id}`);
    
    if (cachedData) {
      res.json({ 
        cached: true, 
        data: JSON.parse(cachedData) 
      });
    } else {
      res.json({ cached: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cache search results
app.post('/cache/search', async (req, res) => {
  try {
    const { query, filters, results } = req.body;
    const cacheKey = `search:${Buffer.from(JSON.stringify({ query, filters })).toString('base64')}`;
    
    await redisClient.setEx(
      cacheKey,
      1800, // 30 minutes expiry
      JSON.stringify(results)
    );
    
    res.json({ message: 'Search results cached' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cached search results
app.get('/cache/search', async (req, res) => {
  try {
    const { query, filters } = req.query;
    const cacheKey = `search:${Buffer.from(JSON.stringify({ query, filters })).toString('base64')}`;
    
    const cachedResults = await redisClient.get(cacheKey);
    
    if (cachedResults) {
      res.json({ 
        cached: true, 
        results: JSON.parse(cachedResults) 
      });
    } else {
      res.json({ cached: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cache
app.delete('/cache/:key', async (req, res) => {
  try {
    const { key } = req.params;
    await redisClient.del(key);
    res.json({ message: 'Cache cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Cache service running',
    redis: redisClient.isOpen ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Cache service running on port ${PORT}`);
});
