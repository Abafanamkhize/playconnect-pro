const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async register(userData) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/register\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        this.setAuthData(data.data.token, data.data.user);
        return data;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/login\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        this.setAuthData(data.data.token, data.data.user);
        return data;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async verifyEmail(token) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/verify-email?token=\${token}\`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Email verification failed');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/forgot-password\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Password reset request failed');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/reset-password\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Password reset failed');
    }
  }

  async getCurrentUser() {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(\`\${API_BASE_URL}/api/auth/me\`, {
        headers: {
          'Authorization': \`Bearer \${this.token}\`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      if (data.success) {
        this.user = data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      }
    } catch (error) {
      this.logout();
      return null;
    }
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  hasRole(role) {
    return this.user && this.user.role === role;
  }

  hasAnyRole(roles) {
    return this.user && roles.includes(this.user.role);
  }

  getAuthHeader() {
    return this.token ? { 'Authorization': \`Bearer \${this.token}\` } : {};
  }
}

export default new AuthService();
