// features/cart/cartApi.js
import { apiService } from "../../services/apiservice";

export const cartApi = {
  // Get all cart items
  getAllItems: async () => {
    return await apiService.get('/customer/cart/get-all-items');
  },

  // Add item to cart
  addToCart: async (cartData) => {
    return await apiService.post('/customer/cart/add-to-cart', cartData);
  },

  // Update cart item quantity
  updateItem: async (itemId, updateData) => {
    return await apiService.put(`/customer/cart/update-items/${itemId}`, updateData);
  },

  // Delete specific cart item
  deleteItem: async (itemId) => {
    return await apiService.delete(`/customer/cart/delete-items/${itemId}`);
  },

  // Clear entire cart
  clearCart: async (cartId) => {
    return await apiService.delete(`/customer/cart/clear-cart/${cartId}`);
  }
};