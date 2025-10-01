const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', AuthController.getCurrentUser);
router.get('/users', async (req, res) => {
  // Temporary endpoint to list users for testing
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

module.exports = router;
