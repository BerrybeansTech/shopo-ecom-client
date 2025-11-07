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
  logoutUser,
  checkUserExists,
  loginWithPhoneOTP,
  loginWithPhonePassword,
  resetPassword,
  getCustomerProfile
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

  const handleCheckUserExists = useCallback(async (identifier) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await checkUserExists(identifier);
      return { 
        success: response.success, 
        exists: response.isExists,
        data: response 
      };
    } catch (error) {
      console.error('Check user exists error:', error);
      return { 
        success: false, 
        exists: false, 
        error: error.message || 'Unable to verify account' 
      };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleSendOTP = useCallback(async (type, identifier) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await sendOTP(type, identifier);
      if (response.success) {
        dispatch(setOtpData({ type, identifier, otp: response.otp }));
        dispatch(setMessage(response.message || 'OTP sent successfully'));
        return { 
          success: true, 
          data: response,
          otp: response.otp
        };
      } else {
        dispatch(setError(response.message || 'Failed to send OTP'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  const handleVerifyOTP = useCallback(async (type, identifier, otp) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await verifyOTP(type, identifier, otp);
      if (response.success) {
        dispatch(setResetToken(response.resetToken));
        dispatch(setMessage(response.message || 'OTP verified successfully'));
        return { 
          success: true, 
          data: response,
          resetToken: response.resetToken 
        };
      } else {
        dispatch(setError(response.message || 'OTP verification failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

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
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

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
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleLoginWithPhonePassword = useCallback(async (phone, password) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await loginWithPhonePassword(phone, password);
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
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleLoginWithPhoneOTP = useCallback(async (phone, otp) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await loginWithPhoneOTP(phone, otp);
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
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetCustomerProfile = useCallback(async (customerId, token) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await getCustomerProfile(customerId, token);
      if (response.success) {
        return { success: true, data: response };
      } else {
        dispatch(setError(response.message || 'Failed to fetch profile'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

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
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

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
      const errorMsg = error.message || 'Network error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // FIXED: Reset Password Handler
  const handleResetPassword = useCallback(async (phone, newPassword, resetToken) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      console.log("Attempting password reset...", { phone, resetToken });

      const response = await resetPassword(phone, newPassword, resetToken);

      if (response.success) {
        dispatch(setMessage('Password reset successfully'));
        return { success: true, data: response };
      } else {
        let errorMessage = response.message || 'Password reset failed';
        
        if (response.message?.includes('Internal server error')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (response.message?.includes('expired') || response.message?.includes('invalid')) {
          errorMessage = 'Reset token has expired or is invalid. Please request a new password reset.';
        } else if (response.message?.includes('not found')) {
          errorMessage = 'User not found. Please check your phone number.';
        }
        
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Reset password error:", error);
      
      let errorMessage = error.message || 'Network error occurred';
      
      if (error.message?.includes('Server error')) {
        errorMessage = 'Server is temporarily unavailable. Please try again in a few minutes.';
      } else if (error.message?.includes('Network error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }
      
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleLogout = useCallback(async (token = null) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      console.log("Starting logout process...");

      if (token) {
        try {
          await logoutUser(token);
          console.log("Server logout successful");
        } catch (serverError) {
          console.warn("Server logout failed, but continuing with client-side logout:", serverError);
        }
      }

      dispatch(logout());
      
      console.log("Client-side logout successful");
      
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'You have been logged out successfully',
          fromLogout: true
        }
      });

      return { success: true, message: 'Logout successful' };
      
    } catch (error) {
      console.error("Logout error:", error);
      
      dispatch(logout());
      navigate('/login', { replace: true });
      
      return { 
        success: false, 
        error: error.message || 'Logout failed' 
      };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearMessage = useCallback(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return {
    ...authState,
    checkUserExists: handleCheckUserExists,
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    register: handleRegister,
    login: handleLogin,
    loginWithPhonePassword: handleLoginWithPhonePassword,
    loginWithPhoneOTP: handleLoginWithPhoneOTP,
    getCustomerProfile: handleGetCustomerProfile,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
    resetPassword: handleResetPassword,
    logout: handleLogout,
    clearError: handleClearError,
    clearMessage: handleClearMessage,
  };
};

export default useAuth;