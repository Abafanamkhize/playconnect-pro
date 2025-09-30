const express = require('express');
const app = express();
const PORT = 3003;

app.get('/api/players', (req, res) => {
  res.json({
    success: true,
    message: 'Player service is running!',
    data: [
      { id: 1, name: 'Test Player 1', position: 'Forward' },
      { id: 2, name: 'Test Player 2', position: 'Midfielder' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🎯 Player Service Test running on port ${PORT}`);
});
