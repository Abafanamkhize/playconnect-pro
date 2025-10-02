import React, { useState } from 'react';

const PlayerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock player profile data
  const playerProfile = {
    name: 'John Doe',
    position: 'Forward',
    age: 22,
    rating: 87,
    team: 'Academy FC',
    nationality: 'Brazil',
    value: '$2,500,000',
    stats: {
      speed: 92, dribbling: 87, shooting: 85, passing: 78, vision: 82
    },
    aiScore: 87,
    profileViews: 245,
    scoutContacts: 12,
    offers: 3,
    videos: 2,
    achievements: ['Top Scorer - Youth League 2023', 'Player of the Month - Jan 2024']
  };

  const recentActivity = [
    { type: 'view', message: 'Manchester United viewed your profile', time: '2 hours ago' },
    { type: 'ai', message: 'AI score updated to 87', time: '1 day ago' },
    { type: 'offer', message: 'New trial offer from Chelsea FC', time: '3 days ago' },
    { type: 'video', message: 'Performance video analyzed', time: '1 week ago' }
  ];

  const offers = [
    { club: 'Chelsea FC', type: 'Trial', status: 'Pending', date: '2024-03-15' },
    { club: 'AC Milan', type: 'Contract', status: 'Under Review', date: '2024-03-10' },
    { club: 'Ajax', type: 'Training Camp', status: 'Accepted', date: '2024-03-05' }
  ];

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>🎯 PlayConnect - Player Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {playerProfile.name}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Player Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Profile Views</div>
            <div className="stat-value">{playerProfile.profileViews}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Scout Contacts</div>
            <div className="stat-value">{playerProfile.scoutContacts}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Offers</div>
            <div className="stat-value">{playerProfile.offers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">AI Score</div>
            <div className="stat-value">{playerProfile.aiScore}/100</div>
          </div>
        </div>

        {/* Player Navigation */}
        <div className="tabs" style={{marginBottom: '20px'}}>
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button 
            className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            Offers ({offers.length})
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="profile-summary">
              <h2>Your Player Profile</h2>
              <div className="profile-card">
                <div className="profile-header">
                  <h3>{playerProfile.name}</h3>
                  <span className="player-rating">{playerProfile.rating} Rating</span>
                </div>
                <div className="profile-details">
                  <div><strong>Position:</strong> {playerProfile.position}</div>
                  <div><strong>Age:</strong> {playerProfile.age}</div>
                  <div><strong>Team:</strong> {playerProfile.team}</div>
                  <div><strong>Nationality:</strong> {playerProfile.nationality}</div>
                  <div><strong>Market Value:</strong> {playerProfile.value}</div>
                </div>
                <div className="profile-stats">
                  <h4>Key Attributes</h4>
                  {Object.entries(playerProfile.stats).map(([stat, value]) => (
                    <div key={stat} className="stat-bar">
                      <span className="stat-name">{stat}:</span>
                      <div className="stat-visual">
                        <div 
                          className="stat-fill" 
                          style={{width: `${value}%`}}
                        ></div>
                        <span className="stat-value">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="activity-feed">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'view' && '👁️'}
                      {activity.type === 'ai' && '🤖'}
                      {activity.type === 'offer' && '📩'}
                      {activity.type === 'video' && '🎥'}
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="offers-content">
            <h2>Your Opportunities</h2>
            <div className="offers-list">
              {offers.map((offer, index) => (
                <div key={index} className="offer-card">
                  <div className="offer-header">
                    <h3>{offer.club}</h3>
                    <span className={`offer-status ${offer.status.toLowerCase().replace(' ', '-')}`}>
                      {offer.status}
                    </span>
                  </div>
                  <div className="offer-details">
                    <div><strong>Type:</strong> {offer.type}</div>
                    <div><strong>Date:</strong> {offer.date}</div>
                  </div>
                  <div className="offer-actions">
                    <button className="btn-view-offer">View Details</button>
                    {offer.status === 'Pending' && (
                      <>
                        <button className="btn-accept">Accept</button>
                        <button className="btn-decline">Decline</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-content">
            <h2>Manage Your Profile</h2>
            <div className="profile-management">
              <div className="management-section">
                <h3>Personal Information</h3>
                <p>Contact your federation to update personal details</p>
              </div>
              
              <div className="management-section">
                <h3>Performance Videos ({playerProfile.videos})</h3>
                <button className="btn-upload">Upload New Video</button>
                <div className="video-list">
                  <div className="video-item">Match Highlights (5:32)</div>
                  <div className="video-item">Skills Demo (2:15)</div>
                </div>
              </div>

              <div className="management-section">
                <h3>Achievements</h3>
                <ul className="achievements-list">
                  {playerProfile.achievements.map((achievement, index) => (
                    <li key={index}>🏆 {achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-content">
            <h2>Performance Analytics</h2>
            <div className="performance-stats">
              <div className="performance-card">
                <h3>AI Talent Score</h3>
                <div className="score-circle">
                  <span className="score-value">{playerProfile.aiScore}%</span>
                </div>
                <p>Based on your recent performances and potential</p>
              </div>
              
              <div className="performance-card">
                <h3>Progress Tracking</h3>
                <div className="progress-chart">
                  <p>📈 Your rating has improved from 82 to 87 in the last 3 months</p>
                  <p>👁️ Profile views increased by 45% this month</p>
                  <p>⭐ Scout interest growing steadily</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;
