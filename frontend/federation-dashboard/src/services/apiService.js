const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Player Management APIs - Connect to existing player service
  async getPlayers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/players?${queryParams}`);
  }

  async getPlayer(id) {
    return this.request(`/api/players/${id}`);
  }

  async createPlayer(playerData) {
    return this.request('/api/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  }

  async updatePlayer(id, playerData) {
    return this.request(`/api/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playerData),
    });
  }

  async deletePlayer(id) {
    return this.request(`/api/players/${id}`, {
      method: 'DELETE',
    });
  }

  // Video Management APIs
  async uploadVideo(videoFile, playerId) {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('playerId', playerId);

    return this.request('/api/videos/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: formData,
    });
  }

  async getPlayerVideos(playerId) {
    return this.request(`/api/players/${playerId}/videos`);
  }

  async deleteVideo(videoId) {
    return this.request(`/api/videos/${videoId}`, {
      method: 'DELETE',
    });
  }

  // User Management APIs
  async getUsers() {
    return this.request('/api/users');
  }

  async updateUserRole(userId, role) {
    return this.request(`/api/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Federation Management APIs
  async getFederations() {
    return this.request('/api/federations');
  }

  async getFederationPlayers(federationId) {
    return this.request(`/api/federations/${federationId}/players`);
  }

  // Search APIs
  async searchPlayers(query, filters = {}) {
    return this.request('/api/search/players', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  // Analytics APIs
  async getPlayerAnalytics(playerId) {
    return this.request(`/api/analytics/players/${playerId}`);
  }

  async getFederationAnalytics(federationId) {
    return this.request(`/api/analytics/federations/${federationId}`);
  }
}

export default new ApiService();
