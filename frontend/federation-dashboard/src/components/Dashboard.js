import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box
} from '@mui/material';

const Dashboard = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PlayConnect Federation Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Welcome to PlayConnect
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Application is starting up. Please check back soon.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;
