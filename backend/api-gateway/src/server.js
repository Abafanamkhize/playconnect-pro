import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Service endpoints
const services = {
  auth: 'http://localhost:3001',
  players: 'http://localhost:3002', 
  federations: 'http://localhost:3003'
};

// Proxy middleware
app.use('/api/auth', createProxyMiddleware({ target: services.auth, changeOrigin: true }));
app.use('/api/players', createProxyMiddleware({ target: services.players, changeOrigin: true }));
app.use('/api/federations', createProxyMiddleware({ target: services.federations, changeOrigin: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'PlayConnect API Gateway', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
});
