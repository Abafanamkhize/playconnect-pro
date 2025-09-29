const express = require('express');
const app = express();
const PORT = 3004;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Federation Service', port: PORT });
});

app.get('/api/federations', (req, res) => {
  res.json([{ id: 1, name: 'SAFA', country: 'South Africa' }]);
});

app.listen(PORT, () => {
  console.log(`🌍 Federation Service running on port ${PORT}`);
});
