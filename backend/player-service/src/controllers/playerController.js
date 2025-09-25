import Player from '../models/Player.js';
import mongoose from 'mongoose';

export const createPlayer = async (req, res) => {
  try {
    const playerData = req.body;
    
    if (!playerData.federationId || !playerData.federationPlayerId) {
      return res.status(400).json({ 
        error: 'Federation ID and Player ID are required' 
      });
    }

    const existingPlayer = await Player.findOne({
      federationId: playerData.federationId,
      federationPlayerId: playerData.federationPlayerId
    });

    if (existingPlayer) {
      return res.status(400).json({ 
        error: 'Player ID already exists in this federation' 
      });
    }

    const player = new Player(playerData);
    await player.save();
    
    await player.populate('federationId', 'name country region');
    
    res.status(201).json({
      message: 'Player created successfully',
      player
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPlayersByFederation = async (req, res) => {
  try {
    const { federationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(federationId)) {
      return res.status(400).json({ error: 'Invalid federation ID' });
    }

    const players = await Player.find({ federationId })
      .populate('federationId', 'name country region')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Player.countDocuments({ federationId });

    res.json({
      players,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

export const updatePlayerVerification = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'verified', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const player = await Player.findByIdAndUpdate(
      playerId,
      {
        'federationVerification.status': status,
        'federationVerification.notes': notes,
        'federationVerification.verifiedAt': status !== 'pending' ? new Date() : null
      },
      { new: true }
    ).populate('federationId', 'name country region');

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({
      message: `Player status updated to ${status}`,
      player
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const searchPlayers = async (req, res) => {
  try {
    const { name, sport, page = 1, limit = 25 } = req.query;
    
    let query = {};

    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } }
      ];
    }

    if (sport) {
      query['sports.sport'] = sport;
    }

    const players = await Player.find(query)
      .populate('federationId', 'name country region')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Player.countDocuments(query);

    res.json({
      players,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search players' });
  }
};
