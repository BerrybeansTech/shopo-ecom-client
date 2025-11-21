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

  // Add to your useProducts hook
const fetchCategoriesOnly = useCallback(async () => {
  try {
    dispatch(setLoading(true));
    const categoriesData = await categoryApi.getAll();
    dispatch(setCategories(categoriesData.data || categoriesData));
    return categoriesData;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
}, [dispatch]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
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