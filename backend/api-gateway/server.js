const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway', port: PORT });
});

app.get('/api/players', (req, res) => {
  res.json([{ id: 1, name: 'Test Player' }]);
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
