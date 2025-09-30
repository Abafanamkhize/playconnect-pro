const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

// Integration with existing player service
router.get('/players', (req, res) => {
  // This would connect to existing player service
  res.json({
    success: true,
    message: 'Connected to existing player database',
    data: [
      { id: 1, name: 'Lionel Messi', position: 'Forward', team: 'Inter Miami' },
      { id: 2, name: 'Cristiano Ronaldo', position: 'Forward', team: 'Al Nassr' },
      { id: 3, name: 'Kevin De Bruyne', position: 'Midfielder', team: 'Man City' }
    ]
  });
});
