const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');

class AuthController {
  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        federationId: user.federationId
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // User Registration
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      console.log('🔧 Attempting to find user with email:', email);
      
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      // Validate password strength
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      console.log('🔧 Creating new user...');
      
      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: role || 'player',
        verificationToken
      });

      // In development, log verification link
      if (process.env.NODE_ENV === 'development') {
        console.log('=== EMAIL VERIFICATION ===');
        console.log(`To: ${user.email}`);
        console.log(`Verification URL: http://localhost:3001/api/auth/verify-email?token=${verificationToken}`);
        console.log('==========================');
      }

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  }

  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email before logging in',
        });
      }

      // Verify password
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      res.json({
        success: true,
        message: 'Login successful',
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
            lastLogin: user.lastLogin,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  }

  // Email Verification
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      const user = await User.findOne({ where: { verificationToken: token } });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification token',
        });
      }

      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      res.json({
        success: true,
        message: 'Email verified successfully. You can now login.',
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed',
      });
    }
  }

  // Forgot Password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal whether email exists
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent.',
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      // In development, log reset link
      if (process.env.NODE_ENV === 'development') {
        console.log('=== PASSWORD RESET ===');
        console.log(`To: ${user.email}`);
        console.log(`Reset URL: http://localhost:3001/api/auth/reset-password?token=${resetToken}`);
        console.log('=======================');
      }

      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset request failed',
      });
    }
  }

  // Reset Password
  async resetPassword(req, res) {
    try {
      const { token } = req.query;
      const { newPassword } = req.body;

      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
        });
      }

      // Validate new password
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Update password
      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully. You can now login with your new password.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Password reset failed',
      });
    }
  }

  // Get Current User
  async getCurrentUser(req, res) {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken'] },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user data',
      });
    }
  }
}

module.exports = new AuthController();
