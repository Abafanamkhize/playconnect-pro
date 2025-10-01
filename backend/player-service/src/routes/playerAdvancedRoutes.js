const express = require('express');
const PlayerAdvancedController = require('../controllers/playerAdvancedController');

const router = express.Router();

// Advanced player routes
router.post('/players/advanced-search', PlayerAdvancedController.advancedSearch);
router.post('/players/compare', PlayerAdvancedController.comparePlayers);
router.get('/players/:playerId/talent-score', PlayerAdvancedController.calculateTalentScore);

module.exports = router;
