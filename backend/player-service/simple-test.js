const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// Simple database connection
const sequelize = new Sequelize('playconnect', 'playconnect_user', null, {
  host: 'localhost',
  dialect: 'postgres',
  logging: true
});

// Test route - no models, just raw SQL
app.post('/test-player', async (req, res) => {
  try {
    const { firstName, lastName, age, position, region, federationId } = req.body;
    
    const [result] = await sequelize.query(
      'INSERT INTO players ("firstName", "lastName", age, position, region, "federationId") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      { bind: [firstName, lastName, age, position, region, federationId] }
    );
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/test-players', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM players');
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Player Test Service' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🎯 TEST Player Service running on port ${PORT}`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/test-player`);
});
