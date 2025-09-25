import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

// Role-based example endpoints
router.get('/admin-only', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.json({ message: 'Welcome admin!' });
});

router.get('/federation-dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'federation') {
    return res.status(403).json({ error: 'Federation access required' });
  }
  res.json({ message: 'Federation dashboard access granted' });
});

export default router;
