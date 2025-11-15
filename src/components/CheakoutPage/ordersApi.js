// src/features/order/ordersApi.js
import { apiService } from "../../services/apiservice";

export const ordersApi = {
  // Get all orders with filters
  getAllOrders: async (filters = {}) => {
    const { status, page = 1, limit = 10 } = filters;
    let url = '/order/get-all-orders';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await apiService.get(url);
  },

  // Get customer's orders
  getCustomerOrders: async (customerId, filters = {}) => {
    const { status, page = 1, limit = 10 } = filters;
    let url = `/order/get-customer-order/${customerId}`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await apiService.get(url);
  },

  // Get specific order by ID
  getOrderById: async (orderId) => {
    return await apiService.get(`/order/get-order/${orderId}`);
  },

  // Create new order
  createOrder: async (orderData) => {
    return await apiService.post('/order/create-order', orderData);
  },

 // Cancel order using update-order endpoint
  cancelOrder: async (orderId) => {
    const cancelData = {
      id: orderId,
      status: "cancelled"
    };
    return await apiService.put('/order/update-order', cancelData);
  },

  // Track order
  trackOrder: async (orderId) => {
    return await apiService.get(`/order/track-order/${orderId}`);
  }
};