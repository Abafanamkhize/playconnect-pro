import React, { useState, useEffect } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Box, Typography, Snackbar, Alert
} from '@mui/material';
import { playerAPI } from '../services/api';

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPlayer, setCurrentPlayer] = useState({
    firstName: '',
    lastName: '',
    position: '',
    dateOfBirth: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const response = await playerAPI.getAll();
      setPlayers(response.data);
    } catch (error) {
      console.error('Error loading players:', error);
      showSnackbar('Error loading players', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreatePlayer = async () => {
    try {
      await playerAPI.create(currentPlayer);
      await loadPlayers();
      setOpenDialog(false);
      setCurrentPlayer({ firstName: '', lastName: '', position: '', dateOfBirth: '' });
      showSnackbar('Player created successfully!');
    } catch (error) {
      console.error('Error creating player:', error);
      showSnackbar('Error creating player', 'error');
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerAPI.delete(playerId);
        await loadPlayers();
        showSnackbar('Player deleted successfully!');
      } catch (error) {
        console.error('Error deleting player:', error);
        showSnackbar('Error deleting player', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h4">Player Management</Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Player
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading players...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.firstName} {player.lastName}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton>✏️</IconButton>
                      <IconButton onClick={() => handleDeletePlayer(player.id)}>🗑️</IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth 
              label="First Name" 
              margin="dense" 
              value={currentPlayer.firstName}
              onChange={(e) => setCurrentPlayer({...currentPlayer, firstName: e.target.value})} 
              required
            />
            <TextField 
              fullWidth 
              label="Last Name" 
              margin="dense"
              value={currentPlayer.lastName}
              onChange={(e) => setCurrentPlayer({...currentPlayer, lastName: e.target.value})} 
              required
            />
            <TextField 
              fullWidth 
              label="Position" 
              margin="dense"
              value={currentPlayer.position}
              onChange={(e) => setCurrentPlayer({...currentPlayer, position: e.target.value})} 
              required
            />
            <TextField 
              fullWidth 
              label="Date of Birth" 
              type="date" 
              margin="dense" 
              InputLabelProps={{ shrink: true }}
              value={currentPlayer.dateOfBirth}
              onChange={(e) => setCurrentPlayer({...currentPlayer, dateOfBirth: e.target.value})} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreatePlayer} variant="contained" color="primary">
              Create Player
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default PlayerManagement;
