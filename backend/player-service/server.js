const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Player Service', port: PORT });
});

app.get('/api/players', (req, res) => {
  res.json([
    { id: 1, firstName: 'Lionel', lastName: 'Messi', position: 'Forward' },
    { id: 2, firstName: 'Test', lastName: 'Player', position: 'Midfielder' }
  ]);
});

app.listen(PORT, () => {
  console.log(`⚽ Player Service running on port ${PORT}`);
});
