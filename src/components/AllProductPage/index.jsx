import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Heart,
  ShoppingCart,
  ChevronRight,
  X,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import Layout from "../Partials/Layout";
import ProductsFilter from "./ProductsFilter";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "../CartPage/useCart";
import { productApi } from "./productApi";

export default function AllProductPage({ type = 1 }) {
  const { addItemToCart } = useCart();
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortOption, setSortOption] = useState("New Arrivals");
  const [loading, setLoading] = useState(true);

  // API Products State
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 50,
    totalItems: 0,
    totalPages: 0,
  });
  const fetchGuardRef = useRef({ inFlight: false, lastKey: null });

  // Filter States
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedReviewThresholds, setSelectedReviewThresholds] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedDiscountRanges, setSelectedDiscountRanges] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSeasonalCollections, setSelectedSeasonalCollections] =
    useState([]);

  // Use products hook for filter data
  const {
    categories,
    sizes,
    colors,
    occasions,
    materials,
    loading: filtersLoading,
    error: filtersError,
  } = useProducts();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);

      try {
        const key = `${pagination.currentPage}-${pagination.itemsPerPage}`;
        if (
          fetchGuardRef.current.inFlight &&
          fetchGuardRef.current.lastKey === key
        ) {
          return;
        }
        fetchGuardRef.current.inFlight = true;
        fetchGuardRef.current.lastKey = key;

        const response = await productApi.getAll(
          pagination.currentPage,
          pagination.itemsPerPage
        );

        // Handle response structure
        const productsData = response.data || [];
        const total = response.pagination?.total || productsData.length;

        setApiProducts(productsData);
        setPagination((prev) => ({
          ...prev,
          totalItems: total,
          totalPages: Math.ceil(total / prev.itemsPerPage),
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsError(error.message || "Failed to load products");
        setApiProducts([]);
      } finally {
        setProductsLoading(false);
        fetchGuardRef.current.inFlight = false;
      }
    };

    fetchProducts();
  }, [pagination.currentPage, pagination.itemsPerPage]);

  const clearAllFilters = () => {
    setSelectedSubCategories([]);
    setSelectedDetails([]);
    setPriceRange({ min: 0, max: 10000 });
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedReviewThresholds([]);
    setSelectedAvailability([]);
    setSelectedDiscountRanges([]);
    setSelectedOccasions([]);
    setSelectedBrands([]);
    setSelectedSeasonalCollections([]);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [
    selectedSubCategories,
    selectedDetails,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedReviewThresholds,
    selectedAvailability,
    selectedDiscountRanges,
    selectedOccasions,
    selectedBrands,
    selectedSeasonalCollections,
    sortOption,
  ]);

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

    selectedReviewThresholds.forEach((r) =>
      pushFilter(`${r}★+`, () =>
        setSelectedReviewThresholds((prev) => prev.filter((i) => i !== r))
      )
    );

    selectedAvailability.forEach((a) =>
      pushFilter(a === "in" ? "In Stock" : "Out of Stock", () =>
        setSelectedAvailability((prev) => prev.filter((i) => i !== a))
      )
    );

    selectedDiscountRanges.forEach((d) =>
      pushFilter(`${d}% off`, () =>
        setSelectedDiscountRanges((prev) => prev.filter((i) => i !== d))
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

    selectedSeasonalCollections.forEach((collection) =>
      pushFilter(collection, () =>
        setSelectedSeasonalCollections((prev) =>
          prev.filter((i) => i !== collection)
        )
      )
    );

    return activeFilters.length ? [...base, ...activeFilters] : base;
  }, [
    selectedSubCategories,
    selectedDetails,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedReviewThresholds,
    selectedAvailability,
    selectedDiscountRanges,
    selectedOccasions,
    selectedBrands,
    selectedSeasonalCollections,
  ]);

  // Placeholder image URL - using a reliable external source
  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Transform API products to match the expected format
  const transformedProducts = useMemo(() => {
    return apiProducts.map((product) => {
      // Calculate prices
      const mrp = parseFloat(product.mrp || 0);
      const sellingPrice = parseFloat(product.sellingPrice || product.mrp || 0);
      const discount =
        mrp > 0 && sellingPrice < mrp
          ? Math.round(((mrp - sellingPrice) / mrp) * 100)
          : 0;

      // Get proper image - use thumbnailImage from API response
      // Only use placeholder if no image exists
      const productImage = product.thumbnailImage || PLACEHOLDER_IMAGE;

      // Get stock from inventories
      const totalStock =
        product.inventories?.reduce(
          (sum, inv) => sum + (inv.quantity || 0),
          0
        ) || 0;

      // Extract colors and sizes from inventories
      const productColors = [
        ...new Set(
          product.inventories
            ?.map((inv) => inv.color?.name || inv.color)
            .filter(Boolean) || []
        ),
      ];

      const productSizes = [
        ...new Set(
          product.inventories
            ?.map((inv) => inv.size?.name || inv.size)
            .filter(Boolean) || []
        ),
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
        seasonal_special_collection: product.seasonal || "",
        product_type:
          product.status === "featured"
            ? "featured"
            : product.status === "popular"
            ? "popular"
            : "",
      };
    });
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...transformedProducts];

    // Category filters
    if (selectedDetails.length > 0) {
      result = result.filter((p) => {
        return selectedDetails.some((detailKey) => {
          const [subCategory, detail] = detailKey.split("||");
          return (
            p.subCategory === subCategory && p.subCategoryDetail === detail
          );
        });
      });
    }

    if (selectedSubCategories.length > 0) {
      result = result.filter((p) =>
        selectedSubCategories.includes(p.subCategory)
      );
    }

    // Price filter
    result = result.filter((p) => {
      const price = parseFloat(p.offer_price.replace("₹", "").replace(",", ""));
      return (
        price >= (priceRange?.min ?? 0) && price <= (priceRange?.max ?? 10000)
      );
    });

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Review filter
    if (selectedReviewThresholds.length > 0) {
      result = result.filter((p) =>
        selectedReviewThresholds.some((t) => p.review >= parseFloat(t))
      );
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      result = result.filter((p) => {
        const inStock = p.stock > 0 ? "in" : "out";
        return selectedAvailability.includes(inStock);
      });
    }

    // Discount filter
    if (selectedDiscountRanges.length > 0) {
      result = result.filter((p) => {
        return selectedDiscountRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return p.discount >= min && (max ? p.discount <= max : true);
        });
      });
    }

    // Occasion filter
    if (selectedOccasions.length > 0) {
      result = result.filter((p) =>
        p.occasion.some((o) => selectedOccasions.includes(o))
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) =>
        selectedBrands.includes(p.brand.toLowerCase())
      );
    }

    // Seasonal Collection filter
    if (selectedSeasonalCollections.length > 0) {
      result = result.filter((p) =>
        selectedSeasonalCollections.includes(p.seasonal_special_collection)
      );
    }

    // Sorting
    if (sortOption === "New Arrivals") {
      result.sort((a, b) => b.id - a.id);
    } else if (sortOption === "Best Sellers") {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortOption === "Sale / Clearance") {
      result.sort((a, b) => b.discount - a.discount);
    } else if (sortOption === "Trending Now") {
      result.sort(
        (a, b) =>
          b.review * (b.reviewCount || 1) - a.review * (a.reviewCount || 1)
      );
    } else if (sortOption === "Price: Low to High") {
      result.sort(
        (a, b) =>
          parseFloat(a.offer_price.replace("₹", "").replace(",", "")) -
          parseFloat(b.offer_price.replace("₹", "").replace(",", ""))
      );
    } else if (sortOption === "Price: High to Low") {
      result.sort(
        (a, b) =>
          parseFloat(b.offer_price.replace("₹", "").replace(",", "")) -
          parseFloat(a.offer_price.replace("₹", "").replace(",", ""))
      );
    }

    return result;
  }, [
    transformedProducts,
    selectedSubCategories,
    selectedDetails,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedReviewThresholds,
    selectedAvailability,
    selectedDiscountRanges,
    selectedOccasions,
    selectedBrands,
    selectedSeasonalCollections,
    sortOption,
  ]);

  const activeFiltersCount = useMemo(() => {
    return [
      selectedSubCategories.length,
      selectedDetails.length,
      selectedColors.length,
      selectedSizes.length,
      selectedReviewThresholds.length,
      selectedAvailability.length,
      selectedDiscountRanges.length,
      selectedOccasions.length,
      selectedBrands.length,
      selectedSeasonalCollections.length,
      priceRange.min !== 0 || priceRange.max !== 10000 ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  }, [
    selectedSubCategories,
    selectedDetails,
    selectedColors,
    selectedSizes,
    selectedReviewThresholds,
    selectedAvailability,
    selectedDiscountRanges,
    selectedOccasions,
    selectedBrands,
    selectedSeasonalCollections,
    priceRange,
  ]);

  const handleAddToCart = async (product) => {
    try {
      const cartData = {
        cartId: 1, // You might want to get this from user context
        productId: product.id,
        productColorVariationId: 1, // Get from product variations
        productSizeVariationId: 1, // Get from product variations
        quantity: 1,
      };

      const result = await addItemToCart(cartData);

      if (result.success) {
        // Show success message
        console.log("Product added to cart successfully");
        alert("Add to cart")
      } else {
        console.error("Failed to add product to cart:", result.error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Combined loading state
  const isLoading = loading || productsLoading || filtersLoading;

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="products-page-wrapper w-full bg-gray-50 min-h-screen">
        <div className="container-x mx-auto p-10 px-3 sm:px-4 lg:px-6 max-w-[1920px]">
          {/* Error Display */}
          {(productsError || filtersError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                {productsError || filtersError}
              </p>
            </div>
          )}

          <div className="w-full lg:flex lg:gap-6 xl:gap-8">
            {/* Filter Sidebar - Desktop */}
            <div className="lg:w-[280px] xl:w-[320px] flex-shrink-0 hidden lg:block">
              <div className="sticky top-6">
                <ProductsFilter
                  products={transformedProducts}
                  selectedSubCategories={selectedSubCategories}
                  setSelectedSubCategories={setSelectedSubCategories}
                  selectedDetails={selectedDetails}
                  setSelectedDetails={setSelectedDetails}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  selectedReviewThresholds={selectedReviewThresholds}
                  setSelectedReviewThresholds={setSelectedReviewThresholds}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  selectedDiscountRanges={selectedDiscountRanges}
                  setSelectedDiscountRanges={setSelectedDiscountRanges}
                  selectedOccasions={selectedOccasions}
                  setSelectedOccasions={setSelectedOccasions}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  selectedSeasonalCollections={selectedSeasonalCollections}
                  setSelectedSeasonalCollections={
                    setSelectedSeasonalCollections
                  }
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
                  setSelectedSubCategories={setSelectedSubCategories}
                  selectedDetails={selectedDetails}
                  setSelectedDetails={setSelectedDetails}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  selectedReviewThresholds={selectedReviewThresholds}
                  setSelectedReviewThresholds={setSelectedReviewThresholds}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  selectedDiscountRanges={selectedDiscountRanges}
                  setSelectedDiscountRanges={setSelectedDiscountRanges}
                  selectedOccasions={selectedOccasions}
                  setSelectedOccasions={setSelectedOccasions}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                  selectedSeasonalCollections={selectedSeasonalCollections}
                  setSelectedSeasonalCollections={
                    setSelectedSeasonalCollections
                  }
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
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "Product" : "Products"}
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
                          onClick={() => setSortOption(opt.key)}
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
                  ) : filteredProducts.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          No products found
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                          Try adjusting your filters to find what you're looking
                          for.
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 xl:gap-6">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
                        >
                          {/* Image Section */}
                          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                // Prevent infinite error loop
                                if (e.target.src !== PLACEHOLDER_IMAGE) {
                                  e.target.src = PLACEHOLDER_IMAGE;
                                }
                              }}
                            />

                            <button className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10">
                              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                            </button>

                            {product.discount > 0 && (
                              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-xs font-bold shadow-lg">
                                {product.discount}% OFF
                              </div>
                            )}

                            {product.product_type && product.discount === 0 && (
                              <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                <span
                                  className={`text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded uppercase text-white shadow-lg ${
                                    product.product_type === "popular"
                                      ? "bg-orange-500"
                                      : "bg-red-600"
                                  }`}
                                >
                                  {product.product_type}
                                </span>
                              </div>
                            )}

                            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 bg-white hover:bg-gray-900 text-gray-800 hover:text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                  Add to Cart
                                </span>
                                <span className="sm:hidden">Add</span>
                              </button>
                              <Link to={`/single-product/${product.id}`}>
                                <button className="bg-white hover:bg-blue-600 text-gray-800 hover:text-white p-2 sm:p-2.5 rounded-lg shadow-lg transition-all duration-300">
                                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              </Link>
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="p-3 sm:p-4 flex flex-col flex-grow">
                            {/* Category */}
                            <p className="text-xs text-gray-500 font-medium mb-1 sm:mb-1.5 uppercase">
                              {product.subCategory}
                            </p>

                            {/* Product Title */}
                            <Link to={`/single-product/${product.id}`}>
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                {product.name}
                              </h3>
                            </Link>

                            {/* Rating Section */}
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                      star <= Math.floor(product.review)
                                        ? "text-yellow-400 fill-current"
                                        : product.review % 1 >= 0.5 &&
                                          star === Math.ceil(product.review)
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
                                (
                                {product.reviewCount
                                  ? product.reviewCount.toLocaleString()
                                  : "0"}
                                )
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
                        </div>
                      ))}
                    </div>
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