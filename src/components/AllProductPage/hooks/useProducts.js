import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCategories, 
  setSizes, 
  setColors, 
  setOccasions, 
  setMaterials,
  setLoading,
  setError,
  setSelectedFilters 
} from '../productSlice';
import { productDataApi, productUtils, categoryApi, reviewApi } from '../productApi';

// Global cache with enhanced error handling
const globalCache = {
  categories: null,
  sizes: null,
  colors: null,
  occasions: null,
  materials: null,
  lastFetched: null,
  error: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

let globalFetchPromise = null;

export const useProducts = () => {
  const dispatch = useDispatch();
  const productState = useSelector(state => state.product);
  
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    if (!globalCache.lastFetched || globalCache.error) return false;
    return Date.now() - globalCache.lastFetched < globalCache.CACHE_DURATION;
  }, []);

  // Get data from cache or Redux store
  const getCachedData = useCallback((key) => {
    if (globalCache[key] && isCacheValid() && !globalCache.error) {
      return globalCache[key];
    }
    return productState[key];
  }, [isCacheValid, productState]);

  const fetchAllProductData = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate requests
    if (isFetchingRef.current && !forceRefresh) {
      return globalFetchPromise;
    }

    // Return cached data if valid and not forcing refresh
    if (isCacheValid() && !forceRefresh && globalCache.categories) {
      if (!hasFetchedRef.current) {
        dispatch(setCategories(globalCache.categories));
        dispatch(setSizes(globalCache.sizes));
        dispatch(setColors(globalCache.colors));
        dispatch(setOccasions(globalCache.occasions));
        dispatch(setMaterials(globalCache.materials));
        hasFetchedRef.current = true;
      }
      return globalCache;
    }

    // Use global promise to prevent duplicate requests
    if (globalFetchPromise && !forceRefresh) {
      return globalFetchPromise;
    }

    try {
      isFetchingRef.current = true;
      dispatch(setLoading(true));
      setLocalLoading(true);
      setLocalError(null);
      globalCache.error = null;

      // Create global promise
      globalFetchPromise = (async () => {
        const productData = await productDataApi.getAll();

        // Update cache
        globalCache.categories = productData.categories || [];
        globalCache.sizes = productData.sizes || [];
        globalCache.colors = productData.colors || [];
        globalCache.occasions = productData.occasions || [];
        globalCache.materials = productData.materials || [];
        globalCache.lastFetched = Date.now();
        globalCache.error = null;

        // Update Redux store
        dispatch(setCategories(globalCache.categories));
        dispatch(setSizes(globalCache.sizes));
        dispatch(setColors(globalCache.colors));
        dispatch(setOccasions(globalCache.occasions));
        dispatch(setMaterials(globalCache.materials));
        
        hasFetchedRef.current = true;
        retryCountRef.current = 0;
        
        return productData;
      })();

      const result = await globalFetchPromise;
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product data';
      
      // Update cache with error
      globalCache.error = errorMessage;
      globalCache.lastFetched = Date.now(); // Still update timestamp to prevent immediate retry
      
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      
      // Retry logic
      if (retryCountRef.current < maxRetries && errorMessage.includes('Unable to connect')) {
        retryCountRef.current++;
        console.warn(`Retrying product data fetch (${retryCountRef.current}/${maxRetries})`);
        setTimeout(() => fetchAllProductData(true), 2000 * retryCountRef.current);
      }
      
      throw error;
    } finally {
      dispatch(setLoading(false));
      setLocalLoading(false);
      isFetchingRef.current = false;
      globalFetchPromise = null;
    }
  }, [dispatch, isCacheValid]);

  const fetchCategoriesOnly = useCallback(async (forceRefresh = false) => {
    const cachedCategories = getCachedData('categories');
    if (cachedCategories && cachedCategories.length > 0 && !forceRefresh) {
      return cachedCategories;
    }

    if ((productState.loading || isFetchingRef.current) && !forceRefresh) return;
    
    try {
      isFetchingRef.current = true;
      dispatch(setLoading(true));
      const response = await categoryApi.getAll();
      const cats = response?.data || response || [];
      
      // Update cache
      globalCache.categories = cats;
      globalCache.lastFetched = Date.now();
      globalCache.error = null;
      
      dispatch(setCategories(cats));
      return cats;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch categories';
      globalCache.error = msg;
      dispatch(setError(msg));
      setLocalError(msg);
      throw err;
    } finally {
      isFetchingRef.current = false;
      dispatch(setLoading(false));
    }
  }, [dispatch, getCachedData, productState.loading]);

  // Initialize data on mount with proper error handling
  useEffect(() => {
    const initializeData = async () => {
      // Only fetch if we don't have valid data and aren't already fetching
      if (
        !hasFetchedRef.current && 
        !isFetchingRef.current &&
        (!isCacheValid() || globalCache.error) &&
        (!productState.categories || productState.categories.length === 0)
      ) {
        try {
          await fetchAllProductData();
        } catch (error) {
          console.error('Failed to initialize product data:', error);
          // Error is already handled in fetchAllProductData
        }
      }
    };

    initializeData();
  }, [fetchAllProductData, productState.categories, isCacheValid]);

  // Review functions
  const createReview = useCallback(async (reviewData) => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      const response = await reviewApi.create(reviewData);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create review';
      setLocalError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, []);

  const getProductReviews = useCallback(async (productId) => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      const response = await reviewApi.getByProduct(productId);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch reviews';
      setLocalError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId) => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      const response = await reviewApi.delete(reviewId);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete review';
      setLocalError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Get unique sizes by type
  const getUniqueSizesByType = useCallback(() => {
    const sizes = getCachedData('sizes') || productState.sizes;
    return productUtils.getUniqueSizesByType(sizes);
  }, [getCachedData, productState.sizes]);

  // Get unique colors
  const getUniqueColors = useCallback(() => {
    const colors = getCachedData('colors') || productState.colors;
    return productUtils.getUniqueColors(colors);
  }, [getCachedData, productState.colors]);

  // Get flattened categories
  const getFlattenedCategories = useCallback(() => {
    const categories = getCachedData('categories') || productState.categories;
    return productUtils.flattenCategories(categories);
  }, [getCachedData, productState.categories]);

  // Update selected filters
  const updateSelectedFilters = useCallback((newFilters) => {
    dispatch(setSelectedFilters(newFilters));
  }, [dispatch]);

  // Get category by ID
  const getCategoryById = useCallback((id) => {
    const categories = getCachedData('categories') || productState.categories;
    return categories.find(cat => cat.id === id);
  }, [getCachedData, productState.categories]);

  // Get size by ID
  const getSizeById = useCallback((id) => {
    const sizes = getCachedData('sizes') || productState.sizes;
    return sizes.find(size => size.id === id);
  }, [getCachedData, productState.sizes]);

  // Get color by ID
  const getColorById = useCallback((id) => {
    const colors = getCachedData('colors') || productState.colors;
    return colors.find(color => color.id === id);
  }, [getCachedData, productState.colors]);

  // Get occasion by ID
  const getOccasionById = useCallback((id) => {
    const occasions = getCachedData('occasions') || productState.occasions;
    return occasions.find(occasion => occasion.id === id);
  }, [getCachedData, productState.occasions]);

  // Get material by ID
  const getMaterialById = useCallback((id) => {
    const materials = getCachedData('materials') || productState.materials;
    return materials.find(material => material.id === id);
  }, [getCachedData, productState.materials]);

  // Get data from cache or Redux store for components
  const categories = getCachedData('categories') || productState.categories;
  const sizes = getCachedData('sizes') || productState.sizes;
  const colors = getCachedData('colors') || productState.colors;
  const occasions = getCachedData('occasions') || productState.occasions;
  const materials = getCachedData('materials') || productState.materials;

  return {
    // State (prioritize cached data)
    categories,
    sizes,
    colors,
    occasions,
    materials,
    selectedFilters: productState.selectedFilters,
    loading: productState.loading || localLoading,
    error: productState.error || localError,
    hasCategories: categories && categories.length > 0,

    // Actions
    fetchAllProductData,
    fetchCategoriesOnly,
    updateSelectedFilters,
    
    // Review Actions
    createReview,
    getProductReviews,
    deleteReview,
    
    // Utility functions
    getUniqueSizesByType,
    getUniqueColors,
    getFlattenedCategories,
    getCategoryById,
    getSizeById,
    getColorById,
    getOccasionById,
    getMaterialById,

    // Data transformation helpers
    groupedSizes: getUniqueSizesByType(),
    uniqueColors: getUniqueColors(),
    flattenedCategories: getFlattenedCategories(),
  };
};

// Hook for specific product data fetching
export const useProductData = (type, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { 
    getCategoryById, 
    getSizeById, 
    getColorById, 
    getOccasionById, 
    getMaterialById 
  } = useProducts();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        let result = null;
        
        switch (type) {
          case 'category':
            result = getCategoryById(id);
            break;
          case 'size':
            result = getSizeById(id);
            break;
          case 'color':
            result = getColorById(id);
            break;
          case 'occasion':
            result = getOccasionById(id);
            break;
          case 'material':
            result = getMaterialById(id);
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id, getCategoryById, getSizeById, getColorById, getOccasionById, getMaterialById]);

  return { data, loading, error };
};

export default useProducts;