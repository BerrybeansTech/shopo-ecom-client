import { apiService } from '../../services/apiservice';

export const OTP_TYPES = {
  CUSTOMER_REGISTRATION: 'customer-registration',
  PASSWORD_RESET: 'reset-password',
  CUSTOMER_LOGIN: 'customer-login',
};

export const checkUserExists = async (identifier) => {
  try {
    if (identifier.includes('@')) {
      return await apiService.apiCall(`/customer/check-exists?email=${encodeURIComponent(identifier)}`, {
        method: 'GET',
      });
    } else {
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


// Update the updateCustomerProfile function
export const updateCustomerProfile = async (customerData, token) => {
  try {
    console.log('Updating customer profile:', customerData);
    
    // FIXED: Use the correct endpoint from your Postman
    const response = await apiService.apiCall('/customer/update-customer', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: customerData,
    });
    
    console.log('Update customer profile response:', response);
    return response;
  } catch (error) {
    console.error('Update customer profile API error:', error);
    throw error;
  }
};

export const updatePassword = async (userData, newPassword, token) => {
  try {
    const updatedData = { ...userData, password: newPassword };
    const response = await apiService.apiCall('/customer/update-customer', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: updatedData,
    });
    return response;
  } catch (error) {
    console.error('Update password API error:', error);
    throw error;
  }
};

// FIXED: Reset Password API call
export const resetPassword = async (phone, newPassword, resetToken) => {
  try {
    const cleanPhone = phone.replace('+91', '');
    console.log('Resetting password:', { 
      phone: cleanPhone, 
      resetToken,
      passwordLength: newPassword.length 
    });
    
    const requestBody = {
      phone: cleanPhone,
      newPassword: newPassword,
      otpToken: resetToken
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
    
    if (error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
      throw new Error('Server error. Please try again later.');
    } else if (error.message?.includes('Network Error')) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw error;
    }
  }
};

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