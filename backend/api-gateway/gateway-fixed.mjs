import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('🚀 Starting PlayConnect API Gateway (ES Modules)...');

// Health endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'API Gateway',
        timestamp: new Date().toISOString(),
        routes: {
            auth: '/api/auth → localhost:3001',
            players: '/api/players → localhost:3003'
        }
    });
});

// Auth Service proxy
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log('🔐 Proxying to Auth Service:', req.method, req.url);
    },
    onError: (err, req, res) => {
        console.error('❌ Auth Service error:', err.message);
        res.status(503).json({ error: 'Auth service unavailable' });
    }
}));

// Player Service proxy - CORRECTED to port 3003
app.use('/api/players', createProxyMiddleware({
    target: 'http://localhost:3003',  // FIXED: This was 3002
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log('⚽ Proxying to Player Service:', req.method, req.url);
    },
    onError: (err, req, res) => {
        console.error('❌ Player Service error:', err.message);
        res.status(503).json({ error: 'Player service unavailable' });
    }
}));

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
    console.log('🎉 API Gateway successfully started on port', PORT);
    console.log('✅ Route mappings:');
    console.log('   /api/auth    → http://localhost:3001');
    console.log('   /api/players → http://localhost:3003');
    console.log('   /health      → Gateway status');
    console.log('\n🔍 Testing gateway health: curl http://localhost:3000/health');
});
