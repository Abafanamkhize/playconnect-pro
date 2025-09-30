import React from 'react';
import FederationDashboard from './FederationDashboard';
import ScoutDashboard from './ScoutDashboard';
import PlayerDashboard from './PlayerDashboard';

const Dashboard = ({ user, onLogout }) => {
  // Render different dashboard based on user role
  switch (user.role) {
    case 'federation_admin':
      return <FederationDashboard user={user} onLogout={onLogout} />;
    
    case 'scout':
      return <ScoutDashboard user={user} onLogout={onLogout} />;
    
    case 'player':
      return <PlayerDashboard user={user} onLogout={onLogout} />;
    
    default:
      return (
        <div className="dashboard">
          <header className="header">
            <div className="header-content">
              <h1>🎯 PlayConnect - Dashboard</h1>
              <div className="user-info">
                <span>Welcome, {user.name}</span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </div>
            </div>
          </header>
          <div className="dashboard-content">
            <p>Welcome to PlayConnect! Your role-specific dashboard is being prepared.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;
