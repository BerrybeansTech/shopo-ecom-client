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

let globalIsFetchingAll = false;
let globalHasFetchedAll = false;

export const useProducts = () => {
  const dispatch = useDispatch();
  const productState = useSelector(state => state.product);
  
  // Use refs to track fetch status without causing re-renders
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const fetchAllProductData = useCallback(async (forceRefresh = false) => {
    if ((isFetchingRef.current || globalIsFetchingAll) && !forceRefresh) {
      return;
    }
    if ((hasFetchedRef.current || globalHasFetchedAll) && !forceRefresh && 
        productState.categories.length > 0) {
      return;
    }
    if (productState.loading && !forceRefresh) {
      return;
    }

    try {
      isFetchingRef.current = true;
      globalIsFetchingAll = true;
      dispatch(setLoading(true));
      setLocalLoading(true);
      setLocalError(null);

      const productData = await productDataApi.getAll();

      dispatch(setCategories(productData.categories));
      dispatch(setSizes(productData.sizes));
      dispatch(setColors(productData.colors));
      dispatch(setOccasions(productData.occasions));
      dispatch(setMaterials(productData.materials));
      hasFetchedRef.current = true;
      globalHasFetchedAll = true;
      
      return productData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product data';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
      setLocalLoading(false);
      isFetchingRef.current = false;
      globalIsFetchingAll = false;
    }
  }, [dispatch, productState.categories.length, productState.loading]);
  
  const fetchCategoriesOnly = useCallback(async (forceRefresh = false) => {
    if ((productState.loading || isFetchingRef.current) && !forceRefresh) return;
    if (productState.categories.length > 0 && !forceRefresh) return;
    try {
      isFetchingRef.current = true;
      dispatch(setLoading(true));
      const response = await categoryApi.getAll();
      const cats = response?.data || response || [];
      dispatch(setCategories(cats));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch categories';
      dispatch(setError(msg));
      setLocalError(msg);
      throw err;
    } finally {
      isFetchingRef.current = false;
      dispatch(setLoading(false));
    }
  }, [dispatch, productState.categories.length, productState.loading]);

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
    return productUtils.getUniqueSizesByType(productState.sizes);
  }, [productState.sizes]);

  // Get unique colors
  const getUniqueColors = useCallback(() => {
    return productUtils.getUniqueColors(productState.colors);
  }, [productState.colors]);

  // Get flattened categories
  const getFlattenedCategories = useCallback(() => {
    return productUtils.flattenCategories(productState.categories);
  }, [productState.categories]);

  // Update selected filters
  const updateSelectedFilters = useCallback((newFilters) => {
    dispatch(setSelectedFilters(newFilters));
  }, [dispatch]);

  // Get category by ID
  const getCategoryById = useCallback((id) => {
    return productState.categories.find(cat => cat.id === id);
  }, [productState.categories]);

  // Get size by ID
  const getSizeById = useCallback((id) => {
    return productState.sizes.find(size => size.id === id);
  }, [productState.sizes]);

  // Get color by ID
  const getColorById = useCallback((id) => {
    return productState.colors.find(color => color.id === id);
  }, [productState.colors]);

  // Get occasion by ID
  const getOccasionById = useCallback((id) => {
    return productState.occasions.find(occasion => occasion.id === id);
  }, [productState.occasions]);

  // Get material by ID
  const getMaterialById = useCallback((id) => {
    return productState.materials.find(material => material.id === id);
  }, [productState.materials]);

  useEffect(() => {
    const shouldFetchData = 
      !hasFetchedRef.current && 
      !isFetchingRef.current &&
      !globalHasFetchedAll &&
      productState.categories.length === 0;

    if (shouldFetchData) {
      fetchAllProductData();
    }
  }, [fetchAllProductData, productState.categories.length]);

  return {
    // State
    categories: productState.categories,
    sizes: productState.sizes,
    colors: productState.colors,
    occasions: productState.occasions,
    materials: productState.materials,
    selectedFilters: productState.selectedFilters,
    loading: productState.loading || localLoading,
    error: productState.error || localError,
    hasCategories: productState.categories && productState.categories.length > 0,

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