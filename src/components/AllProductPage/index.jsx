import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  Heart,
  ShoppingCart,
  ChevronRight,
  X,
  Filter,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import Layout from "../Partials/Layout";
import ProductsFilter from "./ProductsFilter";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "../CartPage/useCart";
import { productApi, productUtils } from "./productApi";
import { updateWishlist, getWishlist, wishlistEvents } from "../../services/wishlistApi";
import { useAuth } from "../../components/Auth/hooks/useAuth";

export default function AllProductPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartNotification, setCartNotification] = useState(null);
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortOption, setSortOption] = useState();
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState({});

  // API Products State
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    itemsPerPage: parseInt(searchParams.get('limit')) || 50,
    totalItems: 0,
    totalPages: 0,
  });
  
  // Fetch guard to prevent duplicate requests
  const fetchGuardRef = useRef({ 
    inFlight: false, 
    lastKey: null,
    timeoutId: null 
  });

  // Filter States
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    searchParams.getAll('subCategory') || []
  );
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [priceRange, setPriceRange] = useState({ 
    min: parseInt(searchParams.get('minPrice')) || 0, 
    max: parseInt(searchParams.get('maxPrice')) || 10000 
  });
  const [selectedColors, setSelectedColors] = useState(
    searchParams.getAll('productColor') || []
  );
  const [selectedSizes, setSelectedSizes] = useState(
    searchParams.getAll('productSize') || []
  );
  const [selectedOccasions, setSelectedOccasions] = useState(
    searchParams.getAll('occasion') || []
  );
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.getAll('brand') || []
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('name') || '');

  // Use products hook for filter data
  const {
    categories,
    loading: filtersLoading,
    error: filtersError,
    fetchAllProductData
  } = useProducts();

  // Subscribe to wishlist changes
  useEffect(() => {
    const unsubscribe = wishlistEvents.subscribe((wishlistData) => {
      const wishlistArray = wishlistData.wishList || [];
      setWishlistItems(new Set(wishlistArray));
    });

    return () => unsubscribe();
  }, []);

  // Build query params from filters
  const buildQueryParams = useCallback(() => {
    const params = productUtils.transformFiltersToQueryParams({
      selectedSubCategories,
      selectedDetails,
      priceRange,
      selectedColors,
      selectedSizes,
      selectedOccasions,
      selectedBrands,
      sortOption,
      searchQuery,
      pagination
    }, categories);
    return params;
  }, [
    selectedSubCategories,
    selectedDetails,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedOccasions,
    selectedBrands,
    sortOption,
    searchQuery,
    pagination,
    categories
  ]);

  // Update URL when filters change
  useEffect(() => {
    const queryParams = buildQueryParams();
    setSearchParams(queryParams, { replace: true });
  }, [buildQueryParams, setSearchParams]);

  // Initialize product data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchAllProductData();
      } catch (error) {
        console.error("Failed to initialize product data:", error);
      }
    };
    
    if (filtersError || !categories.length) {
      initializeData();
    }
  }, [fetchAllProductData, filtersError, categories.length]);

  // Fetch user's wishlist on mount and auth change
  useEffect(() => {
    const fetchUserWishlist = async () => {
      if (!isAuthenticated) {
        setWishlistItems(new Set());
        return;
      }
      try {
        const response = await getWishlist();
        const wishlistArray = response.wishList || [];
        setWishlistItems(new Set(wishlistArray));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlistItems(new Set());
      }
    };
    fetchUserWishlist();
  }, [isAuthenticated]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (fetchGuardRef.current.timeoutId) {
        clearTimeout(fetchGuardRef.current.timeoutId);
      }

      fetchGuardRef.current.timeoutId = setTimeout(async () => {
        const queryParams = buildQueryParams();
        const key = JSON.stringify(queryParams);
        
        if (fetchGuardRef.current.inFlight && fetchGuardRef.current.lastKey === key) {
          return;
        }

        fetchGuardRef.current.inFlight = true;
        fetchGuardRef.current.lastKey = key;

        setProductsLoading(true);
        setProductsError(null);

        try {
          console.log("Fetching products with params:", queryParams);
          const response = await productApi.getAll(queryParams);

          const productsData = response.data || response || [];
          const total = response.pagination?.total || productsData.length || 0;

          console.log("Products received:", productsData.length);
          setApiProducts(Array.isArray(productsData) ? productsData : []);
          setPagination((prev) => ({
            ...prev,
            totalItems: total,
            totalPages: Math.ceil(total / prev.itemsPerPage),
          }));
        } catch (error) {
          console.error("Error fetching products:", error);
          setProductsError(
            error.message === 'Unable to connect to server. Please check your connection.' 
              ? "Unable to load products. Please check your internet connection."
              : "Failed to load products. Please try again later."
          );
          setApiProducts([]);
        } finally {
          setProductsLoading(false);
          fetchGuardRef.current.inFlight = false;
        }
      }, 500);

    };

    fetchProducts();

    return () => {
      if (fetchGuardRef.current.timeoutId) {
        clearTimeout(fetchGuardRef.current.timeoutId);
      }
    };
  }, [buildQueryParams]);

  // Handler for search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handler for filter changes
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Wrapped filter setters
  const wrappedSetSelectedSubCategories = handleFilterChange(setSelectedSubCategories);
  const wrappedSetSelectedDetails = handleFilterChange(setSelectedDetails);
  const wrappedSetSelectedColors = handleFilterChange(setSelectedColors);
  const wrappedSetSelectedSizes = handleFilterChange(setSelectedSizes);
  const wrappedSetSelectedOccasions = handleFilterChange(setSelectedOccasions);
  const wrappedSetSelectedBrands = handleFilterChange(setSelectedBrands);
  const wrappedSetPriceRange = handleFilterChange(setPriceRange);
  const wrappedSetSortOption = handleFilterChange(setSortOption);

  const retryProductsFetch = () => {
    setProductsError(null);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const retryFiltersFetch = () => {
    fetchAllProductData(true);
  };

  const clearAllFilters = () => {
    setSelectedSubCategories([]);
    setSelectedDetails([]);
    setPriceRange({ min: 0, max: 10000 });
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedOccasions([]);
    setSelectedBrands([]);
    setSearchQuery('');
    setSortOption('New Arrivals');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Body overflow management
  useEffect(() => {
    if (filterToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [filterToggle]);

  const breadcrumb = useMemo(() => {
    const base = [
      { name: "Home", path: "/" },
      { name: "Clothing and Accessories", path: "/products" },
    ];

    const activeFilters = [];

    const pushFilter = (label, clearFn) => {
      activeFilters.push({
        name: label,
        path: "#",
        clear: clearFn,
      });
    };

    if (searchQuery) {
      pushFilter(`Search: "${searchQuery}"`, () => setSearchQuery(''));
    }

    selectedDetails.forEach((detailKey) => {
      const [, detail] = detailKey.split("||");
      pushFilter(detail, () =>
        setSelectedDetails((prev) => prev.filter((i) => i !== detailKey))
      );
    });

    selectedSubCategories.forEach((cat) =>
      pushFilter(cat, () => setSelectedSubCategories([]))
    );

    if (priceRange.min !== 0 || priceRange.max !== 10000) {
      pushFilter(`Price ₹${priceRange.min}-₹${priceRange.max}`, () =>
        setPriceRange({ min: 0, max: 10000 })
      );
    }

    selectedColors.forEach((c) =>
      pushFilter(c, () =>
        setSelectedColors((prev) => prev.filter((i) => i !== c))
      )
    );

    selectedSizes.forEach((s) =>
      pushFilter(s, () =>
        setSelectedSizes((prev) => prev.filter((i) => i !== s))
      )
    );

    selectedOccasions.forEach((o) =>
      pushFilter(o, () =>
        setSelectedOccasions((prev) => prev.filter((i) => i !== o))
      )
    );

    selectedBrands.forEach((b) =>
      pushFilter(b, () =>
        setSelectedBrands((prev) => prev.filter((i) => i !== b))
      )
    );

    return activeFilters.length ? [...base, ...activeFilters] : base;
  }, [
    searchQuery,
    selectedSubCategories,
    selectedDetails,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedOccasions,
    selectedBrands,
  ]);

  // Placeholder image URL
  const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Transform API products for display
  const transformedProducts = useMemo(() => {
    return apiProducts.map((product) => {
      const mrp = parseFloat(product.mrp || 0);
      const sellingPrice = parseFloat(product.sellingPrice || product.mrp || 0);
      const discount = mrp > 0 && sellingPrice < mrp
        ? Math.round(((mrp - sellingPrice) / mrp) * 100)
        : 0;

      const productImage = product.thumbnailImage || PLACEHOLDER_IMAGE;

      const totalStock = product.inventories?.reduce(
        (sum, inv) => sum + (inv.availableQuantity || 0), 0
      ) || 0;

      const productColors = [
        ...new Set(product.inventories?.map((inv) => inv.productColor?.color).filter(Boolean) || [])
      ];

      const productSizes = [
        ...new Set(product.inventories?.flatMap((inv) => inv.productSize?.size || []).filter(Boolean) || [])
      ];

      return {
        id: product.id,
        name: product.name || "Unnamed Product",
        image: productImage,
        price: `₹${mrp.toLocaleString()}`,
        offer_price: `₹${sellingPrice.toLocaleString()}`,
        discount: discount,
        review: parseFloat(product.averageRating || 0),
        reviewCount: product.reviewCount || 0,
        stock: totalStock,
        subCategory: product.subCategory?.name || "",
        subCategoryDetail: product.childCategory?.name || "",
        colors: productColors,
        sizes: productSizes,
        occasion: product.occasion ? [product.occasion.name] : [],
        brand: product.brand || "Generic",
        product_type: product.status === "featured" ? "featured" : product.status === "popular" ? "popular" : "",
      };
    });
  }, [apiProducts]);

  // Apply client-side filtering as fallback
  const filteredProducts = useMemo(() => {
    const hasClientSideFilters = selectedColors.length > 0 || selectedSizes.length > 0;
    
    if (hasClientSideFilters) {
      console.log("Applying client-side filtering for colors/sizes");
      const clientSideFiltered = productUtils.filterProductsClientSide(apiProducts, {
        selectedSubCategories,
        selectedDetails,
        priceRange,
        selectedColors,
        selectedSizes,
        selectedOccasions,
        selectedBrands,
      });

      console.log("Client-side filtered products:", clientSideFiltered.length);
      
      return clientSideFiltered.map((product) => {
        const mrp = parseFloat(product.mrp || 0);
        const sellingPrice = parseFloat(product.sellingPrice || product.mrp || 0);
        const discount = mrp > 0 && sellingPrice < mrp
          ? Math.round(((mrp - sellingPrice) / mrp) * 100)
          : 0;

        const productImage = product.thumbnailImage || PLACEHOLDER_IMAGE;

        const totalStock = product.inventories?.reduce(
          (sum, inv) => sum + (inv.availableQuantity || 0), 0
        ) || 0;

        const productColors = [
          ...new Set(product.inventories?.map((inv) => inv.productColor?.color).filter(Boolean) || [])
        ];

        const productSizes = [
          ...new Set(product.inventories?.flatMap((inv) => inv.productSize?.size || []).filter(Boolean) || [])
        ];

        return {
          id: product.id,
          name: product.name || "Unnamed Product",
          image: productImage,
          price: `₹${mrp.toLocaleString()}`,
          offer_price: `₹${sellingPrice.toLocaleString()}`,
          discount: discount,
          review: parseFloat(product.averageRating || 0),
          reviewCount: product.reviewCount || 0,
          stock: totalStock,
          subCategory: product.subCategory?.name || "",
          subCategoryDetail: product.childCategory?.name || "",
          colors: productColors,
          sizes: productSizes,
          occasion: product.occasion ? [product.occasion.name] : [],
          brand: product.brand || "Generic",
          product_type: product.status === "featured" ? "featured" : product.status === "popular" ? "popular" : "",
        };
      });
    }

    console.log("Using backend filtered products:", transformedProducts.length);
    return transformedProducts;
  }, [
    apiProducts,
    transformedProducts,
    selectedSubCategories,
    selectedDetails,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedOccasions,
    selectedBrands
  ]);

  // Apply sorting to filtered products
  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts];

    if (sortOption === "New Arrivals") {
      result.sort((a, b) => b.id - a.id);
    } else if (sortOption === "Best Sellers") {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortOption === "Sale / Clearance") {
      result.sort((a, b) => b.discount - a.discount);
    } else if (sortOption === "Trending Now") {
      result.sort((a, b) => b.review * (b.reviewCount || 1) - a.review * (a.reviewCount || 1));
    } else if (sortOption === "Price: Low to High") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.offer_price.replace("₹", "").replace(/,/g, ""));
        const priceB = parseFloat(b.offer_price.replace("₹", "").replace(/,/g, ""));
        return priceA - priceB;
      });
    } else if (sortOption === "Price: High to Low") {
      result.sort((a, b) => {
        const priceA = parseFloat(a.offer_price.replace("₹", "").replace(/,/g, ""));
        const priceB = parseFloat(b.offer_price.replace("₹", "").replace(/,/g, ""));
        return priceB - priceA;
      });
    }

    return result;
  }, [filteredProducts, sortOption]);

  const activeFiltersCount = useMemo(() => {
    return [
      selectedSubCategories.length,
      selectedDetails.length,
      selectedColors.length,
      selectedSizes.length,
      selectedOccasions.length,
      selectedBrands.length,
      priceRange.min !== 0 || priceRange.max !== 10000 ? 1 : 0,
      searchQuery ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  }, [
    selectedSubCategories,
    selectedDetails,
    selectedColors,
    selectedSizes,
    selectedOccasions,
    selectedBrands,
    priceRange,
    searchQuery,
  ]);

  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (wishlistLoading[productId]) return;

    // Optimistically update UI
    setWishlistItems(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      // This will update the backend and emit event to sync all components
      await updateWishlist(productId);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // Revert optimistic update on error
      setWishlistItems(prev => {
        const newWishlist = new Set(prev);
        if (newWishlist.has(productId)) {
          newWishlist.delete(productId);
        } else {
          newWishlist.add(productId);
        }
        return newWishlist;
      });
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const isInWishlist = (productId) => wishlistItems.has(productId);
  const isLoading = (productsLoading || filtersLoading) && !productsError && !filtersError;

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="products-page-wrapper w-full bg-gray-50 min-h-screen">
        <div className="container-x mx-auto p-10 px-3 sm:px-4 lg:px-6 max-w-[1920px]">
          {/* Error Display */}
          {(productsError || filtersError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <p className="text-red-800 text-sm font-medium">
                    {productsError || filtersError}
                  </p>
                </div>
                <button
                  onClick={productsError ? retryProductsFetch : retryFiltersFetch}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Cart Notification */}
          {cartNotification && (
            <div className={`mb-6 p-4 rounded-lg border flex items-center justify-between ${
              cartNotification.type === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  cartNotification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-sm font-bold ${
                    cartNotification.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {cartNotification.type === 'success' ? '✓' : '!'}
                  </span>
                </div>
                <p className={`text-sm font-medium ${
                  cartNotification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {cartNotification.message}
                </p>
              </div>
              <button onClick={() => setCartNotification(null)}>×</button>
            </div>
          )}

          <div className="w-full lg:flex lg:gap-6 xl:gap-8">
            {/* Filter Sidebar - Desktop */}
            <div className="lg:w-[280px] xl:w-[320px] flex-shrink-0 hidden lg:block">
              <div className="sticky top-6">
                <ProductsFilter
                  products={transformedProducts}
                  selectedSubCategories={selectedSubCategories}
                  setSelectedSubCategories={wrappedSetSelectedSubCategories}
                  selectedDetails={selectedDetails}
                  setSelectedDetails={wrappedSetSelectedDetails}
                  priceRange={priceRange}
                  setPriceRange={wrappedSetPriceRange}
                  selectedColors={selectedColors}
                  setSelectedColors={wrappedSetSelectedColors}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={wrappedSetSelectedSizes}
                  selectedOccasions={selectedOccasions}
                  setSelectedOccasions={wrappedSetSelectedOccasions}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={wrappedSetSelectedBrands}
                  searchQuery={searchQuery}
                  setSearchQuery={handleSearchChange}
                  filterToggle={filterToggle}
                  filterToggleHandler={() => setFilterToggle(!filterToggle)}
                  clearAllFilters={clearAllFilters}
                />
              </div>
            </div>

            {/* Mobile Filter Overlay */}
            {filterToggle && (
              <div className="lg:hidden fixed inset-0 z-50">
                <ProductsFilter
                  products={transformedProducts}
                  selectedSubCategories={selectedSubCategories}
                  setSelectedSubCategories={wrappedSetSelectedSubCategories}
                  selectedDetails={selectedDetails}
                  setSelectedDetails={wrappedSetSelectedDetails}
                  priceRange={priceRange}
                  setPriceRange={wrappedSetPriceRange}
                  selectedColors={selectedColors}
                  setSelectedColors={wrappedSetSelectedColors}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={wrappedSetSelectedSizes}
                  selectedOccasions={selectedOccasions}
                  setSelectedOccasions={wrappedSetSelectedOccasions}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={wrappedSetSelectedBrands}
                  searchQuery={searchQuery}
                  setSearchQuery={handleSearchChange}
                  filterToggle={filterToggle}
                  filterToggleHandler={() => setFilterToggle(!filterToggle)}
                  clearAllFilters={clearAllFilters}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="rounded-xl sm:rounded-2xl shadow-sm border-gray-200 overflow-hidden mb-6 sm:mb-8">
                {/* Breadcrumb */}
                <div className="mt-4 sm:mt-6 px-3 sm:px-4 lg:px-6">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 flex-wrap">
                    {breadcrumb.map((crumb, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        {crumb.clear ? (
                          <button
                            onClick={crumb.clear}
                            className="hover:text-gray-900 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 group text-xs sm:text-sm"
                          >
                            <span>{crumb.name}</span>
                            <X className="w-3 h-3 group-hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <Link
                            to={crumb.path}
                            className={`hover:text-gray-900 px-1.5 sm:px-2 py-1 rounded transition-colors ${
                              idx === breadcrumb.length - 1
                                ? "text-gray-900 font-semibold"
                                : "text-gray-600"
                            }`}
                          >
                            {crumb.name}
                          </Link>
                        )}
                        {idx < breadcrumb.length - 1 && (
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Header Section */}
                <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Clothing And Accessories
                      </h2>
                      <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium border border-gray-300">
                        {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="flex lg:hidden items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 text-xs sm:text-sm font-medium"
                        >
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Clear</span>
                          <span className="bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {activeFiltersCount}
                          </span>
                        </button>
                      )}

                      <button
                        className="lg:hidden flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm"
                        onClick={() => setFilterToggle(!filterToggle)}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Filters</span>
                        {activeFiltersCount > 0 && (
                          <span className="bg-white text-gray-900 text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
                            {activeFiltersCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Sort By:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {[
                        { key: "New Arrivals", label: "New Arrivals" },
                        { key: "Best Sellers", label: "Best Sellers" },
                        { key: "Sale / Clearance", label: "Sale" },
                        { key: "Trending Now", label: "Trending" },
                        { key: "Price: Low to High", label: "Price: Low-High" },
                        { key: "Price: High to Low", label: "Price: High-Low" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => wrappedSetSortOption(opt.key)}
                          className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                            sortOption === opt.key
                              ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="p-3 sm:p-4 lg:p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-16 sm:py-20">
                      <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium text-sm sm:text-base">
                          Loading products...
                        </p>
                      </div>
                    </div>
                  ) : sortedProducts.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                          Try adjusting your filters to find what you're looking for.
                        </p>
                        <button
                          onClick={clearAllFilters}
                          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 xl:gap-6">
                        {sortedProducts.map((product) => {
                          const isWishlisted = isInWishlist(product.id);
                          const isLoadingWishlist = wishlistLoading[product.id];

                          return (
                            <div
                              key={product.id}
                              className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col relative"
                            >
                              <Link
                                to={`/single-product/${product.id}`}
                                className="block flex flex-col flex-grow"
                              >
                                {/* Image Section */}
                                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                      if (e.target.src !== PLACEHOLDER_IMAGE) {
                                        e.target.src = PLACEHOLDER_IMAGE;
                                      }
                                    }}
                                  />

                                  {product.discount > 0 && (
                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-xs font-bold shadow-lg">
                                      {product.discount}% OFF
                                    </div>
                                  )}

                                  {product.product_type && product.discount === 0 && (
                                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                      <span
                                        className={`text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded uppercase text-white shadow-lg ${
                                          product.product_type === "popular" ? "bg-orange-500" : "bg-red-600"
                                        }`}
                                      >
                                        {product.product_type}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Details Section */}
                                <div className="p-3 sm:p-4 flex flex-col flex-grow">
                                  <p className="text-xs text-gray-500 font-medium mb-1 sm:mb-1.5 uppercase">
                                    {product.subCategory}
                                  </p>

                                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                    {product.name}
                                  </h3>

                                  {/* Rating Section */}
                                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                            star <= Math.floor(product.review)
                                              ? "text-yellow-400 fill-current"
                                              : product.review % 1 >= 0.5 && star === Math.ceil(product.review)
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300 fill-current"
                                          }`}
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>

                                    <span className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-semibold transition-colors">
                                      {product.review.toFixed(1)}
                                    </span>

                                    <span className="text-xs text-gray-600 font-medium">
                                      ({product.reviewCount ? product.reviewCount.toLocaleString() : "0"})
                                    </span>
                                  </div>

                                  {/* Price Section */}
                                  <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                                      {product.offer_price}
                                    </span>
                                    {product.discount > 0 && (
                                      <>
                                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                                          {product.price}
                                        </span>
                                        <span className="text-xs text-green-600 font-bold">
                                          {product.discount}% off
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  {/* Stock Info */}
                                  {product.stock > 0 && product.stock < 30 && (
                                    <p className="text-xs text-orange-600 font-semibold mt-auto">
                                      Only {product.stock} left in stock
                                    </p>
                                  )}

                                  {product.stock === 0 && (
                                    <p className="text-xs text-red-600 font-semibold mt-auto">
                                      Out of Stock
                                    </p>
                                  )}
                                </div>
                              </Link>

                              {/* Wishlist Button */}
                              <button
                                onClick={(e) => handleWishlistToggle(e, product.id)}
                                disabled={isLoadingWishlist}
                                className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
                                  isWishlisted
                                    ? 'bg-red-50 opacity-100'
                                    : 'bg-white opacity-0 group-hover:opacity-100'
                                } ${isLoadingWishlist ? 'cursor-not-allowed' : 'hover:bg-red-50'}`}
                              >
                                {isLoadingWishlist ? (
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Heart
                                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                                      isWishlisted
                                        ? 'text-red-500 fill-red-500'
                                        : 'text-gray-700 hover:text-red-500 hover:fill-red-500'
                                    }`}
                                  />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pagination */}
                      {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPagination(prev => ({ 
                                ...prev, 
                                currentPage: Math.max(1, prev.currentPage - 1) 
                              }))}
                              disabled={pagination.currentPage === 1}
                              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                              Previous
                            </button>
                            
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                              .filter(page => 
                                page === 1 || 
                                page === pagination.totalPages || 
                                Math.abs(page - pagination.currentPage) <= 1
                              )
                              .map((page, index, array) => {
                                const showEllipsis = index < array.length - 1 && array[index + 1] !== page + 1;
                                return (
                                  <div key={page} className="flex items-center">
                                    <button
                                      onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                                      className={`w-10 h-10 rounded-lg ${
                                        pagination.currentPage === page
                                          ? 'bg-gray-900 text-white'
                                          : 'border border-gray-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      {page}
                                    </button>
                                    {showEllipsis && <span className="px-2">...</span>}
                                  </div>
                                );
                              })
                            }
                            
                            <button
                              onClick={() => setPagination(prev => ({ 
                                ...prev, 
                                currentPage: Math.min(pagination.totalPages, prev.currentPage + 1) 
                              }))}
                              disabled={pagination.currentPage === pagination.totalPages}
                              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}