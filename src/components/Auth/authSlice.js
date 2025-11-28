import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      otpData: null,
      resetToken: null,
      message: null,
    };
  }

  const storedToken = storage.getToken();
  const storedUser = storage.getUser();
  
  return {
    user: storedUser || null,
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearMessage: (state) => {
      state.message = null;
    },
    
    setOtpData: (state, action) => {
      state.otpData = action.payload;
    },
    
    setResetToken: (state, action) => {
      state.resetToken = action.payload;
    },
    
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message || 'Login successful';
      
      storage.setToken(action.payload.accessToken);
      storage.setUser(action.payload.user);
    },
    
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.message = action.payload.message || 'Registration successful';
      
      storage.setToken(action.payload.accessToken);
      storage.setUser(action.payload.user);
    },
    
    logout: (state) => {
      if (import.meta.env.DEV) {
        console.log("Clearing auth state...");
      }
      
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.otpData = null;
      state.resetToken = null;
      state.error = null;
      state.message = 'Logged out successfully';
      state.loading = false;
      
      storage.clearAuth();
    },
    
    updateUserSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.message = 'Profile updated successfully';
      
      storage.setUser(state.user);
    },
    
    setMessage: (state, action) => {
      state.message = action.payload;
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
} = authSlice.actions;

export default authSlice.reducer;