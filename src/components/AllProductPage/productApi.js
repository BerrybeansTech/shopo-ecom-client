import { apiService } from '../../services/apiservice';

// Request Cache
const requestCache = new Map();
const CACHE_DURATION = 30000;

const deduplicateRequest = async (key, requestFn) => {
  const now = Date.now();
  const cached = requestCache.get(key);

  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.promise;
  }

  const promise = requestFn();
  requestCache.set(key, { promise, timestamp: now });

  // Clean up old cache entries
  setTimeout(() => {
    requestCache.delete(key);
  }, CACHE_DURATION);

  return promise;
};

const buildQueryString = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(key, item));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// CATEGORY API
export const categoryApi = {
  getAll: async () => {
    const key = 'category-getAll';
    return deduplicateRequest(key, async () => {
      return await apiService.get("/product/category/get-all");
    });
  },
};

// SIZE API
export const sizeApi = {
  getAll: async () => {
    const key = 'size-getAll';
    return deduplicateRequest(key, async () => {
      return await apiService.get("/product/size/get-all");
    });
  },
};

// COLOR API
export const colorApi = {
  getAll: async () => {
    const key = 'color-getAll';
    return deduplicateRequest(key, async () => {
      return await apiService.get("/product/color/get-all");
    });
  },
};

// OCCASION API
export const occasionApi = {
  getAll: async () => {
    const key = 'occasion-getAll';
    return deduplicateRequest(key, async () => {
      return await apiService.get("/product/occasion/get-all");
    });
  },
};

// PRODUCT API
export const productApi = {
  getAll: async (filters = {}) => {
    try {
      const queryParams = {
        page: filters.page || 1,
        limit: filters.limit || 50,
        ...(filters.name && { name: filters.name }),
        ...(filters.subCategory && { subCategory: filters.subCategory }),
        ...(filters.childCategory && { childCategory: filters.childCategory }),
        ...(filters.occasion && { occasion: filters.occasion }),
        ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
        ...(filters.productColor && { productColor: filters.productColor }),
        ...(filters.productSize && { productSize: filters.productSize }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.newArrival && { newArrival: true }),
      };

      const queryString = buildQueryString(queryParams);
      const cacheKey = `product-getAll-${queryString}`;

      return deduplicateRequest(cacheKey, async () => {
        console.log('Making API call with params:', queryParams);
        const response = await apiService.get(`/product/get-all-product${queryString}`);
        console.log('API response received:', response);
        return response;
      });
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const key = `product-getById-${id}`;
      return deduplicateRequest(key, async () => {
        const response = await apiService.get(`/product/get-product/${id}`);
        return response?.success && response?.data ? response : { success: true, data: response };
      });
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
};

// REVIEW API
export const reviewApi = {
  create: async (reviewData) => {
    try {
      return await apiService.post("/product/review/create", reviewData);
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  getByProduct: async (productId) => {
    try {
      const key = `review-getByProduct-${productId}`;
      return deduplicateRequest(key, async () => {
        return await apiService.get(`/product/review/get-by-product/${productId}`);
      });
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },

  delete: async (reviewId) => {
    try {
      return await apiService.delete(`/product/review/delete/${reviewId}`);
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw error;
    }
  },
};

// PRODUCT DATA API
export const productDataApi = {
  getAll: async () => {
    try {
      const key = 'productData-getAll';
      return deduplicateRequest(key, async () => {
        const [categories, sizes, colors, occasions] = await Promise.all([
          categoryApi.getAll(),
          sizeApi.getAll(),
          colorApi.getAll(),
          occasionApi.getAll(),
        ]);

        return {
          categories: categories.data || categories,
          sizes: sizes.data || sizes,
          colors: colors.data || colors,
          occasions: occasions.data || occasions,
        };
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error;
    }
  },
};

// PRODUCT UTILS
export const productUtils = {
  getUniqueSizesByType: (sizes) => {
    if (!sizes || !Array.isArray(sizes)) return {};

    const grouped = sizes.reduce((acc, size) => {
      if (!acc[size.type]) acc[size.type] = new Set();
      if (Array.isArray(size.size)) {
        size.size.forEach((s) => acc[size.type].add(s));
      }
      return acc;
    }, {});

    Object.keys(grouped).forEach((type) => {
      grouped[type] = [...grouped[type]].sort();
    });

    return grouped;
  },

  getUniqueColors: (colors) => {
    if (!colors || !Array.isArray(colors)) return [];
    return [...new Set(colors.map((c) => c.color).filter(Boolean))].sort();
  },

  flattenCategories: (categories) => {
    if (!categories || !Array.isArray(categories)) return [];

    const flattened = [];
    categories.forEach((cat) => {
      flattened.push({ id: cat.id, name: cat.name, type: "category", level: 0 });
      
      cat.ProductSubCategories?.forEach((sub) => {
        flattened.push({ id: sub.id, name: sub.name, parentId: cat.id, type: "subcategory", level: 1 });
        
        sub.ProductChildCategories?.forEach((child) => {
          flattened.push({ id: child.id, name: child.name, parentId: sub.id, type: "childcategory", level: 2 });
        });
      });
    });

    return flattened;
  },

  transformFiltersToQueryParams: (filters, categories = []) => {
    const {
      selectedSubCategories = [],
      selectedDetails = [],
      priceRange = { min: 0, max: 10000 },
      selectedColors = [],
      selectedSizes = [],
      selectedOccasions = [],
      selectedBrands = [],
      sortOption,
      searchQuery,
      pagination = { currentPage: 1, itemsPerPage: 50 }
    } = filters;

    const queryParams = {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
    };

    // Text search
    if (searchQuery) {
      queryParams.name = searchQuery;
    }

    // Subcategories - convert names to IDs
    if (selectedSubCategories.length > 0) {
      const subCategoryIds = [];
      categories.forEach(category => {
        category.ProductSubCategories?.forEach(subCategory => {
          if (selectedSubCategories.includes(subCategory.name)) {
            subCategoryIds.push(subCategory.id);
          }
        });
      });
      if (subCategoryIds.length > 0) {
        queryParams.subCategory = subCategoryIds;
      }
    }

    // Child categories - convert names to IDs
    if (selectedDetails.length > 0) {
      const childCategoryIds = [];
      categories.forEach(category => {
        category.ProductSubCategories?.forEach(subCategory => {
          subCategory.ProductChildCategories?.forEach(childCategory => {
            selectedDetails.forEach(detailKey => {
              const [, detailName] = detailKey.split("||");
              if (childCategory.name === detailName) {
                childCategoryIds.push(childCategory.id);
              }
            });
          });
        });
      });
      if (childCategoryIds.length > 0) {
        queryParams.childCategory = childCategoryIds;
      }
    }

    // Price range
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      queryParams.minPrice = priceRange.min;
      queryParams.maxPrice = priceRange.max;
    }

    // Colors
    if (selectedColors.length > 0) {
      queryParams.productColor = selectedColors;
    }

    // Sizes
    if (selectedSizes.length > 0) {
      queryParams.productSize = selectedSizes;
    }

    // Occasions
    if (selectedOccasions.length > 0) {
      queryParams.occasion = selectedOccasions;
    }

    // Brands
    if (selectedBrands.length > 0) {
      queryParams.brand = selectedBrands;
    }

    // New Arrival mode based on sort option
    if (sortOption === 'New Arrivals') {
      queryParams.newArrival = true;
    }

    console.log('Transformed query params:', queryParams);
    return queryParams;
  },

  filterProductsClientSide: (products, filters) => {
    if (!products || !Array.isArray(products)) return [];
    
    let filtered = [...products];
    const {
      selectedSubCategories = [],
      selectedDetails = [],
      priceRange = { min: 0, max: 10000 },
      selectedColors = [],
      selectedSizes = [],
      selectedOccasions = [],
      selectedBrands = [],
    } = filters;

    // Category filters
    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedSubCategories.includes(product.subCategory?.name)
      );
    }

    // Child category filters
    if (selectedDetails.length > 0) {
      filtered = filtered.filter(product => {
        return selectedDetails.some(detailKey => {
          const [subCategory, detail] = detailKey.split("||");
          return (
            product.subCategory?.name === subCategory && 
            product.childCategory?.name === detail
          );
        });
      });
    }

    // Price filter
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      filtered = filtered.filter(product => {
        const sellingPrice = parseFloat(product.sellingPrice || product.mrp || 0);
        return sellingPrice >= priceRange.min && sellingPrice <= priceRange.max;
      });
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => {
        const productColors = product.inventories
          ?.map(inv => inv.productColor?.color)
          .filter(Boolean) || [];
        return selectedColors.some(selectedColor => 
          productColors.some(productColor => 
            productColor.toLowerCase().includes(selectedColor.toLowerCase())
          )
        );
      });
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        const productSizes = product.inventories
          ?.flatMap(inv => inv.productSize?.size || [])
          .filter(Boolean) || [];
        return selectedSizes.some(selectedSize => 
          productSizes.some(productSize => 
            productSize.toLowerCase().includes(selectedSize.toLowerCase())
          )
        );
      });
    }

    // Occasion filter
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter(product => 
        selectedOccasions.includes(product.occasion?.name)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }

    return filtered;
  }
};

export default {
  categoryApi,
  sizeApi,
  colorApi,
  occasionApi,
  productApi,
  reviewApi,
  productDataApi,
  productUtils,
};