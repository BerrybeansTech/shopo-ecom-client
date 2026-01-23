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

  const normalized = categoryName.toLowerCase().trim();

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
    default: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=128&h=128&fit=crop",
    hover: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=256&h=256&fit=crop",
  },
  bottomwear: {
    default: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=128&h=128&fit=crop",
    hover: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=256&h=256&fit=crop",
  },
  footwear: {
    default: "https://rukminim2.flixcart.com/fk-p-flap/128/128/image/69c6589653afdb9a.png",
    hover: "https://rukminim2.flixcart.com/fk-p-flap/256/256/image/69c6589653afdb9a.png",
  },
  accessories: {
    default: "https://rukminim2.flixcart.com/fk-p-flap/128/128/image/f15c02bfeb02d15d.png",
    hover: "https://rukminim2.flixcart.com/fk-p-flap/256/256/image/f15c02bfeb02d15d.png",
  },
  ethnic: {
    default: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=128&h=128&fit=crop",
    hover: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=256&h=256&fit=crop",
  },
  western: {
    default: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=128&h=128&fit=crop",
    hover: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=256&h=256&fit=crop",
  },
  default: {
    default: "https://rukminim2.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png",
    hover: "https://rukminim2.flixcart.com/fk-p-flap/256/256/image/0d75b34f7d8fbcb3.png",
  },
};

/**
 * Get image URLs for a category
 * @param {string} categoryName - Category name to match
 * @returns {Object} - Object with default and hover image URLs
 */
export const getCategoryImages = (categoryName = '') => {
  if (!categoryName) return categoryImageMap.default;

  const normalized = categoryName.toLowerCase().trim();

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