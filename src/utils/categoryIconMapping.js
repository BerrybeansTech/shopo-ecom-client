// src/utils/categoryIconMapping.js
import { getImageUrl, getPlaceholderImage } from "./imageUtils";
import {
  Shirt,
  TrendingUp,
  Footprints,
  Watch,
  ShoppingBag,
  Sparkles,
  Crown,
  Gem,
  Palette,
  Scissors,
  Box,
  Gift,
  Star,
  Zap,
  Heart,
  Award,
  Package,
  Store,
  Grid,
  ShieldCheck,
  MapPin,
  Home
} from "lucide-react";

/**
 * Category Icon Configuration
 * Maps category names to their corresponding Lucide React icons
 */
export const categoryIconMap = {
  // Main Categories
  topwear: Shirt,
  bottomwear: TrendingUp,
  footwear: Footprints,
  accessories: Watch,
  ethnic: Crown,
  western: Star,
  casual: Heart,
  formal: Award,
  sports: Zap,
  kids: Gift,
  women: Sparkles,
  men: Box,

  // Accessories subcategories
  watches: Watch,
  jewelry: Gem,
  bags: ShoppingBag,
  belts: Scissors,
  sunglasses: Award,
  scarves: Palette,

  // Default fallback
  default: Store,
};

/**
 * Get icon component for a category name
 * @param {string} categoryName - Category name to match
 * @returns {React.Component} - Lucide icon component
 */
export const getCategoryIcon = (categoryName = '') => {
  if (!categoryName) return categoryIconMap.default;

  // Normalize by converting to lowercase and stripping all non-alphanumeric characters (spaces, dashes, etc.)
  const normalized = categoryName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Direct match
  if (categoryIconMap[normalized]) {
    return categoryIconMap[normalized];
  }

  // Partial match
  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }

  return categoryIconMap.default;
};

/**
 * Category Image URL Configuration
 * Maps category names to their image URLs from CDN or local assets
 */
export const categoryImageMap = {
  topwear: {
    default: "/assets/icon/Half%20Sleeves%20Shirt%20.jpeg",
    hover: "/assets/icon/Half%20Sleeves%20Shirt%20.jpeg",
  },
  bottomwear: {
    default: "/assets/icon/Gurkha%20Pants.jpeg",
    hover: "/assets/icon/Gurkha%20Pants.jpeg",
  },
  towel: {
    default: "/assets/icon/Towels.jpeg",
    hover: "/assets/icon/Towels.jpeg",
  },
  towels: {
    default: "/assets/icon/Towels.jpeg",
    hover: "/assets/icon/Towels.jpeg",
  },
  default: {
    default: "https://placehold.co/128x128/f3f4f6/9ca3af?text=No+Image",
    hover: "https://placehold.co/128x128/f3f4f6/9ca3af?text=No+Image",
  },
};

/**
 * Get image URLs for a category
 * @param {string} categoryName - Category name to match
 * @returns {Object} - Object with default and hover image URLs
 */
export const getCategoryImages = (categoryName = '') => {
  if (!categoryName) return categoryImageMap.default;

  // Normalize by converting to lowercase and stripping all non-alphanumeric characters (spaces, dashes, etc.)
  const normalized = categoryName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Direct match
  if (categoryImageMap[normalized]) {
    return categoryImageMap[normalized];
  }

  // Partial match
  for (const [key, images] of Object.entries(categoryImageMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return images;
    }
  }

  return categoryImageMap.default;
};

/**
 * Profile menu icon mapping
 */
export const profileIconMap = {
  dashboard: Home,
  home: Home,
  settings: ShieldCheck,
  mappin: MapPin,
  star: Star,
  heart: Heart,
  award: Award,
  gift: Gift,
  zap: Zap,
  shoppingbag: ShoppingBag,
};

/**
 * Get icon component for profile menu items
 * @param {string} iconName - Icon name from profile menu
 * @returns {React.Component} - Lucide icon component
 */
export const getProfileIcon = (iconName = '') => {
  if (!iconName) return Store;

  const normalized = iconName.toLowerCase().replace(/\s+/g, '');
  return profileIconMap[normalized] || Store;
};

/**
 * Enhanced category utilities for navigation
 */
export const categoryUtils = {
  /**
   * Get formatted category name (remove trailing dots)
   */
  formatCategoryName: (name) => {
    if (!name) return '';
    return name.replace(/\.+$/, '').trim();
  },

  /**
   * Build category URL
   */
  getCategoryUrl: (categoryId, subCategoryId = null, childCategoryId = null) => {
    let url = `/category/${categoryId}`;
    if (subCategoryId) url += `/${subCategoryId}`;
    if (childCategoryId) url += `/${childCategoryId}`;
    return url;
  },

  /**
   * Get category hierarchy as breadcrumb
   */
  getCategoryBreadcrumb: (categories, categoryId, subCategoryId = null, childCategoryId = null) => {
    const breadcrumb = [];

    const category = categories.find(c => c.id === categoryId);
    if (!category) return breadcrumb;

    breadcrumb.push({ id: category.id, name: category.name, type: 'category' });

    if (subCategoryId) {
      const subCategory = category.ProductSubCategories?.find(s => s.id === subCategoryId);
      if (subCategory) {
        breadcrumb.push({ id: subCategory.id, name: subCategory.name, type: 'subcategory' });

        if (childCategoryId) {
          const childCategory = subCategory.ProductChildCategories?.find(c => c.id === childCategoryId);
          if (childCategory) {
            breadcrumb.push({ id: childCategory.id, name: childCategory.name, type: 'childcategory' });
          }
        }
      }
    }

    return breadcrumb;
  },

  /**
   * Check if category has subcategories
   */
  hasSubcategories: (category) => {
    return category?.ProductSubCategories && category.ProductSubCategories.length > 0;
  },

  /**
   * Check if subcategory has child categories
   */
  hasChildCategories: (subcategory) => {
    return subcategory?.ProductChildCategories && subcategory.ProductChildCategories.length > 0;
  }
};