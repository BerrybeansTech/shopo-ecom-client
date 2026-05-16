// src/constants/index.js

/**
 * Single API base URL — controlled entirely from .env file
 * 
 * To switch environments, just change VITE_API_BASE_URL in .env:
 *   Local:      VITE_API_BASE_URL=http://localhost:5000
 *   Production: VITE_API_BASE_URL=https://api.rabbitnfinch.com
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * API Configuration
 * All API-related constants should be defined here
 */
export const API_CONFIG = {
  // Base URL for API requests (from .env only)
  BASE_URL: API_BASE,

  // Public URL for assets (images, etc.)
  PUBLIC_URL: API_BASE,
  ASSET_URL: `${API_BASE}/rabbit-and-finch-uploads`,

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

// Export for backward compatibility
export const BASE_URL = API_CONFIG.BASE_URL;
export const PUBLIC_URL = API_CONFIG.PUBLIC_URL;
export const ASSET_URL = API_CONFIG.ASSET_URL;

