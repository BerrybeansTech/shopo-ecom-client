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
  ShoppingBag,
  UserCircle,
  Package,
  Store,
  FileText,
  Shield,
  Truck,
  RefreshCw,
  HelpCircle,
  Info,
  Phone,
  ChevronRight,
  LayoutDashboard,
  MapPin,
  Star,
  Heart,
  Gift,
  CreditCard,
  Users,
  LogOut,
} from "lucide-react";

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

  const getIconComponent = (iconName) => {
    const iconMap = {
      Home: Home,
      ShoppingBag: ShoppingBag,
      Settings: LayoutDashboard,
      MapPin: MapPin,
      Star: Star,
      Heart: Heart,
      Award: Star,
      Gift: Gift,
      Zap: Star,
      Package: Package,
      Store: Store,
      Grid: LayoutDashboard,
      Dashboard: LayoutDashboard,
      Orders: Package,
      Address: MapPin,
      Reviews: Star,
      Wishlist: Heart,
      Loyalty: Gift,
      Referral: Users,
      GiftCard: CreditCard,
    };
    return iconMap[iconName] || LayoutDashboard;
  };

  const showSearchResults = searchQuery.trim() !== "" && !searchLoading;

  // Enhanced profile menu with better organization
  const enhancedProfileMenu = [
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Overview & stats",
      icon: "Dashboard",
      hash: "#dashboard",
    },
    {
      id: "orders",
      label: "My Orders",
      description: "Track & manage orders",
      icon: "Orders",
      hash: "#orders",
    },
    {
      id: "address",
      label: "Addresses",
      description: "Manage delivery addresses",
      icon: "Address",
      hash: "#address",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      description: "Saved items",
      icon: "Wishlist",
      hash: "#wishlist",
    },
    {
      id: "reviews",
      label: "Reviews",
      description: "Your product reviews",
      icon: "Reviews",
      hash: "#reviews",
    },
    {
      id: "loyalty",
      label: "Loyalty Program",
      description: "Rewards & points",
      icon: "Loyalty",
      hash: "#loyalty",
    },
    {
      id: "referral",
      label: "Refer & Earn",
      description: "Invite friends",
      icon: "Referral",
      hash: "#referral",
    },
    {
      id: "giftcard",
      label: "Gift Cards",
      description: "Manage gift cards",
      icon: "GiftCard",
      hash: "#giftcard",
    },
  ];

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
      id: "blog", // ← NEW BLOG ITEM
      label: "Blog",
      description: "Read latest articles & tips",
      icon: FileText,
      path: "/blogs",
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

  return (
    <div className="lg:hidden">
      {/* Top Fixed Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="px-4 py-5 flex items-center justify-between gap-3">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-11 w-auto object-contain"
            />
          </Link>

          {/* Cart Button in Header */}
          <Link
            to="/cart"
            className="relative p-4 rounded-2xl transition-colors min-w-[52px] min-h-[52px] flex items-center justify-center hover:bg-gray-50 active:scale-95"
          >
            <ShoppingBag className="w-7 h-7 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Full Search Panel */}
      {showMobileSearch && (
        <div
          className="fixed inset-0 bg-white z-[60] overflow-y-auto"
          style={{ paddingTop: "64px", paddingBottom: "80px" }}
        >
          <div className="px-4 py-5">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => {
                  setShowMobileSearch(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">Search Products</h2>
            </div>

            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full h-12 pl-5 pr-14 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:bg-white focus:border-black transition-all"
                autoFocus
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                {searchLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-medium px-1">
                  Found {searchResults.length}{" "}
                  {searchResults.length === 1 ? "result" : "results"}
                </p>
                {searchResults.map((product, idx) => (
                  <Link
                    key={`${product.id}-${idx}`}
                    to={getProductUrl(product)}
                    className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors"
                    onClick={() => {
                      setShowMobileSearch(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {getProductCategoryInfo(product)}
                      </div>
                      <div className="font-bold text-sm text-black mt-1.5">
                        {formatINR(getProductPrice(product))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.trim() !== "" &&
              !searchLoading &&
              searchResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try searching with different keywords
                  </p>
                </div>
              )}

            {!searchQuery.trim() && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Start searching</p>
                <p className="text-sm text-gray-400 mt-1">
                  Find your favorite products
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* IMPROVED Mobile Account Dropdown - Full Screen Bottom Sheet */}
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

                {/* Menu Items - Grid Layout for Better UX */}
                <div
                  className="overflow-y-auto pb-6"
                  style={{ maxHeight: "calc(85vh - 140px)" }}
                >
                  <div className="px-4 py-5 space-y-2">
                    {(profileMenuItems.length > 0
                      ? profileMenuItems
                      : enhancedProfileMenu
                    ).map((item) => {
                      const Icon = getIconComponent(item.icon);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToProfile(item.hash);
                            setShowAccountDropdown(false);
                          }}
                          className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-all group active:scale-98"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-semibold text-sm text-gray-900 group-hover:text-black">
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {item.description}
                              </div>
                            )}
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
                    Sign in to unlock exclusive features and personalized
                    experience
                  </p>
                </div>

                {/* Login Benefits */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">
                      Track your orders in real-time
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">
                      Save your favorite items
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">
                      Earn rewards and exclusive offers
                    </p>
                  </div>
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

      {/* More Options Popup */}
      {showMoreOptions && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[55]"
            onClick={() => setShowMoreOptions(false)}
          />
          <div className="more-options-popup fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] max-h-[80vh] overflow-hidden animate-slide-up">
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
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="relative -mt-6 p-3.5 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95"
          >
            <Search className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAccountDropdown(!showAccountDropdown);
            }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
              showAccountDropdown
                ? "text-black bg-gray-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Account</span>
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
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .active-scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default MobileNavbar;