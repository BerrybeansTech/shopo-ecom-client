import { useState, useMemo, useEffect } from "react";
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
import productsData from "../../data/products.json";
import Layout from "../Partials/Layout";
import ProductsFilter from "./ProductsFilter";

const products = productsData.products || [];

export default function AllProductPage({ type = 1 }) {
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortOption, setSortOption] = useState("New Arrivals");
  const [loading, setLoading] = useState(true);

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
  const [selectedSeasonalCollections, setSelectedSeasonalCollections] = useState([]);

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
        setSelectedSeasonalCollections((prev) => prev.filter((i) => i !== collection))
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

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

    result = result.filter((p) => {
      const price = parseFloat(p.offer_price.replace("₹", "").replace(",", ""));
      return (
        price >= (priceRange?.min ?? 0) && price <= (priceRange?.max ?? 10000)
      );
    });

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    if (selectedReviewThresholds.length > 0) {
      result = result.filter((p) =>
        selectedReviewThresholds.some((t) => p.review >= parseFloat(t))
      );
    }

    if (selectedAvailability.length > 0) {
      result = result.filter((p) => {
        const inStock = p.stock > 0 ? "in" : "out";
        return selectedAvailability.includes(inStock);
      });
    }

    if (selectedDiscountRanges.length > 0) {
      result = result.filter((p) => {
        const orig = parseFloat(p.price.replace("₹", "").replace(",", ""));
        const offer = parseFloat(
          p.offer_price.replace("₹", "").replace(",", "")
        );
        const discount = ((orig - offer) / orig) * 100;
        return selectedDiscountRanges.some((range) => {
          const [min, max] = range.split("-").map(Number);
          return discount >= min && (max ? discount <= max : true);
        });
      });
    }

    if (selectedOccasions.length > 0) {
      result = result.filter((p) =>
        p.occasion.some((o) => selectedOccasions.includes(o))
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) =>
        selectedBrands.includes(p.brand.toLowerCase())
      );
    }

    // Seasonal Collection Filter
    if (selectedSeasonalCollections.length > 0) {
      result = result.filter((p) =>
        selectedSeasonalCollections.includes(p.seasonal_special_collection)
      );
    }

    if (sortOption === "New Arrivals") {
      result.sort((a, b) => b.id - a.id);
    } else if (sortOption === "Best Sellers") {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sortOption === "Sale / Clearance") {
      result.sort((a, b) => {
        const discountA = ((parseFloat(a.price.replace("₹", "").replace(",", "")) - parseFloat(a.offer_price.replace("₹", "").replace(",", ""))) / parseFloat(a.price.replace("₹", "").replace(",", ""))) * 100;
        const discountB = ((parseFloat(b.price.replace("₹", "").replace(",", "")) - parseFloat(b.offer_price.replace("₹", "").replace(",", ""))) / parseFloat(b.price.replace("₹", "").replace(",", ""))) * 100;
        return discountB - discountA;
      });
    } else if (sortOption === "Trending Now") {
      result.sort((a, b) => (b.review * (b.reviewCount || 1)) - (a.review * (a.reviewCount || 1)));
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

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="products-page-wrapper w-full bg-gray-50 min-h-screen">
        <div className="container-x mx-auto p-10 px-3 sm:px-4 lg:px-6 max-w-[1920px]">
          <div className="w-full lg:flex lg:gap-6 xl:gap-8">
            {/* Filter Sidebar - Desktop */}
            <div className="lg:w-[280px] xl:w-[320px] flex-shrink-0 hidden lg:block">
              <div className="sticky top-6">
                <ProductsFilter
                  products={products}
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
                  setSelectedSeasonalCollections={setSelectedSeasonalCollections}
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
                  products={products}
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
                  setSelectedSeasonalCollections={setSelectedSeasonalCollections}
                  filterToggle={filterToggle}
                  filterToggleHandler={() => setFilterToggle(!filterToggle)}
                  clearAllFilters={clearAllFilters}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="rounded-xl sm:rounded-2xl shadow-sm  border-gray-200 overflow-hidden mb-6 sm:mb-8 ">
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
                  {loading ? (
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
                              <button className="flex-1 bg-white hover:bg-gray-900 text-gray-800 hover:text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Add to Cart</span>
                                <span className="sm:hidden">Add</span>
                              </button>
                              <button className="bg-white hover:bg-blue-600 text-gray-800 hover:text-white p-2 sm:p-2.5 rounded-lg shadow-lg transition-all duration-300">
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="p-3 sm:p-4 flex flex-col flex-grow">
                            {/* Brand */}
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
                                {product.review}
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
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                {product.price}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-xs text-green-600 font-bold">
                                  {product.discount}% off
                                </span>
                              )}
                            </div>

                            {/* Stock Info */}
                            {product.stock && product.stock < 30 && (
                              <p className="text-xs text-orange-600 font-semibold mt-auto">
                                Only {product.stock} left in stock
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