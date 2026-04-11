import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { reviewApi } from "../AllProductPage/productApi";
import { useCart } from "../CartPage/useCart";
import { normalizeProductImages } from "../../utils/imageUtils";
import NectorEarnPoints from "../NectorSDK/NectorEarnPoints";

export default function ProductView({ product, className, reportHandler, writeReview }) {
  const navigate = useNavigate();
  const { items, addItemToCart, updateItemQuantity, refreshCart, isItemUpdating } = useCart();

  // Add state for add to cart feedback
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [userMessage, setUserMessage] = useState(""); // For showing messages to user

  // Transform API product data to handle inventory structure
  const transformedProduct = useMemo(() => {
    if (!product) return null;

    console.log("Original product data:", product);
    console.log("Inventory structure:", product.inventories);

    const mrp = parseFloat(product.mrp || 0);
    const sellingPrice = parseFloat(product.sellingPrice || product.mrp || 0);
    const discount = mrp > 0 && sellingPrice < mrp
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

    // Get images
    let rawImages = [];

    // Always include thumbnail first if available
    if (product.thumbnailImage) {
      rawImages.push(product.thumbnailImage);
    } else if (product.thumbnail) {
      rawImages.push(product.thumbnail);
    }

    // Add gallery images
    if (product.galleryImage && Array.isArray(product.galleryImage)) {
      // Avoid duplicates if thumbnail is already in gallery
      const galleryImages = product.galleryImage.filter(img => !rawImages.includes(img));
      rawImages = [...rawImages, ...galleryImages];
    } else if (product.images && Array.isArray(product.images)) {
      const moreImages = product.images.filter(img => !rawImages.includes(img));
      rawImages = [...rawImages, ...moreImages];
    }

    const images = rawImages.length > 0
      ? rawImages.map(img => typeof img === 'string' ? (img.startsWith('http') ? img : `http://luxcycs.com/rabbit-and-finch-uploads/${img.startsWith('/') ? img.substring(1) : img}`) : '')
      : [normalizeProductImages(product)[0]]; // Fallback to current utility logic

    // Process available colors and sizes from inventories
    const colorMap = new Map();
    const sizeMap = new Map();
    const inventoryMap = new Map();

    if (product.inventories && product.inventories.length > 0) {
      product.inventories.forEach(inv => {
        // Process colors
        if (inv.productColor) {
          const colorId = inv.productColor.id;
          if (!colorMap.has(colorId)) {
            colorMap.set(colorId, {
              id: colorId,
              name: inv.productColor.color,
              inventoryIds: [inv.id],
              totalStock: inv.availableQuantity || 0
            });
          } else {
            const existingColor = colorMap.get(colorId);
            existingColor.inventoryIds.push(inv.id);
            existingColor.totalStock += (inv.availableQuantity || 0);
          }
        }

        // Process sizes - handle array of sizes
        if (inv.productSize && inv.productSize.size && Array.isArray(inv.productSize.size)) {
          inv.productSize.size.forEach(sizeName => {
            const sizeKey = `${inv.productSize.id}-${sizeName}`;
            if (!sizeMap.has(sizeKey)) {
              sizeMap.set(sizeKey, {
                id: sizeKey,
                originalSizeId: inv.productSize.id,
                name: sizeName,
                inventoryIds: [inv.id],
                totalStock: inv.availableQuantity || 0,
                colorId: inv.productColor?.id
              });
            } else {
              const existingSize = sizeMap.get(sizeKey);
              existingSize.inventoryIds.push(inv.id);
              existingSize.totalStock += (inv.availableQuantity || 0);
            }

            // Create inventory mapping key
            const inventoryKey = `${inv.productColor?.id}-${sizeName}`;
            inventoryMap.set(inventoryKey, inv.id);
          });
        }
      });
    }

    // Convert maps to arrays
    const availableColors = Array.from(colorMap.values());
    const availableSizes = Array.from(sizeMap.values());

    // Fallback if no inventories
    if (availableColors.length === 0) {
      availableColors.push({
        id: 1,
        name: 'Not available',
        inventoryIds: [null],
        totalStock: 100
      });
    }
    if (availableSizes.length === 0) {
      availableSizes.push({
        id: 1,
        name: 'Not available',
        inventoryIds: [null],
        totalStock: 100
      });
    }

    const result = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category?.name || 'Uncategorized',
      mrp: mrp,
      sellingPrice: sellingPrice,
      discount: discount,
      gst: product.gst || 0,
      images: images,
      colors: availableColors,
      sizes: availableSizes,
      inventories: product.inventories || [],
      inventoryMap: inventoryMap,
      specifications: {
        fabric: product.material?.name || 'Not specified',
        fitType: product.fitType || 'Regular',
        occasion: product.occasion?.name || 'Casual',
        careInstructions: product.careInstructions || 'Machine wash cold',
        description: product.description || '',
        seasonal: product.seasonal || 'All Season'
      },
      rating: parseFloat(product.averageRating || 0),
      reviewCount: product.reviewCount || 0,
      totalStock: product.inventories?.reduce((sum, inv) => sum + (inv.availableQuantity || 0), 0) || 0
    };

    console.log("Transformed product:", result);
    return result;
  }, [product]);

  // State management
  const [mainImage, setMainImage] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  const thumbnailRef = useRef(null);

  // Calculate price based on quantity
  const calculatedPrice = useMemo(() => {
    if (!transformedProduct) return { sellingPrice: 0, mrp: 0, discount: 0 };

    const baseSellingPrice = transformedProduct.sellingPrice;
    const baseMrp = transformedProduct.mrp;

    return {
      sellingPrice: baseSellingPrice * quantity,
      mrp: baseMrp * quantity,
      discount: transformedProduct.discount
    };
  }, [transformedProduct, quantity]);

  // Get selected color and size objects
  const selectedColor = useMemo(() => {
    return transformedProduct?.colors.find(color => color.id === selectedColorId) || null;
  }, [transformedProduct, selectedColorId]);

  const selectedSize = useMemo(() => {
    return transformedProduct?.sizes.find(size => size.id === selectedSizeId) || null;
  }, [transformedProduct, selectedSizeId]);

  // Get available stock for selected combination
  const currentStock = useMemo(() => {
    if (!selectedColor || !selectedSize) return 0;

    const matchingInventory = transformedProduct.inventories.find(inv => {
      const colorMatch = inv.productColor?.id === selectedColor.id;
      const sizeMatch = inv.productSize?.size?.includes(selectedSize.name);
      return colorMatch && sizeMatch;
    });

    return matchingInventory?.availableQuantity || 0;
  }, [selectedColor, selectedSize, transformedProduct]);

  // Get matching inventory for selected combination
  const matchingInventory = useMemo(() => {
    if (!selectedColor || !selectedSize || !transformedProduct) return null;

    const inventory = transformedProduct.inventories.find(inv => {
      const colorMatch = inv.productColor?.id === selectedColor.id;
      const sizeMatch = inv.productSize?.size?.includes(selectedSize.name);
      return colorMatch && sizeMatch;
    });

    console.log("Matching inventory:", inventory);
    return inventory;
  }, [selectedColor, selectedSize, transformedProduct]);

  // Get available sizes for selected color
  const availableSizesForSelectedColor = useMemo(() => {
    if (!transformedProduct || !selectedColorId) return transformedProduct?.sizes || [];

    return transformedProduct.sizes.filter(
      size => !size.colorId || size.colorId === selectedColorId
    );
  }, [transformedProduct, selectedColorId]);

  // Check if current selection is already in cart
  const itemInCart = useMemo(() => {
    if (!items || !transformedProduct || !selectedColorId || !selectedSizeId) return null;

    // Find matching inventory for current selection to get variation IDs
    const inventory = transformedProduct.inventories.find(inv => {
      const colorMatch = inv.productColor?.id === selectedColorId;
      const sizeMatch = inv.productSize?.size?.includes(selectedSize?.name);
      return colorMatch && sizeMatch;
    });

    if (!inventory) return null;

    return items.find(item =>
      Number(item.productId) === Number(transformedProduct.id) &&
      Number(item.productColorVariationId) === Number(inventory.productColor?.id) &&
      Number(item.productSizeVariationId) === Number(inventory.productSize?.id)
    );
  }, [items, transformedProduct, selectedColorId, selectedSizeId, selectedSize]);

  // Check if both color and size are selected
  const isOptionsSelected = useMemo(() => {
    return selectedColorId && selectedSizeId;
  }, [selectedColorId, selectedSizeId]);

  // Stock status variables
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock < 10;

  // Check if add to cart button should be disabled
  const isAddToCartDisabled = useMemo(() => {
    return isOutOfStock || !isOptionsSelected || isAddingToCart;
  }, [isOutOfStock, isOptionsSelected, isAddingToCart]);

  // Initialize states when product changes - REMOVED AUTO-SELECTION
  useEffect(() => {
    if (transformedProduct) {
      setMainImage(transformedProduct.images[0] || null);

      // REMOVED: Auto-selection of first color and size
      // Let user manually select both color and size
      setSelectedColorId(null);
      setSelectedSizeId(null);
      setQuantity(1);
    }
  }, [transformedProduct]);

  // Update available sizes when color changes
  useEffect(() => {
    if (transformedProduct && selectedColorId) {
      const availableSizesForColor = transformedProduct.sizes.filter(
        size => !size.colorId || size.colorId === selectedColorId
      );

      // Reset size selection when color changes
      setSelectedSizeId(null);

      console.log("Available sizes for selected color:", availableSizesForColor);
    }
  }, [selectedColorId, transformedProduct]);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (addToCartSuccess) {
      const timer = setTimeout(() => {
        setAddToCartSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addToCartSuccess]);

  // Reset user message after 5 seconds
  useEffect(() => {
    if (userMessage) {
      const timer = setTimeout(() => {
        setUserMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userMessage]);

  // Calculate rating distribution
  const calculateRatingDistribution = (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };


  const calculateOverallRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  // Fetch reviews with better error handling
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;

      setReviewsLoading(true);
      try {
        const response = await reviewApi.getByProduct(product.id);
        // API returns { success: true, data: { reviews: [...] } }
        const reviewsData = response.data?.reviews || [];
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        // Calculate rating distribution
        if (reviewsData.length > 0) {
          setRatingDistribution(calculateRatingDistribution(reviewsData));
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?.id]);

  // Get initials for avatar
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-red-500', 'bg-yellow-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Get rating label
  const getRatingLabel = (rating) => {
    const labels = {
      5: "Excellent",
      4: "Good",
      3: "Average",
      2: "Poor",
      1: "Very Poor"
    };
    return labels[rating] || "No Rating";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handlers
  const handleColorChange = (colorId) => {
    console.log("Color changed to:", colorId);
    setSelectedColorId(colorId);
    setUserMessage(""); // Clear any previous messages
  };

  const handleSizeChange = (sizeId) => {
    console.log("Size changed to:", sizeId);
    setSelectedSizeId(sizeId);
    setUserMessage(""); // Clear any previous messages
  };

  const increment = async () => {
    if (itemInCart) {
      if (itemInCart.quantity < currentStock) {
        await updateItemQuantity(itemInCart.id, itemInCart.quantity + 1);
      } else {
        setUserMessage(`⚠️ Only ${currentStock} items available in stock`);
      }
    } else {
      if (quantity < currentStock) {
        setQuantity(prev => prev + 1);
      }
    }
  };

  const decrement = async () => {
    if (itemInCart) {
      if (itemInCart.quantity > 1) {
        await updateItemQuantity(itemInCart.id, itemInCart.quantity - 1);
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= currentStock) {
      setQuantity(value);
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setPincode(value);

    if (value.length === 6) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 3);
      setDeliveryDate(
        currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      );
      setStockStatus(currentStock > 0 ? "Available" : "Out of Stock");
    } else {
      setDeliveryDate("Enter valid pincode");
      setStockStatus("");
    }
  };

  // Handle disabled button click
  const handleDisabledButtonClick = () => {
    if (!selectedColorId && !selectedSizeId) {
      setUserMessage("⚠️ Please select both color and size to continue");
    } else if (!selectedColorId) {
      setUserMessage("⚠️ Please select a color first");
    } else if (!selectedSizeId) {
      setUserMessage("⚠️ Please select a size first");
    } else if (isOutOfStock) {
      setUserMessage("❌ This combination is out of stock. Please choose different options.");
    }
  };

  // FIXED Add to Cart function with proper feedback
  const handleAddToCart = async () => {
    // Validation
    if (!selectedColor || !selectedSize) {
      setUserMessage("⚠️ Please select both color and size");
      return;
    }

    if (currentStock === 0) {
      setUserMessage("❌ Selected combination is out of stock");
      return;
    }

    if (quantity > currentStock) {
      setUserMessage(`⚠️ Only ${currentStock} items available in stock`);
      return;
    }

    // Check if we have matching inventory
    if (!matchingInventory) {
      console.error("No matching inventory found", {
        selectedColorId: selectedColor.id,
        selectedSizeName: selectedSize.name,
        availableInventories: transformedProduct.inventories
      });
      setUserMessage("❌ Selected combination not available in inventory");
      return;
    }

    // Validate inventory has required IDs
    if (!matchingInventory.productColor?.id || !matchingInventory.productSize?.id) {
      console.error("Inventory missing required IDs:", matchingInventory);
      setUserMessage("❌ Invalid inventory configuration");
      return;
    }

    setIsAddingToCart(true);
    setUserMessage(""); // Clear previous messages

    try {
      // Prepare cart data with correct structure
      const cartData = {
        productId: transformedProduct.id,
        productColorVariationId: matchingInventory.productColor.id,
        productSizeVariationId: matchingInventory.productSize.id,
        quantity: quantity
      };

      console.log("Adding to cart with data:", cartData);
      console.log("Matching inventory details:", matchingInventory);

      const result = await addItemToCart(cartData);

      if (result.success) {
        setAddToCartSuccess(true);
        // Show success alert
        alert("✅ Successfully added to cart!");
        // Refresh cart to get updated data
        await refreshCart();
        return true;
      } else {
        throw new Error(result.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(`❌ Failed to add product to cart\n\n${error.message}\n\nPlease try again or contact support.`);
      return false;
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart();
    if (success) {
      navigate('/checkout');
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setZoomStyle({});
  };

  // Scroll handlers for thumbnails
  const scrollUp = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ top: -120, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ top: 120, behavior: "smooth" });
    }
  };

  // Load more reviews
  const handleLoadMoreReviews = () => {
    setVisibleReviews(prev => prev + 3);
  };

  if (!transformedProduct) {
    return <div className="text-center py-10">Loading product...</div>;
  }


  // Calculate overall rating
  const overallRating = useMemo(() => {
    return reviews.length > 0 ? calculateOverallRating(reviews) : transformedProduct.rating;
  }, [reviews, transformedProduct.rating]);

  if (!transformedProduct) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  return (
    <>
      <div className={`product-view mt-10 w-full lg:flex flex-col lg:flex-row justify-between ${className || ""}`}>

        {/* Image Section */}
        <div data-aos="fade-right" className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px] flex flex-row">
          <div className="w-[120px] flex flex-col gap-2 mr-4">
            {/* Scrollable Thumbnail Container - No Scrollbar */}
            <div
              ref={thumbnailRef}
              className="w-[120px] h-[480px] overflow-y-scroll scrollbar-hide"
              style={{
                scrollBehavior: "smooth",
                msOverflowStyle: "none",  /* IE and Edge */
                scrollbarWidth: "none"     /* Firefox */
              }}
            >
              {/* Hide scrollbar for Chrome, Safari and Opera */}
              <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

              {transformedProduct.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(img)}
                  onMouseEnter={() => setMainImage(img)}
                  className="w-[120px] h-[120px] p-[10px] cursor-pointer relative mx-auto rounded-lg transition-colors duration-200"
                >
                  <img
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className={`w-full h-full object-contain transition-all duration-200 ${mainImage !== img ? "opacity-60" : "opacity-100"
                      }`}
                  />
                  {mainImage === img && (
                    <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Up and Down Arrow Buttons - Always visible at bottom */}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={scrollUp}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-800 hover:bg-slate-950 hover:text-white active:border-2 active:border-blue-700 shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Scroll thumbnails up"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5L18 11L6 11L12 5Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              <button
                onClick={scrollDown}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-800 hover:bg-slate-950 hover:text-white active:border-2 active:border-blue-700 shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Scroll thumbnails down"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 19L18 13L6 13L12 19Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div
              className={`w-full h-[550px] flex justify-center items-center overflow-hidden relative ${"cursor-zoom-in"
                }`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={mainImage || transformedProduct.images[0]}
                alt={transformedProduct.name}
                className={`w-full h-full object-contain transition-transform duration-150 ease-out ${showZoom ? "scale-150" : "scale-100"
                  }`}
                style={zoomStyle}
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <div className="product-details w-full mt-10 lg:mt-0">
            <span className="text-gray-500 text-xs font-normal uppercase tracking-wider mb-2 inline-block">
              {transformedProduct.category}
            </span>
            <p className="text-xl font-medium text-gray-900 mb-4">
              {transformedProduct.name}
            </p>

            {/* Rating */}
            <div className="flex space-x-[10px] items-center mb-6">
              <span className="bg-green-600 text-white text-xs font-bold py-1 px-2 rounded">
                {transformedProduct.rating.toFixed(1)} ★
              </span>
              <span className="text-gray-900 text-sm">
                {transformedProduct.reviewCount} reviews
              </span>
            </div>

            {/* Price Section */}
            <div className="mb-7">
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{calculatedPrice.sellingPrice.toLocaleString()}
                </span>
                {calculatedPrice.discount > 0 && (
                  <>
                    <span className="text-lg font-medium text-gray-400 line-through ml-3">
                      ₹{calculatedPrice.mrp.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-red-600 ml-3 bg-red-50 px-2 py-1 rounded">
                      {calculatedPrice.discount}% off
                    </span>
                    <span
                      className="ml-2 cursor-pointer"
                      onClick={() => setShowPriceDetails(!showPriceDetails)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7.5"
                          fill="#666"
                          stroke="#FFF"
                          strokeWidth="1"
                        />
                        <text
                          x="8"
                          y="10"
                          fontSize="6"
                          textAnchor="middle"
                          fill="#FFF"
                          fontWeight="bold"
                        >
                          i
                        </text>
                      </svg>
                    </span>
                  </>
                )}
              </div>

              {/* Price Details Popup */}
              {showPriceDetails && (
                <div className="mt-2 p-3 bg-gray-100 rounded border border-gray-300">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Maximum Retail Price (incl. of all taxes)</span>
                    <span>₹{calculatedPrice.mrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Selling Price</span>
                    <span>₹{calculatedPrice.sellingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 text-sm mb-1 pt-1">
                    <span>Special Price</span>
                    <span>₹{calculatedPrice.sellingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-300 pt-1 mt-1">
                    <span>Overall you save</span>
                    <span>₹{(calculatedPrice.mrp - calculatedPrice.sellingPrice).toLocaleString()} ({calculatedPrice.discount}%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Message Display */}
            {userMessage && (
              <div className={`mb-4 p-3 rounded text-sm font-medium ${userMessage.includes('✅')
                ? 'bg-green-100 text-green-800 border border-green-300'
                : userMessage.includes('❌')
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}>
                {userMessage}
              </div>
            )}

            {/* Color Selection */}
            <div className="colors mb-[30px]">
              <span className="text-sm font-normal uppercase text-gray-500 mb-[14px] inline-block">
                COLOR
              </span>
              <div className="flex space-x-4 items-center">
                {transformedProduct.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    className={`px-4 py-2 border rounded transition-all duration-200 ${selectedColorId === color.id
          {/* Nector Earn Points Widget */}
          <NectorEarnPoints price={calculatedPrice.sellingPrice} />

          {/* Color Selection */}
          <div className="colors mb-[30px]">
            <span className="text-sm font-normal uppercase text-gray-500 mb-[14px] inline-block">
              COLOR
            </span>
            <div className="flex space-x-4 items-center">
              {transformedProduct.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
                  className={`px-4 py-2 border rounded transition-all duration-200 ${
                    selectedColorId === color.id
                      ? "border-black bg-black text-white shadow-md transform scale-105"
                      : "border-gray-300 bg-white text-gray-800 hover:border-gray-500 hover:shadow-sm"
                      } ${color.totalStock === 0 ? "opacity-50 cursor-not-allowed grayscale" : ""
                      }`}
                    disabled={color.totalStock === 0}
                    title={color.totalStock === 0 ? "Out of stock" : `Select ${color.name}`}
                  >
                    {color.name}
                    {color.totalStock === 0 && " (X)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="product-size mb-[30px]">
              <span className="text-sm font-normal uppercase text-gray-500 mb-[14px] inline-block">
                SIZE
              </span>
              {selectedColorId ? (
                <div className="flex flex-wrap gap-2">
                  {availableSizesForSelectedColor.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeChange(size.id)}
                      className={`px-4 py-2 border rounded min-w-[50px] text-center transition-all duration-200 ${selectedSizeId === size.id
                        ? "border-black bg-black text-white shadow-md transform scale-105"
                        : "border-gray-300 bg-white text-gray-800 hover:border-gray-500 hover:shadow-sm"
                        } ${size.totalStock === 0 ? "opacity-50 cursor-not-allowed grayscale" : ""
                        }`}
                      disabled={size.totalStock === 0}
                      title={size.totalStock === 0 ? "Out of stock" : `Select ${size.name}`}
                    >
                      {size.name}
                      {size.totalStock === 0 && " (X)"}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {transformedProduct.sizes.map((size) => (
                    <button
                      key={size.id}
                      className="px-4 py-2 border border-gray-300 rounded min-w-[50px] text-center bg-gray-100 text-gray-400 cursor-not-allowed"
                      disabled
                      title="Please select a color first"
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Status - Only show when both options are selected */}
            {isOptionsSelected && (
              <div className="mb-4">
                {isOutOfStock ? (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                ) : isLowStock ? (
                  <p className="text-orange-600 font-semibold">
                    Only {currentStock} left in stock!
                  </p>
                ) : (
                  <p className="text-green-600 font-semibold">
                    In Stock ({currentStock} available)
                  </p>
                )}
              </div>
            )}

            {/* Selected Combination Info */}
            {(selectedColor || selectedSize) && (
              <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm text-qblack font-medium">
                  Selected Combination:{" "}
                  {selectedColor && <span className="font-semibold text-blue-600">{selectedColor.name}</span>}
                  {selectedColor && selectedSize && " - "}
                  {selectedSize && <span className="font-semibold text-blue-600">{selectedSize.name}</span>}
                </p>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              {/* Quantity Selector */}
              <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden h-[50px]">
                <button
                  onClick={decrement}
                  className="w-12 h-full flex items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={itemInCart ? (itemInCart.quantity <= 1 || isItemUpdating(itemInCart.id)) : (quantity <= 1 || isOutOfStock || isAddingToCart || !isOptionsSelected)}
                >
                  <span className="text-xl">−</span>
                </button>
                <div className="w-16 h-full flex items-center justify-center font-semibold text-gray-900 bg-white border-x border-gray-300">
                  {itemInCart ? (isItemUpdating(itemInCart.id) ? "..." : itemInCart.quantity) : quantity}
                </div>
                <button
                  onClick={increment}
                  className="w-12 h-full flex items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={itemInCart ? (itemInCart.quantity >= currentStock || isItemUpdating(itemInCart.id)) : (quantity >= currentStock || isOutOfStock || isAddingToCart || !isOptionsSelected)}
                >
                  <span className="text-xl">+</span>
                </button>
              </div>

              {/* Action Buttons Container */}
              <div className="flex flex-1 w-full gap-3">
                {itemInCart ? (
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex-1 h-[50px] bg-gray-900 text-white rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-black transition-all transform active:scale-95 shadow-md"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="21" r="1" fill="currentColor" />
                      <circle cx="17" cy="21" r="1" fill="currentColor" />
                    </svg>
                    <span>GO TO CART</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={isAddToCartDisabled ? handleDisabledButtonClick : handleAddToCart}
                    className={`flex-1 h-[50px] text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${isAddToCartDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : addToCartSuccess
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl transform active:scale-95 transition-transform"
                      }`}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>ADDING...</span>
                      </div>
                    ) : addToCartSuccess ? (
                      <div className="flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>ADDED ITEM</span>
                      </div>
                    ) : !isOptionsSelected ? (
                      "SELECT OPTIONS"
                    ) : (
                      "ADD TO CART"
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={itemInCart ? () => navigate('/checkout') : handleBuyNow}
                  className={`flex-1 h-[50px] text-sm font-bold transition-all rounded-lg border-2 transform active:scale-95 ${isAddToCartDisabled && !itemInCart
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    }`}
                  disabled={isAddingToCart}
                >
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="product-details-section mb-[20px] p-4 bg-white border border-gray-300 rounded">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowProductDetails(!showProductDetails)}
              >
                <h3 className="text-lg font-semibold text-black">Product Details</h3>
                <span className="text-2xl font-bold">
                  {showProductDetails ? "−" : "+"}
                </span>
              </div>
              {showProductDetails && (
                <div className="mt-4 space-y-1">
                  <div className="flex items-center py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm font-medium w-1/3">Fabric</span>
                    <span className="text-gray-900 text-sm font-semibold flex-1">
                      {transformedProduct.specifications.fabric || "Not Specified"}
                    </span>
                  </div>
                  <div className="flex items-center py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm font-medium w-1/3">Fit Type</span>
                    <span className="text-gray-900 text-sm font-semibold flex-1">
                      {transformedProduct.specifications.fitType || "Not Specified"}
                    </span>
                  </div>
                  <div className="flex items-center py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm font-medium w-1/3">Occasion</span>
                    <span className="text-gray-900 text-sm font-semibold flex-1">
                      {transformedProduct.specifications.occasion || "Not Specified"}
                    </span>
                  </div>
                  <div className="flex items-center py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm font-medium w-1/3">Care</span>
                    <span className="text-gray-900 text-sm font-semibold flex-1">
                      {transformedProduct.specifications.careInstructions || "Not Specified"}
                    </span>
                  </div>
                  {transformedProduct.specifications.description && (
                    <div className="flex py-2.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500 text-sm font-medium w-1/3">Description</span>
                      <span className="text-gray-900 text-sm font-medium flex-1 leading-relaxed">
                        {transformedProduct.specifications.description}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      {/* Ratings & Reviews Section */}
      <div data-aos="fade-up" className="ratings-reviews-section w-full mt-12">
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            {/* Left Side - Rating Summary */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ratings & Reviews
              </h3>
              <div className="rating-summary p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  {/* Overall Rating */}
                  <div className="text-center sm:text-left">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {overallRating.toFixed(1)}
                    </div>
                    <div className="text-yellow-400 text-2xl mb-3 flex gap-1">
                      {'★'.repeat(Math.floor(overallRating))}
                      {overallRating % 1 >= 0.5 ? '★' : '☆'}
                      {'☆'.repeat(5 - Math.ceil(overallRating))}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="flex-1 min-w-[280px]">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = reviews.length > 0
                          ? (ratingDistribution[star] / reviews.length) * 100
                          : 0;
                        return (
                          <div key={star} className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700 w-4 text-right">{star}</span>
                            <span className="text-yellow-400 text-lg">★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-[200px]">
                              <div
                                className="bg-yellow-400 h-3 rounded-full transition-all duration-700"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12 font-medium">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Show All Reviews Button */}
            <div className="lg:w-auto flex justify-center">
              {reviews.length > 0 && !showReviews && (
                <button
                  onClick={() => setShowReviews(true)}
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  Show All Reviews ({reviews.length})
                </button>
              )}
            </div>
          </div>

          {/* Reviews List - Only show when expanded */}
          {showReviews && (
            <div className="reviews-list space-y-6 mt-8">
              {reviews.slice(0, visibleReviews).map((review) => (
                <div
                  key={review.id}
                  className="review-item p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`w-12 h-12 ${getAvatarColor(review.Customer?.name)} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <span className="text-white font-semibold text-sm">
                          {getInitials(review.Customer?.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-semibold text-gray-900 text-lg">
                            {review.Customer?.name || 'Anonymous'}
                          </h5>
                          <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                            <span className="text-green-700 text-sm font-bold">{review.rating}.0</span>
                            <span className="text-yellow-400">★</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 font-medium">
                          {getRatingLabel(review.rating)}
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap pl-4">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`http://luxcycs.com/rabbit-and-finch-uploads/${image}`}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                            onClick={() => window.open(`http://luxcycs.com/rabbit-and-finch-uploads/${image}`, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg cursor-pointer"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Load More Button */}
              {visibleReviews < reviews.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMoreReviews}
                    className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 transform hover:scale-105"
                  >
                    Load More Reviews ({reviews.length - visibleReviews} remaining)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {reviews.length === 0 && !reviewsLoading && (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-3xl text-gray-400">☆</span>
              </div>
              <p className="text-gray-500 text-xl font-semibold mb-4">No reviews yet</p>
              <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
                Be the first to share your experience with this product and help other customers make their decision.
              </p>
            </div>
          )}

          {/* Loading State */}
          {reviewsLoading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg font-medium">Loading reviews...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}