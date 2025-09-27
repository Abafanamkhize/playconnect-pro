import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());

const proxyToService = (port, req, res) => {
    const options = {
        hostname: 'localhost',
        port: port,
        path: req.originalUrl,
        method: req.method,
        headers: { ...req.headers, host: 'localhost:' + port }
    };
    
    console.log(`Proxying ${req.method} ${req.url} → localhost:${port}`);
    
    const proxyReq = http.request(options, (proxyRes) => {
        res.status(proxyRes.statusCode);
        proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.status(503).json({ error: 'Service unavailable: ' + err.message });
    });
    
    if (req.body && Object.keys(req.body).length > 0) {
        proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
};

app.get('/health', (req, res) => {
    res.json({ status: 'OK', gateway: 'zero-dependencies' });
});

app.use('/api/players', (req, res) => proxyToService(3003, req, res));
app.use('/api/federations', (req, res) => proxyToService(3004, req, res));
app.use('/api/auth', (req, res) => proxyToService(3001, req, res));

app.listen(3000, () => {
    console.log('🚀 Zero-Dependency Gateway on port 3000');
    console.log('Proxying:');
    console.log('  /api/players → :3003');
    console.log('  /api/federations → :3004'); 
    console.log('  /api/auth → :3001');
});
