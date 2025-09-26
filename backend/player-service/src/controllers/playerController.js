import Player from '../models/Player.js';
import { Op } from 'sequelize';

// Create a new player
export const createPlayer = async (req, res) => {
  try {
    const { firstName, lastName, age, position, region, federationId } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !age || !position || !region || !federationId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, age, position, region, federationId'
      });
    }

    const player = await Player.create({
      firstName,
      lastName,
      age: parseInt(age),
      position,
      region,
      federationId,
      isVerified: false,
      performanceScore: 0.0
    });

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: player
    });
  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating player',
      error: error.message
    });
  }
};

// Get all players with filtering and pagination
export const getPlayers = async (req, res) => {
  try {
    const { page = 1, limit = 10, position, region, search } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for filters
    const whereClause = {};
    if (position) whereClause.position = position;
    if (region) whereClause.region = region;
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const players = await Player.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: players.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(players.count / limit),
        totalPlayers: players.count,
        hasNext: offset + players.rows.length < players.count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching players',
      error: error.message
    });
  }
};

// Get single player by ID
export const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Get player error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching player',
      error: error.message
    });
  }
};

// Update player
export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    await player.update(updates);

    res.json({
      success: true,
      message: 'Player updated successfully',
      data: player
    });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating player',
      error: error.message
    });
  }
};

// Delete player
export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    await player.destroy();

    res.json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting player',
      error: error.message
    });
  }
};
