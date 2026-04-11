// services/wishlistApi.js
import { apiService } from './apiservice';
import { storage } from '../utils/storage';

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
    const user = storage.getUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const cacheKey = `/customer/wishlist/${user.id}`;

    // Explicitly bypass apiService's internal deduplication cache if forceRefresh is true
    if (forceRefresh) {
      apiService.clearCacheForKey(cacheKey);
    }

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      return wishlistCache.data;
    }

    const response = await apiService.get(cacheKey, { 
      skipDeduplication: forceRefresh 
    });
    
    // Normalize IDs to strings for consistent comparison across types
    if (response && response.wishList) {
      response.wishList = response.wishList.map(String);
    }
    
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
    const user = storage.getUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    // Normalize productId to string
    const productIdStr = String(productId);

    // Clear GET cache before mutation to avoid any race conditions
    apiService.clearCacheForKey(`/customer/wishlist/${user.id}`);

    // Use skipDeduplication to ensure toggle always hits server even if clicked rapidly
    const response = await apiService.post('/customer/update-wishlist', {
      userId: user.id,
      productId: productIdStr
    }, { skipDeduplication: true });
    
    // Normalize IDs in response
    if (response && response.wishList) {
      response.wishList = response.wishList.map(String);
    }

    // Clear apiService's internal GET cache for this user's wishlist since it has changed
    apiService.clearCacheForKey(`/customer/wishlist/${user.id}`);

    // Update internal cache with new data
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
    const user = storage.getUser();
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const response = await apiService.delete(`/customer/wishlist/clear/${user.id}`, { 
      skipDeduplication: true 
    });
    
    // Clear and reset cache
    apiService.clearCacheForKey(`/customer/wishlist/${user.id}`);
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