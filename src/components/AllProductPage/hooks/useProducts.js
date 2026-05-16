import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCategories, 
  setSizes, 
  setColors, 
  setOccasions, 
  setMaterials,
  setLoading,
  setError
} from '../productSlice';
import { productDataApi, productUtils, categoryApi, reviewApi } from '../productApi';

// Global cache with manual refresh only
const globalCache = {
  categories: null,
  sizes: null,
  colors: null,
  occasions: null,
  materials: null,
  lastFetched: null,
  error: null,
  CACHE_DURATION: 0, // Disable auto-refresh
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
      globalCache.error = errorMessage;
      globalCache.lastFetched = Date.now();
      
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
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

  // Fetch only categories with caching and error handling
  const fetchCategoriesOnly = useCallback(async (force = false) => {
    // Return cached categories if available and not forcing refresh
    if (globalCache.categories?.length > 0 && !force) {
      return globalCache.categories;
    }

    try {
      dispatch(setLoading(true));
      setLocalLoading(true);
      setLocalError(null);
      globalCache.error = null;

      const categoriesData = await categoryApi.getAll();
      const categories = categoriesData.data || categoriesData;
      
      // Update cache
      globalCache.categories = categories;
      globalCache.lastFetched = Date.now();
      globalCache.error = null;

      // Update Redux store
      dispatch(setCategories(categories));
      
      return categories;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch categories';
      console.error('Error fetching categories:', errorMessage);
      globalCache.error = errorMessage;
      globalCache.lastFetched = Date.now();
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
      setLocalLoading(false);
    }
  }, [dispatch]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      // Only fetch if we haven't attempted a fetch yet AND it's not currently fetching
      // We check if we have data or if the cache is valid to decide if we need a fetch
      if (
        !hasFetchedRef.current && 
        !isFetchingRef.current &&
        !isCacheValid() &&
        (!productState.categories || productState.categories.length === 0)
      ) {
        try {
          await fetchAllProductData();
        } catch (error) {
          console.error('Failed to initialize product data:', error);
        } finally {
          // Mark as fetched even on failure to prevent infinite retry loops
          // The fetchAllProductData itself handles retries with backoff
          hasFetchedRef.current = true;
        }
      }
    };

    initializeData();
  }, [fetchAllProductData, productState.categories, isCacheValid]);

  // Get data from cache or Redux store
  const categories = globalCache.categories || productState.categories;
  const sizes = globalCache.sizes || productState.sizes;
  const colors = globalCache.colors || productState.colors;
  const occasions = globalCache.occasions || productState.occasions;
  const materials = globalCache.materials || productState.materials;

  return {
    // State
    categories,
    sizes,
    colors,
    occasions,
    materials,
    loading: productState.loading || localLoading,
    error: productState.error || localError,
    hasCategories: categories && categories.length > 0,

    // Actions
    fetchAllProductData,
    fetchCategoriesOnly,
    
    // Utility functions
    getUniqueSizesByType: () => productUtils.getUniqueSizesByType(sizes),
    getUniqueColors: () => productUtils.getUniqueColors(colors),
    getFlattenedCategories: () => productUtils.flattenCategories(categories),
    getCategoryById: (id) => categories.find(cat => cat.id === id),
    getSizeById: (id) => sizes.find(size => size.id === id),
    getColorById: (id) => colors.find(color => color.id === id),
    getOccasionById: (id) => occasions.find(occasion => occasion.id === id),
    getMaterialById: (id) => materials.find(material => material.id === id),
  };
};

export default useProducts;