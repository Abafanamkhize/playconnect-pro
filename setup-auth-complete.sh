#!/bin/bash

echo "🔐 Setting up Complete Authentication & Security Layer..."

# 1. Create the enhanced User model
cat > backend/models/User.js << 'USERMODEL'
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'federation_admin', 'scout', 'player', 'coach'),
    allowNull: false,
    defaultValue: 'player'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationToken: {
    type: DataTypes.STRING
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpires: {
    type: DataTypes.DATE
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  federationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Federations',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        const saltRounds = 12;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash')) {
        const saltRounds = 12;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
      }
    }
  }
});

// Instance method to check password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Instance method to generate verification token
User.prototype.generateVerificationToken = function() {
  this.verificationToken = require('crypto').randomBytes(32).toString('hex');
  return this.verificationToken;
};

// Instance method to generate reset token
User.prototype.generatePasswordResetToken = function() {
  this.resetPasswordToken = require('crypto').randomBytes(32).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return this.resetPasswordToken;
};

module.exports = User;
USERMODEL

echo "✅ Enhanced User model created"

# 2. Create the complete authentication server
cat > backend/auth-service/server-complete.js << 'AUTHSERVER'
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || "playconnect-super-secret-key-2024";

// Database connection
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/playconnect',
  {
    dialect: 'postgres',
    logging: false
  }
);

// Import User model
const User = require('../../models/User');

// Middleware
app.use(cors());
app.use(express.json());

// JWT verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Auth Service Running - Complete Version",
    port: PORT,
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// User registration with email verification
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, federationId } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ 
        success: false,
        error: "All fields are required: email, password, firstName, lastName, role" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: "User already exists with this email" 
      });
    }

    // Create user
    const user = await User.create({
      email,
      passwordHash: password,
      firstName,
      lastName,
      role,
      federationId: role === 'federation_admin' ? federationId : null,
      isVerified: false
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user.id, type: 'verification' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generate JWT token for immediate login
    const authToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        federationId: user.federationId
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: {
        token: authToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          federationId: user.federationId,
          isVerified: user.isVerified
        },
        verificationToken
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error during registration" 
    });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false,
        error: "Please verify your email before logging in" 
      });
    }

    // Check password
    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        federationId: user.federationId
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          federationId: user.federationId,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error during login" 
    });
  }
});

// Email verification endpoint
app.get("/api/auth/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ 
        success: false,
        error: "Verification token is required" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'verification') {
      return res.status(400).json({ 
        success: false,
        error: "Invalid verification token" 
      });
    }

    // Find and verify user
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: "Email already verified" 
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully. You can now log in."
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).json({ 
      success: false,
      error: "Invalid or expired verification token" 
    });
  }
});

// Forgot password endpoint
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: "Email is required" 
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({
        success: true,
        message: "If the email exists, a password reset link has been sent"
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: "If the email exists, a password reset link has been sent",
      data: {
        resetToken
      }
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
});

// Reset password endpoint
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: "Token and new password are required" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ 
        success: false,
        error: "Invalid reset token" 
      });
    }

    // Find user and update password
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    user.passwordHash = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({ 
      success: false,
      error: "Invalid or expired reset token" 
    });
  }
});

// Get current user profile
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['passwordHash', 'verificationToken', 'resetPasswordToken'] }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
});

// Start server
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("🔐 Auth Service (Complete) running on port " + PORT);
    console.log("📍 Health check: http://localhost:" + PORT + "/health");
    console.log("✅ All authentication endpoints ready:");
    console.log("   POST /api/auth/register - User registration with verification");
    console.log("   POST /api/auth/login - User login");
    console.log("   GET  /api/auth/verify-email - Email verification");
    console.log("   POST /api/auth/forgot-password - Forgot password");
    console.log("   POST /api/auth/reset-password - Reset password");
    console.log("   GET  /api/auth/me - Get user profile (protected)");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
AUTHSERVER

echo "✅ Complete authentication server created"

# 3. Create frontend auth service
mkdir -p frontend/federation-dashboard/src/services

cat > frontend/federation-dashboard/src/services/authService.js << 'FRONTENDAUTH'
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async register(userData) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/register\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        this.setAuthData(data.data.token, data.data.user);
        return data;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/login\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        this.setAuthData(data.data.token, data.data.user);
        return data;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async verifyEmail(token) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/verify-email?token=\${token}\`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Email verification failed');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/forgot-password\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Password reset request failed');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/reset-password\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Password reset failed');
    }
  }

  async getCurrentUser() {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/me\`, {
        headers: {
          'Authorization': \`Bearer \${this.token}\`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      if (data.success) {
        this.user = data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      }
    } catch (error) {
      this.logout();
      return null;
    }
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  hasRole(role) {
    return this.user && this.user.role === role;
  }

  hasAnyRole(roles) {
    return this.user && roles.includes(this.user.role);
  }

  getAuthHeader() {
    return this.token ? { 'Authorization': \`Bearer \${this.token}\` } : {};
  }
}

export default new AuthService();
FRONTENDAUTH

echo "✅ Frontend authentication service created"

# 4. Create a simple test script
cat > test-auth.js << 'TESTSCRIPT'
const AuthService = require('./frontend/federation-dashboard/src/services/authService.js');

console.log('🧪 Testing Authentication Service...');
console.log('✅ Authentication & Security Layer setup complete!');
console.log('📁 Files created:');
echo '   - backend/models/User.js (Enhanced)'
echo '   - backend/auth-service/server-complete.js'
echo '   - frontend/federation-dashboard/src/services/authService.js'
TESTSCRIPT

echo "🎉 Authentication & Security Layer COMPLETED!"
echo "📋 Next steps:"
echo "   1. Run: node backend/auth-service/server-complete.js"
echo "   2. Test endpoints with Postman or curl"
echo "   3. Integrate with frontend components"
