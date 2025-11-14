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

// Global cache with expiration
const globalCache = {
  categories: null,
  sizes: null,
  colors: null,
  occasions: null,
  materials: null,
  lastFetched: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

let globalFetchPromise = null;

export const useProducts = () => {
  const dispatch = useDispatch();
  const productState = useSelector(state => state.product);
  
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    if (!globalCache.lastFetched) return false;
    return Date.now() - globalCache.lastFetched < globalCache.CACHE_DURATION;
  }, []);

  // Get data from cache or Redux store
  const getCachedData = useCallback((key) => {
    if (globalCache[key] && isCacheValid()) {
      return globalCache[key];
    }
    return productState[key];
  }, [isCacheValid, productState]);

  const fetchAllProductData = useCallback(async (forceRefresh = false) => {
    // Return cached data if valid and not forcing refresh
    if (isCacheValid() && !forceRefresh && 
        globalCache.categories && globalCache.categories.length > 0) {
      dispatch(setCategories(globalCache.categories));
      dispatch(setSizes(globalCache.sizes));
      dispatch(setColors(globalCache.colors));
      dispatch(setOccasions(globalCache.occasions));
      dispatch(setMaterials(globalCache.materials));
      return globalCache;
    }

    // Prevent duplicate requests
    if (globalFetchPromise && !forceRefresh) {
      return globalFetchPromise;
    }

    if ((isFetchingRef.current) && !forceRefresh) {
      return;
    }

    if (productState.loading && !forceRefresh) {
      return;
    }

    try {
      isFetchingRef.current = true;
      dispatch(setLoading(true));
      setLocalLoading(true);
      setLocalError(null);

      // Create global promise to prevent duplicate requests
      globalFetchPromise = (async () => {
        const productData = await productDataApi.getAll();

        // Update cache
        globalCache.categories = productData.categories;
        globalCache.sizes = productData.sizes;
        globalCache.colors = productData.colors;
        globalCache.occasions = productData.occasions;
        globalCache.materials = productData.materials;
        globalCache.lastFetched = Date.now();

        // Update Redux store
        dispatch(setCategories(productData.categories));
        dispatch(setSizes(productData.sizes));
        dispatch(setColors(productData.colors));
        dispatch(setOccasions(productData.occasions));
        dispatch(setMaterials(productData.materials));
        
        hasFetchedRef.current = true;
        return productData;
      })();

      const result = await globalFetchPromise;
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product data';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
      setLocalLoading(false);
      isFetchingRef.current = false;
      globalFetchPromise = null;
    }
  }, [dispatch, productState.loading, isCacheValid]);

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
      
      dispatch(setCategories(cats));
      return cats;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch categories';
      dispatch(setError(msg));
      setLocalError(msg);
      throw err;
    } finally {
      isFetchingRef.current = false;
      dispatch(setLoading(false));
    }
  }, [dispatch, getCachedData, productState.loading]);

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

  // Initialize data on mount
  useEffect(() => {
    const shouldFetchData = 
      !hasFetchedRef.current && 
      !isFetchingRef.current &&
      !isCacheValid() &&
      (!productState.categories || productState.categories.length === 0);

    if (shouldFetchData) {
      fetchAllProductData();
    }
  }, [fetchAllProductData, productState.categories, isCacheValid]);

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