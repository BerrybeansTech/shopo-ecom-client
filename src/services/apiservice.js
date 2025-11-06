// src/services/apiService.js
const BASE_URL = 'http://luxcycs.com:5501';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default ApiService;