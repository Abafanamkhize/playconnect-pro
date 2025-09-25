import express from 'express';

const router = express.Router();

// Temporary routes - we'll build these out next
router.post('/register', (req, res) => {
  res.json({ message: 'Registration endpoint - coming soon!' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - coming soon!' });
});

router.get('/verify', (req, res) => {
  res.json({ message: 'Token verification endpoint - coming soon!' });
});

export default router;
