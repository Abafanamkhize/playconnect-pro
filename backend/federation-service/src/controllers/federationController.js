import { Federation } from '../models/Federation.js';

// Create a new federation
export const createFederation = async (req, res) => {
    try {
        const federation = await Federation.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Federation created successfully',
            data: federation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating federation',
            error: error.message
        });
    }
};

// Get all federations
export const getAllFederations = async (req, res) => {
    try {
        const federations = await Federation.findAll();
        res.json({
            success: true,
            data: federations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching federations',
            error: error.message
        });
    }
};

// Get federation by ID
export const getFederationById = async (req, res) => {
    try {
        const federation = await Federation.findByPk(req.params.id);
        if (!federation) {
            return res.status(404).json({
                success: false,
                message: 'Federation not found'
            });
        }
        res.json({
            success: true,
            data: federation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching federation',
            error: error.message
        });
    }
};

// Update federation
export const updateFederation = async (req, res) => {
    try {
        const federation = await Federation.findByPk(req.params.id);
        if (!federation) {
            return res.status(404).json({
                success: false,
                message: 'Federation not found'
            });
        }
        
        await federation.update(req.body);
        res.json({
            success: true,
            message: 'Federation updated successfully',
            data: federation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating federation',
            error: error.message
        });
    }
};

// Delete federation
export const deleteFederation = async (req, res) => {
    try {
        const federation = await Federation.findByPk(req.params.id);
        if (!federation) {
            return res.status(404).json({
                success: false,
                message: 'Federation not found'
            });
        }
        
        await federation.destroy();
        res.json({
            success: true,
            message: 'Federation deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting federation',
            error: error.message
        });
    }
};
