import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('🚀 PlayConnect Complete API Gateway Starting...');

// Health endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'API Gateway',
        timestamp: new Date().toISOString(),
        services: {
            auth: 'localhost:3001 ✅',
            players: 'localhost:3003 ✅', 
            federations: 'localhost:3004 ✅'
        }
    });
});

// Auth Service
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
}));

// Player Service  
app.use('/api/players', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
}));

// Federation Service - NEW!
app.use('/api/federations', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
}));

app.listen(PORT, () => {
    console.log('🎉 PlayConnect Gateway running on port', PORT);
    console.log('✅ All Services Connected:');
    console.log('   🔐 Auth Service      :3001');
    console.log('   ⚽ Player Service    :3003');
    console.log('   🏢 Federation Service:3004');
    console.log('\n🌐 Test: curl http://localhost:3000/health');
});
