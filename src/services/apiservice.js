// services/apiService.js
const BASE_URL = 'http://luxcycs.com:5501';

export const apiService = (() => {
  const baseURL = BASE_URL;

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  const apiCall = async (endpoint, options = {}) => {
    const url = `${baseURL}${endpoint}`;
    const token = getToken();

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (
      options.body &&
      ['POST', 'PUT', 'PATCH'].includes(config.method.toUpperCase())
    ) {
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
        // Handle token expiration or invalid token
        if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  };

  // Public methods
  const get = (endpoint) => apiCall(endpoint);
  const post = (endpoint, body) => apiCall(endpoint, { method: 'POST', body });
  const put = (endpoint, body) => apiCall(endpoint, { method: 'PUT', body });
  const patch = (endpoint, body) => apiCall(endpoint, { method: 'PATCH', body });
  const del = (endpoint) => apiCall(endpoint, { method: 'DELETE' });

  // Return named functions
  return { apiCall, get, post, put, patch, delete: del, getToken };
})();