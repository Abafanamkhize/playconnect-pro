import User from '../models/User.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/jwtUtils.js';

export const register = async (req, res) => {
  try {
    const { email, password, role, federationId, playerProfileId } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Validate password strength
    if (!validatePasswordStrength(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Validate role
    const validRoles = ['player', 'federation', 'scout', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      email,
      password: hashedPassword,
      role,
      federationId: role === 'federation' ? federationId : undefined,
      playerProfileId: role === 'player' ? playerProfileId : undefined
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
