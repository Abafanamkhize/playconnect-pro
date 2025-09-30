import React, { useState } from 'react';

const FederationDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock player data - in real app, this would come from API
  const players = [
    {
      id: 1,
      name: 'Lionel Messi',
      status: 'Pending',
      position: 'Forward',
      age: 36,
      rating: 82,
      team: 'Inter Miami',
      nationality: 'Argentina',
      value: '$50,000,000',
      stats: {
        speed: 90,
        dribbling: 95,
        shooting: 92,
        passing: 91,
        vision: 94
      }
    },
    {
      id: 2,
      name: 'ssss ssss',
      status: 'Verified',
      position: 'Midfielder',
      age: 33,
      rating: 0,
      team: 'frfrfrfrf',
      nationality: 'Unknown',
      value: '$0',
      stats: {
        speed: 0,
        dribbling: 0,
        shooting: 0,
        passing: 0,
        vision: 0
      }
    }
  ];

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStats = () => ({
    totalPlayers: players.length,
    verified: players.filter(p => p.status === 'Verified').length,
    pending: players.filter(p => p.status === 'Pending').length,
    revenue: '$25,000'
  });

  const stats = getStats();

  const verifyPlayer = (playerId) => {
    // In real app, this would call API
    alert(`Player ${playerId} verified!`);
  };

  const rejectPlayer = (playerId) => {
    // In real app, this would call API
    alert(`Player ${playerId} rejected!`);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>🎯 PlayConnect - Federation Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Players</div>
            <div className="stat-value">{stats.totalPlayers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Verified</div>
            <div className="stat-value" style={{color: 'green'}}>{stats.verified}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{color: 'orange'}}>{stats.pending}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Revenue</div>
            <div className="stat-value" style={{color: 'blue'}}>{stats.revenue}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs" style={{marginBottom: '20px'}}>
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            Player Management
          </button>
          <button 
            className={`tab ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            Verification Queue
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* Search Bar */}
        {activeTab === 'players' || activeTab === 'verification' ? (
          <div className="search-section" style={{marginBottom: '20px'}}>
            <input
              type="text"
              placeholder="Search players by name, position, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
        ) : null}

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Federation Overview</h2>
            <p>Welcome to your federation management dashboard. Use the tabs above to manage players, verify new registrations, and view analytics.</p>
            
            <div className="actions-section">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-btn" onClick={() => setActiveTab('verification')}>
                  Review Pending Verifications
                </button>
                <button className="action-btn" onClick={() => setActiveTab('players')}>
                  Manage Players
                </button>
                <button className="action-btn">
                  Add New Player
                </button>
                <button className="action-btn">
                  Generate Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="players-section">
            <h2>Player Management ({filteredPlayers.length} players)</h2>
            <div className="players-grid">
              {filteredPlayers.map(player => (
                <div key={player.id} className="player-card">
                  <div className="player-header">
                    <h3>{player.name}</h3>
                    <span className={`status ${player.status.toLowerCase()}`}>
                      {player.status}
                    </span>
                  </div>
                  <div className="player-info">
                    <div className="position">{player.position}</div>
                    <div className="age">Age: {player.age}</div>
                    <div className="rating">Rating: {player.rating}</div>
                    <div className="team">Team: {player.team}</div>
                    <div className="nationality">Nationality: {player.nationality}</div>
                    <div className="value">Value: {player.value}</div>
                  </div>
                  <div className="player-stats">
                    {Object.entries(player.stats).map(([stat, value]) => (
                      <div key={stat} className="stat-bar">
                        <span className="stat-name">{stat}:</span>
                        <span className="stat-value">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="player-actions">
                    <button className="btn-edit">Edit</button>
                    <button className="btn-view">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="verification-section">
            <h2>Verification Queue ({players.filter(p => p.status === 'Pending').length} pending)</h2>
            <div className="verification-list">
              {filteredPlayers.filter(p => p.status === 'Pending').map(player => (
                <div key={player.id} className="verification-card">
                  <div className="verification-header">
                    <h3>{player.name}</h3>
                    <span className="status pending">Pending Verification</span>
                  </div>
                  <div className="verification-info">
                    <div><strong>Position:</strong> {player.position}</div>
                    <div><strong>Age:</strong> {player.age}</div>
                    <div><strong>Team:</strong> {player.team}</div>
                    <div><strong>Nationality:</strong> {player.nationality}</div>
                  </div>
                  <div className="verification-actions">
                    <button 
                      className="btn-verify"
                      onClick={() => verifyPlayer(player.id)}
                    >
                      ✅ Verify
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => rejectPlayer(player.id)}
                    >
                      ❌ Reject
                    </button>
                    <button className="btn-details">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Federation Analytics</h2>
            <p>Analytics dashboard coming soon...</p>
            <div className="analytics-placeholder">
              <p>📊 Player distribution charts</p>
              <p>📈 Performance metrics</p>
              <p>🌍 Geographic talent mapping</p>
              <p>💰 Revenue analytics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FederationDashboard;
