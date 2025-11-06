// src/components/Auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial state from localStorage
const getInitialState = () => {
  const storedToken = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('user');
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
    otpData: null,
    resetToken: null,
    message: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error message
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear message
    clearMessage: (state) => {
      state.message = null;
    },
    
    // Set OTP data
    setOtpData: (state, action) => {
      state.otpData = action.payload;
    },
    
    // Set reset token
    setResetToken: (state, action) => {
      state.resetToken = action.payload;
    },
    
    // Login success
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message || 'Login successful';
      
      // Store in localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    
    // Registration success
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message || 'Registration successful';
      
      // Store in localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    
    // Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.otpData = null;
      state.resetToken = null;
      state.error = null;
      state.message = 'Logged out successfully';
      state.loading = false;
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    
    // Update user profile
    updateUserSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.message = 'Profile updated successfully';
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    
    // Set message
    setMessage: (state, action) => {
      state.message = action.payload;
    },

    // Refresh token (if needed)
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  clearMessage,
  setOtpData,
  setResetToken,
  loginSuccess,
  registerSuccess,
  logout,
  updateUserSuccess,
  setMessage,
  refreshToken,
} = authSlice.actions;

export default authSlice.reducer;