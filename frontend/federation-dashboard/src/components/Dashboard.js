import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Logout,
  Notifications,
  AccountCircle,
  SportsSoccer,
  Search,
  AdminPanelSettings,
  TrendingUp,
  Group,
  VideoLibrary
} from '@mui/icons-material';

const Dashboard = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'player': return <SportsSoccer />;
      case 'scout': return <Search />;
      case 'federation_admin': return <AdminPanelSettings />;
      default: return <AccountCircle />;
    }
  };

  const getRoleDisplayName = () => {
    switch (user.role) {
      case 'player': return 'Athlete/Player';
      case 'scout': return 'Scout/Club';
      case 'federation_admin': return 'Federation Admin';
      default: return user.role;
    }
  };

  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'player':
        return 'Ready to showcase your talent and connect with opportunities?';
      case 'scout':
        return 'Discover exceptional talent with our AI-powered insights';
      case 'federation_admin':
        return 'Manage your talent ecosystem and platform operations';
      default:
        return 'Welcome to PlayConnect';
    }
  };

  const getQuickStats = () => {
    switch (user.role) {
      case 'player':
        return [
          { label: 'Profile Views', value: '24', change: '+5' },
          { label: 'Scout Interest', value: '3', change: '+2' },
          { label: 'AI Score', value: '87/100', change: '+3' },
          { label: 'Videos', value: '2', change: '+1' }
        ];
      case 'scout':
        return [
          { label: 'Players Viewed', value: '156', change: '+12' },
          { label: 'Shortlisted', value: '8', change: '+2' },
          { label: 'Messages Sent', value: '23', change: '+5' },
          { label: 'AI Matches', value: '15', change: '+3' }
        ];
      case 'federation_admin':
        return [
          { label: 'Total Players', value: '1,234', change: '+89' },
          { label: 'Verified', value: '856', change: '+34' },
          { label: 'Pending', value: '45', change: '-12' },
          { label: 'Revenue', value: '$45.2K', change: '+8.5%' }
        ];
      default:
        return [];
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            🎯 PlayConnect
            <Typography variant="body2" sx={{ ml: 2, opacity: 0.8 }}>
              {getRoleDisplayName()} Dashboard
            </Typography>
          </Typography>

          <IconButton color="inherit">
            <Notifications />
          </IconButton>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {getRoleIcon()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={onLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
        {/* Welcome Section */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h3" gutterBottom>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {getWelcomeMessage()}
          </Typography>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {getQuickStats().map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Role-Specific Content */}
        <Grid container spacing={4}>
          {/* Common Features */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button variant="outlined" fullWidth startIcon={<TrendingUp />}>
                      View Analytics
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button variant="outlined" fullWidth startIcon={<Group />}>
                      Manage Profile
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button variant="outlined" fullWidth startIcon={<VideoLibrary />}>
                      Upload Videos
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button variant="outlined" fullWidth startIcon={<Search />}>
                      Advanced Search
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* System Status */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
                  <Typography variant="body2">Integration Service: Online</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
                  <Typography variant="body2">Database: Connected</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
                  <Typography variant="body2">AI Services: Active</Typography>
                </Box>
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => window.open('http://localhost:3001/api/status', '_blank')}
                  sx={{ mt: 1 }}
                >
                  View Detailed Status
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Role-Specific Welcome Message */}
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'primary.50' }}>
          <Typography variant="h6" gutterBottom>
            Getting Started with PlayConnect
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role === 'player' && 'Complete your profile, upload highlight videos, and start connecting with scouts worldwide.'}
            {user.role === 'scout' && 'Use our advanced search filters to discover talent, create shortlists, and communicate directly with players.'}
            {user.role === 'federation_admin' && 'Manage player verifications, monitor platform analytics, and oversee your talent ecosystem.'}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
