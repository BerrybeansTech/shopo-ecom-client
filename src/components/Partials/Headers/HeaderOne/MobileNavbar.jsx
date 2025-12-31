// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Home,
//   Menu,
//   X,
//   Search,
//   ShoppingBag,
//   ChevronDown,
//   UserCircle,
//   Package,
//   Store,
//   Grid,
//   FileText,
//   Shield,
//   Truck,
//   RefreshCw,
//   HelpCircle,
//   Info,
//   Phone,
//   Video,
//   Cookie,
//   AlertTriangle,
//   MoreHorizontal,
//   ChevronRight,
// } from "lucide-react";

// const MobileNavbar = ({
//   isScrolled,
//   isMobileMenuOpen,
//   showMobileSearch,
//   navigationCategories,
//   searchQuery,
//   searchResults,
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
//   profileMenuItems,
//   getProductUrl,
//   getProductImage,
//   getProductCategoryInfo,
//   getProductPrice,
//   getUserDisplayName,
//   isActiveRoute,
//   handleSearch,
//   handleLogout,
//   navigateToProfile,
//   setIsMobileMenuOpen,
//   setShowMobileSearch,
//   setShowAccountDropdown,
//   setSearchQuery,
// }) => {
//   const [showMoreOptions, setShowMoreOptions] = useState(false);
//   const [showBottomNav, setShowBottomNav] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   const getIconComponent = (iconName) => {
//     const iconMap = {
//       Home: Home,
//       ShoppingBag: ShoppingBag,
//       Settings: ShoppingBag,
//       MapPin: ShoppingBag,
//       Star: ShoppingBag,
//       Heart: ShoppingBag,
//       Award: ShoppingBag,
//       Gift: ShoppingBag,
//       Zap: ShoppingBag,
//       Package: Package,
//       Store: Store,
//       Grid: Grid,
//     };
//     return iconMap[iconName] || Home;
//   };

//   const showSearchResults = searchQuery.trim() !== "" && !searchLoading;

//   // More options menu items
//   const moreOptionsItems = [
//     {
//       id: "home",
//       label: "Home",
//       description: "Back to homepage",
//       icon: Home,
//       path: "/",
//     },
//     {
//       id: "company",
//       label: "About Us",
//       description: "Learn about our story",
//       icon: Info,
//       path: "/about",
//     },
//     {
//       id: "contact",
//       label: "Contact Us",
//       description: "Get in touch with us",
//       icon: Phone,
//       path: "/contact",
//     },
//     {
//       id: "track",
//       label: "Track Order",
//       description: "Track your shipment",
//       icon: Package,
//       path: "/tracking-order",
//     },
//     {
//       id: "faq",
//       label: "FAQ",
//       description: "Frequently asked questions",
//       icon: HelpCircle,
//       path: "/faq",
//     },
//     {
//       id: "privacy",
//       label: "Privacy Policy",
//       description: "Your privacy matters",
//       icon: Shield,
//       path: "/privacy-policy",
//     },
//     {
//       id: "terms",
//       label: "Terms & Conditions",
//       description: "Legal disclaimer",
//       icon: FileText,
//       path: "/terms-condition",
//     },
//     {
//       id: "shipping",
//       label: "Shipping Policy",
//       description: "Delivery information",
//       icon: Truck,
//       path: "/shipping-policy",
//     },
//     {
//       id: "returns",
//       label: "Returns & Refunds",
//       description: "Return and refund policy",
//       icon: RefreshCw,
//       path: "/return-policy",
//     },
//   ];

//   // Handle scroll to show/hide bottom navigation
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY < 50) {
//         // Always show when near top
//         setShowBottomNav(true);
//       } else if (currentScrollY > lastScrollY) {
//         // Scrolling down - hide
//         setShowBottomNav(false);
//       } else {
//         // Scrolling up - show
//         setShowBottomNav(true);
//       }

//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY]);

//   // Close more options when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showMoreOptions && !e.target.closest(".more-options-popup")) {
//         setShowMoreOptions(false);
//       }
//     };

//     if (showMoreOptions) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showMoreOptions]);

//   return (
//     <div className="lg:hidden">
//       {/* Top Fixed Header */}
//       <nav
//         className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
//           isScrolled ? "shadow-lg" : "shadow-md"
//         }`}
//       >
//         <div className="px-4 py-5 flex items-center justify-between gap-3">
//           <Link to="/" className="flex-shrink-0">
//             <img
//               src="/assets/images/logo.png"
//               alt="Logo"
//               className="h-11 w-auto object-contain"
//             />
//           </Link>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowAccountDropdown(!showAccountDropdown);
//             }}
//             className={`p-4 rounded-2xl transition-colors min-w-[52px] min-h-[52px] flex items-center justify-center ${
//               showAccountDropdown ? "bg-gray-100" : "hover:bg-gray-50"
//             }`}
//           >
//             <UserCircle className="w-7 h-7 text-gray-700" />
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Full Search Panel */}
//       {showMobileSearch && (
//         <div
//           className="fixed inset-0 bg-white z-[60] overflow-y-auto"
//           style={{ paddingTop: "64px", paddingBottom: "80px" }}
//         >
//           <div className="px-4 py-5">
//             <div className="flex items-center gap-3 mb-5">
//               <button
//                 onClick={() => {
//                   setShowMobileSearch(false);
//                   setSearchQuery("");
//                 }}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//               <h2 className="text-lg font-semibold">Search Products</h2>
//             </div>

//             <div className="relative mb-6">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search for products, brands and more..."
//                 className="w-full h-12 pl-5 pr-14 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:bg-white focus:border-black transition-all"
//                 autoFocus
//               />
//               <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
//                 {searchLoading ? (
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Search className="w-4 h-4" />
//                 )}
//               </button>
//             </div>

//             {showSearchResults && searchResults.length > 0 && (
//               <div className="space-y-3">
//                 <p className="text-sm text-gray-600 font-medium px-1">
//                   Found {searchResults.length}{" "}
//                   {searchResults.length === 1 ? "result" : "results"}
//                 </p>
//                 {searchResults.map((product, idx) => (
//                   <Link
//                     key={`${product.id}-${idx}`}
//                     to={getProductUrl(product)}
//                     className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors"
//                     onClick={() => {
//                       setShowMobileSearch(false);
//                       setSearchQuery("");
//                     }}
//                   >
//                     <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                       <img
//                         src={getProductImage(product)}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="font-semibold text-sm text-gray-900 line-clamp-1">
//                         {product.name}
//                       </div>
//                       <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
//                         {getProductCategoryInfo(product)}
//                       </div>
//                       <div className="font-bold text-sm text-black mt-1.5">
//                         {formatINR(getProductPrice(product))}
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}

//             {searchQuery.trim() !== "" &&
//               !searchLoading &&
//               searchResults.length === 0 && (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Search className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-gray-500 font-medium">No products found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Try searching with different keywords
//                   </p>
//                 </div>
//               )}

//             {!searchQuery.trim() && (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Search className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <p className="text-gray-500 font-medium">Start searching</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Find your favorite products
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Mobile Account Dropdown */}
//       {showAccountDropdown && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/20 z-[45]"
//             onClick={() => setShowAccountDropdown(false)}
//           />
//           <div
//             ref={accountRef}
//             onClick={(e) => e.stopPropagation()}
//             className="fixed top-16 right-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[50] max-h-[calc(100vh-5rem)] overflow-y-auto"
//           >
//             {isAuthenticated ? (
//               <>
//                 <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
//                       <UserCircle className="w-6 h-6 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="font-semibold text-gray-900 truncate">
//                         {getUserDisplayName()}
//                       </div>
//                       <div className="text-xs text-gray-500">Welcome back!</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="py-2 px-2">
//                   {profileMenuItems.map((item) => {
//                     const Icon = getIconComponent(item.icon);
//                     return (
//                       <button
//                         type="button"
//                         key={item.id}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           navigateToProfile(item.hash);
//                         }}
//                         className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                       >
//                         <Icon className="w-4 h-4 flex-shrink-0" />
//                         <span>{item.label}</span>
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <div className="p-3 border-t border-gray-100">
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleLogout();
//                     }}
//                     className="w-full py-2.5 bg-red-50 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="p-4">
//                 <div className="text-center mb-4">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <UserCircle className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Sign in to access your account
//                   </p>
//                 </div>
//                 <Link
//                   to="/login"
//                   className="block w-full py-3 bg-black text-white text-center rounded-lg font-semibold hover:bg-gray-800 transition-colors"
//                   onClick={() => setShowAccountDropdown(false)}
//                 >
//                   Sign In / Register
//                 </Link>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* More Options Popup */}
//       {showMoreOptions && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/40 z-[55]"
//             onClick={() => setShowMoreOptions(false)}
//           />
//           <div className="more-options-popup fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] max-h-[80vh] overflow-hidden animate-slide-up">
//             {/* Header */}
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-bold text-gray-900">
//                   More Options
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   Quick access to all pages
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowMoreOptions(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>

//             {/* Menu Items */}
//             <div
//               className="overflow-y-auto pb-6"
//               style={{ maxHeight: "calc(80vh - 80px)" }}
//             >
//               <div className="px-3 py-3 space-y-1">
//                 {moreOptionsItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <Link
//                       key={item.id}
//                       to={item.path}
//                       onClick={() => setShowMoreOptions(false)}
//                       className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all group"
//                     >
//                       <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
//                         <Icon className="w-5 h-5" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="font-semibold text-sm text-gray-900 group-hover:text-black">
//                           {item.label}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-0.5">
//                           {item.description}
//                         </div>
//                       </div>
//                       <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Bottom Navigation Bar with Scroll Animation */}
//       <div
//         className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ${
//           showBottomNav ? "translate-y-0" : "translate-y-full"
//         }`}
//         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
//       >
//         <div className="flex items-center justify-around px-2 py-2">
//           <Link
//             to="/"
//             className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
//               isActiveRoute("/")
//                 ? "text-black bg-gray-50"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             <Home className="w-5 h-5" />
//             <span className="text-xs font-medium">Home</span>
//           </Link>

//           <Link
//             to="/all-products"
//             className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
//               isActiveRoute("/all-products")
//                 ? "text-black bg-gray-50"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             <Store className="w-5 h-5" />
//             <span className="text-xs font-medium">Shop</span>
//           </Link>

//           <button
//             onClick={() => setShowMobileSearch(!showMobileSearch)}
//             className="relative -mt-6 p-3.5 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95"
//           >
//             <Search className="w-6 h-6" />
//           </button>

//           <Link
//             to="/cart"
//             className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all relative ${
//               isActiveRoute("/cart")
//                 ? "text-black bg-gray-50"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             <div className="relative">
//               <ShoppingBag className="w-5 h-5" />
//               {itemCount > 0 && (
//                 <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
//                   {itemCount > 9 ? "9+" : itemCount}
//                 </span>
//               )}
//             </div>
//             <span className="text-xs font-medium">Cart</span>
//           </Link>

//           <button
//             onClick={() => setShowMoreOptions(true)}
//             className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 transition-all"
//           >
//             <Menu className="w-5 h-5" />
//             <span className="text-xs font-medium">More</span>
//           </button>
//         </div>
//       </div>

//       {/* Spacer for bottom nav */}
//       <div className="h-16" />

//       <style >{`
//         @keyframes slide-up {
//           from {
//             transform: translateY(100%);
//           }
//           to {
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-up {
//           animation: slide-up 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MobileNavbar;



import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  Search,
  UserCircle,
  Package,
  Store,
  ChevronRight,
  LogOut,
  ChevronDown,
  Grid,
  Info,
  Phone,
  HelpCircle,
  Shield,
  FileText,
  Truck,
  RefreshCw,
  Filter,
} from "lucide-react";
import { getCategoryIcon, getProfileIcon } from "../../../../utils/categoryIconMapping";

const MobileNavbar = ({
  isScrolled,
  navigationCategories,
  searchQuery,
  searchResults,
  searchLoading,
  searchRef,
  showAccountDropdown,
  isAuthenticated,
  itemCount,
  profileMenuItems,
  getProductUrl,
  navigateToProduct,
  getUserDisplayName,
  isActiveRoute,
  handleSearch,
  handleLogout,
  navigateToProfile,
  setShowAccountDropdown,
  setSearchQuery,
  showSearchResults,
  setShowSearchResults,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showInlineSearch, setShowInlineSearch] = useState(false);
  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const isShopPage =
    location.pathname.startsWith("/all-products") ||
    location.pathname.startsWith("/category");

  // Sync with parent component for filter counts
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail) {
        if (typeof e.detail.count === "number") {
          setActiveFiltersCount(e.detail.count);
        }
        if (typeof e.detail.query === "string" && isShopPage) {
          setLocalSearchQuery(e.detail.query);
          if (e.detail.query.trim() !== "") {
            handleSearch(e.detail.query);
          }
        }
      }
    };
    window.addEventListener("active-filters-count-changed", handleSync);
    return () =>
      window.removeEventListener("active-filters-count-changed", handleSync);
  }, [isShopPage, handleSearch]);

  // Handle filter toggle
  const handleFilterToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-product-filters"));
  };

  // Handle shop page search
  const handleShopSearch = (val) => {
    setLocalSearchQuery(val);
    handleSearch(val);
    setShowSearchResults(true);
  };

  // Handle shop search submit (Enter key or button click)
  const handleShopSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      navigate(`/all-products?name=${encodeURIComponent(localSearchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  // Handle shop search result click
  const handleShopSearchResultClick = (product) => {
    try {
      navigateToProduct(product);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Handle inline search submit (Enter key)
  const handleInlineSearchSubmit = () => {
    if (searchQuery.trim()) {
      setShowInlineSearch(false);
      setShowSearchResults(false);
      navigate(`/all-products?name=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Handle inline search result click
  const handleInlineSearchResultClick = (product) => {
    try {
      navigateToProduct(product);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // More options menu items
  const moreOptionsItems = [
    { id: "home", label: "Home", description: "Back to homepage", icon: Home, path: "/" },
    { id: "company", label: "About Us", description: "Learn about our story", icon: Info, path: "/about" },
    { id: "contact", label: "Contact Us", description: "Get in touch", icon: Phone, path: "/contact" },
    { id: "track", label: "Track Order", description: "Track shipment", icon: Package, path: "/tracking-order" },
    { id: "faq", label: "FAQ", description: "Common questions", icon: HelpCircle, path: "/faq" },
    { id: "privacy", label: "Privacy Policy", description: "Your privacy matters", icon: Shield, path: "/privacy-policy" },
    { id: "terms", label: "Terms & Conditions", description: "Legal info", icon: FileText, path: "/terms-condition" },
    { id: "shipping", label: "Shipping Policy", description: "Delivery info", icon: Truck, path: "/shipping-policy" },
    { id: "returns", label: "Returns & Refunds", description: "Return policy", icon: RefreshCw, path: "/return-policy" },
  ];

  // Cart icon component
  const CartIconSmall = () => (
    <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );

  // Handle scroll to hide/show bottom nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowBottomNav(true);
      } else if (currentScrollY > lastScrollY) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close more options when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMoreOptions && !e.target.closest(".more-options-popup")) {
        setShowMoreOptions(false);
      }
    };

    if (showMoreOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreOptions]);

  // Toggle category
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedSubcategory(null);
  };

  // Toggle subcategory
  const toggleSubcategory = (subcategoryId) => {
    setExpandedSubcategory(
      expandedSubcategory === subcategoryId ? null : subcategoryId
    );
  };

  return (
    <div className="lg:hidden">
      {/* ===== TOP FIXED HEADER ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        {/* Logo and Account/Cart Icons */}
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-11 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">
            {/* Account Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAccountDropdown(!showAccountDropdown);
              }}
              className="relative p-3 rounded-lg transition-colors hover:bg-gray-50 active:scale-95"
              title="Account"
            >
              <UserCircle className="w-6 h-6 text-gray-700" />
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-3 rounded-lg transition-colors hover:bg-gray-50 active:scale-95"
              title="Shopping Cart"
            >
              <CartIconSmall />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* SHOP PAGE SEARCH BAR */}
        {isShopPage && (
          <div className="px-4 pb-4 relative" ref={searchRef}>
            <div className="relative group">
              <input
                type="text"
                value={localSearchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(e) => handleShopSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleShopSearchSubmit();
                  }
                }}
                placeholder="Search products..."
                className="w-full h-11 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition-all shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {localSearchQuery && (
                  <button
                    onClick={() => {
                      handleShopSearch("");
                      setShowSearchResults(false);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 active:scale-90 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleShopSearchSubmit}
                  className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors active:scale-95"
                  title="Search"
                >
                  {searchLoading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Shop Search Results - Dropdown */}
            {showSearchResults && localSearchQuery.trim() !== "" && searchResults.length > 0 && (
              <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-[60]">
                <div className="py-2">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                    Suggestions
                  </div>
                  {searchResults.slice(0, 5).map((product, idx) => (
                    <button
                      key={`shop-${product.id}-${idx}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const productName = product.name || "";
                        setShowSearchResults(false);
                        navigate(`/all-products?name=${encodeURIComponent(productName)}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 group text-left cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-black transition-colors" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700 line-clamp-1 group-hover:text-black transition-colors">
                          {product.name}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-black transition-colors flex-shrink-0" />
                    </button>
                  ))}
                  {/* View all results button */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShopSearchSubmit();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 border-t border-gray-200 transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    View all results for "{localSearchQuery}"
                  </button>
                </div>
              </div>
            )}

            {/* No Results Message */}
            {showSearchResults && localSearchQuery.trim() !== "" && !searchLoading && searchResults.length === 0 && (
              <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-8 text-center z-[60]">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
                <p className="text-xs text-gray-500">
                  We couldn't find anything for "{localSearchQuery}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* INLINE SEARCH BAR (for non-shop pages) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showInlineSearch ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
          }`}
          ref={searchRef}
        >
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleInlineSearchSubmit();
                  }
                }}
                placeholder="Search for products..."
                className="w-full h-11 pl-4 pr-20 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
                autoFocus={showInlineSearch}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => {
                    setShowInlineSearch(false);
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={handleInlineSearchSubmit}
                  className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors active:scale-95"
                  title="Search"
                >
                  {searchLoading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Inline Search Results */}
            {showSearchResults && searchQuery.trim() !== "" && searchResults.length > 0 && (
              <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="py-2">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                    Suggestions
                  </div>
                  {searchResults.slice(0, 5).map((product, idx) => (
                    <button
                      key={`inline-${product.id}-${idx}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const productName = product.name || "";
                        setShowInlineSearch(false);
                        setShowSearchResults(false);
                        navigate(`/all-products?name=${encodeURIComponent(productName)}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 group text-left cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-black transition-colors" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700 line-clamp-1 group-hover:text-black transition-colors">
                          {product.name}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-black transition-colors flex-shrink-0" />
                    </button>
                  ))}
                  {/* View all results button */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInlineSearchSubmit();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 border-t border-gray-200 transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}

            {/* No Results for Inline Search */}
            {showSearchResults && searchQuery.trim() !== "" && !searchLoading && searchResults.length === 0 && (
              <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-6 text-center z-50">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
                <p className="text-xs text-gray-500">We couldn't find anything for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== CATEGORIES DRAWER ===== */}
      {showCategoriesDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300"
            onClick={() => setShowCategoriesDrawer(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-2xl z-[60] overflow-hidden flex flex-col animate-slide-in-left">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                      <Grid className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight">Shop by Categories</h2>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] ml-11">Explore our collections</p>
                </div>
                <button
                  onClick={() => setShowCategoriesDrawer(false)}
                  className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-90 rounded-full transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-gray-50/50">
              {navigationCategories.length > 0 ? (
                <div className="py-4 px-3 space-y-2">
                  {navigationCategories.map((category) => {
                    const isExpanded = expandedCategory === category.id;
                    const CategoryIcon = getCategoryIcon(category.name);

                    return (
                      <div key={category.id} className={`rounded-2xl transition-all duration-300 ${isExpanded ? "bg-white shadow-md border border-gray-100 mb-4" : "hover:bg-white/80"}`}>
                        {/* Category Button */}
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className={`flex items-center justify-between w-full px-4 py-4 rounded-2xl transition-all group ${isExpanded ? "bg-gray-50/50" : ""}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              isExpanded 
                                ? "bg-black text-white shadow-lg shadow-black/20" 
                                : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                            }`}>
                              <CategoryIcon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className={`font-bold text-[15px] transition-colors ${isExpanded ? "text-black" : "text-gray-700 group-hover:text-black"}`}>
                                {category.name}
                              </span>
                              {category.subcategories.length > 0 && (
                                <span className="text-[10px] text-gray-400 font-semibold">{category.subcategories.length} Collections</span>
                              )}
                            </div>
                          </div>
                          {category.subcategories.length > 0 && (
                            <div className={`p-1.5 rounded-full transition-all ${isExpanded ? "bg-black/5 rotate-180" : "bg-gray-50 text-gray-400 group-hover:text-black"}`}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          )}
                        </button>

                        {/* Subcategories */}
                        {isExpanded && category.subcategories.length > 0 && (
                          <div className="px-2 pb-4 space-y-1 animate-fade-in">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mx-4 mb-3" />
                            {category.subcategories.map((subcategory) => {
                              const isSubExpanded = expandedSubcategory === subcategory.id;
                              const hasChildren = subcategory.childCategories && subcategory.childCategories.length > 0;

                              return (
                                <div key={subcategory.id} className="group/sub">
                                  {/* Subcategory Header */}
                                  {hasChildren ? (
                                    <div className={`rounded-xl transition-all ${isSubExpanded ? "bg-gray-50/80 mb-2" : "hover:bg-gray-50"}`}>
                                      <button
                                        onClick={() => toggleSubcategory(subcategory.id)}
                                        className="flex items-center justify-between w-full px-4 py-3.5 text-sm transition-all"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isSubExpanded ? "bg-black scale-125" : "bg-gray-300 group-hover/sub:bg-gray-400"}`} />
                                          <span className={`font-bold ${isSubExpanded ? "text-black" : "text-gray-600 group-hover/sub:text-black"}`}>
                                            {subcategory.name}
                                          </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSubExpanded ? "rotate-180" : ""}`} />
                                      </button>

                                      {/* Child Categories */}
                                      {isSubExpanded && (
                                        <div className="px-3 pb-3 space-y-1 animate-slide-down">
                                          <Link
                                            to={`/all-products?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                                            className="flex items-center gap-3 px-8 py-2.5 text-[13px] font-extrabold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            onClick={() => setShowCategoriesDrawer(false)}
                                          >
                                            <ChevronRight className="w-3.5 h-3.5" />
                                            <span>View All {subcategory.name}</span>
                                          </Link>
                                          {subcategory.childCategories.map((childCategory) => (
                                            <Link
                                              key={childCategory.id}
                                              to={`/all-products?categoryId=${category.id}&subcategoryId=${subcategory.id}&childCategoryId=${childCategory.id}`}
                                              className="flex items-center gap-3 px-8 py-2.5 text-[13px] font-medium text-gray-500 hover:text-black hover:bg-white rounded-lg transition-all group/child"
                                              onClick={() => setShowCategoriesDrawer(false)}
                                            >
                                              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover/child:text-black transition-colors" />
                                              {childCategory.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <Link
                                      to={`/all-products?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                                      className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-all group/link"
                                      onClick={() => setShowCategoriesDrawer(false)}
                                    >
                                      <div className="w-2 h-2 rounded-full bg-gray-300 group-hover/link:bg-black transition-all" />
                                      {subcategory.name}
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                    <Grid className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Categories Found</h3>
                  <p className="text-sm text-gray-500">We couldn't load the categories at this moment. Please try again later.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <Link
                to="/all-products"
                className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg shadow-black/10 active:scale-95 transition-all"
                onClick={() => setShowCategoriesDrawer(false)}
              >
                <Store className="w-5 h-5" />
                <span>Shop All Products</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ===== ACCOUNT DROPDOWN ===== */}
      {showAccountDropdown && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[55]"
            onClick={() => setShowAccountDropdown(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] max-h-[85vh] overflow-hidden">
            {isAuthenticated ? (
              <>
                {/* Account Header */}
                <div className="sticky top-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-5 py-6 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
                        <UserCircle className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg text-white truncate">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                          Welcome back! 👋
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAccountDropdown(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Account Menu Items */}
                <div
                  className="overflow-y-auto pb-6"
                  style={{ maxHeight: "calc(85vh - 140px)" }}
                >
                  <div className="px-4 py-5 space-y-2">
                    {profileMenuItems.map((item) => {
                      const IconComponent = getProfileIcon(item.icon);
                      const descriptions = {
                        dashboard: "Overview of your account",
                        profile: "Manage your login details",
                        address: "Manage shipping addresses",
                        order: "View your order history",
                        review: "Rate your purchases",
                        wishlist: "Your saved items",
                        loyalty: "Rewards and points",
                        referral: "Invite friends and earn",
                        giftcard: "Manage gift cards",
                      };

                      return (
                        <button
                          key={item.id}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToProfile(item.hash);
                            setShowAccountDropdown(false);
                          }}
                          className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-all group"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-semibold text-sm text-gray-900 group-hover:text-black">
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {descriptions[item.id]}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Sign Out Button */}
                  <div className="px-4 pb-4 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                        setShowAccountDropdown(false);
                      }}
                      className="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6">
                <button
                  onClick={() => setShowAccountDropdown(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="text-center mb-6 pt-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <UserCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Welcome!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sign in to unlock exclusive features
                  </p>
                </div>

                <Link
                  to="/login"
                  className="block w-full py-4 bg-black text-white text-center rounded-2xl font-bold hover:bg-gray-800 transition-colors"
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== MORE OPTIONS POPUP ===== */}
      {showMoreOptions && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[55]"
            onClick={() => setShowMoreOptions(false)}
          />
          <div className="more-options-popup fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  More Options
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quick access to all pages
                </p>
              </div>
              <button
                onClick={() => setShowMoreOptions(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div
              className="overflow-y-auto pb-6"
              style={{ maxHeight: "calc(80vh - 80px)" }}
            >
              <div className="px-3 py-3 space-y-1">
                {moreOptionsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setShowMoreOptions(false)}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all group"
                    >
                      <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-black">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== BOTTOM NAVIGATION ===== */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
              isActiveRoute("/")
                ? "text-black bg-gray-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Shop */}
          <Link
            to="/all-products"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
              isActiveRoute("/all-products")
                ? "text-black bg-gray-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-xs font-medium">Shop</span>
          </Link>

          {/* Filter or Search - Center Button */}
          {isShopPage ? (
            <button
              onClick={handleFilterToggle}
              className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all text-gray-500 hover:text-gray-700"
            >
              <div className="relative p-3.5 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center -mt-6">
                <Filter className="w-6 h-6" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight text-black">
                Filter
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowInlineSearch(!showInlineSearch)}
              className="relative -mt-6 p-3.5 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95"
            >
              <Search className="w-6 h-6" />
            </button>
          )}

          {/* Categories */}
          <button
            onClick={() => setShowCategoriesDrawer(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 transition-all"
          >
            <Grid className="w-5 h-5" />
            <span className="text-xs font-medium">Categories</span>
          </button>

          {/* More */}
          <button
            onClick={() => setShowMoreOptions(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 transition-all"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-16" />

      {/* Animations */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MobileNavbar;