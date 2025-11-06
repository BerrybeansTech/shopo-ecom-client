// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import {
//   Home,
//   ShoppingCart,
//   Truck,
//   HelpCircle,
//   User,
//   Menu,
//   X,
//   Search,
//   ShoppingBag,
//   ChevronDown,
//   MapPin,
//   Phone,
//   Mail,
//   Heart,
//   Package,
//   Bell,
//   Sparkles,
//   Shirt,
//   Laptop,
//   Home as HomeIcon,
//   Smartphone,
//   Watch,
//   Footprints,
//   Baby,
//   Book,
//   Dumbbell,
//   Palette,
// } from "lucide-react";
// import productsData from "../../../../data/products.json";

// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const searchRef = useRef(null);

//   // Extract categories and subcategories from imported JSON data
//   const extractCategories = () => {
//     const categoriesMap = new Map();
    
//     productsData.products.forEach(product => {
//       const mainCategory = product.mainCategory;
//       const subCategory = product.subCategory;
      
//       if (!categoriesMap.has(mainCategory)) {
//         categoriesMap.set(mainCategory, new Set());
//       }
//       if (subCategory) {
//         categoriesMap.get(mainCategory).add(subCategory);
//       }
//     });

//     const categories = Array.from(categoriesMap).map(([mainCategory, subCategoriesSet]) => ({
//       name: mainCategory,
//       subcategories: Array.from(subCategoriesSet)
//     }));

//     return categories;
//   };

//   const categories = extractCategories();

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === "") {
//       setSearchResults([]);
//       setShowSearchResults(false);
//       return;
//     }
    
//     const filteredProducts = productsData.products.filter(product =>
//       product.name.toLowerCase().includes(query.toLowerCase()) ||
//       product.brand.toLowerCase().includes(query.toLowerCase()) ||
//       product.mainCategory.toLowerCase().includes(query.toLowerCase()) ||
//       product.subCategory.toLowerCase().includes(query.toLowerCase())
//     );
    
//     setSearchResults(filteredProducts.slice(0, 5));
//     setShowSearchResults(true);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setShowSearchResults(false);
//         setIsSearchFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="font-sans">
//       {/* Premium Top Bar */}
//       <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between py-2.5 text-xs">
//             <div className="hidden md:flex items-center gap-6">
//               <Link to="tel:+911234567890" className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200 group">
//                 <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
//                 <span className="font-medium">+91 123 456 7890</span>
//               </Link>
//               <Link to="mailto:support@rabbitfinch.com" className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200 group">
//                 <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
//                 <span className="font-medium">support@rabbitfinch.com</span>
//               </Link>
//             </div>
//             <div className="flex items-center gap-2 mx-auto md:mx-0">
//               <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
//               <span className="font-semibold">Free Shipping on Orders Above ₹1,999</span>
//             </div>
//             <div className="hidden lg:flex items-center gap-5">
//               <Link to="/track-order" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors text-xs font-medium group">
//                 <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
//                 Track Order
//               </Link>
//               <Link to="/support" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors text-xs font-medium group">
//                 <HelpCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
//                 Help
//               </Link>
//               <Link to="/offers" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors text-xs font-medium group">
//                 <Bell className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
//                 Offers
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Navigation */}
//       <nav
//         className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
//           isScrolled ? "shadow-2xl" : "shadow-md"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Primary Navigation Row */}
//           <div className="flex items-center justify-between h-20">
//             {/* Logo Section */}
//             <div className="flex items-center flex-shrink-0">
//               <Link to="/" className="flex items-center transition-all duration-300 hover:scale-105">
//                 <div className="relative">
//                   <img
//                     src="/assets/images/logo.png"
//                     alt="Rabbit & Finch"
//                     className="h-11 w-auto object-contain lg:h-14"
//                   />
//                 </div>
//               </Link>
//             </div>

//             {/* Enhanced Search Bar - Desktop */}
//             <div className="hidden lg:flex flex-1 max-w-xl mx-8">
//               <div ref={searchRef} className="relative w-full">
//                 <div className={`relative flex items-center transition-all duration-300 ${
//                   isSearchFocused ? 'transform scale-[1.02]' : ''
//                 }`}>
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     onFocus={() => setIsSearchFocused(true)}
//                     placeholder="Search for products, brands, categories..."
//                     className={`w-full h-12 pl-5 pr-14 bg-gray-50 border-2 rounded-full text-sm font-medium focus:outline-none transition-all duration-300 placeholder-gray-400 ${
//                       isSearchFocused 
//                         ? 'border-black bg-white shadow-lg' 
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   />
//                   <button className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105">
//                     <Search className="w-4 h-4" />
//                   </button>
//                 </div>

//                 {/* Enhanced Search Results */}
//                 {showSearchResults && searchResults.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
//                     <div className="p-2">
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           Search Results ({searchResults.length})
//                         </p>
//                       </div>
//                       {searchResults.map((product) => (
//                         <Link
//                           key={product.id}
//                           to={`/product/${product.id}`}
//                           className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
//                         >
//                           <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden group-hover:ring-2 ring-black transition-all">
//                             <img
//                               src={product.image}
//                               alt={product.name}
//                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                             />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-black">
//                               {product.name}
//                             </div>
//                             <div className="text-xs text-gray-500 font-medium mt-0.5">
//                               {product.brand} • {product.mainCategory}
//                             </div>
//                             <div className="text-sm font-bold text-black mt-1">
//                               {product.offer_price}
//                             </div>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {showSearchResults && searchResults.length === 0 && searchQuery && (
//                   <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-8 text-center">
//                     <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                     <p className="text-sm font-semibold text-gray-900">No results found</p>
//                     <p className="text-xs text-gray-500 mt-1">Try searching with different keywords</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-2">
//               {/* Quick Links - Desktop */}
//               <div className="hidden xl:flex items-center gap-1">
//                 <Link
//                   to="/"
//                   className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 group"
//                 >
//                   <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                   <span>Home</span>
//                 </Link>
//                 <Link
//                   to="/all-products"
//                   className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 group"
//                 >
//                   <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                   <span>Shop</span>
//                 </Link>
//                 <Link
//                   to="/wishlist"
//                   className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 group relative"
//                 >
//                   <Heart className="w-5 h-5 group-hover:scale-110 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
//                   <span>Wishlist</span>
//                 </Link>
//               </div>

//               {/* Track Order Section - Right Side */}
//               <Link
//                 to="/track-order"
//                 className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 group cursor-pointer"
//               >
//                 <div className="flex items-center gap-2">
//                   <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                   <div className="text-left">
//                     <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
//                       Track Order
//                     </div>
//                     <div className="text-sm font-bold text-gray-900">
//                       Status
//                     </div>
//                   </div>
//                 </div>
//               </Link>

//               {/* Enhanced Cart Button */}
//               <Link
//                 to="/cart"
//                 className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 group relative"
//               >
//                 <div className="relative">
//                   <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                   <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-black to-gray-800 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg">
//                     0
//                   </span>
//                 </div>
//                 <div className="hidden lg:block text-left">
//                   <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
//                     Cart
//                   </div>
//                   <div className="text-sm font-bold text-gray-900">
//                     ₹0.00
//                   </div>
//                 </div>
//               </Link>

//               {/* Premium Account Button */}
//               <Link
//                 to="/profile"
//                 className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-gradient-to-br from-black via-gray-900 to-black text-white hover:from-gray-800 hover:to-gray-900 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group relative overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
//                 <User className="w-5 h-5 relative z-10" />
//                 <div className="text-left relative z-10">
//                   <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">
//                     Account
//                   </div>
//                   <div className="text-sm font-bold">
//                     Sign In
//                   </div>
//                 </div>
//               </Link>

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(true)}
//                 className="lg:hidden p-2.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200"
//               >
//                 <Menu className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Categories Bar - Desktop */}
//           <div className="hidden lg:block border-t border-gray-100">
//             <div className="flex items-center justify-center gap-2 py-3">
//               {categories.map((category, index) => (
//                 <div
//                   key={index}
//                   className="relative group"
//                   onMouseEnter={() => setActiveCategory(index)}
//                   onMouseLeave={() => setActiveCategory(null)}
//                 >
//                   <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200 group-hover:shadow-md">
//                     <span>{category.name}</span>
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
//                       activeCategory === index ? 'rotate-180' : ''
//                     }`} />
//                   </button>

//                   {/* Enhanced Dropdown */}
//                   {activeCategory === index && (
//                     <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white shadow-2xl border border-gray-100 rounded-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//                       <div className="px-5 pb-3 mb-2 border-b border-gray-100">
//                         <div className="text-xs font-bold text-black uppercase tracking-wide flex items-center gap-2">
//                           <div className="w-1 h-4 bg-black rounded-full"></div>
//                           {category.name}
//                         </div>
//                       </div>
//                       <div className="px-2 max-h-80 overflow-y-auto">
//                         {category.subcategories.map((sub, idx) => (
//                           <Link
//                             key={idx}
//                             to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
//                             className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-200 hover:translate-x-1"
//                           >
//                             {sub}
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Mobile Search */}
//           <div className="lg:hidden pb-4 pt-1">
//             <div ref={searchRef} className="relative">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 onFocus={() => setIsSearchFocused(true)}
//                 placeholder="Search products..."
//                 className="w-full h-11 pl-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
//               />
//               <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
//                 <Search className="w-4 h-4" />
//               </button>

//               {/* Mobile Search Results */}
//               {showSearchResults && searchResults.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
//                   <div className="p-2">
//                     {searchResults.map((product) => (
//                       <Link
//                         key={product.id}
//                         to={`/product/${product.id}`}
//                         className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-200"
//                       >
//                         <img
//                           src={product.image}
//                           alt={product.name}
//                           className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 object-cover"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-semibold text-gray-900 truncate">{product.name}</div>
//                           <div className="text-xs text-gray-500 font-medium">{product.brand}</div>
//                           <div className="text-sm font-bold text-black mt-0.5">{product.offer_price}</div>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Premium Mobile Menu */}
//       {isMobileMenuOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//           <div className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
//             {/* Premium Mobile Header */}
//             <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 relative overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
//               <div className="relative flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center ring-2 ring-white/20 shadow-lg">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <div className="text-base font-bold">Welcome Back!</div>
//                     <div className="text-xs text-gray-300 font-medium mt-0.5">
//                       Sign in to your account
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Categories */}
//             <div className="p-5">
//               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
//                 <ShoppingCart className="w-4 h-4" />
//                 Browse Categories
//               </h3>
//               <div className="space-y-2">
//                 {categories.map((category, idx) => (
//                   <details key={idx} className="group">
//                     <summary className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl cursor-pointer hover:from-gray-100 hover:to-gray-50 transition-all list-none shadow-sm">
//                       <span className="font-bold text-gray-900 text-sm">
//                         {category.name}
//                       </span>
//                       <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-300 group-open:rotate-180" />
//                     </summary>
//                     <div className="mt-2 ml-2 space-y-1 animate-in slide-in-from-top-1 duration-200">
//                       {category.subcategories.map((sub, subIdx) => (
//                         <Link
//                           key={subIdx}
//                           to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
//                           className="block p-3 pl-6 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-all hover:translate-x-1"
//                         >
//                           {sub}
//                         </Link>
//                       ))}
//                     </div>
//                   </details>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="p-5 border-t-2 border-gray-100">
//               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
//                 <Sparkles className="w-4 h-4" />
//                 Quick Links
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { name: "Home", icon: Home, href: "/" },
//                   { name: "Shop All", icon: ShoppingCart, href: "/all-products" },
//                   { name: "Track Order", icon: Package, href: "/track-order" },
//                   { name: "Support", icon: HelpCircle, href: "/support" },
//                 ].map((item, idx) => (
//                   <Link
//                     key={idx}
//                     to={item.href}
//                     className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 hover:shadow-lg transition-all duration-200 border border-gray-100 group"
//                   >
//                     <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center mb-2.5 shadow-sm border border-gray-200 group-hover:scale-110 transition-transform">
//                       <item.icon className="w-5 h-5 text-gray-700" />
//                     </div>
//                     <span className="text-xs font-bold text-gray-900">
//                       {item.name}
//                     </span>
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Premium Account Section */}
//             <div className="p-5 border-t-2 border-gray-100">
//               <Link
//                 to="/profile"
//                 className="flex items-center justify-between p-5 bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-2xl hover:from-gray-800 hover:to-gray-900 transition-all shadow-xl hover:shadow-2xl group relative overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
//                 <div className="flex items-center gap-4 relative z-10">
//                   <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center ring-2 ring-white/20 shadow-lg">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <div className="font-bold text-base">My Account</div>
//                     <div className="text-xs text-gray-300 font-medium mt-0.5">Login / Sign Up</div>
//                   </div>
//                 </div>
//                 <ChevronDown className="w-5 h-5 -rotate-90 relative z-10" />
//               </Link>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  Bell,
  Sparkles,
  Shirt,
  Boxes,
  Dumbbell,
  Watch,
  Footprints,
  Glasses,
  ShoppingBasket,
} from "lucide-react";
import productsData from "../../../../data/products.json";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const extractCategories = () => {
    const categoriesMap = new Map();
    
    productsData.products.forEach(product => {
      const mainCategory = product.mainCategory;
      const subCategory = product.subCategory;
      
      if (!categoriesMap.has(mainCategory)) {
        categoriesMap.set(mainCategory, new Set());
      }
      if (subCategory) {
        categoriesMap.get(mainCategory).add(subCategory);
      }
    });

    const categories = Array.from(categoriesMap).map(([mainCategory, subCategoriesSet]) => ({
      name: mainCategory,
      subcategories: Array.from(subCategoriesSet)
    }));

    return categories;
  };

  const categories = extractCategories();

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Topwear': Shirt,
      'Bottomwear': Boxes,
      'Activewear / Sportswear': Dumbbell,
      'Sportswear': Dumbbell,
      'Activewear': Dumbbell,
      'Accessories': Watch,
      'Footwear': Footprints,
      'Fashion': Shirt,
      'Electronics': ShoppingBasket,
      'Home & Furniture': Home,
      'Mobile': Phone,
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const filteredProducts = productsData.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.mainCategory.toLowerCase().includes(query.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredProducts.slice(0, 5));
    setShowSearchResults(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="font-sans">
      {/* Premium Top Bar - Black & White */}
      {/* <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 text-xs">
            <div className="hidden md:flex items-center gap-6">
              <Link to="tel:+911234567890" className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200 group">
                <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">+91 123 456 7890</span>
              </Link>
              <Link to="mailto:support@rabbitfinch.com" className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200 group">
                <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">support@rabbitfinch.com</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold">Free Shipping on Orders Above ₹1,999</span>
            </div>
            <div className="hidden lg:flex items-center gap-5">
              <Link to="/track-order" className="flex items-center gap-1.5 hover:text-gray-300 transition-colors text-xs font-medium group">
                <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                Track Order
              </Link>
              <Link to="/support" className="flex items-center gap-1.5 hover:text-gray-300 transition-colors text-xs font-medium group">
                <HelpCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                Help
              </Link>
              <Link to="/offers" className="flex items-center gap-1.5 hover:text-gray-300 transition-colors text-xs font-medium group">
                <Bell className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                Offers
              </Link>
            </div>
          </div>
        </div>
      </div> */}

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
                    placeholder="Search for products, brands, categories..."
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

                {/* Enhanced Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden">
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-xs font-bold text-black uppercase tracking-wider">
                          Search Results ({searchResults.length})
                        </p>
                      </div>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group border-b border-gray-100 last:border-0"
                        >
                          <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border-2 border-gray-200 group-hover:border-black transition-all">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-black truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-600 font-medium mt-0.5">
                              {product.brand} • {product.mainCategory}
                            </div>
                            <div className="text-sm font-bold text-black mt-1">
                              {product.offer_price}
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
                    <p className="text-sm font-bold text-black">No results found</p>
                    <p className="text-xs text-gray-600 mt-1">Try searching with different keywords</p>
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

              {/* Track Order Section */}
              <Link
                to="/track-order"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">
                      Track Order
                    </div>
                    <div className="text-sm font-bold text-black">
                      Status
                    </div>
                  </div>
                </div>
              </Link>

              {/* Enhanced Cart Button */}
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

              {/* Premium Account Button */}
              <Link
                to="/profile"
                className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-black text-white hover:bg-gray-800 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <User className="w-5 h-5 relative z-10" />
                <div className="text-left relative z-10">
                  <div className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                    Account
                  </div>
                  <div className="text-sm font-bold">
                    Sign In
                  </div>
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-black hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Categories Bar - Desktop - Black & White */}
          <div className="hidden lg:block border-t border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-1 py-2">
              {categories.map((category, index) => {
                const CategoryIcon = getCategoryIcon(category.name);
                return (
                  <div
                    key={index}
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

                    {/* Enhanced Dropdown - Black & White */}
                    {activeCategory === index && category.subcategories.length > 0 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white shadow-2xl border-2 border-gray-200 rounded-xl py-2 z-50">
                        <div className="px-4 py-2.5 border-b-2 border-gray-200 bg-gray-50">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="w-4 h-4 text-black" />
                            <span className="text-xs font-bold text-black uppercase tracking-wide">
                              {category.name}
                            </span>
                          </div>
                        </div>
                        <div className="px-2 py-2 max-h-96 overflow-y-auto">
                          <div className="grid grid-cols-1 gap-1">
                            {category.subcategories.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black rounded-lg transition-all duration-200 group"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-black transition-colors"></div>
                                <span className="flex-1">{sub}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
                placeholder="Search products..."
                className="w-full h-11 pl-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 border-b border-gray-100 last:border-0"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 object-cover border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-black truncate">{product.name}</div>
                          <div className="text-xs text-gray-600 font-medium">{product.brand}</div>
                          <div className="text-sm font-bold text-black mt-0.5">{product.offer_price}</div>
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

      {/* Premium Mobile Menu - Black & White */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto border-l-2 border-gray-200">
            {/* Premium Mobile Header */}
            <div className="bg-black text-white p-6 relative">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold">Welcome Back!</div>
                    <div className="text-xs text-gray-300 font-medium mt-0.5">
                      Sign in to your account
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

            {/* Categories - Black & White Mobile Style */}
            <div className="p-5">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Browse Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category, idx) => {
                  const CategoryIcon = getCategoryIcon(category.name);
                  return (
                    <details key={idx} className="group">
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
                      <div className="mt-2 ml-2 space-y-1">
                        {category.subcategories.map((sub, subIdx) => (
                          <Link
                            key={subIdx}
                            to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-2 p-3 pl-6 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </details>
                  );
                })}
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

            {/* Premium Account Section */}
            <div className="p-5 border-t-2 border-gray-200">
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
                    <div className="text-xs text-gray-300 font-medium mt-0.5">Login / Sign Up</div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 -rotate-90 relative z-10" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;