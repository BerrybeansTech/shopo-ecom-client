import { apiService } from '../../services/apiservice';

// Category APIs
export const categoryApi = {
  getAll: async () => {
    const response = await apiService.apiCall("/product/category/get-all");
    return response;
  },
};

// Size APIs
export const sizeApi = {
  getAll: async () => {
    const response = await apiService.apiCall("/product/size/get-all");
    return response;
  },
  getById: async (id) => {
    const response = await apiService.apiCall(`/product/size/get-size/${id}`);
    return response;
  },
};

// Color APIs
export const colorApi = {
  getAll: async () => {
    const response = await apiService.apiCall("/product/color/get-all");
    return response;
  },
  getById: async (id) => {
    const response = await apiService.apiCall(`/product/color/get-color/${id}`);
    return response;
  },
};

// Occasion APIs
export const occasionApi = {
  getAll: async () => {
    const response = await apiService.apiCall("/product/occasion/get-all");
    return response;
  },
  getById: async (id) => {
    const response = await apiService.apiCall(`/product/occasion/get-occasion/${id}`);
    return response;
  },
};

// Material APIs
export const materialApi = {
  getAll: async () => {
    const response = await apiService.apiCall("/product/material/get-all");
    return response;
  },
  getById: async (id) => {
    const response = await apiService.apiCall(`/product/material/get-material/${id}`);
    return response;
  },
};

// Combined product data API
export const productDataApi = {
  getAll: async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching all product data:", error);
      throw error;
    }
  },
};

// Utility functions for data transformation
export const productUtils = {
  // Get unique sizes grouped by type
  getUniqueSizesByType: (sizes) => {
    if (!sizes || !Array.isArray(sizes)) return {};
    
    const groupedSizes = sizes.reduce((acc, size) => {
      if (!acc[size.type]) {
        acc[size.type] = new Set();
      }
      if (size.size && Array.isArray(size.size)) {
        size.size.forEach(s => acc[size.type].add(s));
      }
      return acc;
    }, {});

    // Convert Sets to Arrays
    Object.keys(groupedSizes).forEach(type => {
      groupedSizes[type] = Array.from(groupedSizes[type]);
    });

    return groupedSizes;
  },

  // Get unique colors
  getUniqueColors: (colors) => {
    if (!colors || !Array.isArray(colors)) return [];
    const uniqueColors = [...new Set(colors.map(color => color.color).filter(Boolean))];
    return uniqueColors;
  },

  // Flatten categories for easy access
  flattenCategories: (categories) => {
    if (!categories || !Array.isArray(categories)) return [];
    
    const flattened = [];
    
    categories.forEach(category => {
      // Add main category
      flattened.push({
        id: category.id,
        name: category.name,
        type: 'category',
        level: 0
      });

      // Add subcategories
      category.ProductSubCategories?.forEach(subCategory => {
        flattened.push({
          id: subCategory.id,
          name: subCategory.name,
          parentId: category.id,
          type: 'subcategory',
          level: 1
        });

        // Add child categories
        subCategory.ProductChildCategories?.forEach(childCategory => {
          flattened.push({
            id: childCategory.id,
            name: childCategory.name,
            parentId: subCategory.id,
            type: 'childcategory',
            level: 2
          });
        });
      });
    });

    return flattened;
  },

  // Get category hierarchy for breadcrumbs
  getCategoryHierarchy: (categories, categoryId) => {
    if (!categories || !Array.isArray(categories)) return [];
    
    const hierarchy = [];
    
    // Find the category in all levels
    const findCategory = (cats, targetId) => {
      for (const cat of cats) {
        if (cat.id === targetId) {
          hierarchy.unshift(cat);
          return true;
        }
        
        if (cat.ProductSubCategories) {
          for (const subCat of cat.ProductSubCategories) {
            if (subCat.id === targetId) {
              hierarchy.unshift(subCat);
              hierarchy.unshift(cat);
              return true;
            }
            
            if (subCat.ProductChildCategories) {
              for (const childCat of subCat.ProductChildCategories) {
                if (childCat.id === targetId) {
                  hierarchy.unshift(childCat);
                  hierarchy.unshift(subCat);
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
  }
};

// Product filter API
export const productFilterApi = {
  getFilteredProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
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
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error;
    }
  }
};

export default {
  categoryApi,
  sizeApi,
  colorApi,
  occasionApi,
  materialApi,
  productDataApi,
  productFilterApi,
  productUtils
};