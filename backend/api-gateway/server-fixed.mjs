import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('🔧 Fixed API Gateway starting...');

app.get('/health', (req, res) => {
    res.json({ status: 'OK', gateway: 'fixed-version' });
});

// CORRECTED: Player service on port 3003 (not 3002)
app.use('/api/players', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
}));

app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
}));

app.listen(PORT, () => {
    console.log('🚀 Fixed Gateway running on port', PORT);
    console.log('✅ Player service: localhost:3003');
    console.log('✅ Auth service: localhost:3001');
});
