import express from 'express';
import {
    createFederation,
    getAllFederations,
    getFederationById,
    updateFederation,
    deleteFederation
} from '../controllers/federationController.js';

const router = express.Router();

// Federation CRUD routes
router.post('/', createFederation);
router.get('/', getAllFederations);
router.get('/:id', getFederationById);
router.put('/:id', updateFederation);
router.delete('/:id', deleteFederation);

// Health check route
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Federation Service is healthy',
        timestamp: new Date().toISOString()
    });
});

export default router;
