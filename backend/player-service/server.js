import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Mock database (replace with real database)
let players = [
  {
    id: 1,
    firstName: 'Lionel',
    lastName: 'Messi',
    position: 'Forward',
    dateOfBirth: '1987-06-24',
    federationId: 1,
    createdAt: new Date()
  },
  {
    id: 2,
    firstName: 'Test',
    lastName: 'Player',
    position: 'Midfielder',
    dateOfBirth: '2000-01-01',
    federationId: 1,
    createdAt: new Date()
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Player Service' });
});

// Get all players
app.get('/api/players', (req, res) => {
  res.json(players);
});

// Get player by ID
app.get('/api/players/:id', (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json(player);
});

// Create new player
app.post('/api/players', (req, res) => {
  const newPlayer = {
    id: players.length + 1,
    ...req.body,
    createdAt: new Date()
  };
  players.push(newPlayer);
  res.status(201).json(newPlayer);
});

// Update player
app.put('/api/players/:id', (req, res) => {
  const index = players.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Player not found' });
  }
  players[index] = { ...players[index], ...req.body };
  res.json(players[index]);
});

// Delete player
app.delete('/api/players/:id', (req, res) => {
  const index = players.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Player not found' });
  }
  players.splice(index, 1);
  res.json({ message: 'Player deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`⚽ Player Service running on port ${PORT}`);
});
