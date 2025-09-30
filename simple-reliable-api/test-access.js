const express = require('express');
const app = express();
const PORT = 3015;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ACCESS CONTROL TEST - RUNNING', 
    port: PORT,
    message: 'Ready for testing!'
  });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@test.com' && password === 'password') {
    res.json({ 
      token: 'test-token-123', 
      user: { email, role: 'admin' } 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});
