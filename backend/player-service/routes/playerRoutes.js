const express = require('express');
const multer = require('multer');
const { authenticateToken, requireRole } = require('../auth-service/middleware/authMiddleware');
const Player = require('../models/Player');
const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Create player (Federation only)
router.post('/', authenticateToken, requireRole(['federation_admin', 'super_admin']), async (req, res) => {
  try {
    const playerData = {
      ...req.body,
      federationId: req.user.federationId || req.body.federationId
    };
    
    const player = await Player.create(playerData);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all players with search/filter
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, position, nationality, verified } = req.query;
    const where = {};
    
    if (position) where.position = position;
    if (nationality) where.nationality = nationality;
    if (verified) where.verificationStatus = 'verified';
    
    const players = await Player.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      players: players.rows,
      totalPages: Math.ceil(players.count / limit),
      currentPage: parseInt(page),
      totalPlayers: players.count
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload video for player
router.post('/:id/videos', authenticateToken, requireRole(['federation_admin', 'super_admin']), upload.single('video'), async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const videoData = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date()
    };
    
    const videos = player.videos || [];
    videos.push(videoData);
    
    await player.update({ videos });
    res.json({ message: 'Video uploaded successfully', video: videoData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get player by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
