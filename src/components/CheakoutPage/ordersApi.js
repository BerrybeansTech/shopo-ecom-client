// features/order/ordersApi.js
import { apiService } from "../../services/apiservice";

export const ordersApi = {
  // Get all orders (admin)
  getAllOrders: async () => {
    return await apiService.get('/order/get-all-orders');
  },

  // Get specific order by ID
  getOrderById: async (orderId) => {
    return await apiService.get(`/order/get-order/${orderId}`);
  },

  // Get customer's orders
  getCustomerOrders: async (customerId) => {
    return await apiService.get(`/order/get-customer-order/${customerId}`);
  },

  // Create new order
  createOrder: async (orderData) => {
    return await apiService.post('/order/create-order', orderData);
  },

  // Update order
  updateOrder: async (orderData) => {
    return await apiService.put('/order/update-order', orderData);
  },

  // Invoice APIs
  // Get all invoices
  getAllInvoices: async () => {
    return await apiService.get('/order/invoices');
  },

  // Get specific invoice by ID
  getInvoiceById: async (invoiceId) => {
    return await apiService.get(`/order/invoices/${invoiceId}`);
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    return await apiService.post('/order/invoices', invoiceData);
  },

  // Update invoice
  updateInvoice: async (invoiceId, invoiceData) => {
    return await apiService.put(`/order/invoices/${invoiceId}`, invoiceData);
  },

  // Delete invoice
  deleteInvoice: async (invoiceId) => {
    return await apiService.delete(`/order/invoices/${invoiceId}`);
  },

  // View invoice PDF
  viewInvoice: async (filename) => {
    return await apiService.get(`/order/invoices/view/${filename}`);
  },

  // Download invoice PDF
  downloadInvoice: async (filename) => {
    return await apiService.get(`/order/invoices/download/${filename}`);
  }
};
