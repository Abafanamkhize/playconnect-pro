import express from 'express';

const app = express();
const PORT = 3003;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/players', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Players endpoint working',
    data: [] 
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
