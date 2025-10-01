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
