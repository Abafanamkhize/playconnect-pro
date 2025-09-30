import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userTypes = [
    { label: 'Athlete/Player', value: 'player' },
    { label: 'Scout/Club', value: 'scout' }, 
    { label: 'Federation Admin', value: 'federation_admin' }
  ];

  const handleTabChange = (index) => {
    setActiveTab(index);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const role = userTypes[activeTab].value;
      
      const response = await fetch('http://localhost:3003/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        onLogin(data.data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDemoCredentials = () => {
    const roles = {
      player: { email: 'player@test.com', password: 'password' },
      scout: { email: 'scout@test.com', password: 'password' },
      federation_admin: { email: 'federation@test.com', password: 'password' }
    };
    return roles[userTypes[activeTab].value];
  };

  const fillDemoCredentials = () => {
    const demo = getDemoCredentials();
    setFormData({
      email: demo.email,
      password: demo.password
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🎯 PlayConnect</h1>
          <p>Where Talent Meets Opportunity</p>
        </div>

        <div className="tabs">
          {userTypes.map((type, index) => (
            <button
              key={type.value}
              className={`tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing In...' : `Sign In as ${userTypes[activeTab].label}`}
          </button>

          <button type="button" className="demo-btn" onClick={fillDemoCredentials}>
            Fill Demo Credentials
          </button>
        </form>

        <div className="help-links">
          <p>
            {activeTab === 0 && "Don't have an account? Contact your sports federation"}
            {activeTab === 1 && "Need a scout account? Apply through federation"}
            {activeTab === 2 && "Federation registration requires verification"}
          </p>
          <a href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
