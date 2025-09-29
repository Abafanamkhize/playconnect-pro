import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { RootState } from '../app/store';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PlayConnect Federation Portal
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {userInfo?.user?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Player Management interface will be implemented here.
        </Typography>
      </Container>
    </Box>
  );
};

export default Dashboard;
