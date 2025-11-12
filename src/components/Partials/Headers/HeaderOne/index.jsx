import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  HelpCircle,
  User,
  Menu,
  X,
  Search,
  ShoppingBag,
  ChevronDown,
  Heart,
  Package,
  Sparkles,
  Shirt,
  Boxes,
  Dumbbell,
  Watch,
  Footprints,
  Glasses,
  ShoppingBasket,
  LogOut,
} from "lucide-react";
import { useProducts } from "../../../AllProductPage/hooks/useProducts";
import { useAuth } from "../../../Auth/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  // Use the products hook to get categories from Redux store
  const { 
    categories, 
    fetchCategoriesOnly,
    loading, 
    hasCategories,
    getFlattenedCategories,
    getCategoryById 
  } = useProducts();

  // Use the auth hook to get user authentication state
  const { 
    user, 
    isAuthenticated, 
    logout, 
    loading: authLoading 
  } = useAuth();

  // Fetch ONLY categories data on component mount if not already loaded
  useEffect(() => {
    const initializeCategories = async () => {
      if ((!categories || categories.length === 0) && !loading && !hasCategories) {
        console.log('Navbar: Fetching categories data only');
        try {
          await fetchCategoriesOnly();
        } catch (error) {
          console.error('Navbar: Failed to fetch categories data', error);
        }
      }
    };

    initializeCategories();
  }, [categories, loading, hasCategories, fetchCategoriesOnly]);

  // Click outside handler for search and account dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Handle search dropdown
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
        setIsSearchFocused(false);
      }
      
      // Handle account dropdown
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Transform categories for navigation - only categories structure
  const navigationCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      subcategories: category.ProductSubCategories?.map(subCategory => ({
        id: subCategory.id,
        name: subCategory.name,
        childCategories: subCategory.ProductChildCategories?.map(childCategory => ({
          id: childCategory.id,
          name: childCategory.name
        })) || []
      })) || []
    }));
  }, [categories]);

  const flattenedCategories = useMemo(() => getFlattenedCategories(), [getFlattenedCategories]);

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Topwear': Shirt,
      'Bottomwear': Boxes,
      'Activewear': Dumbbell,
      'Sportswear': Dumbbell,
      'Accessories': Watch,
      'Footwear': Footprints,
      'Fashion': Shirt,
      'Electronics': ShoppingBasket,
      'Home': Home,
      'Furniture': Home,
      'Mobile': ShoppingBasket,
      'Beauty': Glasses,
      'Sports': Dumbbell,
      'Watches': Watch,
      'Bags': ShoppingBag,
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return ShoppingCart;
  };

  // Search only through categories
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Search only through flattened categories
    const categoryResults = flattenedCategories.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);
    
    setSearchResults(categoryResults);
    setShowSearchResults(true);
  };

  // Generate proper category URLs
  const getCategoryUrl = (categoryItem) => {
    if (!categoryItem) return '/';
    
    switch (categoryItem.type) {
      case 'category':
        return `/category/${categoryItem.id}`;
      case 'subcategory':
        return `/category/${categoryItem.parentId}/${categoryItem.id}`;
      case 'childcategory':
        const subCategory = flattenedCategories.find(item => 
          item.id === categoryItem.parentId && item.type === 'subcategory'
        );
        if (subCategory) {
          return `/category/${subCategory.parentId}/${subCategory.id}/${categoryItem.id}`;
        }
        return `/category/${categoryItem.id}`;
      default:
        return '/';
    }
  };

  // Get category display name with hierarchy
  const getCategoryDisplayName = (categoryItem) => {
    if (!categoryItem) return '';
    
    switch (categoryItem.type) {
      case 'category':
        return `Category: ${categoryItem.name}`;
      case 'subcategory':
        const parentCategory = getCategoryById(categoryItem.parentId);
        return `Subcategory: ${parentCategory?.name || ''} › ${categoryItem.name}`;
      case 'childcategory':
        const parentSub = flattenedCategories.find(item => 
          item.id === categoryItem.parentId && item.type === 'subcategory'
        );
        const grandParentCategory = parentSub ? getCategoryById(parentSub.parentId) : null;
        return `Child: ${grandParentCategory?.name || ''} › ${parentSub?.name || ''} › ${categoryItem.name}`;
      default:
        return categoryItem.name;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setShowAccountDropdown(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Sign In';
    
    if (user.name) {
      return user.name.split(' ')[0]; // First name only
    } else if (user.email) {
      return user.email.split('@')[0]; // Username part of email
    } else if (user.phone) {
      return user.phone.replace('+91', ''); // Phone without country code
    }
    
    return 'My Account';
  };

  // Get user greeting for mobile
  const getUserGreeting = () => {
    if (!user) return 'Welcome Back!';
    
    if (user.name) {
      return `Hello, ${user.name.split(' ')[0]}!`;
    }
    
    return 'Welcome Back!';
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans">
      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Primary Navigation Row */}
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img
                    src="/assets/images/logo.png"
                    alt="Rabbit & Finch"
                    className="h-11 w-auto object-contain lg:h-14"
                  />
                </div>
              </Link>
            </div>

            {/* Enhanced Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div ref={searchRef} className="relative w-full">
                <div className={`relative flex items-center transition-all duration-300 ${
                  isSearchFocused ? 'transform scale-[1.02]' : ''
                }`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search categories..."
                    className={`w-full h-12 pl-5 pr-14 bg-gray-50 border-2 rounded-full text-sm font-medium focus:outline-none transition-all duration-300 placeholder-gray-400 ${
                      isSearchFocused 
                        ? 'border-black bg-white shadow-lg' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105">
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Results for Categories */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden">
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-xs font-bold text-black uppercase tracking-wider">
                          Categories ({searchResults.length})
                        </p>
                      </div>
                      {searchResults.map((categoryItem, index) => (
                        <Link
                          key={`${categoryItem.id}-${index}`}
                          to={getCategoryUrl(categoryItem)}
                          className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group border-b border-gray-100 last:border-0"
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border-2 border-gray-200 group-hover:border-black transition-all flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-black truncate">
                              {categoryItem.name}
                            </div>
                            <div className="text-xs text-gray-600 font-medium mt-0.5">
                              {getCategoryDisplayName(categoryItem)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {showSearchResults && searchResults.length === 0 && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 p-8 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-black">No categories found</p>
                    <p className="text-xs text-gray-600 mt-1">Try different keywords</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Quick Links - Desktop */}
              <div className="hidden xl:flex items-center gap-1">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/all-products"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Shop</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group relative"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-all" />
                  <span>Wishlist</span>
                </Link>
              </div>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="flex items-center gap-3 px-4 py-2.5 text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group relative"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg">
                    0
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">
                    Cart
                  </div>
                  <div className="text-sm font-bold text-black">
                    ₹0.00
                  </div>
                </div>
              </Link>

              {/* Account Button with Dropdown */}
              <div ref={accountRef} className="hidden lg:block relative">
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex items-center gap-3 px-5 py-2.5 bg-black text-white hover:bg-gray-800 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <User className="w-5 h-5 relative z-10" />
                  <div className="text-left relative z-10">
                    <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      {isAuthenticated ? 'Account' : 'Account'}
                    </div>
                    <div className="text-sm font-bold">
                      {isAuthenticated ? getUserDisplayName() : 'Sign In'}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${
                    showAccountDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Account Dropdown */}
                {showAccountDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 py-2">
                    {isAuthenticated ? (
                      // Logged In State
                      <>
                        <div className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-black">
                                {getUserDisplayName()}
                              </div>
                              <div className="text-xs text-gray-600">
                                {user?.email || user?.phone || 'Welcome back!'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 transition-all duration-200"
                            onClick={() => setShowAccountDropdown(false)}
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>
                        </div>
                        
                        <div className="border-t-2 border-gray-200 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      // Not Logged In State
                      <>
                        <div className="px-4 py-3 border-b-2 border-gray-200 bg-gray-50">
                          <div className="text-sm font-bold text-black">Welcome!</div>
                          <div className="text-xs text-gray-600">Sign in to your account</div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 px-4 py-3 mx-2 mb-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium text-sm"
                            onClick={() => setShowAccountDropdown(false)}
                          >
                            <User className="w-4 h-4" />
                            Sign In / Register
                          </Link>
                          
                          <div className="px-4 py-2">
                            <div className="text-xs text-gray-600 text-center">
                              New customer?{' '}
                              <Link
                                to="/signup"
                                className="text-black font-semibold hover:underline"
                                onClick={() => setShowAccountDropdown(false)}
                              >
                                Start here
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-black hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories Bar - Desktop */}
          <div className="hidden lg:block border-t border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-1 py-2">
              {navigationCategories.length > 0 ? (
                navigationCategories.map((category, index) => {
                  const CategoryIcon = getCategoryIcon(category.name);
                  return (
                    <div
                      key={category.id}
                      className="relative group"
                      onMouseEnter={() => setActiveCategory(index)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <button className="flex flex-col items-center gap-1.5 px-4 py-2.5 text-black hover:text-black transition-all duration-200 group-hover:bg-gray-100 rounded-lg min-w-[100px]">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 group-hover:bg-black transition-all duration-200 group-hover:shadow-md border border-gray-200 group-hover:border-black">
                          <CategoryIcon className="w-5 h-5 text-black group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-center leading-tight">{category.name}</span>
                          {category.subcategories.length > 0 && (
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                              activeCategory === index ? 'rotate-180' : ''
                            }`} />
                          )}
                        </div>
                      </button>

                      {/* Dropdown */}
                      {activeCategory === index && category.subcategories.length > 0 && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white shadow-2xl border-2 border-gray-200 rounded-xl py-2 z-50">
                          <div className="px-4 py-2.5 border-b-2 border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4 text-black" />
                              <span className="text-xs font-bold text-black uppercase tracking-wide">
                                {category.name}
                              </span>
                            </div>
                          </div>
                          <div className="px-2 py-2 max-h-96 overflow-y-auto">
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="mb-2 last:mb-0">
                                {/* Subcategory */}
                                <Link
                                  to={`/category/${category.id}/${subcategory.id}`}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-black hover:bg-gray-100 rounded-lg transition-all duration-200 group border-b border-gray-100"
                                  onClick={() => setActiveCategory(null)}
                                >
                                  <div className="w-2 h-2 rounded-full bg-black"></div>
                                  <span className="flex-1">{subcategory.name}</span>
                                </Link>
                                
                                {/* Child Categories */}
                                {subcategory.childCategories.length > 0 && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {subcategory.childCategories.map((childCategory) => (
                                      <Link
                                        key={childCategory.id}
                                        to={`/category/${category.id}/${subcategory.id}/${childCategory.id}`}
                                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-all duration-200 group"
                                        onClick={() => setActiveCategory(null)}
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-black transition-colors"></div>
                                        <span className="flex-1">{childCategory.name}</span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-2 text-gray-500 text-sm">
                  {loading ? "Loading categories..." : "No categories available"}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4 pt-1">
            <div ref={searchRef} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search categories..."
                className="w-full h-11 pl-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {searchResults.map((categoryItem, index) => (
                      <Link
                        key={`${categoryItem.id}-${index}`}
                        to={getCategoryUrl(categoryItem)}
                        className="flex items-center gap-3 p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200">
                          <ShoppingCart className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-black truncate">{categoryItem.name}</div>
                          <div className="text-xs text-gray-600 font-medium">{getCategoryDisplayName(categoryItem)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto border-l-2 border-gray-200">
            {/* Mobile Header */}
            <div className="bg-black text-white p-6 relative">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold">
                      {isAuthenticated ? getUserGreeting() : 'Welcome Back!'}
                    </div>
                    <div className="text-xs text-gray-300 font-medium mt-0.5">
                      {isAuthenticated 
                        ? (user?.email || user?.phone || 'Your account')
                        : 'Sign in to your account'
                      }
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="p-5">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Browse Categories
              </h3>
              <div className="space-y-2">
                {navigationCategories.length > 0 ? (
                  navigationCategories.map((category) => {
                    const CategoryIcon = getCategoryIcon(category.name);
                    return (
                      <details key={category.id} className="group">
                        <summary className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-black hover:shadow-md transition-all list-none">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                              <CategoryIcon className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-bold text-black text-sm">
                              {category.name}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-black transition-transform duration-300 group-open:rotate-180" />
                        </summary>
                        <div className="mt-2 ml-2 space-y-2">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id}>
                              <Link
                                to={`/category/${category.id}/${subcategory.id}`}
                                className="flex items-center gap-2 p-3 pl-6 text-sm font-bold text-black hover:bg-gray-100 rounded-lg transition-all border-b border-gray-100"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                {subcategory.name}
                              </Link>
                              
                              {subcategory.childCategories.length > 0 && (
                                <div className="ml-4 mt-1 space-y-1">
                                  {subcategory.childCategories.map((childCategory) => (
                                    <Link
                                      key={childCategory.id}
                                      to={`/category/${category.id}/${subcategory.id}/${childCategory.id}`}
                                      className="flex items-center gap-2 p-2 pl-8 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                      {childCategory.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {loading ? "Loading categories..." : "No categories available"}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 border-t-2 border-gray-200">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Home", icon: Home, href: "/" },
                  { name: "Shop All", icon: ShoppingCart, href: "/all-products" },
                  { name: "Track Order", icon: Package, href: "/track-order" },
                  { name: "Support", icon: HelpCircle, href: "/support" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all duration-200 border-2 border-gray-200 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center mb-2.5 shadow-sm border-2 border-gray-200 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-xs font-bold text-black">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Section */}
            <div className="p-5 border-t-2 border-gray-200">
              {isAuthenticated ? (
                // Logged In State
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    className="flex items-center justify-between p-5 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl group relative overflow-hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border-2 border-white/20 shadow-lg">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-base">My Account</div>
                        <div className="text-xs text-gray-300 font-medium mt-0.5">
                          {getUserDisplayName()}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 -rotate-90 relative z-10" />
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/orders"
                      className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all text-sm font-medium border-2 border-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                // Not Logged In State
                <Link
                  to="/login"
                  className="flex items-center justify-between p-5 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl group relative overflow-hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border-2 border-white/20 shadow-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-base">My Account</div>
                      <div className="text-xs text-gray-300 font-medium mt-0.5">Login / Sign Up</div>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 -rotate-90 relative z-10" />
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;