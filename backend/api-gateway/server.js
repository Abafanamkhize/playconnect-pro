const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'API Gateway' });
});

// Auth Service - port 3001
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/api/auth',
    },
}));

// Player Service - CORRECTED to port 3003
app.use('/api/players', createProxyMiddleware({
    target: 'http://localhost:3003',  // FIXED: 3002 → 3003
    changeOrigin: true,
    pathRewrite: {
        '^/api/players': '/api/players',
    },
}));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log('✅ Routes configured:');
    console.log('   /api/auth    → http://localhost:3001');
    console.log('   /api/players → http://localhost:3003');
});
