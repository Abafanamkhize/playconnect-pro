import React, { useState } from 'react';
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
  Divider,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Fab
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
  VideoLibrary,
  CheckCircle,
  Pending,
  Cancel,
  Add,
  Message,
  Favorite,
  Share,
  Analytics,
  Settings,
  Person,
  Star,
  Email,
  Phone,
  LocationOn,
  CalendarToday
} from '@mui/icons-material';

// Mock data for demonstration
const mockPlayerData = {
  profile: {
    name: 'Alex Johnson',
    age: 22,
    position: 'Forward',
    team: 'City United FC',
    nationality: 'USA',
    height: '185cm',
    weight: '78kg',
    rating: 88,
    aiScore: 92
  },
  stats: {
    speed: 87,
    shooting: 85,
    passing: 82,
    dribbling: 90,
    defense: 75,
    physical: 88
  },
  opportunities: [
    { id: 1, club: 'MLS Scouts', status: 'Interested', date: '2024-01-15' },
    { id: 2, club: 'European Academy', status: 'Trial Offered', date: '2024-01-12' },
    { id: 3, club: 'National Team Scouts', status: 'Watching', date: '2024-01-10' }
  ],
  videos: [
    { id: 1, title: 'Match Highlights vs Rivals', duration: '2:45', views: 1245 },
    { id: 2, title: 'Training Session', duration: '5:20', views: 867 },
    { id: 3, title: 'Skill Compilation', duration: '3:15', views: 2103 }
  ]
};

const mockScoutData = {
  discoveredPlayers: [
    { id: 1, name: 'Lionel Messi', position: 'Forward', rating: 95, status: 'Verified', match: 98 },
    { id: 2, name: 'Kevin De Bruyne', position: 'Midfielder', rating: 91, status: 'Verified', match: 87 },
    { id: 3, name: 'Virgil van Dijk', position: 'Defender', rating: 89, status: 'Verified', match: 76 }
  ],
  shortlist: [
    { id: 101, name: 'Young Talent A', position: 'Forward', age: 19, potential: 94 },
    { id: 102, name: 'Promising Midfielder', position: 'Midfielder', age: 21, potential: 88 },
    { id: 103, name: 'Solid Defender', position: 'Defender', age: 23, potential: 85 }
  ],
  analytics: {
    playersViewed: 156,
    shortlisted: 12,
    contactsMade: 23,
    successRate: '68%'
  }
};

const mockAdminData = {
  verificationQueue: [
    { id: 1, name: 'Player A', position: 'Forward', submitted: '2024-01-15', status: 'Pending' },
    { id: 2, name: 'Player B', position: 'Midfielder', submitted: '2024-01-14', status: 'Pending' },
    { id: 3, name: 'Player C', position: 'Defender', submitted: '2024-01-13', status: 'Approved' }
  ],
  systemStats: {
    totalPlayers: 1247,
    verifiedPlayers: 856,
    pendingVerification: 45,
    totalRevenue: '$45,230'
  },
  recentActivity: [
    { id: 1, action: 'Player Verified', user: 'Sarah Wilson', time: '2 hours ago' },
    { id: 2, action: 'New Scout Registered', user: 'MLS Scouting Team', time: '4 hours ago' },
    { id: 3, action: 'Payment Processed', user: 'European Academy', time: '1 day ago' }
  ]
};

const ProfessionalDashboard = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'player': return '#2196f3';
      case 'scout': return '#ff9800';
      case 'federation_admin': return '#4caf50';
      default: return '#666';
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = '#1976d2' }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ProgressCard = ({ title, value, color = '#1976d2' }) => (
    <Card sx={{ p: 2 }}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={value} 
          sx={{ 
            flexGrow: 1, 
            mr: 2, 
            height: 8, 
            borderRadius: 4,
            backgroundColor: '#f0f0f0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
              borderRadius: 4
            }
          }} 
        />
        <Typography variant="body2" fontWeight="bold">
          {value}%
        </Typography>
      </Box>
    </Card>
  );

  // Player Dashboard Components
  const PlayerProfileSection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ textAlign: 'center', p: 3 }}>
          <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
            <Person sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {mockPlayerData.profile.name}
          </Typography>
          <Chip label={mockPlayerData.profile.position} color="primary" sx={{ mb: 1 }} />
          <Typography color="textSecondary" gutterBottom>
            {mockPlayerData.profile.team} • {mockPlayerData.profile.nationality}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Chip icon={<Star />} label={`Rating: ${mockPlayerData.profile.rating}`} variant="outlined" />
            <Chip icon={<TrendingUp />} label={`AI Score: ${mockPlayerData.profile.aiScore}`} color="success" />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Performance Analytics
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(mockPlayerData.stats).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <ProgressCard 
                  title={key.charAt(0).toUpperCase() + key.slice(1)} 
                  value={value}
                  color={value > 85 ? '#4caf50' : value > 75 ? '#ff9800' : '#f44336'}
                />
              </Grid>
            ))}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );

  const PlayerOpportunitiesSection = () => (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Opportunity Tracking
        </Typography>
        <Button variant="outlined" startIcon={<Add />}>
          New Opportunity
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Club/Organization</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPlayerData.opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell>
                  <Typography fontWeight="medium">{opportunity.club}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={opportunity.status} 
                    color={
                      opportunity.status === 'Trial Offered' ? 'success' : 
                      opportunity.status === 'Interested' ? 'warning' : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{opportunity.date}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <Message />
                  </IconButton>
                  <IconButton size="small" color="secondary">
                    <Email />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  const PlayerVideosSection = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Video Highlights
      </Typography>
      <Grid container spacing={2}>
        {mockPlayerData.videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card variant="outlined" sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VideoLibrary color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    {video.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Duration: {video.duration}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Views: {video.views.toLocaleString()}
                </Typography>
                <Button fullWidth variant="outlined" size="small" sx={{ mt: 1 }}>
                  Play Video
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            variant="outlined" 
            sx={{ 
              cursor: 'pointer', 
              borderStyle: 'dashed',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 140
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Add sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography color="textSecondary">
                Upload New Video
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );

  // Scout Dashboard Components
  const ScoutDiscoverySection = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Advanced Player Search
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined" startIcon={<Search />}>
            Position
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined">
            Age Range
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined">
            Rating
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="contained">
            Apply Filters
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom fontWeight="bold">
        Discovered Players
      </Typography>
      <Grid container spacing={2}>
        {mockScoutData.discoveredPlayers.map((player) => (
          <Grid item xs={12} md={4} key={player.id}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                <SportsSoccer sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {player.name}
              </Typography>
              <Chip label={player.position} size="small" sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Rating: {player.rating}</Typography>
                <Typography variant="body2" color="success.main">
                  Match: {player.match}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button fullWidth variant="outlined" size="small">
                  View Profile
                </Button>
                <Button fullWidth variant="contained" size="small">
                  Contact
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  );

  const ScoutShortlistSection = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Player Shortlisting
      </Typography>
      <List>
        {mockScoutData.shortlist.map((player) => (
          <ListItem key={player.id} divider>
            <ListItemIcon>
              <Favorite color="error" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontWeight="medium">{player.name}</Typography>
                  <Chip label={`Potential: ${player.potential}`} color="success" size="small" />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Typography variant="body2">Position: {player.position}</Typography>
                  <Typography variant="body2">Age: {player.age}</Typography>
                </Box>
              }
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary">
                <Message />
              </IconButton>
              <IconButton size="small" color="secondary">
                <Email />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Card>
  );

  // Admin Dashboard Components
  const AdminVerificationSection = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Player Verification Queue
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockAdminData.verificationQueue.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <Typography fontWeight="medium">{player.name}</Typography>
                </TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.submitted}</TableCell>
                <TableCell>
                  <Chip 
                    label={player.status} 
                    color={player.status === 'Approved' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                    Review
                  </Button>
                  <Button size="small" variant="contained" color="success">
                    Verify
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  const AdminAnalyticsSection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Players"
          value={mockAdminData.systemStats.totalPlayers.toLocaleString()}
          icon={<Group />}
          color="#2196f3"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Verified"
          value={mockAdminData.systemStats.verifiedPlayers.toLocaleString()}
          icon={<CheckCircle />}
          color="#4caf50"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pending"
          value={mockAdminData.systemStats.pendingVerification}
          icon={<Pending />}
          color="#ff9800"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Revenue"
          value={mockAdminData.systemStats.totalRevenue}
          icon={<TrendingUp />}
          color="#9c27b0"
        />
      </Grid>
    </Grid>
  );

  // Render appropriate content based on user role
  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'player':
        return (
          <Box>
            <PlayerProfileSection />
            <Box sx={{ mt: 3 }}>
              <PlayerOpportunitiesSection />
            </Box>
            <Box sx={{ mt: 3 }}>
              <PlayerVideosSection />
            </Box>
          </Box>
        );
      
      case 'scout':
        return (
          <Box>
            <ScoutDiscoverySection />
            <Box sx={{ mt: 3 }}>
              <ScoutShortlistSection />
            </Box>
          </Box>
        );
      
      case 'federation_admin':
        return (
          <Box>
            <AdminAnalyticsSection />
            <Box sx={{ mt: 3 }}>
              <AdminVerificationSection />
            </Box>
          </Box>
        );
      
      default:
        return <Typography>No content available for your role.</Typography>;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="static" elevation={2} sx={{ bgcolor: getRoleColor() }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            🎯 PlayConnect
            <Typography variant="body2" sx={{ ml: 2, opacity: 0.9 }}>
              Professional Dashboard
            </Typography>
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
              {user.role === 'player' ? <SportsSoccer /> : 
               user.role === 'scout' ? <Search /> : <AdminPanelSettings />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ mr: 1 }} />
              My Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
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
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          background: `linear-gradient(135deg, ${getRoleColor()} 0%, #764ba2 100%)`, 
          color: 'white',
          borderRadius: 3
        }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {user.role === 'player' && 'Track your performance and discover new opportunities'}
            {user.role === 'scout' && 'Discover exceptional talent with advanced analytics'}
            {user.role === 'federation_admin' && 'Manage your talent ecosystem efficiently'}
          </Typography>
        </Paper>

        {/* Role-Specific Content */}
        {renderRoleSpecificContent()}

        {/* Quick Actions Footer */}
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'primary.50', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Button fullWidth variant="contained" startIcon={<Analytics />}>
                Analytics
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button fullWidth variant="outlined" startIcon={<Settings />}>
                Settings
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button fullWidth variant="outlined" startIcon={<Message />}>
                Messages
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button fullWidth variant="outlined" startIcon={<Analytics />}>
                Help
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="add"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ProfessionalDashboard;
