const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getCurrentUser);

// Admin-only routes
router.get('/users', authenticateToken, requireRole(['super_admin', 'federation_admin']), async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.findAll({
      attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken'] }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin-only', authenticateToken, requireRole(['super_admin', 'federation_admin']), (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    user: req.user
  });
});

// Player-only routes
router.get('/player-dashboard', authenticateToken, requireRole(['player']), (req, res) => {
  res.json({
    success: true,
    message: 'Player dashboard access granted',
    user: req.user
  });
});

module.exports = router;
