const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Auth Service', port: PORT });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ token: 'test-token', user: { role: 'admin' } });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});
