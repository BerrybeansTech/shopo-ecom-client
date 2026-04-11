import { apiService } from '../../services/apiservice';

// Request Cache
const requestCache = new Map();
const CACHE_DURATION = 0;

const deduplicateRequest = async (key, requestFn) => {
  const now = Date.now();
  const cached = requestCache.get(key);

  if (cached && (CACHE_DURATION === 0 || (now - cached.timestamp < CACHE_DURATION))) {
    return cached.promise;
  }

  const promise = requestFn();
  requestCache.set(key, { promise, timestamp: now });

  if (CACHE_DURATION > 0) {
    setTimeout(() => {
      requestCache.delete(key);
    }, CACHE_DURATION);
  }

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
  getAll: async (filters = {}) => {
    try {
      const queryParams = {};

      if (filters.material) {
        if (Array.isArray(filters.material)) {
          queryParams.material = filters.material.join(',');
        } else {
          queryParams.material = filters.material;
        }
      }

      const queryString = buildQueryString(queryParams);
      const key = `occasion-getAll-${queryString}`;

      return deduplicateRequest(key, async () => {
        return await apiService.get(`/product/occasion/get-all${queryString}`);
      });
    } catch (error) {
      console.error("Error fetching occasions:", error);
      throw error;
    }
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
  getAll: async (filters = {}) => {
    try {
      const queryParams = {
        page: filters.page || 1,
        limit: filters.limit || 12,
        ...(filters.name && { name: filters.name }),
        ...(filters.subCategory && { subCategory: filters.subCategory }),
        ...(filters.childCategory && { childCategory: filters.childCategory }),
        ...(filters.occasion && { occasion: filters.occasion }),
        ...(filters.material && { material: filters.material }),
        ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
        ...(filters.productColor && { productColor: filters.productColor }),
        ...(filters.productSize && { productSize: filters.productSize }),
        ...(filters.newArrival && { newArrival: true }),
      };

      // Handle multiple colors
      if (filters.productColor) {
        if (Array.isArray(filters.productColor)) {
          const standardizedColors = filters.productColor.map(color => {
            if (!color) return '';
            return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
          });
          queryParams.productColor = standardizedColors.join(',');
        } else {
          const colors = filters.productColor.split(',').map(color => {
            if (!color) return '';
            return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
          });
          queryParams.productColor = colors.join(',');
        }
      }

      // Handle multiple sizes
      if (filters.productSize && Array.isArray(filters.productSize)) {
        queryParams.productSize = filters.productSize.join(',');
      }

      // Handle multiple subcategories
      if (filters.subCategory && Array.isArray(filters.subCategory)) {
        queryParams.subCategory = filters.subCategory.join(',');
      }

      // Handle multiple child categories
      if (filters.childCategory && Array.isArray(filters.childCategory)) {
        queryParams.childCategory = filters.childCategory.join(',');
      }

      // Handle multiple occasions
      if (filters.occasion && Array.isArray(filters.occasion)) {
        queryParams.occasion = filters.occasion.join(',');
      }

      // Handle multiple materials
      if (filters.material && Array.isArray(filters.material)) {
        queryParams.material = filters.material.join(',');
      }

      // Handle multiple categories
      if (filters.category && Array.isArray(filters.category)) {
        queryParams.category = filters.category.join(',');
      }

      // FIXED: Handle rating filter - Send MINIMUM threshold only
      if (filters.rating && Array.isArray(filters.rating) && filters.rating.length > 0) {
        // Get the MINIMUM rating threshold (lowest value selected)
        // This ensures we show products >= minimum (includes all higher ratings too)
        const minRating = Math.min(...filters.rating.map(r => parseFloat(r)));
        queryParams.minAvgRating = minRating;
        console.log('Rating filter - Selected thresholds:', filters.rating, 'Sending minimum to API as minAvgRating:', queryParams.minAvgRating);
      }

      const queryString = buildQueryString(queryParams);
      const cacheKey = `product-getAll-${queryString}`;

      return deduplicateRequest(cacheKey, async () => {
        console.log('Making API call with params:', queryParams);
        console.log('Query string:', queryString);
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

  getRelatedProducts: async (productId, categoryId, limit = 8) => {
    try {
      const key = `product-related-${productId}-${categoryId}-${limit}`;
      return deduplicateRequest(key, async () => {
        // Fetch products from the same category, excluding the current product
        const queryParams = {
          category: categoryId,
          limit: limit + 1, // Fetch one extra to account for filtering out current product
          page: 1,
        };

        const queryString = buildQueryString(queryParams);
        const response = await apiService.get(`/product/get-all-product${queryString}`);

        // Filter out the current product and limit results
        if (response?.success && Array.isArray(response.data)) {
          const filteredProducts = response.data
            .filter(p => p.id !== parseInt(productId))
            .slice(0, limit);
          return { success: true, data: filteredProducts };
        }

        return response;
      });
    } catch (error) {
      console.error(`Error fetching related products for ${productId}:`, error);
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
      grouped[type] = [...grouped[type]].sort();
    });

    return grouped;
  },

  getUniqueColors: (colors) => {
    if (!colors || !Array.isArray(colors)) return [];
    return [...new Set(colors.map((c) => c.color).filter(Boolean))].sort();
  },

  getUniqueMaterials: (materials) => {
    if (!materials || !Array.isArray(materials)) return [];
    return [...new Set(materials.map((m) => m.name).filter(Boolean))].sort();
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

  transformFiltersToQueryParams: (filters, categories = [], occasions = [], materials = []) => {
    const {
      selectedCategoryId = null,
      selectedSubCategories = [],
      selectedDetails = [],
      priceRange = { min: 0, max: 10000 },
      selectedColors = [],
      selectedSizes = [],
      selectedOccasions = [],
      selectedMaterials = [],
      selectedReviewThresholds = [],
      newArrival = false,
      selectedAvailability = [],
      sortOption,
      searchQuery,
      pagination = { currentPage: 1, itemsPerPage: 12 }
    } = filters;

    const queryParams = {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
    };

    // Text search
    if (searchQuery) {
      queryParams.name = searchQuery;
    }

    // Category ID - Handle main category selection from URL
    const categoryIds = new Set();
    if (selectedCategoryId) {
      categoryIds.add(parseInt(selectedCategoryId));
      console.log('📍 Adding categoryId to query params:', selectedCategoryId);
    }

    // Subcategories - convert names to IDs
    if (selectedSubCategories.length > 0) {
      const subCategoryIds = [];
      categories.forEach(category => {
        category.ProductSubCategories?.forEach(subCategory => {
          if (selectedSubCategories.includes(subCategory.name)) {
            subCategoryIds.push(subCategory.id);
            if (category.id) categoryIds.add(category.id);
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
                if (category.id) categoryIds.add(category.id);
              }
            });
          });
        });
      });
      if (childCategoryIds.length > 0) {
        queryParams.childCategory = childCategoryIds;
      }
    }

    // Add category IDs to query params
    if (categoryIds.size > 0) {
      queryParams.category = Array.from(categoryIds);
      console.log('📍 Final category IDs for API:', queryParams.category);
    }

    // Price range
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      queryParams.minPrice = priceRange.min;
      queryParams.maxPrice = priceRange.max;
    }

    // Colors - Pass array directly
    if (selectedColors.length > 0) {
      queryParams.productColor = selectedColors;
    }

    // Sizes - Pass array directly
    if (selectedSizes.length > 0) {
      queryParams.productSize = selectedSizes;
    }

    // Materials - convert selected names to IDs
    if (selectedMaterials.length > 0 && materials && materials.length > 0) {
      const materialIds = [];
      materials.forEach(material => {
        if (selectedMaterials.includes(material.name)) {
          materialIds.push(material.id);
        }
      });
      if (materialIds.length > 0) {
        queryParams.material = materialIds;
      }
    }

    // Occasions - convert selected names to IDs
    if (selectedOccasions.length > 0 && occasions && occasions.length > 0) {
      const occasionIds = [];
      occasions.forEach(occ => {
        if (selectedOccasions.includes(occ.name)) {
          occasionIds.push(occ.id);
        }
      });
      if (occasionIds.length > 0) {
        queryParams.occasion = occasionIds;
      }
    }

    // FIXED: Rating filter - Use MINIMUM threshold to show all products above it
    if (selectedReviewThresholds.length > 0) {
      // Get the minimum threshold - this will include all products at or above this rating
      // Example: If user selects [3, 4], use 3 to show 3★, 4★, and 5★ products
      const minThreshold = Math.min(...selectedReviewThresholds.map(r => parseFloat(r)));
      queryParams.minAvgRating = minThreshold;
      console.log('Rating filter applied - Selected thresholds:', selectedReviewThresholds, 'Using minimum as minAvgRating:', queryParams.minAvgRating);
    }

    // Availability (In Stock / Out of Stock)
    if (selectedAvailability.length > 0) {
      const hasIn = selectedAvailability.includes('in');
      const hasOut = selectedAvailability.includes('out');

      if (hasIn && !hasOut) {
        queryParams.inStock = true;
      } else if (hasOut && !hasIn) {
        queryParams.inStock = false;
      }
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
      selectedMaterials = [],
      selectedReviewThresholds = [],
      selectedAvailability = [],
    } = filters;

    // Category filters
    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubCategories.some(subCat =>
          product.subCategory?.name?.toLowerCase().includes(subCat.toLowerCase())
        )
      );
    }

    // Child category filters
    if (selectedDetails.length > 0) {
      filtered = filtered.filter(product => {
        return selectedDetails.some(detailKey => {
          const [subCategory, detail] = detailKey.split("||");
          return (
            product.subCategory?.name?.toLowerCase().includes(subCategory.toLowerCase()) &&
            product.childCategory?.name?.toLowerCase().includes(detail.toLowerCase())
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
          .filter(Boolean)
          .map(color => color.toLowerCase()) || [];

        return selectedColors.some(selectedColor =>
          productColors.some(productColor =>
            productColor.includes(selectedColor.toLowerCase())
          )
        );
      });
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        const productSizes = product.inventories
          ?.flatMap(inv => inv.productSize?.size || [])
          .filter(Boolean)
          .map(size => size.toLowerCase()) || [];

        return selectedSizes.some(selectedSize =>
          productSizes.some(productSize =>
            productSize.includes(selectedSize.toLowerCase())
          )
        );
      });
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(product =>
        selectedMaterials.some(material => {
          const productMaterial = product.material?.name;
          if (!productMaterial) return false;
          return productMaterial.toLowerCase().includes(material.toLowerCase());
        })
      );
    }

    // Occasion filter
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter(product =>
        selectedOccasions.some(occasion =>
          product.occasion?.name?.toLowerCase().includes(occasion.toLowerCase())
        )
      );
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      const hasIn = selectedAvailability.includes('in');
      const hasOut = selectedAvailability.includes('out');

      if (hasIn && !hasOut) {
        filtered = filtered.filter(product => {
          const totalStock =
            product.inventories?.reduce(
              (sum, inv) => sum + (inv.availableQuantity || 0),
              0
            ) || 0;
          return totalStock > 0;
        });
      } else if (hasOut && !hasIn) {
        filtered = filtered.filter(product => {
          const totalStock =
            product.inventories?.reduce(
              (sum, inv) => sum + (inv.availableQuantity || 0),
              0
            ) || 0;
          return totalStock === 0;
        });
      }
    }

    // FIXED: Rating filter - Use MINIMUM threshold to show all products >= that rating
    if (selectedReviewThresholds.length > 0) {
      // Get the minimum threshold to include all products at or above this rating
      // Example: Select [3, 4] → use 3 → shows products with 3★, 4★, 5★
      const minThreshold = Math.min(...selectedReviewThresholds.map(r => parseFloat(r)));
      filtered = filtered.filter(product => {
        const avgRating = parseFloat(product.averageRating || 0);
        return avgRating >= minThreshold;
      });
      console.log('Client-side rating filter - Selected thresholds:', selectedReviewThresholds, 'Using minimum:', minThreshold, 'Filtered count:', filtered.length);
    }

    return filtered;
  }
};

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