import React from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'Federation Admin';

  const stats = {
    totalPlayers: 1247,
    totalFederations: 12,
    activeScouts: 89,
    newPlayersThisMonth: 42
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom>
        PlayConnect Federation Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Players</Typography>
              <Typography variant="h4">{stats.totalPlayers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Federations</Typography>
              <Typography variant="h4">{stats.totalFederations}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Scouts</Typography>
              <Typography variant="h4">{stats.activeScouts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>New This Month</Typography>
              <Typography variant="h4">{stats.newPlayersThisMonth}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/players')}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Player Management</Typography>
              <Typography>Manage player profiles, stats, and videos</Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>Manage Players</Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/federations')}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Federation Management</Typography>
              <Typography>Manage federation accounts and settings</Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>Manage Federations</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 3, mt: 3 }}>
        <Typography variant="h6">Welcome, Federation Admin!</Typography>
        <Typography>Role: {userRole}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2, mr: 2 }}
          onClick={() => navigate('/players')}
        >
          Manage Players
        </Button>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/federations')}
        >
          Manage Federations
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;
