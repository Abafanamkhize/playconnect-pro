import express from 'express';
import Player from '../models/Player.js';
import { 
  createPlayer, 
  getPlayersByFederation, 
  updatePlayerVerification,
  searchPlayers 
} from '../controllers/playerController.js';

const router = express.Router();

// Create new player
router.post('/', createPlayer);

// Get players by federation
router.get('/federation/:federationId', getPlayersByFederation);

// Search players
router.get('/search', searchPlayers);

// Update player verification
router.put('/:playerId/verification', updatePlayerVerification);

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('federationId', 'name country region');
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ player });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

export default router;
