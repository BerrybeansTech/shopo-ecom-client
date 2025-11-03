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
  Heart,
  Package,
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Sample categories - replace with your actual data
  const categories = [
    { name: "Electronics", subcategories: ["Smartphones", "Laptops", "Accessories"] },
    { name: "Fashion", subcategories: ["Men", "Women", "Kids"] },
    { name: "Home & Living", subcategories: ["Furniture", "Decor", "Kitchen"] },
    { name: "Beauty", subcategories: ["Skincare", "Makeup", "Haircare"] },
  ];

  // Sample search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    // Add your search logic here
    setShowSearchResults(true);
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
      {/* Premium Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 text-xs">
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-slate-300 transition-all duration-200 group">
                <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <Phone className="w-3 h-3" />
                </div>
                <span className="font-medium">+91 123 456 7890</span>
              </a>
              <a href="mailto:support@rabbitfinch.com" className="flex items-center gap-2 hover:text-slate-300 transition-all duration-200 group">
                <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <Mail className="w-3 h-3" />
                </div>
                <span className="font-medium">support@rabbitfinch.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Truck className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="font-semibold">Free Shipping on Orders Above ₹1,999</span>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <a href="/track-order" className="flex items-center gap-1.5 hover:text-slate-300 transition-all text-xs font-medium">
                <MapPin className="w-3 h-3" />
                Track Order
              </a>
              <a href="/support" className="flex items-center gap-1.5 hover:text-slate-300 transition-all text-xs font-medium">
                <HelpCircle className="w-3 h-3" />
                Help
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-2xl border-b border-slate-200" : "shadow-md"
        }`}
      >
        <div className="max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Primary Navigation Row */}
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center transition-all duration-300 hover:opacity-80">
                <div className="relative">
                  <img
                    src="/assets/images/logo.png"
                    alt="Rabbit & Finch"
                    className="h-12 w-auto object-contain lg:h-16"
                  />
                </div>
              </a>
            </div>

            {/* Enhanced Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full search-container">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300"></div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for products, brands, categories..."
                    className="relative w-full h-14 pl-6 pr-16 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-slate-900 focus:bg-white focus:shadow-xl transition-all duration-300 placeholder-slate-400"
                  />
                  <button className="absolute right-2 top-2 h-10 w-10 bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-xl hover:from-slate-800 hover:to-slate-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105">
                    <Search className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Enhanced Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto backdrop-blur-xl">
                    <div className="p-3">
                      {searchResults.map((product, index) => (
                        <a
                          key={index}
                          href="#"
                          className="flex items-center gap-4 p-3 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-xl transition-all duration-200 group"
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 bg-slate-100 rounded-xl border-2 border-slate-200 group-hover:border-slate-300 transition-all"></div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-900 mb-1">Product Name</div>
                            <div className="text-xs text-slate-500 font-medium mb-2">Brand • Category</div>
                            <div className="text-lg font-bold text-slate-900">₹0,000</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Quick Links - Desktop */}
              <div className="hidden xl:flex items-center gap-1">
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </a>
                <a
                  href="/shop"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shop</span>
                </a>
                <a
                  href="/wishlist"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </a>
              </div>

              {/* Cart Button */}
              <a
                href="/cart"
                className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group relative"
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-slate-900 to-slate-700 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg">
                    0
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[9px] text-slate-500 font-semibold leading-tight uppercase tracking-wider">
                    Shopping Cart
                  </div>
                  <div className="text-sm font-bold text-slate-900 leading-tight">
                    ₹0
                  </div>
                </div>
              </a>

              {/* Account Button */}
              <a
                href="/account"
                className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-gradient-to-br from-slate-900 to-slate-700 text-white hover:from-slate-800 hover:to-slate-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <User className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[9px] font-semibold leading-tight uppercase tracking-wider opacity-90">
                    My Account
                  </div>
                  <div className="text-sm font-bold leading-tight">
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

          {/* Categories Bar - Desktop */}
          <div className="hidden lg:block border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 py-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(index)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200">
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>

                  {/* Dropdown */}
                  {activeCategory === index && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white shadow-2xl border-2 border-slate-200 rounded-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 pb-2 mb-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          {category.name}
                        </div>
                      </div>
                      {category.subcategories.map((sub, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="block px-5 py-3 mx-2 text-sm font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 rounded-xl transition-all duration-200"
                        >
                          {sub}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-12 pl-5 pr-14 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-slate-900 focus:bg-white focus:shadow-lg transition-all duration-300"
              />
              <button className="absolute right-2 top-2 h-8 w-8 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-800 transition-all">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
            {/* Mobile Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center ring-2 ring-white/20">
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
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
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
                {categories.map((category, idx) => (
                  <details key={idx} className="group">
                    <summary className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl cursor-pointer hover:from-slate-100 hover:to-slate-200 transition-all list-none">
                      <span className="font-bold text-slate-900 text-sm">
                        {category.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-600 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 ml-2 space-y-1">
                      {category.subcategories.map((sub, subIdx) => (
                        <a
                          key={subIdx}
                          href="#"
                          className="block p-3 pl-6 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          {sub}
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
                  { name: "Home", icon: Home },
                  { name: "Shop All", icon: ShoppingCart },
                  { name: "Track Order", icon: Package },
                  { name: "Support", icon: HelpCircle },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl hover:from-slate-100 hover:to-slate-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                      <item.icon className="w-5 h-5 text-slate-700" />
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
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center ring-2 ring-white/20">
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