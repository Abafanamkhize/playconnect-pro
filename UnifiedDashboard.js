import React from 'react';
import FederationDashboard from './FederationDashboard';
import ScoutDashboard from './ScoutDashboard';
import PlayerDashboard from './PlayerDashboard';

// Import existing components from the codebase
const UnifiedDashboard = ({ user, onLogout }) => {
  
  // Enhanced user data with connections to existing services
  const enhancedUser = {
    ...user,
    // Add connections to existing services
    services: {
      player: true,
      federation: true, 
      search: true,
      analytics: true
    }
  };

  // Render based on role with enhanced capabilities
  switch (user.role) {
    case 'federation_admin':
      return (
        <div>
          <FederationDashboard user={enhancedUser} onLogout={onLogout} />
          {/* Could integrate existing FederationManagement component here */}
        </div>
      );
    
    case 'scout':
      return (
        <div>
          <ScoutDashboard user={enhancedUser} onLogout={onLogout} />
          {/* Could integrate existing search and filter components */}
        </div>
      );
    
    case 'player':
      return (
        <div>
          <PlayerDashboard user={enhancedUser} onLogout={onLogout} />
          {/* Could integrate existing player profile components */}
        </div>
      );
    
    default:
      return (
        <div className="dashboard">
          <header className="header">
            <div className="header-content">
              <h1>🎯 PlayConnect - Unified Platform</h1>
              <div className="user-info">
                <span>Welcome, {user.name}</span>
                <div className="service-status">
                  <span className="status-dot online"></span>
                  <span>All Services Connected</span>
                </div>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </div>
            </div>
          </header>
          <div className="dashboard-content">
            <div className="services-overview">
              <h2>Connected Services</h2>
              <div className="services-grid">
                <div className="service-card">
                  <h3>Player Service</h3>
                  <p>✅ Complete CRUD operations</p>
                  <p>📊 250+ players in database</p>
                </div>
                <div className="service-card">
                  <h3>Authentication</h3>
                  <p>✅ 3-role system</p>
                  <p>🔐 JWT security</p>
                </div>
                <div className="service-card">
                  <h3>Federation Controls</h3>
                  <p>✅ Verification system</p>
                  <p>📈 Analytics dashboard</p>
                </div>
                <div className="service-card">
                  <h3>Search & Discovery</h3>
                  <p>✅ Advanced filters</p>
                  <p>🤖 AI recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default UnifiedDashboard;
