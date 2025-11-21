// services/wishlistApi.js
import { apiService } from './apiservice';

// Wishlist event emitter for cross-component synchronization
class WishlistEventEmitter {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(wishlistData) {
    this.listeners.forEach(callback => callback(wishlistData));
  }
}

export const wishlistEvents = new WishlistEventEmitter();

// In-memory cache for wishlist
let wishlistCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5000 // 5 seconds
};

const isCacheValid = () => {
  if (!wishlistCache.data || !wishlistCache.timestamp) return false;
  return Date.now() - wishlistCache.timestamp < wishlistCache.CACHE_DURATION;
};

// Get user's wishlist
export const getWishlist = async (forceRefresh = false) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      return wishlistCache.data;
    }

    const response = await apiService.get(`/customer/wishlist/${user.id}`);
    
    // Update cache
    wishlistCache.data = response;
    wishlistCache.timestamp = Date.now();
    
    // Emit event to notify all listeners
    wishlistEvents.emit(response);
    
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
    
    // Update cache with new data
    wishlistCache.data = response;
    wishlistCache.timestamp = Date.now();
    
    // Emit event to notify all listeners of the change
    wishlistEvents.emit(response);
    
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
    
    // Clear cache
    wishlistCache.data = { wishList: [] };
    wishlistCache.timestamp = Date.now();
    
    // Emit event to notify all listeners
    wishlistEvents.emit({ wishList: [] });
    
    return response;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

// Check if product is in wishlist
export const isProductInWishlist = async (productId) => {
  try {
    const wishlist = await getWishlist();
    return wishlist.wishList?.includes(productId) || false;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

// Clear wishlist cache
export const clearWishlistCache = () => {
  wishlistCache.data = null;
  wishlistCache.timestamp = null;
};