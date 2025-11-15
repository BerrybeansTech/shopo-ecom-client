// services/wishlistApi.js
import { apiService } from './apiservice';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const response = await apiService.get(`/customer/wishlist/${user.id}`);
    return response;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Update wishlist (add or remove item)
export const updateWishlist = async (productId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const response = await apiService.post('/customer/update-wishlist', {
      userId: user.id,
      productId
    });
    return response;
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
};

// Clear all items from wishlist
export const clearWishlist = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const response = await apiService.delete(`/customer/wishlist/clear/${user.id}`);
    return response;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

