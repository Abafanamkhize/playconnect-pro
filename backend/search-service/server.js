const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/search', searchRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Search service running' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Search service running on port ${PORT}`);
});
