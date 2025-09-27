import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, TextField, Dialog,
  DialogActions, DialogContent, DialogTitle, Box, Card, CardContent
} from '@mui/material';
import { federationAPI } from '../services/api';

const FederationManagement = () => {
  const [federations, setFederations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newFederation, setNewFederation] = useState({
    name: '',
    country: '',
    contactEmail: ''
  });

  useEffect(() => {
    loadFederations();
  }, []);

  const loadFederations = async () => {
    try {
      const response = await federationAPI.getFederations();
      setFederations(response.data);
    } catch (error) {
      console.error('Error loading federations:', error);
    }
  };

  const handleCreateFederation = async () => {
    try {
      await federationAPI.createFederation(newFederation);
      await loadFederations();
      setOpenDialog(false);
      setNewFederation({ name: '', country: '', contactEmail: '' });
      alert('Federation created successfully!');
    } catch (error) {
      console.error('Error creating federation:', error);
      alert('Error creating federation');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h4">Federation Management</Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Federation
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {federations.map((federation) => (
            <Card key={federation.id} sx={{ minWidth: 300 }}>
              <CardContent>
                <Typography variant="h6">{federation.name}</Typography>
                <Typography color="textSecondary">{federation.country}</Typography>
                <Typography variant="body2">{federation.contactEmail}</Typography>
                <Typography variant="body2">
                  Players: {federation.playerCount || 0}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Federation</DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth 
              label="Federation Name" 
              margin="dense" 
              value={newFederation.name}
              onChange={(e) => setNewFederation({...newFederation, name: e.target.value})} 
            />
            <TextField 
              fullWidth 
              label="Country" 
              margin="dense"
              value={newFederation.country}
              onChange={(e) => setNewFederation({...newFederation, country: e.target.value})} 
            />
            <TextField 
              fullWidth 
              label="Contact Email" 
              margin="dense"
              value={newFederation.contactEmail}
              onChange={(e) => setNewFederation({...newFederation, contactEmail: e.target.value})} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateFederation} variant="contained">Create Federation</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default FederationManagement;
