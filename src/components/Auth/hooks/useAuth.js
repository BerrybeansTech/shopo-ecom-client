// src/components/Auth/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  sendOTP, 
  verifyOTP, 
  registerCustomer, 
  loginCustomer, 
  updateCustomerProfile,
  updatePassword,
  logoutUser
} from '../authApi';

import {
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
} from '../authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  // ✅ Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // ✅ Clear message
  const handleClearMessage = useCallback(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  // ✅ Send OTP
  const handleSendOTP = useCallback(async (type, identifier) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await sendOTP(type, identifier);
      if (response.success) {
        dispatch(setOtpData({ type, identifier, otp: response.otp }));
        dispatch(setMessage(response.message || 'OTP sent successfully'));
        return { success: true, data: response };
      } else {
        dispatch(setError(response.message || 'Failed to send OTP'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Network error occurred';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Verify OTP
  const handleVerifyOTP = useCallback(async (type, identifier, otp) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await verifyOTP(type, identifier, otp);
      if (response.success) {
        dispatch(setResetToken(response.resetToken));
        dispatch(setMessage(response.message || 'OTP verified successfully'));
        return { success: true, data: response };
      } else {
        dispatch(setError(response.message || 'OTP verification failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Network error occurred';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Register Customer
  const handleRegister = useCallback(async (customerData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await registerCustomer(customerData);
      if (response.success) {
        dispatch(registerSuccess({
          user: response.data.customer,
          accessToken: response.data.accessToken,
          message: response.message,
        }));
        return { success: true, data: response };
      } else {
        dispatch(setError(response.message || 'Registration failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Network error occurred';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Login Customer
  const handleLogin = useCallback(async (email, password) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await loginCustomer({ email, password });
      if (response.success) {
        dispatch(loginSuccess({
          user: response.user,
          accessToken: response.accessToken,
          message: response.message,
        }));
        return { success: true, data: response };
      } else {
        dispatch(setError(response.message || 'Login failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Network error occurred';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Update Customer Profile
  const handleUpdateProfile = useCallback(async (customerData, token) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await updateCustomerProfile(customerData, token);
      if (response.success) {
        dispatch(updateUserSuccess(customerData));
        dispatch(setMessage(response.message || 'Profile updated successfully'));
        return { success: true, data: response };
      } else {
        dispatch(setError(response.message || 'Update failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Network error occurred';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Update Password
  const handleUpdatePassword = useCallback(async (userData, newPassword, token) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await updatePassword(userData, newPassword, token);
      if (response.success) {
        dispatch(setMessage('Password updated successfully'));
        return { success: true, data: response };
      } else {
        dispatch(setError(response.message || 'Password update failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Network error occurred';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ✅ Logout (API + Redux clear + Navigation)
  const handleLogout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      
      // Get token from state or localStorage
      const token = authState.accessToken || localStorage.getItem('accessToken');
      
      // Optional: Call server logout if token exists
      if (token) {
        try {
          await logoutUser(token);
        } catch (error) {
          console.warn('Server logout failed, but clearing local state:', error);
          // Continue with local logout even if server call fails
        }
      }
      
      // Clear Redux state
      dispatch(logout());
      
      // Navigate to login page
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local state and redirect
      dispatch(logout());
      navigate('/login', { replace: true });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate, authState.accessToken]);

  // ✅ Check Authentication Status
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // If user is in Redux state, no need to update
      if (!authState.isAuthenticated) {
        dispatch(loginSuccess({
          user: JSON.parse(user),
          accessToken: token,
          message: 'Welcome back!'
        }));
      }
      return true;
    }
    return false;
  }, [dispatch, authState.isAuthenticated]);

  // ✅ Get Current User
  const getCurrentUser = useCallback(() => {
    return authState.user || JSON.parse(localStorage.getItem('user') || 'null');
  }, [authState.user]);

  // ✅ Get Access Token
  const getAccessToken = useCallback(() => {
    return authState.accessToken || localStorage.getItem('accessToken');
  }, [authState.accessToken]);

  // ✅ Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return authState.isAuthenticated && !!getAccessToken();
  }, [authState.isAuthenticated, getAccessToken]);

  // ✅ Return all states + actions
  return {
    // State
    user: authState.user,
    accessToken: authState.accessToken,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    otpData: authState.otpData,
    resetToken: authState.resetToken,
    message: authState.message,

    // Actions
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    register: handleRegister,
    login: handleLogin,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
    logout: handleLogout,
    clearError: handleClearError,
    clearMessage: handleClearMessage,
    
    // Utility functions
    checkAuthStatus,
    getCurrentUser,
    getAccessToken,
    isAuthenticated: isAuthenticated(),
  };
};

export default useAuth;