import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

// Mock database (replace with real database)
let federations = [
  {
    id: 1,
    name: 'South African Football Association',
    country: 'South Africa',
    contactEmail: 'admin@safa.co.za',
    playerCount: 2,
    createdAt: new Date()
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Federation Service' });
});

// Get all federations
app.get('/api/federations', (req, res) => {
  res.json(federations);
});

// Get federation by ID
app.get('/api/federations/:id', (req, res) => {
  const federation = federations.find(f => f.id === parseInt(req.params.id));
  if (!federation) {
    return res.status(404).json({ error: 'Federation not found' });
  }
  res.json(federation);
});

// Create new federation
app.post('/api/federations', (req, res) => {
  const newFederation = {
    id: federations.length + 1,
    ...req.body,
    playerCount: 0,
    createdAt: new Date()
  };
  federations.push(newFederation);
  res.status(201).json(newFederation);
});

// Update federation
app.put('/api/federations/:id', (req, res) => {
  const index = federations.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Federation not found' });
  }
  federations[index] = { ...federations[index], ...req.body };
  res.json(federations[index]);
});

app.listen(PORT, () => {
  console.log(`🌍 Federation Service running on port ${PORT}`);
});
