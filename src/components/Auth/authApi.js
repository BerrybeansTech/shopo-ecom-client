// src/components/Auth/authApi.js
import { apiService } from '../../services/apiservice';

// OTP type constants
export const OTP_TYPES = {
  CUSTOMER_REGISTRATION: 'customer-registration',
  PASSWORD_RESET: 'password-reset',
};

// ✅ Send OTP
export const sendOTP = async (type, identifier) => {
  return apiService.apiCall('/otp/send', {
    method: 'POST',
    body: { type, identifier },
  });
};

// ✅ Verify OTP
export const verifyOTP = async (type, identifier, otp) => {
  return apiService.apiCall('/otp/verify', {
    method: 'POST',
    body: { type, identifier, otp },
  });
};

// ✅ Register Customer
export const registerCustomer = async (customerData) => {
  return apiService.apiCall('/customer/create-customer', {
    method: 'POST',
    body: customerData,
  });
};

// ✅ Login Customer
export const loginCustomer = async (credentials) => {
  return apiService.apiCall('/customer/login', {
    method: 'POST',
    body: credentials,
  });
};

// ✅ Get Customer Profile
export const getCustomerProfile = async (customerId, token) => {
  return apiService.apiCall(`/customer/get-customer/${customerId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Update Customer Profile
export const updateCustomerProfile = async (customerData, token) => {
  return apiService.apiCall('/customer/update-customer', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: customerData,
  });
};

// ✅ Update Password
export const updatePassword = async (userData, newPassword, token) => {
  const updatedData = { ...userData, password: newPassword };

  return apiService.apiCall('/customer/update-customer', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: updatedData,
  });
};

// ✅ Logout User (optional API call)
export const logoutUser = async (token) => {
  return apiService.apiCall('/customer/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};
