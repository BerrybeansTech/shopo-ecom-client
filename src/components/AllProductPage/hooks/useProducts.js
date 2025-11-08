import { useState, useEffect, useCallback } from 'react';
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
import { productDataApi, productUtils } from '../productApi';

export const useProducts = () => {
  const dispatch = useDispatch();
  const productState = useSelector(state => state.product);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Fetch all product data
  const fetchAllProductData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      setLocalLoading(true);
      setLocalError(null);

      const productData = await productDataApi.getAll();

      // Transform and set data in Redux store
      dispatch(setCategories(productData.categories));
      dispatch(setSizes(productData.sizes));
      dispatch(setColors(productData.colors));
      dispatch(setOccasions(productData.occasions));
      dispatch(setMaterials(productData.materials));

      dispatch(setLoading(false));
      setLocalLoading(false);
      
      return productData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product data';
      dispatch(setError(errorMessage));
      setLocalError(errorMessage);
      setLocalLoading(false);
      dispatch(setLoading(false));
      throw error;
    }
  }, [dispatch]);

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

  // Initialize product data on component mount
  useEffect(() => {
    if (productState.categories.length === 0 && 
        productState.sizes.length === 0 && 
        productState.colors.length === 0) {
      fetchAllProductData();
    }
  }, [fetchAllProductData, productState.categories.length, productState.sizes.length, productState.colors.length]);

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

    // Actions
    fetchAllProductData,
    updateSelectedFilters,
    
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