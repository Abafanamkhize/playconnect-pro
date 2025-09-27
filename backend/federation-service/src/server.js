import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import federationRoutes from './routes/federationRoutes.js';
import { testConnection } from './config/database.js';
import './models/Federation.js'; // Import model to sync with database

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/federations', federationRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'PlayConnect Federation Service',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Federation Service',
        timestamp: new Date().toISOString()
    });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('❌ Cannot start server without database connection');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log('🏢 Federation Service running on port', PORT);
            console.log('📊 Environment:', process.env.NODE_ENV);
            console.log('🔗 Health check: http://localhost:' + PORT + '/health');
            console.log('🔗 API Base: http://localhost:' + PORT + '/api/federations');
        });
    } catch (error) {
        console.error('❌ Failed to start Federation Service:', error);
        process.exit(1);
    }
};

startServer();
