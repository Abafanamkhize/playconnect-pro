import React, { useState } from 'react';

const ScoutDashboard = ({ user, onLogout }) => {
  const [searchFilters, setSearchFilters] = useState({
    position: '',
    ageRange: [18, 35],
    minRating: 0,
    nationality: ''
  });
  const [searchResults, setSearchResults] = useState([]);

  // Mock player data for scouts to discover
  const allPlayers = [
    {
      id: 1,
      name: 'Lionel Messi',
      position: 'Forward',
      age: 36,
      rating: 95,
      team: 'Inter Miami',
      nationality: 'Argentina',
      value: '$50,000,000',
      stats: { speed: 90, dribbling: 95, shooting: 92, passing: 91, vision: 94 },
      status: 'Verified',
      aiScore: 98,
      videos: 3,
      lastMatch: '2024-03-15'
    },
    {
      id: 2,
      name: 'Kylian Mbappé',
      position: 'Forward',
      age: 25,
      rating: 91,
      team: 'Paris Saint-Germain',
      nationality: 'France',
      value: '$180,000,000',
      stats: { speed: 96, dribbling: 89, shooting: 88, passing: 80, vision: 82 },
      status: 'Verified',
      aiScore: 94,
      videos: 5,
      lastMatch: '2024-03-14'
    },
    {
      id: 3,
      name: 'Kevin De Bruyne',
      position: 'Midfielder',
      age: 32,
      rating: 91,
      team: 'Manchester City',
      nationality: 'Belgium',
      value: '$70,000,000',
      stats: { speed: 76, dribbling: 86, shooting: 86, passing: 94, vision: 93 },
      status: 'Verified',
      aiScore: 96,
      videos: 4,
      lastMatch: '2024-03-13'
    }
  ];

  const performSearch = () => {
    const results = allPlayers.filter(player => {
      return (
        (!searchFilters.position || player.position === searchFilters.position) &&
        player.age >= searchFilters.ageRange[0] &&
        player.age <= searchFilters.ageRange[1] &&
        player.rating >= searchFilters.minRating &&
        (!searchFilters.nationality || player.nationality.toLowerCase().includes(searchFilters.nationality.toLowerCase()))
      );
    });
    setSearchResults(results);
  };

  const shortlistPlayer = (playerId) => {
    alert(`Player ${playerId} added to shortlist!`);
  };

  const contactPlayer = (playerId) => {
    alert(`Contacting player ${playerId} through their federation...`);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>🎯 PlayConnect - Scout Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Scout Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Players Viewed</div>
            <div className="stat-value">45</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Shortlisted</div>
            <div className="stat-value">8</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Contacts Made</div>
            <div className="stat-value">12</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">AI Matches</div>
            <div className="stat-value">15</div>
          </div>
        </div>

        {/* Advanced Search Section */}
        <div className="search-panel">
          <h2>🔍 Advanced Player Search</h2>
          <div className="search-filters">
            <div className="filter-group">
              <label>Position:</label>
              <select 
                value={searchFilters.position}
                onChange={(e) => setSearchFilters({...searchFilters, position: e.target.value})}
              >
                <option value="">Any Position</option>
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Age Range: {searchFilters.ageRange[0]} - {searchFilters.ageRange[1]}</label>
              <input 
                type="range" 
                min="16" 
                max="40" 
                value={searchFilters.ageRange[1]}
                onChange={(e) => setSearchFilters({...searchFilters, ageRange: [searchFilters.ageRange[0], parseInt(e.target.value)]})}
              />
            </div>

            <div className="filter-group">
              <label>Minimum Rating: {searchFilters.minRating}+</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={searchFilters.minRating}
                onChange={(e) => setSearchFilters({...searchFilters, minRating: parseInt(e.target.value)})}
              />
            </div>

            <div className="filter-group">
              <label>Nationality:</label>
              <input 
                type="text"
                placeholder="Filter by nationality..."
                value={searchFilters.nationality}
                onChange={(e) => setSearchFilters({...searchFilters, nationality: e.target.value})}
              />
            </div>

            <button className="search-btn" onClick={performSearch}>
              Search Players
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results ({searchResults.length} players found)</h3>
            <div className="players-grid scout-view">
              {searchResults.map(player => (
                <div key={player.id} className="player-card scout-card">
                  <div className="player-header">
                    <h3>{player.name}</h3>
                    <span className="ai-score">AI: {player.aiScore}%</span>
                  </div>
                  <div className="player-info">
                    <div className="position">{player.position}</div>
                    <div className="details">
                      <span>Age: {player.age}</span>
                      <span>Rating: {player.rating}</span>
                    </div>
                    <div className="team">{player.team}</div>
                    <div className="nationality">{player.nationality}</div>
                    <div className="value">{player.value}</div>
                  </div>
                  <div className="player-stats">
                    {Object.entries(player.stats).map(([stat, value]) => (
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
                  <div className="scout-actions">
                    <button 
                      className="btn-shortlist"
                      onClick={() => shortlistPlayer(player.id)}
                    >
                      ⭐ Shortlist
                    </button>
                    <button 
                      className="btn-contact"
                      onClick={() => contactPlayer(player.id)}
                    >
                      📞 Contact
                    </button>
                    <button className="btn-view">View Profile</button>
                  </div>
                  <div className="player-meta">
                    <span>Videos: {player.videos}</span>
                    <span>Last Match: {player.lastMatch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="ai-recommendations">
          <h2>⭐ AI Recommendations For You</h2>
          <div className="recommendations-grid">
            {allPlayers.slice(0, 3).map(player => (
              <div key={player.id} className="recommendation-card">
                <div className="rec-header">
                  <h4>{player.name}</h4>
                  <span className="match-score">92% Match</span>
                </div>
                <div className="rec-details">
                  <span>{player.position} • {player.age} years</span>
                  <span>{player.team} • {player.nationality}</span>
                </div>
                <button 
                  className="btn-view-rec"
                  onClick={() => setSearchResults([player])}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutDashboard;
