import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingCart,
  Truck,
  HelpCircle,
  User,
  Menu,
  X,
  Search,
  ShoppingBag,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import productsData from "../../../../data/products.json";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Extract unique categories from product data
  const extractCategoriesFromProducts = () => {
    const categories = {};

    productsData.products.forEach((product) => {
      const mainCategory = product.mainCategory;
      const subCategory = product.subCategory;

      if (!categories[mainCategory]) {
        categories[mainCategory] = new Set();
      }
      if (subCategory) {
        categories[mainCategory].add(subCategory);
      }
    });

    return Object.entries(categories).map(([name, subcats]) => ({
      name,
      subcategories: Array.from(subcats),
    }));
  };

  const categories = extractCategoriesFromProducts();

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = productsData.products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.mainCategory.toLowerCase().includes(query.toLowerCase()) ||
          product.subCategory?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Calculate cart total
  const calculateCartTotal = () => {
    const cartItems = productsData.products.slice(0, 3);
    return cartItems
      .reduce((total, item) => {
        const price = parseInt(
          item.offer_price.replace("₹", "").replace(",", "")
        );
        return total + price;
      }, 0)
      .toLocaleString("en-IN");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="font-sans">
      {/* Top Info Bar - Professional Touch */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 text-xs">
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:+911234567890" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 123 456 7890</span>
              </a>
              <a href="mailto:support@rabbitfinch.com" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span>support@rabbitfinch.com</span>
              </a>
            </div>
            <div className="flex items-center gap-1.5 mx-auto md:mx-0">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium">Free Shipping on Orders Above ₹1,999</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-xl" : "shadow-sm"
        }`}
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Primary Navigation Row */}
          <div className="flex items-center justify-between h-24 lg:h-28">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0 mr-8">
              <a href="/" className="flex items-center transition-transform hover:scale-105 duration-300">
                <img
                  src="/assets/images/logo.png"
                  alt="Rabbit & Finch"
                  className="h-14 w-auto object-contain lg:h-20"
                />
              </a>
            </div>

            {/* Search Bar - Desktop - Width decreased slightly */}
              <div className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative w-full search-container">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for products, brands, categories..."
                    className="w-full h-14 pl-6 pr-16 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-slate-900 focus:bg-white focus:shadow-lg transition-all duration-300 placeholder-slate-400"
                  />
                  <button className="absolute right-2 top-2 h-10 w-10 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg">
                    <Search className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      {searchResults.map((product, index) => (
                        <a
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                          onClick={() => setShowSearchResults(false)}
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-xl border-2 border-slate-100 group-hover:border-slate-300 transition-all"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate mb-1 group-hover:text-slate-700">
                              {product.name}
                            </div>
                            <div className="text-xs text-slate-500 font-medium mb-2">
                              {product.brand} • {product.mainCategory}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-slate-900">
                                {product.offer_price}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-8">
              {/* Quick Links - Desktop Only - All icons same size */}
              <div className="hidden xl:flex items-center gap-1"> {/* Reduced gap from 2 to 1 */}
                <a
                  href="/"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <Home className="w-5 h-5" /> {/* Made consistent size */}
                  <span>Home</span>
                </a>
                <a
                  href="/all-products"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" /> {/* Made consistent size */}
                  <span>Shop</span>
                </a>
                <a
                  href="/track-order"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <Truck className="w-5 h-5" /> {/* Made consistent size */}
                  <span>Track</span>
                </a>
              </div>

              {/* Cart */}
              <a
                href="/cart"
                className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md">
                    3
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[9px] text-slate-500 font-semibold leading-tight uppercase tracking-wide">
                    Shopping Cart
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    ₹{calculateCartTotal()}
                  </div>
                </div>
              </a>

              {/* Account - Now same width as search bar structure */}
              <a
                href="/profile"
                className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <User className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[9px] font-semibold leading-tight uppercase tracking-wide opacity-90">
                    My Account
                  </div>
                  <div className="text-xs font-bold leading-tight">
                    Login
                  </div>
                </div>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Categories Navigation Bar - Desktop */}
          <div className="hidden lg:block border-t border-slate-200">
            <div className="flex items-center justify-center gap-1 py-1">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(index)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200">
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeCategory === index && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white shadow-2xl border-2 border-slate-200 rounded-2xl py-3 z-50">
                      <div className="px-3 pb-2 mb-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          {category.name}
                        </div>
                      </div>
                      {category.subcategories.map((subcategory) => (
                        <a
                          key={subcategory}
                          href={`/category/${category.name.toLowerCase()}/${subcategory
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block px-5 py-3 mx-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all duration-200"
                        >
                          {subcategory}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className="relative search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-12 pl-5 pr-14 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-slate-900 focus:bg-white focus:shadow-lg transition-all duration-300"
              />
              <button className="absolute right-2 top-2 h-8 w-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {searchResults.map((product) => (
                      <a
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl border-2 border-slate-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate mb-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-500 font-medium mb-1">
                            {product.brand} • {product.mainCategory}
                          </div>
                          <div className="text-base font-bold text-slate-900">
                            {product.offer_price}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
            {/* Mobile Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-bold">Welcome!</div>
                    <div className="text-xs text-slate-300 font-medium">
                      Sign in to continue
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
                Browse Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <details key={category.name} className="group">
                    <summary className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all list-none">
                      <span className="font-bold text-slate-900 text-sm">
                        {category.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-600 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 ml-2 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <a
                          key={subcategory}
                          href={`/category/${category.name.toLowerCase()}/${subcategory
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block p-3 pl-6 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subcategory}
                        </a>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 border-t-2 border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Home", icon: Home, path: "/" },
                  { name: "Shop All", icon: ShoppingCart, path: "/shop" },
                  { name: "Track Order", icon: Truck, path: "/track-order" },
                  { name: "Support", icon: HelpCircle, path: "/support" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 hover:shadow-md transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                      <item.icon className="w-5 h-5 text-slate-700" /> {/* Made consistent size */}
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {item.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Account Section */}
            <div className="p-5 border-t-2 border-slate-100">
              <a
                href="/account"
                className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-base">My Account</div>
                    <div className="text-xs text-slate-300 font-medium">Login / Sign Up</div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;