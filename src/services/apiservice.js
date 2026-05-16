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

   const submitReview = async (reviewData) => {
    try {
      const formData = new FormData();
      formData.append('productId', reviewData.productId);
      formData.append('rating', reviewData.rating);
      formData.append('comment', reviewData.comment);
      
      if (reviewData.orderItemId) {
        formData.append('orderItemId', reviewData.orderItemId);
      }
      
      if (reviewData.images && reviewData.images.length > 0) {
        reviewData.images.forEach((image, index) => {
          formData.append('images', image);
        });
      }
      
      return await post('/product/review/create', formData);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const checkReviewEligibility = async (productId) => {
    try {
      return await get(`/product/review/eligibility/${productId}`);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      throw error;
    }
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

    // Check if body is FormData (for file uploads)
    const isFormData = options.body instanceof FormData;

    const config = {
      method: options.method || 'GET',
      credentials: 'include', // Required to handle HttpOnly cookies
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body && ['POST', 'PUT', 'PATCH'].includes(config.method.toUpperCase())) {
      // Don't JSON.stringify FormData
      config.body = isFormData ? options.body : JSON.stringify(options.body);
    }

    try {
      let response = await fetch(url, config);
      
      // Handle 401 Unauthorized (Token Expired)
      if (response.status === 401 && !options._retry) {
        try {
          // Attempt to refresh token
          const refreshUrl = `${baseURL}/customer/refresh-token`;
          const refreshResponse = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Credentials 'include' is required to send the refreshToken cookie
            credentials: 'include' 
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.accessToken) {
              // 1. Save new token
              storage.setToken(refreshData.accessToken);
              
              // 2. Update headers for retry
              config.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
              
              // 3. Mark as retry to prevent infinite loops
              options._retry = true;
              
              // 4. Retry original request
              response = await fetch(url, config);
            }
          } else {
            // Refresh failed, logout user
            storage.clearAuth();
            throw new Error('Session expired. Please login again.');
          }
        } catch (refreshError) {
          storage.clearAuth();
          throw refreshError;
        }
      }

      // Handle other connection errors
      if (!response.ok && response.status !== 304) {
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

  // Public methods with optional deduplication
  const get = (endpoint, options = {}) => {
    if (options.skipDeduplication) {
      return apiCall(endpoint, options);
    }
    const key = `GET-${endpoint}`;
    return deduplicateRequest(key, () => apiCall(endpoint, options));
  };


  const post = (endpoint, body, options = {}) => {
    if (options.skipDeduplication) {
      return apiCall(endpoint, { method: 'POST', body, ...options });
    }
    const key = `POST-${endpoint}-${JSON.stringify(body)}`;
    return deduplicateRequest(key, () => apiCall(endpoint, { method: 'POST', body, ...options }));
  };

  const put = (endpoint, body, options = {}) => {
    if (options.skipDeduplication) {
      return apiCall(endpoint, { method: 'PUT', body, ...options });
    }
    const key = `PUT-${endpoint}-${JSON.stringify(body)}`;
    return deduplicateRequest(key, () => apiCall(endpoint, { method: 'PUT', body, ...options }));
  };

  const patch = (endpoint, body, options = {}) => {
    if (options.skipDeduplication) {
      return apiCall(endpoint, { method: 'PATCH', body, ...options });
    }
    const key = `PATCH-${endpoint}-${JSON.stringify(body)}`;
    return deduplicateRequest(key, () => apiCall(endpoint, { method: 'PATCH', body, ...options }));
  };

  const del = (endpoint, options = {}) => {
    if (options.skipDeduplication) {
      return apiCall(endpoint, { method: 'DELETE', ...options });
    }
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

  const download = async (endpoint, filename) => {
    const url = `${baseURL}${endpoint}`;
    const token = getToken();

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      console.error('Download Error:', error);
      throw error;
    }
  };

  return { 
    apiCall, 
    get, 
    post, 
    put, 
    patch, 
    delete: del, 
    download,
    getToken,
    getCurrentUserId,
    submitReview,
    checkReviewEligibility,
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