import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Product data
  categories: [],
  sizes: [],
  colors: [],
  occasions: [],
  materials: [],

  // UI state
  loading: false,
  error: null,

  // Selected filters
  selectedFilters: {
    category: null,
    subCategory: null,
    childCategory: null,
    sizes: [],
    colors: [],
    occasion: null,
    material: null,
    priceRange: {
      min: 0,
      max: 10000
    },
    sortBy: 'newest'
  },

  // Pagination
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0
  }
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Set product data
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSizes: (state, action) => {
      state.sizes = action.payload;
    },
    setColors: (state, action) => {
      state.colors = action.payload;
    },
    setOccasions: (state, action) => {
      state.occasions = action.payload;
    },
    setMaterials: (state, action) => {
      state.materials = action.payload;
    },

    // Set UI state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Filter actions
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    setCategoryFilter: (state, action) => {
      state.selectedFilters.category = action.payload;
      // Reset sub and child categories when main category changes
      state.selectedFilters.subCategory = null;
      state.selectedFilters.childCategory = null;
    },
    setSubCategoryFilter: (state, action) => {
      state.selectedFilters.subCategory = action.payload;
      // Reset child category when sub category changes
      state.selectedFilters.childCategory = null;
    },
    setChildCategoryFilter: (state, action) => {
      state.selectedFilters.childCategory = action.payload;
    },
    setSizeFilter: (state, action) => {
      const { size, type } = action.payload;
      const existingIndex = state.selectedFilters.sizes.findIndex(
        s => s.size === size && s.type === type
      );
      
      if (existingIndex >= 0) {
        // Remove if already exists
        state.selectedFilters.sizes.splice(existingIndex, 1);
      } else {
        // Add new size
        state.selectedFilters.sizes.push({ size, type });
      }
    },
    setColorFilter: (state, action) => {
      const color = action.payload;
      const existingIndex = state.selectedFilters.colors.indexOf(color);
      
      if (existingIndex >= 0) {
        // Remove if already exists
        state.selectedFilters.colors.splice(existingIndex, 1);
      } else {
        // Add new color
        state.selectedFilters.colors.push(color);
      }
    },
    setOccasionFilter: (state, action) => {
      state.selectedFilters.occasion = action.payload;
    },
    setMaterialFilter: (state, action) => {
      state.selectedFilters.material = action.payload;
    },
    setPriceRangeFilter: (state, action) => {
      state.selectedFilters.priceRange = action.payload;
    },
    setSortBy: (state, action) => {
      state.selectedFilters.sortBy = action.payload;
    },
    clearAllFilters: (state) => {
      state.selectedFilters = initialState.selectedFilters;
    },

    // Pagination actions
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when items per page changes
    },
    setTotalItems: (state, action) => {
      state.pagination.totalItems = action.payload;
      state.pagination.totalPages = Math.ceil(action.payload / state.pagination.itemsPerPage);
    },

    // Reset entire state
    resetProductState: () => initialState
  }
});

export const {
  setCategories,
  setSizes,
  setColors,
  setOccasions,
  setMaterials,
  setLoading,
  setError,
  clearError,
  setSelectedFilters,
  setCategoryFilter,
  setSubCategoryFilter,
  setChildCategoryFilter,
  setSizeFilter,
  setColorFilter,
  setOccasionFilter,
  setMaterialFilter,
  setPriceRangeFilter,
  setSortBy,
  clearAllFilters,
  setCurrentPage,
  setItemsPerPage,
  setTotalItems,
  resetProductState
} = productSlice.actions;

// Selectors
export const selectCategories = (state) => state.product.categories;
export const selectSizes = (state) => state.product.sizes;
export const selectColors = (state) => state.product.colors;
export const selectOccasions = (state) => state.product.occasions;
export const selectMaterials = (state) => state.product.materials;
export const selectLoading = (state) => state.product.loading;
export const selectError = (state) => state.product.error;
export const selectSelectedFilters = (state) => state.product.selectedFilters;
export const selectPagination = (state) => state.product.pagination;

export default productSlice.reducer;