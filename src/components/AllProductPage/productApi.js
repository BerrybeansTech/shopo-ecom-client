import { apiService } from '../../services/apiservice';

// Request deduplication cache
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Helper function for deduplication
const deduplicateRequest = async (key, requestFn) => {
  const now = Date.now();
  const cached = requestCache.get(key);
  
  // Return cached promise if it exists and is fresh
  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.promise;
  }
  
  // Create new request
  const promise = requestFn();
  requestCache.set(key, { promise, timestamp: now });
  
  // Clean up cache after request completes
  promise.finally(() => {
    // Keep it in cache for the duration, it will be cleaned up on next request
  });
  
  return promise;
};

// Clear expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      requestCache.delete(key);
    }
  }
}, 60000); // Clean every minute

// CATEGORY API
export const categoryApi = {
  getAll: async () => {
    const key = 'category-getAll';
    return deduplicateRequest(key, async () => {
      const response = await apiService.apiCall("/product/category/get-all");
      return response;
    });
  },
};

// SIZE API
export const sizeApi = {
  getAll: async () => {
    const key = 'size-getAll';
    return deduplicateRequest(key, async () => {
      const response = await apiService.apiCall("/product/size/get-all");
      return response;
    });
  },
};

// COLOR API
export const colorApi = {
  getAll: async () => {
    const key = 'color-getAll';
    return deduplicateRequest(key, async () => {
      const response = await apiService.apiCall("/product/color/get-all");
      return response;
    });
  },
};

// OCCASION API
export const occasionApi = {
  getAll: async () => {
    const key = 'occasion-getAll';
    return deduplicateRequest(key, async () => {
      const response = await apiService.apiCall("/product/occasion/get-all");
      return response;
    });
  },
};

// MATERIAL API
export const materialApi = {
  getAll: async () => {
    const key = 'material-getAll';
    return deduplicateRequest(key, async () => {
      const response = await apiService.apiCall("/product/material/get-all");
      return response;
    });
  },
};

// PRODUCT API
export const productApi = {
  // Get all products
  getAll: async (page = 1, limit = 10) => {
    try {
      const key = `product-getAll-${page}-${limit}`;
      return deduplicateRequest(key, async () => {
        const response = await apiService.apiCall(`/product/get-all-product?page=${page}&limit=${limit}`);
        return response;
      });
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  // Get product by ID
  getById: async (id) => {
    try {
      const key = `product-getById-${id}`;
      
      return deduplicateRequest(key, async () => {
        const response = await apiService.apiCall(`/product/get-product/${id}`);
        
        // Handle different response structures
        if (response && response.success && response.data) {
          return response;
        }
        
        if (response && response.data) {
          return response;
        }
        
        if (response && response.id) {
          return { success: true, data: response };
        }
        
        throw new Error('Invalid response structure from API');
      });
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  // Filter products
  filter: async (filters = {}) => {
    try {
      const filterString = JSON.stringify(filters);
      const key = `product-filter-${filterString}`;
      
      return deduplicateRequest(key, async () => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(item => queryParams.append(key, item));
            } else {
              queryParams.append(key, value);
            }
          }
        });

        const response = await apiService.apiCall(`/product/filter?${queryParams.toString()}`);
        return response;
      });
    } catch (error) {
      console.error("Error filtering products:", error);
      throw error;
    }
  },
};

// REVIEW API
export const reviewApi = {
  // Create a new review
  create: async (reviewData) => {
    try {
      const response = await apiService.apiCall("/product/review/create", {
        method: "POST",
        body: JSON.stringify(reviewData),
      });
      return response;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Get all reviews (for admin use)
  getAll: async () => {
    try {
      const key = 'review-getAll';
      return deduplicateRequest(key, async () => {
        const response = await apiService.apiCall("/product/review/get-all");
        return response;
      });
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      throw error;
    }
  },

  // Get reviews by product ID
  getByProduct: async (productId) => {
    try {
      const key = `review-getByProduct-${productId}`;
      return deduplicateRequest(key, async () => {
        const response = await apiService.apiCall(`/product/review/get-by-product/${productId}`);
        return response;
      });
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },

  // Get single review by ID
  getById: async (id) => {
    try {
      const key = `review-getById-${id}`;
      return deduplicateRequest(key, async () => {
        const response = await apiService.apiCall(`/product/review/get-review/${id}`);
        return response;
      });
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw error;
    }
  },

  // Update review
  update: async (id, reviewData) => {
    try {
      const response = await apiService.apiCall(`/product/review/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(reviewData),
      });
      return response;
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
  },

  // Delete review
  delete: async (id) => {
    try {
      const response = await apiService.apiCall(`/product/review/delete/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  },
};

// COMBINED PRODUCT DATA API
export const productDataApi = {
  getAll: async () => {
    try {
      const key = 'productData-getAll';
      return deduplicateRequest(key, async () => {
        const [categories, sizes, colors, occasions, materials] = await Promise.all([
          categoryApi.getAll(),
          sizeApi.getAll(),
          colorApi.getAll(),
          occasionApi.getAll(),
          materialApi.getAll(),
        ]);

        const result = {
          categories: categories.data || categories,
          sizes: sizes.data || sizes,
          colors: colors.data || colors,
          occasions: occasions.data || occasions,
          materials: materials.data || materials,
        };

        return result;
      });
    } catch (error) {
      console.error("Error fetching all product data:", error);
      throw error;
    }
  },
};

// PRODUCT UTILITIES
export const productUtils = {
  // Group sizes by type
  getUniqueSizesByType: (sizes) => {
    if (!sizes || !Array.isArray(sizes)) return {};
    const groupedSizes = sizes.reduce((acc, size) => {
      if (!acc[size.type]) acc[size.type] = new Set();
      if (size.size && Array.isArray(size.size)) {
        size.size.forEach(s => acc[size.type].add(s));
      }
      return acc;
    }, {});
    Object.keys(groupedSizes).forEach(type => {
      groupedSizes[type] = Array.from(groupedSizes[type]);
    });
    return groupedSizes;
  },

  // Unique colors
  getUniqueColors: (colors) => {
    if (!colors || !Array.isArray(colors)) return [];
    return [...new Set(colors.map(c => c.color).filter(Boolean))];
  },

  // Flatten categories
  flattenCategories: (categories) => {
    if (!categories || !Array.isArray(categories)) return [];
    const flattened = [];

    categories.forEach(category => {
      flattened.push({ id: category.id, name: category.name, type: 'category', level: 0 });
      category.ProductSubCategories?.forEach(sub => {
        flattened.push({ id: sub.id, name: sub.name, parentId: category.id, type: 'subcategory', level: 1 });
        sub.ProductChildCategories?.forEach(child => {
          flattened.push({ id: child.id, name: child.name, parentId: sub.id, type: 'childcategory', level: 2 });
        });
      });
    });

    return flattened;
  },

  // Breadcrumb hierarchy
  getCategoryHierarchy: (categories, categoryId) => {
    if (!categories || !Array.isArray(categories)) return [];
    const hierarchy = [];

    const findCategory = (cats, targetId) => {
      for (const cat of cats) {
        if (cat.id === targetId) {
          hierarchy.unshift(cat);
          return true;
        }
        if (cat.ProductSubCategories) {
          for (const sub of cat.ProductSubCategories) {
            if (sub.id === targetId) {
              hierarchy.unshift(sub);
              hierarchy.unshift(cat);
              return true;
            }
            if (sub.ProductChildCategories) {
              for (const child of sub.ProductChildCategories) {
                if (child.id === targetId) {
                  hierarchy.unshift(child);
                  hierarchy.unshift(sub);
                  hierarchy.unshift(cat);
                  return true;
                }
              }
            }
          }
        }
      }
      return false;
    };

    findCategory(categories, categoryId);
    return hierarchy;
  },
};

// EXPORT ALL
export default {
  categoryApi,
  sizeApi,
  colorApi,
  occasionApi,
  materialApi,
  productApi,
  reviewApi,
  productDataApi,
  productUtils,
};