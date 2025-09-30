import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Grid,
  Divider
} from '@mui/material';
import {
  SportsSoccer,
  Search,
  AdminPanelSettings,
  Security,
  TrendingUp,
  Group
} from '@mui/icons-material';

const EnhancedLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('scout');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connect to integration service
      const response = await fetch('http://localhost:3006/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email || getDemoEmail(role), 
          password: password || 'password',
          role 
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        onLogin(data.data.user);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please ensure the backend service is running on port 3006.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDemoEmail = (selectedRole) => {
    switch (selectedRole) {
      case 'player': return 'player@test.com';
      case 'scout': return 'scout@test.com';
      case 'federation_admin': return 'federation@test.com';
      default: return 'scout@test.com';
    }
  };

  const fillDemoCredentials = (selectedRole) => {
    setRole(selectedRole);
    setEmail(getDemoEmail(selectedRole));
    setPassword('password');
  };

  const roleOptions = [
    {
      value: 'player',
      label: 'Athlete/Player',
      icon: <SportsSoccer sx={{ fontSize: 40, color: 'primary.main' }} />,
      description: 'Showcase your talent and connect with opportunities worldwide',
      features: ['Profile Management', 'Performance Analytics', 'Opportunity Tracking', 'Video Highlights']
    },
    {
      value: 'scout',
      label: 'Scout/Club',
      icon: <Search sx={{ fontSize: 40, color: 'secondary.main' }} />,
      description: 'Discover and recruit exceptional talent with AI-powered insights',
      features: ['Advanced Search', 'Player Shortlisting', 'Talent Analytics', 'Direct Communication']
    },
    {
      value: 'federation_admin',
      label: 'Federation Admin',
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: 'success.main' }} />,
      description: 'Manage talent verification and platform operations',
      features: ['Player Verification', 'System Analytics', 'Revenue Management', 'User Administration']
    }
  ];

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6, color: 'white' }}>
          <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            🎯 PlayConnect
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom sx={{ opacity: 0.9, fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
            Where Talent Meets Opportunity
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, mt: 2 }}>
            Revolutionizing Sports Talent Discovery Worldwide
          </Typography>
        </Box>

        <Paper elevation={24} sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 1200, borderRadius: 4 }}>
          <Grid container spacing={4}>
            {/* Left Side - Role Selection */}
            <Grid item xs={12} md={6}>
              <Box>
                <FormLabel component="legend" sx={{ mb: 3, fontWeight: 'bold', fontSize: '1.25rem' }}>
                  Select Your Role to Begin
                </FormLabel>
                <RadioGroup
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    fillDemoCredentials(e.target.value);
                  }}
                >
                  {roleOptions.map((option) => (
                    <Card 
                      key={option.value}
                      variant="outlined"
                      sx={{ 
                        mb: 3,
                        border: role === option.value ? 3 : 1,
                        borderColor: role === option.value ? 'primary.main' : 'grey.300',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.light',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <FormControlLabel
                          value={option.value}
                          control={<Radio />}
                          label={
                            <Box sx={{ ml: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {option.icon}
                                <Typography variant="h6" fontWeight="bold" sx={{ ml: 2 }}>
                                  {option.label}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {option.description}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {option.features.map((feature, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      px: 1,
                                      py: 0.5,
                                      bgcolor: 'primary.50',
                                      borderRadius: 1,
                                      fontSize: '0.75rem',
                                      color: 'primary.main'
                                    }}
                                  >
                                    {feature}
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
              </Box>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Secure Sign In
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Access your {roleOptions.find(r => r.value === role)?.label} dashboard
                </Typography>

                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={getDemoEmail(role)}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    sx={{ mb: 3 }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      mt: 2, 
                      mb: 2, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `Sign In as ${roleOptions.find(r => r.value === role)?.label}`
                    )}
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="medium"
                      onClick={() => fillDemoCredentials(role)}
                      sx={{ mb: 2 }}
                    >
                      Auto-Fill Demo Credentials
                    </Button>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <Security sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Secure JWT Authentication • Rate Limited • Encrypted
                    </Typography>

                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {role === 'scout' && "🔍 Need a scout account? Apply through your sports federation"}
                        {role === 'player' && "⚽ New player? Contact your local sports federation for registration"}
                        {role === 'federation_admin' && "🏢 Federation admin access requires organization verification"}
                      </Typography>
                    </Box>

                    <Button size="small" sx={{ mt: 1 }} color="inherit">
                      Forgot Password?
                    </Button>
                  </Box>
                </form>

                {/* System Status */}
                <Box sx={{ mt: 4, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'success.800' }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 1 }} />
                    System Status: Integration Service Running on Port 3006
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => window.open('http://localhost:3006/api/status', '_blank')}
                    sx={{ mt: 1 }}
                  >
                    Check Backend Status
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center', color: 'white' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 PlayConnect - Global Sports Talent Platform
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            Secure • Verified • AI-Powered
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default EnhancedLogin;
