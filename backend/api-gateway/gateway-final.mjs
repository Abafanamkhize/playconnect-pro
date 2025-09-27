import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('🚀 PlayConnect Final API Gateway Starting...');

// Health endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'API Gateway',
        timestamp: new Date().toISOString()
    });
});

// Auth Service - working configuration
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/api/auth',
    },
}));

// Player Service - fixed configuration
app.use('/api/players', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/api/players': '/api/players',
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('⚽ Proxying to Player Service:', req.method, req.url);
    }
}));

// Federation Service - working configuration
app.use('/api/federations', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: {
        '^/api/federations': '/api/federations',
    },
}));

// Error handling for unknown routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Service route not found' });
});

app.listen(PORT, () => {
    console.log('🎉 PlayConnect Gateway running on port', PORT);
    console.log('✅ Services configured:');
    console.log('   /api/auth       → :3001');
    console.log('   /api/players    → :3003'); 
    console.log('   /api/federations → :3004');
});
