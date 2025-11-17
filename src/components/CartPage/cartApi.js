// src/features/cart/cartApi.js
import { apiService } from "../../services/apiservice";

export const cartApi = {
  // Get all cart items
  getAllItems: async () => {
    return await apiService.get('/customer/cart/get-all-items');
  },

  // Add item to cart
  addToCart: async (cartData) => {
    const response = await apiService.post('/customer/cart/add-to-cart', cartData);
    // Invalidate cart GET cache after mutation
    apiService.clearCacheForKey('GET-/customer/cart/get-all-items');
    return response;
  },

  // Update cart item quantity
  updateItem: async (itemId, updateData) => {
    const response = await apiService.put(`/customer/cart/update-items/${itemId}`, updateData);
    // Invalidate cart GET cache after mutation
    apiService.clearCacheForKey('GET-/customer/cart/get-all-items');
    return response;
  },

  // Delete specific cart item
  deleteItem: async (itemId) => {
    const response = await apiService.delete(`/customer/cart/delete-items/${itemId}`);
    // Invalidate cart GET cache after mutation
    apiService.clearCacheForKey('GET-/customer/cart/get-all-items');
    return response;
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      // First, get cart items to find cartId
      const cartItems = await apiService.get('/customer/cart/get-all-items');
      
      // If we have items, get cartId from first item, otherwise use default
      let cartId = 1;
      
      if (cartItems.data && cartItems.data.length > 0) {
        cartId = cartItems.data[0].cartId || 1;
      }
      
      const response = await apiService.delete(`/customer/cart/clear-cart/${cartId}`);
      // Invalidate cart GET cache after mutation
      apiService.clearCacheForKey('GET-/customer/cart/get-all-items');
      return response;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Alternative: Clear cart by deleting all items individually
  clearCartByItems: async () => {
    try {
      const cartItems = await apiService.get('/customer/cart/get-all-items');
      
      if (cartItems.data && cartItems.data.length > 0) {
        // Delete all items one by one
        const deletePromises = cartItems.data.map(item => 
          apiService.delete(`/customer/cart/delete-items/${item.id}`)
        );
        
        await Promise.all(deletePromises);
        // Invalidate cart GET cache after mutation
        apiService.clearCacheForKey('GET-/customer/cart/get-all-items');
        return { success: true, message: 'Cart cleared successfully' };
      }
      
      return { success: true, message: 'Cart is already empty' };
    } catch (error) {
      console.error('Error clearing cart items:', error);
      throw error;
    }
  }
};