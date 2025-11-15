// services/apiservice.js
// const BASE_URL = 'http://luxcycs.com:5501';
const BASE_URL = 'http://localhost:3000';                                                                                                                                                                                       

// Request deduplication cache
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Global request tracker
const activeRequests = new Map();

export const apiService = (() => {
  const baseURL = BASE_URL;

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).id : null;
    }
    return null;
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
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
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
      console.error('API Call Error:', {
        url,
        error: error.message,
        stack: error.stack
      });
      
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
}, 60000);



// src/services/apiService.js
// const BASE_URL = "http://luxcycs.com:5501";

// // Helper to get access token from localStorage
// const getAccessToken = () => localStorage.getItem("accessToken");

// // Helper to save new access token after refresh
// const setAccessToken = (token) => {
//   if (token) localStorage.setItem("accessToken", token);
// };

// // Helper to remove tokens and logout
// const logoutUser = () => {
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("user");
//   window.dispatchEvent(new Event("auth-token-expired"));
//   window.location.href = "/login";
// };

// // Core API call function
// const apiCall = async (endpoint, options = {}, retry = true) => {
//   const token = getAccessToken();

//   const config = {
//     method: options.method || "GET",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//     credentials: "include", // ✅ send HttpOnly refresh token cookie
//   };

//   // Add JSON body automatically for POST/PUT/PATCH
//   if (options.body && ["POST", "PUT", "PATCH"].includes(config.method.toUpperCase())) {
//     config.body = JSON.stringify(options.body);
//   }

//   try {
//     const res = await fetch(`${BASE_URL}${endpoint}`, config);

//     // Try to parse JSON safely
//     const contentType = res.headers.get("content-type");
//     const data = contentType?.includes("application/json") ? await res.json() : await res.text();

//     // ✅Handle success
//     if (res.ok || res.status === 304) return data;

 
//     if (res.status === 401) {
//       console.warn("Access token expired or unauthorized");

//       // If refresh-token endpoint exists
//       if (retry) {
//         try {
//           const refreshResponse = await fetch(`${BASE_URL}/customer/refresh-token`, {
//             method: "POST",
//             credentials: "include", // Send refresh cookie automatically
//           });

//           if (refreshResponse.ok) {
//             const refreshData = await refreshResponse.json();
//             const newAccessToken = refreshData?.accessToken;

//             if (newAccessToken) {
//               console.log("✅ Token refreshed successfully");
//               setAccessToken(newAccessToken);

//               // Retry the original request once
//               return await apiCall(endpoint, options, false);
//             }
//           }

//           // If refresh fails, logout
//           console.error("❌ Refresh token invalid or missing");
//           logoutUser();
//           throw new Error("Session expired. Please log in again.");
//         } catch (refreshErr) {
//           console.error("Refresh token error:", refreshErr);
//           logoutUser();
//           throw new Error("Session expired. Please log in again.");
//         }
//       } else {
//         // Already retried once
//         logoutUser();
//         throw new Error("Session expired. Please log in again.");
//       }
//     }

//     // 🚫 Handle other HTTP errors
//     throw new Error(data?.message || `HTTP error ${res.status}`);

//   } catch (err) {
//     console.error("API error:", err);
//     throw err;
//   }
// };

// // Export clean helper methods
// export const apiService = {
//   apiCall,
//   get: (url, options) => apiCall(url, { ...options, method: "GET" }),
//   post: (url, body, options) => apiCall(url, { ...options, method: "POST", body }),
//   put: (url, body, options) => apiCall(url, { ...options, method: "PUT", body }),
//   patch: (url, body, options) => apiCall(url, { ...options, method: "PATCH", body }),
//   delete: (url, options) => apiCall(url, { ...options, method: "DELETE" }),
// };
