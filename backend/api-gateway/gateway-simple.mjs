import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';

const app = express();
const proxy = httpProxy.createProxyServer();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'API Gateway - Simple Version',
        timestamp: new Date().toISOString()
    });
});

// Player Service proxy
app.use('/api/players', (req, res) => {
    console.log('⚽ Proxying to Player Service:', req.method, req.url);
    proxy.web(req, res, { target: 'http://localhost:3003' });
});

// Federation Service proxy
app.use('/api/federations', (req, res) => {
    console.log('🏢 Proxying to Federation Service:', req.method, req.url);
    proxy.web(req, res, { target: 'http://localhost:3004' });
});

// Auth Service proxy
app.use('/api/auth', (req, res) => {
    console.log('🔐 Proxying to Auth Service:', req.method, req.url);
    proxy.web(req, res, { target: 'http://localhost:3001' });
});

// Error handling
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(503).json({ error: 'Service unavailable' });
});

app.listen(PORT, () => {
    console.log('🚀 Simple API Gateway running on port', PORT);
    console.log('✅ Ready to proxy requests to:');
    console.log('   :3001 - Auth Service');
    console.log('   :3003 - Player Service');
    console.log('   :3004 - Federation Service');
});
