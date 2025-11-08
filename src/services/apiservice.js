const BASE_URL = 'http://luxcycs.com:5501';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body && (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH')) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }

  // Convenience methods
  get(endpoint) {
    return this.apiCall(endpoint);
  }

  post(endpoint, body) {
    return this.apiCall(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.apiCall(endpoint, { method: 'PUT', body });
  }

  patch(endpoint, body) {
    return this.apiCall(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.apiCall(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
export default ApiService;