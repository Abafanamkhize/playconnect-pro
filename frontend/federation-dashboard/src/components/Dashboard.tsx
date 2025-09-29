import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People,
  VideoLibrary,
  Analytics,
  Settings
} from '@mui/icons-material';
import { RootState } from '../app/store';
import PlayerManagement from './PlayerManagement';

const drawerWidth = 240;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const [activeTab, setActiveTab] = React.useState('players');

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
    { text: 'Player Management', icon: <People />, value: 'players' },
    { text: 'Video Library', icon: <VideoLibrary />, value: 'videos' },
    { text: 'Analytics', icon: <Analytics />, value: 'analytics' },
    { text: 'Settings', icon: <Settings />, value: 'settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'players':
        return <PlayerManagement />;
      case 'dashboard':
      default:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome to PlayConnect Federation Portal
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Select a section from the sidebar to manage your players, videos, and analytics.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
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
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            top: '64px'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  selected={activeTab === item.value}
                  onClick={() => setActiveTab(item.value)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
