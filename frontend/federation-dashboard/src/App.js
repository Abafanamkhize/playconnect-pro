import React from 'react';
import './App.css';

function App() {
  const handleStatusCheck = () => {
    window.open('http://localhost:3006/api/status', '_blank');
  };

  const handlePlayersCheck = () => {
    window.open('http://localhost:3006/api/players', '_blank');
  };

  const handleHealthCheck = () => {
    window.open('http://localhost:3006/api/health', '_blank');
  };

  return (
    <div className="App" style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#1976d2', fontSize: '2.5rem', marginBottom: '10px' }}>
          🎯 PlayConnect
        </h1>
        <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '20px' }}>
          Phase 2 - Integration Service Running
        </h2>
        
        <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>Backend Services</h3>
          <p style={{ margin: '10px 0', fontSize: '1.1rem' }}>
            <strong>Integration Service:</strong> http://localhost:3006
          </p>
          <p style={{ margin: '10px 0', fontSize: '1.1rem' }}>
            <strong>Status:</strong> ✅ Running
          </p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Test Endpoints</h3>
          <button 
            onClick={handleStatusCheck}
            style={{ 
              padding: '12px 24px', 
              margin: '8px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📊 Check Status
          </button>
          <button 
            onClick={handlePlayersCheck}
            style={{ 
              padding: '12px 24px', 
              margin: '8px',
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            👥 View Players
          </button>
          <button 
            onClick={handleHealthCheck}
            style={{ 
              padding: '12px 24px', 
              margin: '8px',
              backgroundColor: '#ed6c02',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ❤️ Health Check
          </button>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ color: '#7b1fa2', marginBottom: '10px' }}>Next Steps</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Once the frontend dependencies are fully resolved, we'll integrate the complete dashboard with:
          </p>
          <ul style={{ textAlign: 'left', display: 'inline-block', color: '#666' }}>
            <li>3-role authentication system</li>
            <li>Player management dashboard</li>
            <li>Scout discovery platform</li>
            <li>Federation admin controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
