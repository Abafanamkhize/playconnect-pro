const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3003;
const HOST = '0.0.0.0'; // Bind to all interfaces

// Enhanced CORS for network access
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Health endpoint with network info
app.get('/health', (req, res) => {
  res.json({
    status: 'Auth Service Running (Network)',
    port: PORT,
    host: HOST,
    accessible: true,
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/v2/auth/login-enhanced - User login',
      'GET /api/connectivity - Service status'
    ]
  });
});

// Your existing auth routes would go here...
app.post('/api/v2/auth/login-enhanced', (req, res) => {
  // Mock login for testing
  res.json({
    success: true,
    message: "Network login successful",
    data: {
      token: "network_test_token",
      user: { id: "1", email: "test@playconnect.com", role: "player" }
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🔐 Auth Service running on http://${HOST}:${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${require('os').hostname()}:${PORT}`);
  console.log(`📱 Mobile: http://${require('ip').address()}:${PORT}`);
});
