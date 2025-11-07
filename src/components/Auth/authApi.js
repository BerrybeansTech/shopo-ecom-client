// src/components/Auth/authApi.js
import { apiService } from '../../services/apiservice';

// OTP type constants
export const OTP_TYPES = {
  CUSTOMER_REGISTRATION: 'customer-registration',
  PASSWORD_RESET: 'password-reset',
  CUSTOMER_LOGIN: 'customer-login',
};

// Check if user exists
export const checkUserExists = async (identifier) => {
  try {
    // Check if identifier is email or phone
    if (identifier.includes('@')) {
      return await apiService.apiCall(`/customer/check-exists?email=${encodeURIComponent(identifier)}`, {
        method: 'GET',
      });
    } else {
      // Remove +91 if present for API call
      const phone = identifier.replace('+91', '');
      return await apiService.apiCall(`/customer/check-exists?phone=${phone}`, {
        method: 'GET',
      });
    }
  } catch (error) {
    console.error('Check user exists API error:', error);
    throw error;
  }
};

// Send OTP
export const sendOTP = async (type, identifier) => {
  try {
    const cleanIdentifier = identifier.replace('+91', '');
    console.log('Sending OTP:', { type, identifier: cleanIdentifier });
    
    const response = await apiService.apiCall('/otp/send', {
      method: 'POST',
      body: { type, identifier: cleanIdentifier },
    });
    
    console.log('Send OTP response:', response);
    return response;
  } catch (error) {
    console.error('Send OTP API error:', error);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (type, identifier, otp) => {
  try {
    const cleanIdentifier = identifier.replace('+91', '');
    console.log('Verifying OTP:', { type, identifier: cleanIdentifier, otp });
    
    const response = await apiService.apiCall('/otp/verify', {
      method: 'POST',
      body: { type, identifier: cleanIdentifier, otp },
    });
    
    console.log('Verify OTP response:', response);
    return response;
  } catch (error) {
    console.error('Verify OTP API error:', error);
    throw error;
  }
};

// Register Customer
export const registerCustomer = async (customerData) => {
  try {
    console.log('Registering customer:', customerData);
    const response = await apiService.apiCall('/customer/create-customer', {
      method: 'POST',
      body: customerData,
    });
    
    console.log('Register customer response:', response);
    return response;
  } catch (error) {
    console.error('Register customer API error:', error);
    throw error;
  }
};

// Login Customer with Email
export const loginCustomer = async (credentials) => {
  try {
    console.log('Logging in customer:', { email: credentials.email });
    const response = await apiService.apiCall('/customer/login', {
      method: 'POST',
      body: credentials,
    });
    
    console.log('Login customer response:', response);
    return response;
  } catch (error) {
    console.error('Login customer API error:', error);
    throw error;
  }
};

// Login with Phone and Password
export const loginWithPhonePassword = async (phone, password) => {
  try {
    const cleanPhone = phone.replace('+91', '');
    console.log('Logging in with phone:', { phone: cleanPhone });
    
    const response = await apiService.apiCall('/customer/login', {
      method: 'POST',
      body: { phone: cleanPhone, password },
    });
    
    console.log('Login with phone response:', response);
    return response;
  } catch (error) {
    console.error('Login with phone API error:', error);
    throw error;
  }
};

// Login with Phone and OTP
export const loginWithPhoneOTP = async (phone, otp) => {
  try {
    const cleanPhone = phone.replace('+91', '');
    console.log('Logging in with phone OTP:', { phone: cleanPhone, otp });
    
    const response = await apiService.apiCall('/customer/login-with-otp', {
      method: 'POST',
      body: { phone: cleanPhone, otp },
    });
    
    console.log('Login with phone OTP response:', response);
    return response;
  } catch (error) {
    console.error('Login with phone OTP API error:', error);
    throw error;
  }
};

// Get Customer Profile
export const getCustomerProfile = async (customerId, token) => {
  try {
    const response = await apiService.apiCall(`/customer/get-customer/${customerId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error('Get customer profile API error:', error);
    throw error;
  }
};

// Update Customer Profile
export const updateCustomerProfile = async (customerData, token) => {
  try {
    const response = await apiService.apiCall('/customer/update-customer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: customerData,
    });
    return response;
  } catch (error) {
    console.error('Update customer profile API error:', error);
    throw error;
  }
};

// Update Password
export const updatePassword = async (userData, newPassword, token) => {
  try {
    const updatedData = { ...userData, password: newPassword };
    const response = await apiService.apiCall('/customer/update-customer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: updatedData,
    });
    return response;
  } catch (error) {
    console.error('Update password API error:', error);
    throw error;
  }
};

// Reset Password
export const resetPassword = async (identifier, newPassword, resetToken) => {
  try {
    const cleanIdentifier = identifier.replace('+91', '');
    console.log('Resetting password:', { 
      identifier: cleanIdentifier, 
      resetToken,
      passwordLength: newPassword.length 
    });
    
    const requestBody = {
      identifier: cleanIdentifier,
      newPassword: newPassword,
      resetToken: resetToken
    };

    console.log('Reset password request body:', requestBody);
    
    const response = await apiService.apiCall('/customer/reset-password', {
      method: 'POST',
      body: requestBody,
    });
    
    console.log('Reset password response:', response);
    return response;
  } catch (error) {
    console.error('Reset password API error:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
      throw new Error('Server error. Please try again later.');
    } else if (error.message?.includes('Network Error')) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw error;
    }
  }
};

// Update password using profile update (fallback method)
export const updatePasswordViaProfile = async (identifier, newPassword, token) => {
  try {
    const cleanIdentifier = identifier.replace('+91', '');
    console.log('Updating password via profile:', { identifier: cleanIdentifier });
    
    // First get current user data
    const userResponse = await apiService.apiCall('/customer/get-customer-by-phone', {
      method: 'POST',
      body: { phone: cleanIdentifier },
    });
    
    if (!userResponse.success) {
      throw new Error('User not found');
    }
    
    // Update user with new password
    const updateData = {
      ...userResponse.data,
      password: newPassword
    };
    
    const response = await apiService.apiCall('/customer/update-customer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: updateData,
    });
    
    console.log('Update password via profile response:', response);
    return response;
  } catch (error) {
    console.error('Update password via profile error:', error);
    throw error;
  }
};

//  Logout User (optional API call)
export const logoutUser = async (token) => {
  try {
    const response = await apiService.apiCall('/customer/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
};