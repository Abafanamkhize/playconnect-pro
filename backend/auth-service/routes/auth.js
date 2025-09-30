const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password and role are required'
      });
    }

    // TODO: Replace with actual database check
    // For now, using mock data
    const mockUsers = [
      {
        id: '1',
        email: 'player@test.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'player',
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        id: '2', 
        email: 'scout@test.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'scout',
        firstName: 'David',
        lastName: 'Smith'
      },
      {
        id: '3',
        email: 'federation@test.com', 
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'federation_admin',
        firstName: 'Sarah',
        lastName: 'Johnson'
      }
    ];

    // Find user
    const user = mockUsers.find(u => u.email === email && u.role === role);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // In real app, we would verify password with bcrypt
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === 'password'; // Simple check for demo

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        name: `${user.firstName} ${user.lastName}`
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Check auth status
router.get('/me', (req, res) => {
  // This would verify JWT token from headers
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    res.json({
      success: true,
      data: {
        user: decoded
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
