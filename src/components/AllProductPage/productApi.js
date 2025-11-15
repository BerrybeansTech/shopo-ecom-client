import { apiService } from '../../services/apiservice';

// Request Cache (Deduplication)
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const deduplicateRequest = async (key, requestFn) => {
  const now = Date.now();
  const cached = requestCache.get(key);

  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.promise;
  }

  const promise = requestFn();
  requestCache.set(key, { promise, timestamp: now });

  return promise;
};

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      requestCache.delete(key);
    }
  }
}, 60000);

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

// MATERIAL API
export const materialApi = {
  getAll: async () => {
    const key = 'material-getAll';
    return deduplicateRequest(key, async () => {
      return await apiService.get("/product/material/get-all");
    });
  },
};

// PRODUCT API
export const productApi = {
  getAll: async (page = 1, limit = 10) => {
    try {
      const key = `product-getAll-${page}-${limit}`;
      return deduplicateRequest(key, async () => {
        const response = await apiService.get(
          `/product/get-all-product?page=${page}&limit=${limit}`
        );
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

        if (response?.success && response?.data) return response;
        if (response?.data) return response;
        if (response?.id) return { success: true, data: response };

        throw new Error("Invalid response structure from API");
      });
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  getRelatedProducts: async (productId, categoryId, limit = 8) => {
    try {
      const key = `product-related-${productId}-${categoryId}-${limit}`;
      return deduplicateRequest(key, async () => {
        const allResponse = await productApi.getAll(1, 1000);
        const products = allResponse.data || allResponse;

        if (!Array.isArray(products)) {
          throw new Error("Invalid products data received");
        }

        const related = products
          .filter(
            (product) =>
              product.id !== productId &&
              (product.categoryId === categoryId ||
                product.category?.id === categoryId)
          )
          .slice(0, limit);

        return {
          success: true,
          data: related,
          total: related.length,
        };
      });
    } catch (error) {
      console.error("Error fetching related products:", error);
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

  getAll: async () => {
    try {
      const key = 'review-getAll';
      return deduplicateRequest(key, async () => {
        return await apiService.get("/product/review/get-all");
      });
    } catch (error) {
      console.error("Error getting all reviews:", error);
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

  getById: async (id) => {
    try {
      const key = `review-getById-${id}`;
      return deduplicateRequest(key, async () => {
        return await apiService.get(`/product/review/get-review/${id}`);
      });
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await apiService.put(`/product/review/update/${id}`, data);
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await apiService.delete(`/product/review/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
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
        const [categories, sizes, colors, occasions, materials] = await Promise.all([
          categoryApi.getAll(),
          sizeApi.getAll(),
          colorApi.getAll(),
          occasionApi.getAll(),
          materialApi.getAll(),
        ]);

        return {
          categories: categories.data || categories,
          sizes: sizes.data || sizes,
          colors: colors.data || colors,
          occasions: occasions.data || occasions,
          materials: materials.data || materials,
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
      grouped[type] = [...grouped[type]];
    });

    return grouped;
  },

  getUniqueColors: (colors) => {
    if (!colors || !Array.isArray(colors)) return [];
    return [...new Set(colors.map((c) => c.color).filter(Boolean))];
  },

  flattenCategories: (categories) => {
    if (!categories || !Array.isArray(categories)) return [];

    const flattened = [];

    categories.forEach((cat) => {
      flattened.push({
        id: cat.id,
        name: cat.name,
        type: "category",
        level: 0,
      });

      cat.ProductSubCategories?.forEach((sub) => {
        flattened.push({
          id: sub.id,
          name: sub.name,
          parentId: cat.id,
          type: "subcategory",
          level: 1,
        });

        sub.ProductChildCategories?.forEach((child) => {
          flattened.push({
            id: child.id,
            name: child.name,
            parentId: sub.id,
            type: "childcategory",
            level: 2,
          });
        });
      });
    });

    return flattened;
  },

  getCategoryHierarchy: (categories, categoryId) => {
    if (!categories || !Array.isArray(categories)) return [];

    const hierarchy = [];

    const findCategory = (cats, targetId) => {
      for (const cat of cats) {
        if (cat.id === targetId) {
          hierarchy.unshift(cat);
          return true;
        }

        for (const sub of cat.ProductSubCategories || []) {
          if (sub.id === targetId) {
            hierarchy.unshift(sub, cat);
            return true;
          }

          for (const child of sub.ProductChildCategories || []) {
            if (child.id === targetId) {
              hierarchy.unshift(child, sub, cat);
              return true;
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

// EXPORT DEFAULT
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
