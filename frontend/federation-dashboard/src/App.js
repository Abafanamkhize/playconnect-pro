import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PlayerManagement from './components/PlayerManagement';
import FederationManagement from './components/FederationManagement';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                PlayConnect
              </Link>
            </Typography>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/players">
                  Players
                </Button>
                <Button color="inherit" component={Link} to="/federations">
                  Federations
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/players" element={<PlayerManagement />} />
          <Route path="/federations" element={<FederationManagement />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
