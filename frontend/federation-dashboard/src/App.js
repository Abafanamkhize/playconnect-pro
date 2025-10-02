import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { SportsSoccer, People, VideoLibrary, Analytics } from '@mui/icons-material';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// LOGIN COMPONENT - This should be the FIRST screen
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        id: 1,
        email: formData.email,
        name: 'Demo User',
        role: 'federation_admin'
      }, 'demo-token-123');
      setLoading(false);
    }, 1500);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          padding: 4,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          width: 400,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <SportsSoccer sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" color="primary">
            PlayConnect
          </Typography>
        </Box>
        
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Sign In to Your Account
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" align="center">
          Demo: Use any email and password
        </Typography>
      </Box>
    </Box>
  );
};

// DASHBOARD COMPONENT - Shows after login
const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SportsSoccer sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PlayConnect Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Player Management Card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/players')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2">
                  Player Management
                </Typography>
                <Typography color="text.secondary">
                  Manage athlete profiles, stats, and verification
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Video Management Card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/videos')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <VideoLibrary sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" component="h2">
                  Video Management
                </Typography>
                <Typography color="text.secondary">
                  Upload and analyze player performance videos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics Card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/analytics')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Analytics sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" component="h2">
                  Analytics
                </Typography>
                <Typography color="text.secondary">
                  View performance insights and trends
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Scout Portal Card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate('/scouts')}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <People sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                <Typography variant="h5" component="h2">
                  Scout Portal
                </Typography>
                <Typography color="text.secondary">
                  Talent discovery and assessment tools
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Other page components (simplified)
const PlayersPage = ({ onLogout }) => (
  <Box>
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Player Management
          </Typography>
          <Button color="inherit" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Player Management
      </Typography>
      <Typography>
        This is where you would manage all player profiles, statistics, and verification status.
      </Typography>
    </Container>
  </Box>
);

const VideosPage = ({ onLogout }) => (
  <Box>
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Video Management
          </Typography>
          <Button color="inherit" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Video Management
      </Typography>
      <Typography>
        Upload and analyze player performance videos with AI-powered insights.
      </Typography>
    </Container>
  </Box>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app start
  useEffect(() => {
    const token = localStorage.getItem('playconnect_token');
    const userData = localStorage.getItem('playconnect_user');
    
    console.log('Auth check:', { token, userData });
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    console.log('Login successful:', userData);
    localStorage.setItem('playconnect_token', token);
    localStorage.setItem('playconnect_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('playconnect_token');
    localStorage.removeItem('playconnect_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading PlayConnect...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  console.log('App render - authenticated:', isAuthenticated);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Always show login first if not authenticated */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <Login onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" replace />
            } 
          />
          
          {/* Protected routes - only accessible after login */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard user={user} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/players" 
            element={
              isAuthenticated ? 
                <PlayersPage onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/videos" 
            element={
              isAuthenticated ? 
                <VideosPage onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Default route - redirect to login or dashboard */}
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
