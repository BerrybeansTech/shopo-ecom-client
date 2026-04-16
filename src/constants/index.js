// src/constants/index.js

/**
 * API Configuration
 * All API-related constants should be defined here
 */
export const API_CONFIG = {
  // Base URL for API requests
  // Priority: VITE_API_BASE_URL env variable > fallback to production
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://luxcycs.com:5501',

  // Public URL for assets (images, etc.)
  // Priority: VITE_PUBLIC_URL env variable > same as BASE_URL
  PUBLIC_URL: 'http://luxcycs.com',
  ASSET_URL: 'http://luxcycs.com/rabbit-and-finch-uploads',

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Number of retry attempts for failed requests
  RETRY_ATTEMPTS: 3,

  // Cache duration for request deduplication (30 seconds)
  CACHE_DURATION: 30000,

  // Cache cleanup interval (1 minute)
  CACHE_CLEANUP_INTERVAL: 60000,
};

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  // Default delivery days
  DELIVERY_DAYS: 3,

  // Express delivery days
  EXPRESS_DELIVERY_DAYS: 1,

  // Default shipping cost
  DEFAULT_SHIPPING_COST: 7,
};

/**
 * Environment Detection
 */
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// Export BASE_URL for backward compatibility
export const BASE_URL = API_CONFIG.BASE_URL;
export const PUBLIC_URL = API_CONFIG.PUBLIC_URL;
export const ASSET_URL = API_CONFIG.ASSET_URL;

