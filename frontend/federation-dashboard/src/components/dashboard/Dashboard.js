import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  const getDashboardData = () => {
    switch (user.role) {
      case 'player':
        return {
          title: 'Player Dashboard',
          stats: [
            { label: 'Profile Views', value: '245' },
            { label: 'Scout Contacts', value: '12' },
            { label: 'Offers', value: '3' },
            { label: 'AI Score', value: '87/100' }
          ],
          actions: ['View My Profile', 'See Who Viewed Me', 'Check Offers', 'Performance Stats']
        };
      case 'scout':
        return {
          title: 'Scout Dashboard', 
          stats: [
            { label: 'Players Viewed', value: '45' },
            { label: 'Shortlisted', value: '8' },
            { label: 'Contacts', value: '12' },
            { label: 'Saved Searches', value: '3' }
          ],
          actions: ['Find Players', 'My Shortlist', 'Contact Players', 'Reports']
        };
      case 'federation_admin':
        return {
          title: 'Federation Dashboard',
          stats: [
            { label: 'Total Players', value: '1,250' },
            { label: 'Verified', value: '980' },
            { label: 'Pending', value: '45' },
            { label: 'Revenue', value: '$25K' }
          ],
          actions: ['Add Player', 'Verify Players', 'View Analytics', 'Manage Users']
        };
      default:
        return { title: 'Dashboard', stats: [], actions: [] };
    }
  };

  const dashboardData = getDashboardData();

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>🎯 PlayConnect - {dashboardData.title}</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          {dashboardData.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {dashboardData.actions.map((action, index) => (
              <button key={index} className="action-btn">
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-text">
            {user.role === 'player' && '✓ Manchester United viewed your profile (2 hours ago)'}
            {user.role === 'scout' && '⭐ AI recommends: John Doe (Forward, 87 score)'}
            {user.role === 'federation_admin' && '⏳ 3 players pending verification'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
