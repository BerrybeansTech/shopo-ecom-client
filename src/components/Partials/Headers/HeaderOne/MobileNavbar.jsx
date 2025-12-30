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
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { getCategoryIcon, getProfileIcon } from "../../../../utils/categoryIconMapping";

const MobileNavbar = ({
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
  setSearchQuery,
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showInlineSearch, setShowInlineSearch] = useState(false);
  const [showCategoriesDrawer, setShowCategoriesDrawer] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);

  // More options menu items
  const moreOptionsItems = [
    {
      id: "home",
      label: "Home",
      description: "Back to homepage",
      icon: Home,
      path: "/",
    },
    {
      id: "company",
      label: "About Us",
      description: "Learn about our story",
      icon: Info,
      path: "/about",
    },
    {
      id: "contact",
      label: "Contact Us",
      description: "Get in touch with us",
      icon: Phone,
      path: "/contact",
    },
    {
      id: "track",
      label: "Track Order",
      description: "Track your shipment",
      icon: Package,
      path: "/tracking-order",
    },
    {
      id: "faq",
      label: "FAQ",
      description: "Frequently asked questions",
      icon: HelpCircle,
      path: "/faq",
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      description: "Your privacy matters",
      icon: Shield,
      path: "/privacy-policy",
    },
    {
      id: "terms",
      label: "Terms & Conditions",
      description: "Legal disclaimer",
      icon: FileText,
      path: "/terms-condition",
    },
    {
      id: "shipping",
      label: "Shipping Policy",
      description: "Delivery information",
      icon: Truck,
      path: "/shipping-policy",
    },
    {
      id: "returns",
      label: "Returns & Refunds",
      description: "Return and refund policy",
      icon: RefreshCw,
      path: "/return-policy",
    },
  ];

  // Professional Cart Icon SVG Component
  const CartIcon = () => (
    <svg
      className="w-6 h-6 current-color"
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

  // Professional Cart Icon SVG for Top Header
  const CartIconSmall = () => (
    <svg
      className="w-6 h-6 text-gray-700"
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

  const showSearchResults = searchQuery.trim() !== "" && !searchLoading;

  // Handle scroll to show/hide bottom navigation
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

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedSubcategory(null);
  };

  const toggleSubcategory = (subcategoryId) => {
    setExpandedSubcategory(
      expandedSubcategory === subcategoryId ? null : subcategoryId
    );
  };

  return (
    <div className="lg:hidden">
      {/* Top Fixed Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="px-4 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-11 w-auto object-contain"
            />
          </Link>

          {/* Right Side Icons - Account & Cart */}
          <div className="flex items-center gap-2">
            {/* Account Icon Button */}
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

            {/* Cart Icon Button */}
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

        {/* Inline Search Bar */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showInlineSearch ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for products..."
                className="w-full h-11 pl-4 pr-20 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black transition-all"
                autoFocus={showInlineSearch}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => {
                    setShowInlineSearch(false);
                    setSearchQuery("");
                  }}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <button className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                  {searchLoading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="py-2">
                  {searchResults.map((product, idx) => (
                    <Link
                      key={`${product.id}-${idx}`}
                      to={getProductUrl(product)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setShowInlineSearch(false);
                        setSearchQuery("");
                      }}
                    >
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 text-sm font-medium text-gray-700 line-clamp-1">
                        {product.name}
                      </span>
                      <span className="text-xs text-gray-400">Enter</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.trim() !== "" &&
              !searchLoading &&
              searchResults.length === 0 && (
                <div className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-6 text-center z-50">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
          </div>
        </div>
      </nav>

      {/* Categories Drawer - Left Slider */}
      {showCategoriesDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[55]"
            onClick={() => setShowCategoriesDrawer(false)}
          />
          <div className="categories-drawer fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[60] overflow-hidden animate-slide-right">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Grid className="w-6 h-6" />
                <h2 className="text-lg font-bold">Categories</h2>
              </div>
              <button
                onClick={() => setShowCategoriesDrawer(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories List */}
            <div className="overflow-y-auto h-full pb-24">
              {navigationCategories.length > 0 ? (
                <div className="py-2">
                  {navigationCategories.map((category) => {
                    const isExpanded = expandedCategory === category.id;
                    const CategoryIcon = getCategoryIcon(category.name);
                    
                    return (
                      <div key={category.id} className="border-b border-gray-100">
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="flex items-center justify-between w-full px-5 py-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-black group-hover:to-gray-800 transition-all">
                              <CategoryIcon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                            <span className="font-semibold text-sm text-gray-900 group-hover:text-black">
                              {category.name}
                            </span>
                          </div>
                          {category.subcategories.length > 0 && (
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>

                        {/* Subcategories */}
                        {isExpanded && category.subcategories.length > 0 && (
                          <div className="bg-gray-50">
                            {category.subcategories.map((subcategory) => {
                              const isSubExpanded =
                                expandedSubcategory === subcategory.id;
                              return (
                                <div key={subcategory.id} className="border-t border-gray-200">
                                  {/* Subcategory Header */}
                                  <div className="flex items-center">
                                    <Link
                                      to={`/category/${category.id}/${subcategory.id}`}
                                      className="flex-1 flex items-center gap-3 px-5 pl-12 py-3.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium group"
                                      onClick={() => setShowCategoriesDrawer(false)}
                                    >
                                      <div className="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-black transition-colors"></div>
                                      {subcategory.name}
                                    </Link>
                                    {subcategory.childCategories.length > 0 && (
                                      <button
                                        onClick={() =>
                                          toggleSubcategory(subcategory.id)
                                        }
                                        className="px-4 py-3.5 hover:bg-gray-100"
                                      >
                                        <ChevronDown
                                          className={`w-4 h-4 text-gray-400 transition-transform ${
                                            isSubExpanded ? "rotate-180" : ""
                                          }`}
                                        />
                                      </button>
                                    )}
                                  </div>

                                  {/* Child Categories */}
                                  {isSubExpanded &&
                                    subcategory.childCategories.length > 0 && (
                                      <div className="bg-white">
                                        {subcategory.childCategories.map(
                                          (childCategory) => (
                                            <Link
                                              key={childCategory.id}
                                              to={`/category/${category.id}/${subcategory.id}/${childCategory.id}`}
                                              className="flex items-center gap-3 px-5 pl-20 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors group"
                                              onClick={() =>
                                                setShowCategoriesDrawer(false)
                                              }
                                            >
                                              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-900" />
                                              {childCategory.name}
                                            </Link>
                                          )
                                        )}
                                      </div>
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
                <div className="text-center py-12">
                  <Grid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No categories available</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Account Dropdown - Full Screen Bottom Sheet */}
      {showAccountDropdown && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[55]"
            onClick={() => setShowAccountDropdown(false)}
          />
          <div className="account-dropdown-popup fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] max-h-[85vh] overflow-hidden animate-slide-up">
            {isAuthenticated ? (
              <>
                {/* Premium Header */}
                <div className="sticky top-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-5 py-6 border-b border-gray-700">
                  <div className="flex items-start justify-between mb-4">
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

                {/* Menu Items */}
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
                        giftcard: "Manage gift cards"
                      };
                      
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToProfile(item.hash);
                            setShowAccountDropdown(false);
                          }}
                          className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-all group active:scale-98"
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
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                        setShowAccountDropdown(false);
                      }}
                      className="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors active:scale-98"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6">
                {/* Close Button */}
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
                  className="block w-full py-4 bg-black text-white text-center rounded-2xl font-bold hover:bg-gray-800 transition-colors active:scale-98"
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* More Options Popup - Bottom Sheet */}
      {showMoreOptions && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[55]"
            onClick={() => setShowMoreOptions(false)}
          />
          <div className="more-options-popup fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Header */}
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

            {/* Menu Items */}
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

      {/* Bottom Navigation Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-2 py-2">
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

          <button
            onClick={() => setShowInlineSearch(!showInlineSearch)}
            className="relative -mt-6 p-3.5 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            <Search className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowCategoriesDrawer(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 transition-all"
          >
            <Grid className="w-5 h-5" />
            <span className="text-xs font-medium">Categories</span>
          </button>

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

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slide-right {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-slide-right {
          animation: slide-right 0.3s ease-out;
        }
        .active-scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default MobileNavbar;