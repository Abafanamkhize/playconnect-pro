const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/players', playerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Player service running' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Player service running on port ${PORT}`);
});
