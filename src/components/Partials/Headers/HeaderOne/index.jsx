import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../../../AllProductPage/hooks/useProducts";
import { useAuth } from "../../../Auth/hooks/useAuth";
import { useCart } from "../../../CartPage/useCart";
import { productApi } from "../../../AllProductPage/productApi";
import { getCategoryImages } from "../../../../utils/categoryIconMapping";


import { getProductImage } from "../../../../utils/imageUtils";
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

  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    if (!hasAttemptedFetch.current && (!categories || categories.length === 0) && !loading) {
      hasAttemptedFetch.current = true;
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

  // Handle search - fetch suggestions for dropdown
  const handleSearch = async (query, options = { showDropdown: true }) => {
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
      setSearchResults(Array.isArray(products) ? products : []);
      if (options.showDropdown) {
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Navigate to single product page
  const getProductUrl = (product) => {
    if (!product) return "/";
    const id = product.id || product._id;
    return `/single-product/${id}`;
  };

  // Navigate to product and clear search state
  const navigateToProduct = (product) => {
    try {
      const url = getProductUrl(product);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      navigate(url);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const getProductPrice = (product) => product.sellingPrice || product.mrp || 0;

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
    navigateToProduct,
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
    setShowSearchResults,
    loading,
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
    navigateToProduct,
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
    setSearchQuery,
    showSearchResults,
    setShowSearchResults,
    loading,
  };

  return (
    <div className="font-sans">
      <DesktopNavbar {...desktopNavbarProps} />
      <MobileNavbar {...mobileNavbarProps} />
    </div>
  );
};

export default Navbar;