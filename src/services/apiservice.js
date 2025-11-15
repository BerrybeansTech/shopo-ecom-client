// services/apiService.js
// const BASE_URL = 'http://luxcycs.com:5501';
const BASE_URL = ' http://localhost:3000';

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

      // 304 Not Modified is actually a success status
      if (response.ok || response.status === 304) {
        // If we got JSON data with success: true, return it
        if (typeof data === 'object' && data.success) {
          return data;
        }
        // If we got valid data, return it
        if (data) {
          return data;
        }
      }

      // Only throw error for actual error status codes
      if (!response.ok && response.status !== 304) {
        // Handle token expiration or invalid token
        if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
          throw new Error('Session expired. Please login again.');
        }
        
        // For other errors
        const errorMessage = typeof data === 'object' && data.message 
          ? data.message 
          : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Call Error:', {
        url,
        error: error.message,
        stack: error.stack
      });
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
