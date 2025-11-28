// src/utils/storage.js

/**
 * Centralized Storage Utility
 * Provides a safe, consistent interface for localStorage operations
 * with error handling, type safety, and SSR support
 */

class Storage {
  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  static isAvailable() {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Parsed value or default
   */
  static get(key, defaultValue = null) {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch (e) {
        // If parsing fails, return as string
        return item;
      }
    } catch (error) {
      console.error(`Error reading "${key}" from storage:`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be stringified)
   * @returns {boolean} Success status
   */
  static set(key, value) {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error writing "${key}" to storage:`, error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('Storage quota exceeded. Attempting to clear old data...');
        // Could implement cleanup logic here
      }
      
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  static remove(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing "${key}" from storage:`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   * @returns {boolean} Success status
   */
  static clear() {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get multiple items at once
   * @param {string[]} keys - Array of keys
   * @returns {Object} Object with key-value pairs
   */
  static getMultiple(keys) {
    const result = {};
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    return result;
  }

  /**
   * Set multiple items at once
   * @param {Object} items - Object with key-value pairs
   * @returns {boolean} Success status (true if all succeeded)
   */
  static setMultiple(items) {
    let allSuccess = true;
    Object.entries(items).forEach(([key, value]) => {
      if (!this.set(key, value)) {
        allSuccess = false;
      }
    });
    return allSuccess;
  }

  /**
   * Remove multiple items at once
   * @param {string[]} keys - Array of keys to remove
   * @returns {boolean} Success status (true if all succeeded)
   */
  static removeMultiple(keys) {
    let allSuccess = true;
    keys.forEach(key => {
      if (!this.remove(key)) {
        allSuccess = false;
      }
    });
    return allSuccess;
  }

  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  static has(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking "${key}" in storage:`, error);
      return false;
    }
  }

  /**
   * Get all keys from localStorage
   * @returns {string[]} Array of keys
   */
  static getAllKeys() {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      return [];
    }
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Convenience methods for common operations
export const storage = {
  // Auth-related
  getToken: () => Storage.get(STORAGE_KEYS.ACCESS_TOKEN),
  setToken: (token) => Storage.set(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeToken: () => Storage.remove(STORAGE_KEYS.ACCESS_TOKEN),
  
  // User-related
  getUser: () => Storage.get(STORAGE_KEYS.USER),
  setUser: (user) => Storage.set(STORAGE_KEYS.USER, user),
  removeUser: () => Storage.remove(STORAGE_KEYS.USER),
  
  // Auth helpers
  clearAuth: () => {
    Storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    Storage.remove(STORAGE_KEYS.USER);
  },
  
  isAuthenticated: () => {
    return Storage.has(STORAGE_KEYS.ACCESS_TOKEN);
  },
  
  // Generic methods
  get: Storage.get.bind(Storage),
  set: Storage.set.bind(Storage),
  remove: Storage.remove.bind(Storage),
  clear: Storage.clear.bind(Storage),
  has: Storage.has.bind(Storage),
  getAllKeys: Storage.getAllKeys.bind(Storage),
  getMultiple: Storage.getMultiple.bind(Storage),
  setMultiple: Storage.setMultiple.bind(Storage),
  removeMultiple: Storage.removeMultiple.bind(Storage),
};

export default Storage;

