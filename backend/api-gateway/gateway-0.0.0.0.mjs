import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());

const proxyToService = (port, req, res) => {
    const options = {
        hostname: '0.0.0.0',  // Connect to 0.0.0.0 where services listen
        port: port,
        path: req.originalUrl,
        method: req.method,
        headers: { ...req.headers }
    };
    
    console.log(`Proxying ${req.method} ${req.url} → 0.0.0.0:${port}`);
    
    const proxyReq = http.request(options, (proxyRes) => {
        let body = '';
        proxyRes.on('data', (chunk) => body += chunk);
        proxyRes.on('end', () => {
            res.status(proxyRes.statusCode);
            res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json');
            res.send(body);
        });
    });
    
    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.status(503).json({ error: 'Service unavailable' });
    });
    
    if (req.body && Object.keys(req.body).length > 0) {
        proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
};

app.get('/health', (req, res) => {
    res.json({ status: 'OK', gateway: '0.0.0.0-fixed' });
});

app.use('/api/players', (req, res) => proxyToService(3003, req, res));
app.use('/api/federations', (req, res) => proxyToService(3004, req, res));
app.use('/api/auth', (req, res) => proxyToService(3001, req, res));

app.listen(3000, '0.0.0.0', () => {  // Also listen on 0.0.0.0
    console.log('🚀 Gateway listening on 0.0.0.0:3000');
    console.log('Proxying to services on 0.0.0.0');
});
