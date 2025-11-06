import { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export default function ProductsFilter({
  products = [],
  selectedSubCategories,
  setSelectedSubCategories,
  selectedDetails,
  setSelectedDetails,
  priceRange,
  setPriceRange,
  selectedColors,
  setSelectedColors,
  selectedSizes,
  setSelectedSizes,
  selectedReviewThresholds,
  setSelectedReviewThresholds,
  selectedAvailability,
  setSelectedAvailability,
  selectedDiscountRanges,
  setSelectedDiscountRanges,
  selectedOccasions,
  setSelectedOccasions,
  selectedBrands,
  setSelectedBrands,
  selectedSeasonalCollections,
  setSelectedSeasonalCollections,
  className,
  filterToggle,
  filterToggleHandler,
}) {
  const [openAccordion, setOpenAccordion] = useState("Topwear");
  const [openSubAccordions, setOpenSubAccordions] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Extract actual categories from your product data
  const getCategoryTree = () => {
    const categories = {};
    const mainCategories = [...new Set(products.map((p) => p.mainCategory))];

    mainCategories.forEach((mainCat) => {
      categories[mainCat] = {};
      const subCategories = [
        ...new Set(
          products
            .filter((p) => p.mainCategory === mainCat)
            .map((p) => p.subCategory)
        ),
      ];

      subCategories.forEach((subCat) => {
        const details = [
          ...new Set(
            products
              .filter(
                (p) =>
                  p.mainCategory === mainCat &&
                  p.subCategory === subCat &&
                  p.subCategoryDetail
              )
              .map((p) => p.subCategoryDetail)
          ),
        ];
        categories[mainCat][subCat] = details;
      });
    });

    return categories;
  };

  const categoryTree = getCategoryTree();

  // Extract unique values from products for filters
  const extractUniqueValues = () => {
    const colors = [...new Set(products.flatMap((p) => p.colors))].filter(
      Boolean
    );
    const sizes = [...new Set(products.flatMap((p) => p.sizes))].filter(
      Boolean
    );
    const brands = [...new Set(products.map((p) => p.brand))].filter(Boolean);
    const occasions = [...new Set(products.flatMap((p) => p.occasion))].filter(
      Boolean
    );
    const seasonalCollections = [
      ...new Set(
        products.map((p) => p.seasonal_special_collection).filter(Boolean)
      ),
    ];

    return { colors, sizes, brands, occasions, seasonalCollections };
  };

  const { colors, sizes, brands, occasions, seasonalCollections } =
    extractUniqueValues();
  const reviewOptions = ["4", "3", "2", "1"];
  const discountRanges = ["10-25", "26-50", "51-75", "76-100"];

  // Handle subcategory selection
  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategories((prev) => {
      const currentSubCategories = Array.isArray(prev) ? prev : [];
      if (currentSubCategories.includes(subCategory)) {
        return currentSubCategories.filter((cat) => cat !== subCategory);
      } else {
        return [...currentSubCategories, subCategory];
      }
    });
  };

  const isSubCategorySelected = (subCategory) => {
    return Array.isArray(selectedSubCategories)
      ? selectedSubCategories.includes(subCategory)
      : false;
  };

  // Handle seasonal collection selection
  const handleSeasonalCollectionChange = (collection) => {
    setSelectedSeasonalCollections((prev) => {
      const currentCollections = Array.isArray(prev) ? prev : [];
      if (currentCollections.includes(collection)) {
        return currentCollections.filter((col) => col !== collection);
      } else {
        return [...currentCollections, collection];
      }
    });
  };

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close filter when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterToggle && isMobile && !event.target.closest(".filter-widget")) {
        filterToggleHandler();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterToggle, isMobile, filterToggleHandler]);

  // Prevent body scroll when filter is open on mobile
  useEffect(() => {
    if (filterToggle && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [filterToggle, isMobile]);

  const toggleAccordion = (main) => {
    setOpenAccordion((prev) => (prev === main ? null : main));
  };

  const toggleSubAccordion = (subCategory, e) => {
    e?.stopPropagation();
    setOpenSubAccordions((prev) => ({
      ...prev,
      [subCategory]: !prev[subCategory],
    }));
  };

  const handleDetailChange = (detailKey) => {
    setSelectedDetails((prev) => {
      const currentDetails = Array.isArray(prev) ? prev : [];
      if (currentDetails.includes(detailKey)) {
        return currentDetails.filter((d) => d !== detailKey);
      } else {
        return [...currentDetails, detailKey];
      }
    });
  };

  // Handle Select All for Main Category
  const handleSelectAllMainCategory = (mainCategory) => {
    const subCategories = Object.keys(categoryTree[mainCategory]);

    const allSubCategoryKeys = [];
    const allDetailKeys = [];

    subCategories.forEach((subCategory) => {
      const details = categoryTree[mainCategory][subCategory];
      if (details.length > 0) {
        details.forEach((detail) =>
          allDetailKeys.push(`${subCategory}||${detail}`)
        );
      } else {
        allSubCategoryKeys.push(subCategory);
      }
    });

    const allKeysToSelect = [...allSubCategoryKeys, ...allDetailKeys];
    const currentSubCategories = Array.isArray(selectedSubCategories)
      ? selectedSubCategories
      : [];
    const currentDetails = Array.isArray(selectedDetails)
      ? selectedDetails
      : [];

    const allSelected = allKeysToSelect.every((key) =>
      allSubCategoryKeys.includes(key)
        ? currentSubCategories.includes(key)
        : currentDetails.includes(key)
    );

    if (allSelected) {
      setSelectedSubCategories(
        currentSubCategories.filter((cat) => !allSubCategoryKeys.includes(cat))
      );
      setSelectedDetails(
        currentDetails.filter((detail) => !allDetailKeys.includes(detail))
      );
    } else {
      setSelectedSubCategories([
        ...new Set([...currentSubCategories, ...allSubCategoryKeys]),
      ]);
      setSelectedDetails([...new Set([...currentDetails, ...allDetailKeys])]);
    }
  };

  // Handle Select All for Subcategory details
  const handleSelectAllSubCategory = (subCategory, details) => {
    const allDetailKeys = details.map((detail) => `${subCategory}||${detail}`);
    const currentDetails = Array.isArray(selectedDetails)
      ? selectedDetails
      : [];
    const allSelected = allDetailKeys.every((key) =>
      currentDetails.includes(key)
    );

    if (allSelected) {
      setSelectedDetails(
        currentDetails.filter((key) => !allDetailKeys.includes(key))
      );
    } else {
      setSelectedDetails([...new Set([...currentDetails, ...allDetailKeys])]);
    }
  };

  const handleColorChange = (e) => {
    const color = e.target.name;
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  const handleSizeChange = (e) => {
    const size = e.target.name;
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const handleReviewChange = (threshold) => {
    setSelectedReviewThresholds((prev) =>
      prev.includes(threshold)
        ? prev.filter((item) => item !== threshold)
        : [...prev, threshold]
    );
  };

  const handleAvailabilityChange = (avail) => {
    setSelectedAvailability((prev) =>
      prev.includes(avail)
        ? prev.filter((item) => item !== avail)
        : [...prev, avail]
    );
  };

  const handleDiscountChange = (range) => {
    setSelectedDiscountRanges((prev) =>
      prev.includes(range)
        ? prev.filter((item) => item !== range)
        : [...prev, range]
    );
  };

  const handleOccasionChange = (occasion) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((item) => item !== occasion)
        : [...prev, occasion]
    );
  };

  const handleBrandChange = (e) => {
    const brand = e.target.name;
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
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
    setOpenAccordion("Topwear");
    setOpenSubAccordions({});
  };

  // Count selected filters
  const selectedFiltersCount = [
    Array.isArray(selectedSubCategories) ? selectedSubCategories.length : 0,
    Array.isArray(selectedDetails) ? selectedDetails.length : 0,
    Array.isArray(selectedColors) ? selectedColors.length : 0,
    Array.isArray(selectedSizes) ? selectedSizes.length : 0,
    Array.isArray(selectedReviewThresholds)
      ? selectedReviewThresholds.length
      : 0,
    Array.isArray(selectedAvailability) ? selectedAvailability.length : 0,
    Array.isArray(selectedDiscountRanges) ? selectedDiscountRanges.length : 0,
    Array.isArray(selectedOccasions) ? selectedOccasions.length : 0,
    Array.isArray(selectedBrands) ? selectedBrands.length : 0,
    Array.isArray(selectedSeasonalCollections)
      ? selectedSeasonalCollections.length
      : 0,
    priceRange.min !== 0 || priceRange.max !== 10000 ? 1 : 0,
  ].reduce((count, filter) => count + filter, 0);

  const isDefaultPriceRange =
    priceRange?.min === 0 && priceRange?.max === 10000;

  // Removal handlers
  const removeDetail = (detailKey) => {
    setSelectedDetails((prev) => prev.filter((item) => item !== detailKey));
  };

  const removeSubCategory = (subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.filter((item) => item !== subCategory)
    );
  };

  const removeColor = (color) => {
    setSelectedColors((prev) => prev.filter((item) => item !== color));
  };

  const removeSize = (size) => {
    setSelectedSizes((prev) => prev.filter((item) => item !== size));
  };

  const removeReview = (threshold) => {
    setSelectedReviewThresholds((prev) =>
      prev.filter((item) => item !== threshold)
    );
  };

  const removeAvailability = (avail) => {
    setSelectedAvailability((prev) => prev.filter((item) => item !== avail));
  };

  const removeDiscount = (range) => {
    setSelectedDiscountRanges((prev) => prev.filter((item) => item !== range));
  };

  const removeOccasion = (occasion) => {
    setSelectedOccasions((prev) => prev.filter((item) => item !== occasion));
  };

  const removeBrand = (brand) => {
    setSelectedBrands((prev) => prev.filter((item) => item !== brand));
  };

  const removeSeasonalCollection = (collection) => {
    setSelectedSeasonalCollections((prev) =>
      prev.filter((item) => item !== collection)
    );
  };

  const handleMobileClose = () => {
    if (filterToggleHandler) {
      filterToggleHandler();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {filterToggle && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[50] lg:hidden transition-opacity duration-300"
          onClick={handleMobileClose}
        />
      )}

      {/* Main Filter Sidebar */}
      <div
        className={`filter-widget w-full fixed lg:relative left-0 top-0 h-screen lg:h-auto z-50 lg:z-auto overflow-y-auto px-6 pt-6 lg:pt-0 lg:px-0 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out bg-white lg:bg-transparent ${
          className || ""
        } ${
          filterToggle
            ? "translate-x-0 z-[60]"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: isMobile ? "85%" : "100%",
          maxWidth: isMobile ? "340px" : "none",
        }}
      >
        {/* Mobile Header */}
        <div className="flex lg:hidden justify-between items-center pb-4 border-b border-gray-200 mb-4 bg-white">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Filters</h1>
            {selectedFiltersCount > 0 && (
              <span className="bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full min-w-[24px] text-center">
                {selectedFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={handleMobileClose}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors duration-200 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center pb-4 border-b-2 border-gray-200 mb-5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Filters</h1>
            {selectedFiltersCount > 0 && (
              <span className="bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full min-w-[24px] text-center">
                {selectedFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-gray-600 text-sm font-semibold hover:text-gray-900 transition-colors duration-200 underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>

        {/* Active Filters Bar */}
        {selectedFiltersCount > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Active:</span>

              {/* SubCategory Chips */}
              {(Array.isArray(selectedSubCategories)
                ? selectedSubCategories
                : []
              ).map((subCategory) => (
                <div
                  key={`subcategory-${subCategory}`}
                  className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-xs font-medium">{subCategory}</span>
                  <button
                    onClick={() => removeSubCategory(subCategory)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Price Chip */}
              {!isDefaultPriceRange && (
                <div className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200">
                  <span className="text-xs font-medium">
                    ₹{priceRange?.min ?? 0} - ₹{priceRange?.max ?? 10000}
                  </span>
                  <button
                    onClick={() => setPriceRange({ min: 0, max: 10000 })}
                    className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Detail Chips */}
              {(Array.isArray(selectedDetails) ? selectedDetails : []).map(
                (detailKey) => {
                  const [, detail] = detailKey.split("||");
                  return (
                    <div
                      key={`detail-${detailKey}`}
                      className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                    >
                      <span className="text-xs font-medium">{detail}</span>
                      <button
                        onClick={() => removeDetail(detailKey)}
                        className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                      >
                        ×
                      </button>
                    </div>
                  );
                }
              )}

              {/* Color Chips */}
              {(Array.isArray(selectedColors) ? selectedColors : []).map(
                (color) => (
                  <div
                    key={`color-${color}`}
                    className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="text-xs font-medium">{color}</span>
                    </div>
                    <button
                      onClick={() => removeColor(color)}
                      className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {/* Size Chips */}
              {(Array.isArray(selectedSizes) ? selectedSizes : []).map(
                (size) => (
                  <div
                    key={`size-${size}`}
                    className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                  >
                    <span className="text-xs font-medium">{size}</span>
                    <button
                      onClick={() => removeSize(size)}
                      className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {/* Review Chips */}
              {(Array.isArray(selectedReviewThresholds)
                ? selectedReviewThresholds
                : []
              ).map((review) => (
                <div
                  key={`review-${review}`}
                  className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-xs font-medium">{review}★+</span>
                  <button
                    onClick={() => removeReview(review)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Seasonal Collection Chips */}
              {(Array.isArray(selectedSeasonalCollections)
                ? selectedSeasonalCollections
                : []
              ).map((collection) => (
                <div
                  key={`seasonal-${collection}`}
                  className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-xs font-medium">{collection}</span>
                  <button
                    onClick={() => removeSeasonalCollection(collection)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Other Filter Chips */}
              {(Array.isArray(selectedAvailability)
                ? selectedAvailability
                : []
              ).map((availability) => (
                <div
                  key={`availability-${availability}`}
                  className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-xs font-medium">
                    {availability === "in" ? "In Stock" : "Out of Stock"}
                  </span>
                  <button
                    onClick={() => removeAvailability(availability)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              {(Array.isArray(selectedDiscountRanges)
                ? selectedDiscountRanges
                : []
              ).map((discount) => (
                <div
                  key={`discount-${discount}`}
                  className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-xs font-medium">{discount}% off</span>
                  <button
                    onClick={() => removeDiscount(discount)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              {(Array.isArray(selectedOccasions) ? selectedOccasions : []).map(
                (occasion) => (
                  <div
                    key={`occasion-${occasion}`}
                    className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                  >
                    <span className="text-xs font-medium">{occasion}</span>
                    <button
                      onClick={() => removeOccasion(occasion)}
                      className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {(Array.isArray(selectedBrands) ? selectedBrands : []).map(
                (brand) => (
                  <div
                    key={`brand-${brand}`}
                    className="bg-gray-900 text-white rounded-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-800 transition-all duration-200"
                  >
                    <span className="text-xs font-medium capitalize">
                      {brand}
                    </span>
                    <button
                      onClick={() => removeBrand(brand)}
                      className="text-white hover:text-gray-200 transition-colors duration-200 text-sm leading-none font-bold"
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Filter Content */}
        <div className="filter-content pb-24 lg:pb-0 space-y-5">
          {/* Category Filter */}
          <div className="filter-section">
            <div className="flex items-center justify-between mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">Category</h3>
            </div>

            <div className="space-y-2">
              {Object.keys(categoryTree).map((mainCategory) => {
                const subCategories = Object.keys(categoryTree[mainCategory]);
                const hasAnyDetails = subCategories.some(
                  (sub) => categoryTree[mainCategory][sub].length > 0
                );

                const allSubCategoryKeys = [];
                const allDetailKeys = [];
                subCategories.forEach((subCategory) => {
                  const details = categoryTree[mainCategory][subCategory];
                  if (details.length > 0) {
                    details.forEach((detail) =>
                      allDetailKeys.push(`${subCategory}||${detail}`)
                    );
                  } else {
                    allSubCategoryKeys.push(subCategory);
                  }
                });

                const allKeysToSelect = [
                  ...allSubCategoryKeys,
                  ...allDetailKeys,
                ];
                const currentSubCategories = Array.isArray(
                  selectedSubCategories
                )
                  ? selectedSubCategories
                  : [];
                const currentDetails = Array.isArray(selectedDetails)
                  ? selectedDetails
                  : [];

                const allSelected =
                  allKeysToSelect.length > 0 &&
                  allKeysToSelect.every((key) =>
                    allSubCategoryKeys.includes(key)
                      ? currentSubCategories.includes(key)
                      : currentDetails.includes(key)
                  );

                return (
                  <div key={mainCategory} className="space-y-1">
                    {/* Main Category */}
                    <button
                      onClick={() => toggleAccordion(mainCategory)}
                      className="w-full flex justify-between items-center py-2.5 px-3 text-gray-900 font-semibold text-sm hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <span>{mainCategory}</span>
                      {openAccordion === mainCategory ? (
                        <ChevronUp className="w-4 h-4 text-gray-700" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-700" />
                      )}
                    </button>

                    {/* Subcategories Section */}
                    {openAccordion === mainCategory && (
                      <div className="space-y-1 bg-gray-50 rounded-lg p-3 ml-2">
                        {!hasAnyDetails && (
                          <div
                            className="flex items-center gap-2.5 mb-2 pb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-2 transition-all duration-200"
                            onClick={() =>
                              handleSelectAllMainCategory(mainCategory)
                            }
                          >
                            <div
                              className={`w-4 h-4 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                                allSelected
                                  ? "bg-gray-900 border-gray-900 text-white"
                                  : "border-gray-400 hover:border-gray-900"
                              }`}
                            >
                              {allSelected && (
                                <span className="text-xs font-bold">✓</span>
                              )}
                            </div>
                            <label className="text-xs font-bold text-gray-700 select-none cursor-pointer">
                              {allSelected ? "Deselect All" : "Select All"}
                            </label>
                          </div>
                        )}

                        {/* Individual Subcategories */}
                        {subCategories.map((subCategory) => {
                          const details =
                            categoryTree[mainCategory][subCategory];
                          const hasDetails = details.length > 0;

                          const subCategoryDetailKeys = details.map(
                            (detail) => `${subCategory}||${detail}`
                          );
                          const allDetailsSelected =
                            subCategoryDetailKeys.length > 0 &&
                            subCategoryDetailKeys.every((key) =>
                              selectedDetails.includes(key)
                            );

                          const isSubCategoryChecked =
                            isSubCategorySelected(subCategory);

                          return (
                            <div
                              key={subCategory}
                              className="border-b border-gray-200 last:border-b-0 pb-2"
                            >
                              {/* Subcategory Row */}
                              <div
                                className="w-full flex justify-between items-center py-2 px-2.5 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                                onClick={() =>
                                  hasDetails
                                    ? toggleSubAccordion(subCategory)
                                    : handleSubCategoryChange(subCategory)
                                }
                              >
                                <div className="flex items-center gap-2.5">
                                  {/* Checkbox (for subcategory without details) */}
                                  {!hasDetails && (
                                    <div
                                      className={`w-4 h-4 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                                        isSubCategoryChecked
                                          ? "bg-gray-900 border-gray-900 text-white"
                                          : "border-gray-400 hover:border-gray-900"
                                      }`}
                                    >
                                      {isSubCategoryChecked && (
                                        <span className="text-xs font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <span className="text-sm">{subCategory}</span>
                                </div>

                                {hasDetails && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSubAccordion(subCategory);
                                    }}
                                    className={`w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-transform duration-300 ${
                                      openSubAccordions[subCategory]
                                        ? "rotate-180 bg-gray-100"
                                        : ""
                                    } hover:bg-gray-900 hover:text-white`}
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Subcategory Details */}
                              {hasDetails && openSubAccordions[subCategory] && (
                                <div className="ml-5 mt-2 space-y-1 border-l-2 border-gray-200 pl-3">
                                  {/* Select All Details */}
                                  <div
                                    className="flex items-center gap-2.5 mb-2 pb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-all duration-200"
                                    onClick={() =>
                                      handleSelectAllSubCategory(
                                        subCategory,
                                        details
                                      )
                                    }
                                  >
                                    <div
                                      className={`w-3.5 h-3.5 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                                        allDetailsSelected
                                          ? "bg-gray-900 border-gray-900 text-white"
                                          : "border-gray-400 hover:border-gray-900"
                                      }`}
                                    >
                                      {allDetailsSelected && (
                                        <span className="text-xs font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                    <label className="text-xs font-bold text-gray-700 select-none cursor-pointer">
                                      {allDetailsSelected
                                        ? "Deselect All"
                                        : "Select All"}
                                    </label>
                                  </div>

                                  {/* Individual Details */}
                                  {details.map((detail) => {
                                    const detailKey = `${subCategory}||${detail}`;
                                    const isChecked =
                                      selectedDetails.includes(detailKey);
                                    return (
                                      <div
                                        key={detailKey}
                                        className="group flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                                        onClick={() =>
                                          handleDetailChange(detailKey)
                                        }
                                      >
                                        <div
                                          className={`w-3.5 h-3.5 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                                            isChecked
                                              ? "bg-gray-900 border-gray-900 text-white"
                                              : "border-gray-400 group-hover:border-gray-900"
                                          }`}
                                        >
                                          {isChecked && (
                                            <span className="text-xs font-bold">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                        <label className="text-xs font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer transition-all duration-200 select-none">
                                          {detail}
                                        </label>
                                      </div>
                                    );
                                  })}
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
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">
                Price Range
              </h3>
            </div>

            <div className="px-2 mb-4 mt-4">
              <RangeSlider
                value={[priceRange?.min ?? 0, priceRange?.max ?? 10000]}
                onInput={(values) => {
                  setPriceRange({ min: values[0], max: values[1] });
                }}
                min={0}
                max={10000}
                step={10}
                className="range-slider-black"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Min
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="10"
                    value={priceRange?.min ?? 0}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : Number(e.target.value);
                      const clampedValue = Math.max(
                        0,
                        Math.min(value, priceRange?.max ?? 10000)
                      );
                      setPriceRange((prev) => ({ ...prev, min: clampedValue }));
                    }}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200"
                  />
                </div>
              </div>

              <span className="text-gray-500 text-xs font-semibold pt-6">to</span>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Max
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="10"
                    value={priceRange?.max ?? 10000}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 10000 : Number(e.target.value);
                      const clampedValue = Math.min(
                        10000,
                        Math.max(value, priceRange?.min ?? 0)
                      );
                      setPriceRange((prev) => ({ ...prev, max: clampedValue }));
                    }}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs bg-gray-900 text-white px-4 py-2.5 rounded-lg">
              <span className="font-semibold">Range:</span>
              <span className="font-bold">
                ₹{priceRange?.min ?? 0} - ₹{priceRange?.max ?? 10000}
              </span>
            </div>
          </div>

          {/* Color Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">Colors</h3>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {colors.map((color) => {
                const isChecked = Array.isArray(selectedColors)
                  ? selectedColors.includes(color)
                  : false;
                const colorMap = {
                  Red: "#EF4444",
                  Blue: "#3B82F6",
                  Green: "#10B981",
                  Yellow: "#FBBF24",
                  Black: "#000000",
                  White: "#FFFFFF",
                  Grey: "#9CA3AF",
                  "Navy Blue": "#1E3A8A",
                  "Light Blue": "#93C5FD",
                  Beige: "#F5F5DC",
                  Khaki: "#F0E68C",
                  Brown: "#8B4513",
                  "Graphite Grey": "#42464B",
                  "Sand Beige": "#C2B280",
                  "Indigo Blue": "#4B0082",
                  "Jet Black": "#0A0A0A",
                  Silver: "#C0C0C0",
                  Gold: "#FFD700",
                };
                const colorValue = colorMap[color] || color.toLowerCase();

                return (
                  <div key={color} className="group">
                    <input
                      type="checkbox"
                      id={`color-${color}`}
                      name={color}
                      onChange={handleColorChange}
                      checked={isChecked}
                      className="hidden"
                    />
                    <label
                      htmlFor={`color-${color}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    >
                      <div
                        className={`flex items-center justify-center transition-all duration-200 ${
                          isChecked
                            ? "w-5 h-5 rounded-full border-2 border-gray-900 bg-white"
                            : "w-5 h-5 rounded-full"
                        }`}
                      >
                        <div
                          className={`rounded-full transition-all duration-200 ${
                            isChecked ? "w-3 h-3" : "w-5 h-5"
                          }`}
                          style={{ backgroundColor: colorValue }}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isChecked ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {color}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seasonal Special Collection Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">
                Seasonal Collections
              </h3>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {seasonalCollections.map((collection) => {
                const isChecked = Array.isArray(selectedSeasonalCollections)
                  ? selectedSeasonalCollections.includes(collection)
                  : false;
                return (
                  <div
                    key={collection}
                    className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => handleSeasonalCollectionChange(collection)}
                  >
                    <div
                      className={`w-4 h-4 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                        isChecked
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "border-gray-400 group-hover:border-gray-900"
                      }`}
                    >
                      {isChecked && (
                        <span className="text-xs font-bold">✓</span>
                      )}
                    </div>
                    <label className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer transition-all duration-200 select-none">
                      {collection}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Size Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">Size</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isChecked = Array.isArray(selectedSizes)
                  ? selectedSizes.includes(size)
                  : false;
                return (
                  <div key={size}>
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                      name={size}
                      onChange={handleSizeChange}
                      checked={isChecked}
                      className="hidden"
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className={`inline-block px-4 py-2 text-sm font-semibold border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        isChecked
                          ? "bg-gray-900 border-gray-900 text-white shadow-md"
                          : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                      }`}
                    >
                      {size}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">Reviews</h3>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {reviewOptions.map((threshold) => {
                const isChecked = Array.isArray(selectedReviewThresholds)
                  ? selectedReviewThresholds.includes(threshold)
                  : false;
                return (
                  <div
                    key={threshold}
                    className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => handleReviewChange(threshold)}
                  >
                    <div
                      className={`w-4 h-4 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                        isChecked
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "border-gray-400 group-hover:border-gray-900"
                      }`}
                    >
                      {isChecked && (
                        <span className="text-xs font-bold">✓</span>
                      )}
                    </div>
                    <label className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {threshold}★ & above
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">
                Availability
              </h3>
            </div>
            <div className="space-y-1.5">
              {["in", "out"].map((item, idx) => {
                const isChecked = Array.isArray(selectedAvailability)
                  ? selectedAvailability.includes(item)
                  : false;
                return (
                  <div
                    key={item}
                    className="group flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => handleAvailabilityChange(item)}
                  >
                    <div
                      className={`w-4 h-4 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                        isChecked
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "border-gray-400 group-hover:border-gray-900"
                      }`}
                    >
                      {isChecked && (
                        <span className="text-xs font-bold">✓</span>
                      )}
                    </div>
                    <label className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer">
                      {["In Stock", "Out of Stock"][idx]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discount Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">Discount</h3>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {discountRanges.map((item) => {
                const isChecked = Array.isArray(selectedDiscountRanges)
                  ? selectedDiscountRanges.includes(item)
                  : false;
                return (
                  <div
                    key={item}
                    className="group flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => handleDiscountChange(item)}
                  >
                    <div
                      className={`w-4 h-4 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                        isChecked
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "border-gray-400 group-hover:border-gray-900"
                      }`}
                    >
                      {isChecked && (
                        <span className="text-xs font-bold">✓</span>
                      )}
                    </div>
                    <label className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer">
                      {item}% off
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="filter-section">
            <div className="flex items-center mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-gray-900">Occasion</h3>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {occasions.map((item) => {
                const isChecked = Array.isArray(selectedOccasions)
                  ? selectedOccasions.includes(item)
                  : false;
                return (
                  <div
                    key={item}
                    className="group flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => handleOccasionChange(item)}
                  >
                    <div
                      className={`w-4 h-4 flex items-center justify-center border-2 rounded transition-all duration-200 ${
                        isChecked
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "border-gray-400 group-hover:border-gray-900"
                      }`}
                    >
                      {isChecked && (
                        <span className="text-xs font-bold">✓</span>
                      )}
                    </div>
                    <label className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer">
                      {item}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        /* Enhanced Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f8f8;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 10px;
          opacity: 0.6;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1a1a1a;
          opacity: 0.8;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .custom-scrollbar:hover {
          scrollbar-color: #1a1a1a #f8f8f8;
        }

        /* Range Slider Black Theme */
        .range-slider-black .range-slider__range {
          background: #1a1a1a;
          height: 4px;
        }

        .range-slider-black .range-slider__thumb {
          background: #1a1a1a;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 16px;
          height: 16px;
        }

        .range-slider-black .range-slider__thumb:hover {
          background: #000000;
        }

        .range-slider-black .range-slider__thumb:active {
          background: #000000;
          transform: scale(1.1);
        }

        /* Enhanced input styling */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Focus states for inputs */
        input:focus {
          box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
        }

        /* Smooth transitions */
        .filter-section {
          transition: all 0.3s ease-in-out;
        }

        .accordion-content {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Enhanced checkbox hover effects */
        .group:hover .checkbox-hover {
          transform: scale(1.1);
          border-color: #1a1a1a;
        }

        /* Mobile optimizations */
        @media (max-width: 1023px) {
          .filter-content {
            padding-bottom: 80px;
          }

          .filter-widget {
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
            background: #ffffff !important;
          }

          /* Ensure white background for all mobile filter sections */
          .filter-section {
            background: #ffffff !important;
            border: 1px solid #e5e5e5 !important;
            border-radius: 12px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
          }

          .top-filter-bar {
            background: #f8f8f8 !important;
          }
        }

        /* Desktop optimizations */
        @media (min-width: 1024px) {
          .filter-widget {
            position: sticky;
            top: 1.5rem;
            background: transparent !important;
          }

          .filter-section {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
}