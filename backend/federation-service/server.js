const express = require('express');
<<<<<<< HEAD
const cors = require('cors');

=======
>>>>>>> c914a42f12460edeffad269d875cffed32852c9b
const app = express();
const PORT = process.env.PORT || 3003;

<<<<<<< HEAD
// Middleware
app.use(cors());
app.use(express.json());

// In-memory federation store
const federations = [
  {
    id: 'test-federation-001',
    name: 'South African Football Federation',
    country: 'South Africa',
    contactEmail: 'admin@saff.co.za',
    verificationLevel: 'verified',
    isActive: true,
    createdAt: new Date()
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Federation Service Running', 
    port: PORT,
    timestamp: new Date().toISOString(),
    federationsCount: federations.length
  });
});

// Get all federations - simple path for gateway
app.get('/federations', (req, res) => {
  res.json({ federations });
});

// Get federation by ID
app.get('/federations/:id', (req, res) => {
  const { id } = req.params;
  const federation = federations.find(f => f.id === id);
  
  if (!federation) {
    return res.status(404).json({ error: 'Federation not found' });
  }
  
  res.json({ federation });
=======
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Federation Service', port: PORT });
});

app.get('/api/federations', (req, res) => {
  res.json([{ id: 1, name: 'SAFA', country: 'South Africa' }]);
>>>>>>> c914a42f12460edeffad269d875cffed32852c9b
});

// Start server
app.listen(PORT, () => {
  console.log(`🏛️  Federation Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log('✅ Federation endpoints ready:');
  console.log('   GET /federations - Get all federations');
  console.log('   GET /federations/:id - Get federation by ID');
});
