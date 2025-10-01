import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { SportsSoccer } from '@mui/icons-material';
import ApiService from '../services/api';

const EnhancedLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemStatus, setSystemStatus] = useState('checking');

  // Check system status on component mount
  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        setSystemStatus('online');
      } else {
        setSystemStatus('offline');
      }
    } catch (err) {
      setSystemStatus('offline');
    }
  };

  const handleInputChange = (field) => (event) => {
    setCredentials(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(credentials);
      
      if (response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        if (onLoginSuccess) {
          onLoginSuccess(response.user, response.token);
        }
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Login failed: Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      player: { email: 'test@example.com', password: 'testpassword123' },
      admin: { email: 'admin@playconnect.com', password: 'admin123456' }
    };
    
    setCredentials(demoCredentials[role]);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <SportsSoccer sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography component="h1" variant="h4">
              PlayConnect
            </Typography>
          </Box>
          
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Federation Dashboard
          </Typography>

          {/* System Status */}
          <Alert 
            severity={systemStatus === 'online' ? 'success' : 'error'}
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => window.open('http://localhost:3001/health', '_blank')}
              >
                Check
              </Button>
            }
          >
            System Status: {systemStatus === 'online' ? 'Backend Service Running on Port 3001' : 'Backend Service Offline'}
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={credentials.email}
              onChange={handleInputChange('email')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleInputChange('password')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>

          {/* Demo Login Buttons */}
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Demo Accounts:
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('player')}
              >
                Player Demo
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('admin')}
              >
                Admin Demo
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default EnhancedLogin;
