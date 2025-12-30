import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../../../AllProductPage/hooks/useProducts";
import { useAuth } from "../../../Auth/hooks/useAuth";
import { useCart } from "../../../CartPage/useCart";
import { productApi } from "../../../AllProductPage/productApi";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { categories, fetchCategoriesOnly, loading } = useProducts();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, total, formatINR, isEmpty } = useCart();

  const [isFetching, setIsFetching] = useState(false);

  const profileMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: "Home", hash: "/profile#dashboard" },
    { id: "profile", label: "Login & Security", icon: "Settings", hash: "/profile#profile" },
    { id: "address", label: "Address", icon: "MapPin", hash: "/profile#address" },
    { id: "order", label: "Orders", icon: "ShoppingBag", hash: "/profile#order" },
    { id: "review", label: "Reviews", icon: "Star", hash: "/profile#review" },
    { id: "wishlist", label: "Wishlist", icon: "Heart", hash: "/profile#wishlist" },
    { id: "loyalty", label: "Loyalty Program", icon: "Award", hash: "/profile#loyalty" },
    { id: "referral", label: "Referral", icon: "Zap", hash: "/profile#referral" },
    { id: "giftcard", label: "Gift Card", icon: "Gift", hash: "/profile#giftcard" },
  ];

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const fetchCategories = useCallback(async () => {
    if (isFetching) return;
    try {
      setIsFetching(true);
      await fetchCategoriesOnly(true);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchCategoriesOnly, isFetching]);

  const capitalizeFirstLetter = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

  useEffect(() => {
    if ((!categories || categories.length === 0) && !loading) {
      fetchCategories();
    }
  }, [categories, loading, fetchCategories]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.map((category) => ({
      id: category.id,
      name: category.name.replace(/\.+$/, "").trim(),
      subcategories:
        category.ProductSubCategories?.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          childCategories:
            subCategory.ProductChildCategories?.map((childCategory) => ({
              id: childCategory.id,
              name: childCategory.name,
            })) || [],
        })) || [],
    }));
  }, [categories]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    try {
      setSearchLoading(true);
      const response = await productApi.getAll({ name: query, limit: 8 });
      const products = response.data || response;
      setSearchResults(products);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const getProductUrl = (product) => {
    if (!product) return "/";
    return `/product/${product.name.toLowerCase().replace(/\s+/g, "-")}-${product.id}`;
  };

  const getProductPrice = (product) => product.sellingPrice || product.mrp || 0;

  const getProductImage = (product) => {
    if (product.thumbnailImage) {
      return product.thumbnailImage.startsWith("http")
        ? product.thumbnailImage
        : `http://luxcycs.com:5501/${product.thumbnailImage}`;
    }
    if (product.galleryImage && product.galleryImage.length > 0) {
      const firstImage = product.galleryImage[0];
      return firstImage.startsWith("http")
        ? firstImage
        : `http://luxcycs.com:5501/${firstImage}`;
    }
    return `https://placehold.co/400x400/ffffff/000000?text=${encodeURIComponent(product.name)}`;
  };

  const getProductCategoryInfo = (product) => {
    const category = product.category?.name || "Uncategorized";
    const subCategory = product.subCategory?.name;
    return subCategory ? `${category} › ${subCategory}` : category;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowAccountDropdown(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigateToProfile = (path) => {
    navigate(path);
    setShowAccountDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return "Profile";
    if (user.name) return capitalizeFirstLetter(user.name.split(" ")[0]);
    if (user.email) return user.email.split("@")[0];
    if (user.phone) return user.phone.replace("+91", "");
    return "My Profile";
  };

  const getCategoryImages = (categoryName) => {
    const imageMap = {
      Topwear: {
        default: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=128&h=128&fit=crop",
      },
      Bottomwear: {
        default: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=128&h=128&fit=crop",
      },
      Accessories: {
        default: "https://rukminim2.flixcart.com/fk-p-flap/128/128/image/f15c02bfeb02d15d.png",
      },
      Footwear: {
        default: "https://rukminim2.flixcart.com/fk-p-flap/128/128/image/69c6589653afdb9a.png",
      },
    };
    for (const [key, urls] of Object.entries(imageMap)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) return urls;
    }
    return {
      default: "https://rukminim2.flixcart.com/fk-p-flap/128/128/image/0d75b34f7d8fbcb3.png",
    };
  };

  // Props for DesktopNavbar
  const desktopNavbarProps = {
    isScrolled,
    navigationCategories,
    searchQuery,
    searchResults,
    showSearchResults,
    searchLoading,
    searchRef,
    accountRef,
    showAccountDropdown,
    isAuthenticated,
    user,
    itemCount,
    total,
    isEmpty,
    formatINR,
    activeSubcategory,
    activeCategory,
    profileMenuItems,
    getCategoryImages,
    getProductUrl,
    getProductImage,
    getProductCategoryInfo,
    getProductPrice,
    getUserDisplayName,
    isActiveRoute,
    handleSearch,
    handleLogout,
    navigateToProfile,
    setActiveCategory,
    setActiveSubcategory,
    setShowAccountDropdown,
  };

  // Props for MobileNavbar
  const mobileNavbarProps = {
    isScrolled,
    isMobileMenuOpen,
    showMobileSearch,
    navigationCategories,
    searchQuery,
    searchResults,
    searchLoading,
    searchRef,
    accountRef,
    showAccountDropdown,
    isAuthenticated,
    user,
    itemCount,
    total,
    isEmpty,
    formatINR,
    profileMenuItems,
    getProductUrl,
    getProductImage,
    getProductCategoryInfo,
    getProductPrice,
    getUserDisplayName,
    isActiveRoute,
    handleSearch,
    handleLogout,
    navigateToProfile,
    setIsMobileMenuOpen,
    setShowMobileSearch,
    setShowAccountDropdown,
  };

  return (
    <div className="font-sans">
      <DesktopNavbar {...desktopNavbarProps} />
      <MobileNavbar {...mobileNavbarProps} />
    </div>
  );
};

export default Navbar;