// services/apiservice.js
import { API_CONFIG } from '../constants';
import { storage } from '../utils/storage';

// Request deduplication cache
const requestCache = new Map();
const CACHE_DURATION = API_CONFIG.CACHE_DURATION;

// Global request tracker
const activeRequests = new Map();

export const apiService = (() => {
  const baseURL = API_CONFIG.BASE_URL;

  const getToken = () => {
    return storage.getToken() || null;
  };

  const getCurrentUserId = () => {
    const user = storage.getUser();
    return user?.id || null;
  };

  // Request deduplication helper
  const deduplicateRequest = async (key, requestFn) => {
    const now = Date.now();
    const cached = requestCache.get(key);
    
    // Return cached promise if it exists and is fresh
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      return cached.promise;
    }
    
    // Prevent duplicate active requests
    if (activeRequests.has(key)) {
      return activeRequests.get(key);
    }
    
    // Create new request
    const promise = requestFn().finally(() => {
      activeRequests.delete(key);
    });
    
    requestCache.set(key, { promise, timestamp: now });
    activeRequests.set(key, promise);
    
    return promise;
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

    if (options.body && ['POST', 'PUT', 'PATCH'].includes(config.method.toUpperCase())) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle connection errors
      if (!response.ok && response.status !== 304) {
        if (response.status === 401) {
          storage.clearAuth();
          throw new Error('Session expired. Please login again.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return data;
    } catch (error) {
      // Only log errors in development mode
      if (import.meta.env.DEV) {
        console.error('API Call Error:', {
          url,
          error: error.message,
          stack: error.stack
        });
      }
      
      // Enhanced error handling
      if (error.message.includes('Failed to fetch') || error.message.includes('Connection refused')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      
      throw error;
    }
  };

  // Public methods with deduplication
  const get = (endpoint, options = {}) => {
    const key = `GET-${endpoint}`;
    return deduplicateRequest(key, () => apiCall(endpoint, options));
  };

  const post = (endpoint, body, options = {}) => {
    const key = `POST-${endpoint}-${JSON.stringify(body)}`;
    return deduplicateRequest(key, () => apiCall(endpoint, { method: 'POST', body, ...options }));
  };

  const put = (endpoint, body, options = {}) => {
    const key = `PUT-${endpoint}-${JSON.stringify(body)}`;
    return deduplicateRequest(key, () => apiCall(endpoint, { method: 'PUT', body, ...options }));
  };

  const patch = (endpoint, body, options = {}) => {
    const key = `PATCH-${endpoint}-${JSON.stringify(body)}`;
    return deduplicateRequest(key, () => apiCall(endpoint, { method: 'PATCH', body, ...options }));
  };

  const del = (endpoint, options = {}) => {
    const key = `DELETE-${endpoint}`;
    return deduplicateRequest(key, () => apiCall(endpoint, { method: 'DELETE', ...options }));
  };

  // Clear cache methods
  const clearCache = () => {
    requestCache.clear();
    activeRequests.clear();
  };

  const clearCacheForKey = (keyPattern) => {
    for (const [key] of requestCache.entries()) {
      if (key.includes(keyPattern)) {
        requestCache.delete(key);
      }
    }
  };

  return { 
    apiCall, 
    get, 
    post, 
    put, 
    patch, 
    delete: del, 
    getToken,
    getCurrentUserId,
    clearCache,
    clearCacheForKey
  };
})();

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      requestCache.delete(key);
    }
  }
}, API_CONFIG.CACHE_CLEANUP_INTERVAL);