import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('🔧 Starting Fixed API Gateway...');

// Simple health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        gateway: 'fixed',
        timestamp: new Date().toISOString()
    });
});

// Player Service - simplified configuration
app.use('/api/players', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    logLevel: 'silent' // Reduce verbose logging
}));

// Federation Service - simplified configuration
app.use('/api/federations', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    logLevel: 'silent'
}));

// Auth Service - simplified configuration
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    logLevel: 'silent'
}));

app.listen(PORT, () => {
    console.log('🚀 Fixed Gateway running on port', PORT);
    console.log('✅ All services should now work through gateway');
});
