import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import { Edit, Delete, Add, SportsSoccer } from '@mui/icons-material';

// Mock data - will be replaced with API calls
const mockPlayers = [
  {
    id: 1,
    name: 'John Doe',
    age: 22,
    position: 'Forward',
    nationality: 'Brazil',
    skills: ['Speed', 'Dribbling'],
    status: 'active',
    videos: 3
  },
  {
    id: 2,
    name: 'Mike Smith',
    age: 19,
    position: 'Midfielder',
    nationality: 'Spain',
    skills: ['Passing', 'Vision'],
    status: 'active',
    videos: 1
  },
  {
    id: 3,
    name: 'Carlos Ruiz',
    age: 25,
    position: 'Defender',
    nationality: 'Mexico',
    skills: ['Tackling', 'Strength'],
    status: 'pending',
    videos: 0
  }
];

const PlayerManagement = () => {
  const [players, setPlayers] = useState(mockPlayers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    position: '',
    nationality: '',
    skills: ''
  });

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const skillOptions = ['Speed', 'Dribbling', 'Shooting', 'Passing', 'Vision', 'Tackling', 'Strength', 'Stamina'];

  useEffect(() => {
    // TODO: Fetch players from API
    // fetchPlayers();
  }, []);

  const handleOpenDialog = (player?: any) => {
    if (player) {
      setEditingPlayer(player);
      setFormData({
        name: player.name,
        age: player.age.toString(),
        position: player.position,
        nationality: player.nationality,
        skills: player.skills.join(', ')
      });
    } else {
      setEditingPlayer(null);
      setFormData({
        name: '',
        age: '',
        position: '',
        nationality: '',
        skills: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlayer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to API
    if (editingPlayer) {
      // Update player
      setPlayers(players.map(p => 
        p.id === editingPlayer.id 
          ? { ...p, ...formData, skills: formData.skills.split(', '), age: parseInt(formData.age) }
          : p
      ));
    } else {
      // Add new player
      const newPlayer = {
        id: players.length + 1,
        ...formData,
        skills: formData.skills.split(', '),
        age: parseInt(formData.age),
        status: 'active',
        videos: 0
      };
      setPlayers([...players, newPlayer]);
    }
    handleCloseDialog();
  };

  const handleDelete = (playerId: number) => {
    // TODO: Connect to API
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Player Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Player
        </Button>
      </Box>

      {/* Stats Cards - Using simple Box layout instead of Grid */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Players
            </Typography>
            <Typography variant="h4">
              {players.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Players
            </Typography>
            <Typography variant="h4">
              {players.filter(p => p.status === 'active').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Pending Verification
            </Typography>
            <Typography variant="h4">
              {players.filter(p => p.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Videos
            </Typography>
            <Typography variant="h4">
              {players.reduce((acc, p) => acc + p.videos, 0)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Players Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Videos</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <SportsSoccer sx={{ mr: 1, color: 'text.secondary' }} />
                    {player.name}
                  </Box>
                </TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.nationality}</TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5} flexWrap="wrap">
                    {player.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={player.status} 
                    color={getStatusColor(player.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{player.videos}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenDialog(player)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(player.id)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Player Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPlayer ? 'Edit Player' : 'Add New Player'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  select
                  label="Position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                >
                  {positions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <TextField
                fullWidth
                label="Nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Skills (comma separated)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Speed, Dribbling, Shooting"
                helperText="Separate skills with commas"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingPlayer ? 'Update' : 'Add'} Player
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PlayerManagement;
