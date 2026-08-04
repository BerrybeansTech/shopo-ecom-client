// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   ShoppingBag,
//   UserCircle,
//   Search,
//   ChevronDown,
//   Package,
//   MapPin,
//   Settings,
//   Star,
//   Heart,
//   Award,
//   Gift,
//   LogOut,
//   Store,
//   Zap,
//   X,
// } from "lucide-react";

// const DesktopNavbar = ({
//   isScrolled,
//   navigationCategories,
//   searchQuery,
//   searchResults,
//   showSearchResults,
//   searchLoading,
//   searchRef,
//   accountRef,
//   showAccountDropdown,
//   isAuthenticated,
//   user,
//   itemCount,
//   total,
//   isEmpty,
//   formatINR,
//   activeSubcategory,
//   activeCategory,
//   profileMenuItems,
//   getCategoryImages,
//   getProductUrl,
//   getProductImage,
//   getProductCategoryInfo,
//   getProductPrice,
//   getUserDisplayName,
//   handleSearch,
//   handleLogout,
//   navigateToProfile,
//   setActiveCategory,
//   setActiveSubcategory,
//   setShowAccountDropdown,
//   setShowSearchResults,
// }) => {
//   const location = useLocation();

//   const isActiveRoute = (path) => {
//     if (path === "/") return location.pathname === "/";
//     return location.pathname.startsWith(path);
//   };

//   const getIconComponent = (iconName) => {
//     const iconMap = {
//       Home, ShoppingBag, Settings, MapPin, Star, Heart, Award, Gift, Zap,
//     };
//     return iconMap[iconName] || Home;
//   };

//   const clearSearch = () => {
//     handleSearch("");
//     setShowSearchResults(false);
//   };

//   return (
//     <nav
//       className={`hidden lg:block sticky top-0 z-50 bg-white transition-all duration-300 ${
//         isScrolled ? "shadow-lg" : "shadow-md"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Main Header - Reduced Height */}
//         <div className="flex items-center justify-between h-16 gap-4">
//           {/* Compact Logo */}
//           <div className="flex items-center flex-shrink-0">
//             <Link
//               to="/"
//               className="flex items-center transition-transform duration-300 hover:scale-105"
//             >
//               <img
//                 src="/assets/images/logo.png"
//                 alt="Logo"
//                 className="h-9 w-auto object-contain"
//               />
//             </Link>
//           </div>

//           {/* Compact Search */}
//           <div className="flex-1 max-w-xl">
//             <div ref={searchRef} className="relative w-full">
//               <div className="relative">
//                 <div className="relative flex items-center group">
//                   {!searchQuery && (
//                     <Search className="absolute left-3 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-gray-600 pointer-events-none" />
//                   )}
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     onFocus={() => setShowSearchResults(true)}
//                     placeholder="Search products..."
//                     className={`w-full h-10 ${searchQuery ? 'pl-3' : 'pl-10'} pr-10 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-black focus:shadow-md transition-all duration-200`}
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={clearSearch}
//                       className="absolute right-1.5 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                   {searchLoading && (
//                     <div className="absolute right-1.5 p-1.5">
//                       <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Compact Search Results */}
//               {showSearchResults && searchResults.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
//                   <div className="max-h-72 overflow-y-auto py-1">
//                     {searchResults.map((product, index) => (
//                       <Link
//                         key={`${product.id}-${index}`}
//                         to={getProductUrl(product)}
//                         className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all font-medium group"
//                         onClick={() => setShowSearchResults(false)}
//                       >
//                         <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
//                         <span className="flex-1 truncate">{product.name}</span>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {showSearchResults && searchQuery && searchResults.length === 0 && !searchLoading && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 px-4 py-6 text-center">
//                   <div className="text-sm text-gray-600">
//                     No results for "{searchQuery}"
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Compact Navigation Icons */}
//           <div className="flex items-center gap-0.5">
//             <Link to="/" className={`flex items-center gap-2 px-3 h-10 rounded-lg transition-all ${isActiveRoute("/") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100 hover:text-black"}`}>
//               <Home className="w-4 h-4" />
//               <span className="text-sm font-semibold">Home</span>
//             </Link>

//             <Link to="/all-products" className={`flex items-center gap-2 px-3 h-10 rounded-lg transition-all ${isActiveRoute("/all-products") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100 hover:text-black"}`}>
//               <Store className="w-4 h-4" />
//               <span className="text-sm font-semibold">Shop</span>
//             </Link>

//             <Link to="/track-order" className={`flex items-center gap-2 px-3 h-10 rounded-lg transition-all ${isActiveRoute("/track-order") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100 hover:text-black"}`}>
//               <Package className="w-4 h-4" />
//               <span className="text-sm font-semibold">Track</span>
//             </Link>

//             {/* Compact Cart */}
//             <Link to="/cart" className={`flex items-center gap-2 px-3 h-10 rounded-lg transition-all relative ${isActiveRoute("/cart") ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100 hover:text-black"}`}>
//               <div className="relative">
//                 <ShoppingBag className="w-4 h-4" />
//                 {itemCount > 0 && (
//                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
//                     {itemCount}
//                   </span>
//                 )}
//               </div>
//               <div className="flex flex-col justify-center">
//                 <span className="text-xs font-semibold leading-none">Cart</span>
//                 <span className="text-[10px] font-bold text-black mt-0.5">
//                   {isEmpty ? formatINR(0) : formatINR(total)}
//                 </span>
//               </div>
//             </Link>

//             {/* Compact Account Dropdown */}
//             <div ref={accountRef} className="relative">
//               <button
//                 onClick={() => setShowAccountDropdown(!showAccountDropdown)}
//                 className={`flex items-center gap-2 px-3 h-10 rounded-lg transition-all ${
//                   showAccountDropdown ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100 hover:text-black"
//                 }`}
//               >
//                 <UserCircle className="w-4 h-4" />
//                 <span className="text-sm font-semibold">
//                   {isAuthenticated ? getUserDisplayName() : "Account"}
//                 </span>
//                 <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAccountDropdown ? "rotate-180" : ""}`} />
//               </button>

//               {/* Compact Dropdown */}
//               {showAccountDropdown && (
//                 <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
//                   {isAuthenticated ? (
//                     <>
//                       <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
//                             <UserCircle className="w-5 h-5 text-white" />
//                           </div>
//                           <div>
//                             <div className="text-sm font-bold text-gray-900">{getUserDisplayName()}</div>
//                             <div className="text-xs text-gray-600">Welcome back!</div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="py-1.5 max-h-96 overflow-y-auto">
//                         {profileMenuItems.map((item) => {
//                           const Icon = getIconComponent(item.icon);
//                           return (
//                             <button
//                               key={item.id}
//                               onMouseDown={(e) => e.stopPropagation()}
//                               onClick={() => navigateToProfile(item.hash)}
//                               className="flex items-center gap-2.5 w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-all group"
//                             >
//                               <Icon className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
//                               <span>{item.label}</span>
//                             </button>
//                           );
//                         })}
//                       </div>

//                       <div className="border-t border-gray-200 bg-gray-50">
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium transition-all text-sm"
//                         >
//                           <LogOut className="w-4 h-4" />
//                           Sign Out
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="p-5 text-center">
//                       <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                         <UserCircle className="w-7 h-7 text-gray-400" />
//                       </div>
//                       <div className="font-bold text-base text-gray-900 mb-1.5">Welcome!</div>
//                       <div className="text-sm text-gray-600 mb-4">Sign in to access your account</div>
//                       <Link
//                         to="/login"
//                         className="block w-full py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
//                         onClick={() => setShowAccountDropdown(false)}
//                       >
//                         Sign In / Register
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Compact Categories Mega Menu */}
//         <div className="hidden lg:block border-t border-gray-200 bg-white">
//           <div className="flex items-center justify-center gap-4 px-4 py-3">
//             {navigationCategories.length > 0 ? (
//               navigationCategories.map((category, index) => {
//                 const categoryImages = getCategoryImages(category.name);
//                 const isActive = activeCategory === index;
//                 return (
//                   <div
//                     key={category.id}
//                     className="relative group"
//                     onMouseEnter={() => {
//                       setActiveCategory(index);
//                       if (category.subcategories.length > 0) setActiveSubcategory(0);
//                     }}
//                     onMouseLeave={() => {
//                       setActiveCategory(null);
//                       setActiveSubcategory(null);
//                     }}
//                   >
//                     <button className="flex flex-col items-center gap-1.5 px-2.5 py-1.5 hover:bg-gray-50 rounded-lg transition-all">
//                       <div className="w-11 h-11 flex items-center justify-center overflow-hidden rounded-lg">
//                         <img
//                           src={categoryImages.default}
//                           alt={category.name}
//                           className="w-full h-full object-cover transition-transform group-hover:scale-110"
//                         />
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className="text-xs font-semibold text-gray-800 whitespace-nowrap max-w-[80px] truncate">
//                           {category.name}
//                         </span>
//                         {category.subcategories.length > 0 && (
//                           <ChevronDown className={`w-3 h-3 text-gray-600 transition-transform ${isActive ? "rotate-180" : ""}`} />
//                         )}
//                       </div>
//                     </button>

//                     {isActive && category.subcategories.length > 0 && (
//                       <div className="absolute top-full left-0 mt-1.5 bg-white shadow-2xl border border-gray-200 rounded-lg z-50 flex overflow-hidden">
//                         <div className="min-w-[260px] bg-gray-50 border-r border-gray-200 py-4">
//                           <div className="space-y-0.5 px-2">
//                             {category.subcategories.map((subcategory, subIndex) => (
//                               <div
//                                 key={subcategory.id}
//                                 className={`rounded-lg cursor-pointer transition-all ${activeSubcategory === subIndex ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
//                                 onMouseEnter={() => setActiveSubcategory(subIndex)}
//                               >
//                                 <Link
//                                   to={`/category/${category.id}/${subcategory.id}`}
//                                   className={`flex items-center justify-between px-3 py-2 text-xs font-medium ${activeSubcategory === subIndex ? "text-black" : "text-gray-700 hover:text-black"}`}
//                                   onClick={() => {
//                                     setActiveCategory(null);
//                                     setActiveSubcategory(null);
//                                   }}
//                                 >
//                                   <span>{subcategory.name}</span>
//                                   {subcategory.childCategories.length > 0 && (
//                                     <ChevronDown className="w-3 h-3 -rotate-90 text-gray-400" />
//                                   )}
//                                 </Link>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {category.subcategories[activeSubcategory]?.childCategories.length > 0 && (
//                           <div className="min-w-[320px] bg-white py-4 px-6 max-h-96 overflow-y-auto">
//                             <h3 className="text-xs font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
//                               {category.subcategories[activeSubcategory].name}
//                             </h3>
//                             <div className="space-y-1">
//                               {category.subcategories[activeSubcategory].childCategories.map((childCategory) => (
//                                 <Link
//                                   key={childCategory.id}
//                                   to={`/category/${category.id}/${category.subcategories[activeSubcategory].id}/${childCategory.id}`}
//                                   className="block text-xs text-gray-700 hover:text-black hover:bg-gray-50 px-2.5 py-1.5 rounded-lg font-medium"
//                                   onClick={() => {
//                                     setActiveCategory(null);
//                                     setActiveSubcategory(null);
//                                   }}
//                                 >
//                                   {childCategory.name}
//                                 </Link>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-gray-500 text-sm py-2">No categories available</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default DesktopNavbar;



import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  UserCircle,
  Search,
  ChevronDown,
  Package,
  FileText,
  LogOut,
  Store,
  X,
} from "lucide-react";
import { getCategoryIcon, getCategoryImages, getProfileIcon } from "../../../../utils/categoryIconMapping";



const DesktopNavbar = ({
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
  setShowSearchResults,
  loading,
}) => {
  const navigate = useNavigate();
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Check if we're on the shop/all-products page
  const isShopPage = isActiveRoute("/all-products") || isActiveRoute("/category");

  const clearSearch = () => {
    handleSearch("");
    setShowSearchResults(false);
    // If we're on shop page, navigate to clear URL
    if (isShopPage) {
      navigate("/all-products");
    }
  };

  // Handle search submit (Enter key or Search button click)
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      // Close dropdown first
      setShowSearchResults(false);
      // Then navigate
      navigate(`/all-products?name=${encodeURIComponent(query)}`);
    }
  };

   const CartIcon = () => (
    <svg
      className="w-5 h-5 current-color"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );

  return (
    <nav
      className={`hidden lg:block sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/assets/images/logo.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div ref={searchRef} className="relative w-full">
              <div className="relative flex items-center group">
                {!searchQuery && (
                  <Search className="absolute left-4 w-5 h-5 text-gray-800 group-focus-within:text-gray-600 pointer-events-none" />
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value, { showDropdown: true })}
                  onFocus={() => setShowSearchResults(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="Search for products, brands and more..."
                  className={`w-full h-11 ${
                    searchQuery ? "pl-5" : "pl-12"
                  } pr-12 bg-white border border-gray-800 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-gray-900 focus:shadow-md transition-all duration-200`}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {searchLoading && (
                  <div className="absolute right-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-300 z-50 overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.slice(0, 5).map((product, index) => (
                      <button
                        key={`${product.id}-${index}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Navigate to single product page
                          const productUrl = getProductUrl(product);
                          setShowSearchResults(false);
                          navigate(productUrl);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors group text-left cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                        <span className="flex-1 font-medium">
                          {product.name}
                        </span>
                      </button>
                    ))}
                    {/* View all results button */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSearchSubmit();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 border-t border-gray-200 transition-colors cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}

              {showSearchResults &&
                searchQuery &&
                searchResults.length === 0 &&
                !searchLoading && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-300 z-50 px-4 py-6 text-center">
                    <div className="text-sm text-gray-600">
                      No results found for "{searchQuery}"
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActiveRoute("/")
                  ? "text-gray-900 font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title="Home"
            >
              <Home className="w-5 h-5" />
              <span className="text-[0.95rem] font-medium">Home</span>
            </Link>

            {/* Shop */}
            <Link
              to="/all-products"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActiveRoute("/all-products")
                  ? "text-gray-900 font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title="Shop"
            >
              <Store className="w-5 h-5" />
              <span className="text-[0.95rem] font-medium">Shop</span>
            </Link>

            {/* Track Order */}
            <Link
              to="/track-order"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActiveRoute("/track-order")
                  ? "text-gray-900 font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title="Track Order"
            >
              <Package className="w-5 h-5" />
              <span className="text-[0.95rem] font-medium">Track</span>
            </Link>

            {/* Blog */}
            <Link
              to="/blogs"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActiveRoute("/blogs")
                  ? "text-gray-900 font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title="Blog"
            >
              <FileText className="w-5 h-5" />
              <span className="text-[0.95rem] font-medium">Blog</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 relative group ${
                isActiveRoute("/cart")
                  ? "text-gray-900 font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title={`Cart (${itemCount} items)`}
            >
              <div className="relative">
                <CartIcon />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[0.95rem] font-medium">Cart</span>
            </Link>



            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 mx-2" />

            {/* Account Dropdown */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  showAccountDropdown
                    ? "text-gray-900 font-bold bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="Account"
              >
                <div className="relative">
                  <UserCircle className="w-5 h-5" />
                </div>
                <span className="text-[0.95rem] font-medium">
                  {isAuthenticated
                    ? getUserDisplayName()?.split(" ")[0]
                    : "Account"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showAccountDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Account Dropdown Menu */}
              {showAccountDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {isAuthenticated ? (
                    <>
                      {/* User Header */}
                      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {getUserDisplayName()}
                            </div>
                            <div className="text-xs text-gray-600">Account</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2 max-h-[400px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {profileMenuItems.map((item) => {
                          const IconComponent = getProfileIcon(item.icon);
                          return (
                            <button
                              key={item.id}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={() => navigateToProfile(item.hash)}
                              className="flex items-center gap-3 w-full px-5 py-3 text-[0.95rem] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                            >
                              <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Sign In Prompt */
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="font-bold text-base text-gray-900 mb-1">
                        Welcome!
                      </div>
                      <div className="text-xs text-gray-600 mb-5">
                        Sign in to access your account
                      </div>
                      <Link
                        to="/login"
                        className="block w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => setShowAccountDropdown(false)}
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Mega Menu */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="flex items-center justify-center gap-8 px-4 py-2">
            {navigationCategories.length > 0 ? (
              navigationCategories.map((category, index) => {
                const categoryImages = getCategoryImages(category.name);
                const CategoryIcon = getCategoryIcon(category.name);
                const isActive = activeCategory === index;
                
                return (
                  <div
                    key={category.id}
                    className="relative group"
                    onMouseEnter={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                      }
                      setActiveCategory(index);
                      if (category.subcategories.length > 0)
                        setActiveSubcategory(0);
                    }}
                    onMouseLeave={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                      timeoutRef.current = setTimeout(() => {
                        setActiveCategory(null);
                        setActiveSubcategory(null);
                      }, 200);
                    }}
                  >
                    <button className="flex flex-col items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all">
                      <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                        {categoryImages.default ? (
                          <img
                            src={categoryImages.default}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <CategoryIcon className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap max-w-[80px] truncate">
                          {category.name}
                        </span>
                        {category.subcategories.length > 0 && (
                          <ChevronDown
                            className={`w-3 h-3 text-gray-500 transition-transform ${
                              isActive ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isActive && category.subcategories.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border border-gray-200 rounded-lg z-50 flex overflow-hidden before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:content-['']">
                        {/* Subcategories */}
                        <div className="min-w-[240px] bg-gray-50 border-r border-gray-200 py-4">
                          <div className="space-y-1 px-2">
                            {category.subcategories.map(
                              (subcategory, subIndex) => (
                                <div
                                  key={subcategory.id}
                                  className={`rounded-lg cursor-pointer transition-all ${
                                    activeSubcategory === subIndex
                                      ? "bg-white shadow-sm"
                                      : "hover:bg-white/50"
                                  }`}
                                  onMouseEnter={() =>
                                    setActiveSubcategory(subIndex)
                                  }
                                >
                                  <Link
                                    to={`/all-products?subcategoryId=${subcategory.id}`}
                                    className={`flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors ${
                                      activeSubcategory === subIndex
                                        ? "text-gray-900"
                                        : "text-gray-700 hover:text-gray-900"
                                    }`}
                                    onClick={() => {
                                      if (timeoutRef.current) {
                                        clearTimeout(timeoutRef.current);
                                        timeoutRef.current = null;
                                      }
                                      setActiveCategory(null);
                                      setActiveSubcategory(null);
                                    }}
                                  >
                                    <span>{subcategory.name}</span>
                                    {subcategory.childCategories.length > 0 && (
                                      <ChevronDown className="w-3 h-3 -rotate-90 text-gray-400" />
                                    )}
                                  </Link>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Child Categories */}
                        {category.subcategories[activeSubcategory]
                          ?.childCategories.length > 0 && (
                          <div className="min-w-[300px] bg-white py-4 px-6 max-h-[400px] overflow-y-auto">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                              {category.subcategories[activeSubcategory].name}
                            </h3>
                            <div className="space-y-1">
                              {category.subcategories[
                                activeSubcategory
                              ].childCategories.map((childCategory) => (
                                <Link
                                  key={childCategory.id}
                                  to={`/all-products?childCategoryId=${childCategory.id}`}
                                  className="block text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded font-medium transition-colors"
                                  onClick={() => {
                                    if (timeoutRef.current) {
                                      clearTimeout(timeoutRef.current);
                                      timeoutRef.current = null;
                                    }
                                    setActiveCategory(null);
                                    setActiveSubcategory(null);
                                  }}
                                >
                                  {childCategory.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : loading ? (
              <div className="flex items-center gap-6 py-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                    <div className="w-16 h-3 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm py-2">
                No categories available
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavbar;