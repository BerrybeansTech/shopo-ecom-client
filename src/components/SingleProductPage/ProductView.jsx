import { useState, useRef, useEffect, useMemo } from "react";
import { reviewApi } from "../AllProductPage/productApi";
import { useCart } from "../CartPage/useCart";

export default function ProductView({ product, className, reportHandler }) {
  const { addItemToCart, refreshCart } = useCart();

  // Add state for add to cart feedback
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

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
    const images = product.galleryImage && product.galleryImage.length > 0
      ? product.galleryImage
      : product.thumbnailImage
      ? [product.thumbnailImage]
      : [];

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
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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

  // Initialize states when product changes
  useEffect(() => {
    if (transformedProduct) {
      setMainImage(transformedProduct.images[0] || null);
      
      // Auto-select first available color
      if (transformedProduct.colors.length > 0) {
        const firstColor = transformedProduct.colors[0];
        setSelectedColorId(firstColor.id);
        console.log("Auto-selected color:", firstColor);
      }
    }
  }, [transformedProduct]);

  // Update available sizes when color changes
  useEffect(() => {
    if (transformedProduct && selectedColorId) {
      const availableSizesForColor = transformedProduct.sizes.filter(
        size => !size.colorId || size.colorId === selectedColorId
      );
      
      if (selectedSizeId && !availableSizesForColor.find(size => size.id === selectedSizeId)) {
        if (availableSizesForColor.length > 0) {
          setSelectedSizeId(availableSizesForColor[0].id);
        } else {
          setSelectedSizeId(null);
        }
      } else if (!selectedSizeId && availableSizesForColor.length > 0) {
        setSelectedSizeId(availableSizesForColor[0].id);
      }
    }
  }, [selectedColorId, transformedProduct, selectedSizeId]);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (addToCartSuccess) {
      const timer = setTimeout(() => {
        setAddToCartSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addToCartSuccess]);

  // Fetch reviews with better error handling
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;
      
      setReviewsLoading(true);
      try {
        const response = await reviewApi.getByProduct(product.id);
        const reviewsData = response.data || response || [];
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?.id]);

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
    if (!transformedProduct || !selectedColorId) return [];
    
    return transformedProduct.sizes.filter(
      size => !size.colorId || size.colorId === selectedColorId
    );
  }, [transformedProduct, selectedColorId]);

  // Handlers
  const handleColorChange = (colorId) => {
    console.log("Color changed to:", colorId);
    setSelectedColorId(colorId);
  };

  const handleSizeChange = (sizeId) => {
    console.log("Size changed to:", sizeId);
    setSelectedSizeId(sizeId);
  };

  const increment = () => {
    if (quantity < currentStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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

  // FIXED Add to Cart function with proper feedback
  const handleAddToCart = async () => {
    // Validation
    if (!selectedColor || !selectedSize) {
      alert("⚠️ Please select both color and size");
      return;
    }

    if (currentStock === 0) {
      alert("❌ Selected combination is out of stock");
      return;
    }

    if (quantity > currentStock) {
      alert(`⚠️ Only ${currentStock} items available in stock`);
      return;
    }

    // Check if we have matching inventory
    if (!matchingInventory) {
      console.error("No matching inventory found", {
        selectedColorId: selectedColor.id,
        selectedSizeName: selectedSize.name,
        availableInventories: transformedProduct.inventories
      });
      alert("❌ Selected combination not available in inventory");
      return;
    }

    // Validate inventory has required IDs
    if (!matchingInventory.productColor?.id || !matchingInventory.productSize?.id) {
      console.error("Inventory missing required IDs:", matchingInventory);
      alert("❌ Invalid inventory configuration");
      return;
    }

    setIsAddingToCart(true);

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
        
        // Show success message
        alert(`✅ Successfully added to cart!`);
        
        // Refresh cart to get updated data
        await refreshCart();
        
        console.log("Cart result:", result);
      } else {
        throw new Error(result.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(`❌ Failed to add product to cart\n\n${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (addToCartSuccess) {
      // After successful add to cart, redirect to cart page
      window.location.href = '/cart';
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

  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock < 10;

  if (!transformedProduct) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  return (
    <div className={`product-view w-full lg:flex flex-col lg:flex-row justify-between ${className || ""}`}>

      {/* Image Section */}
      <div data-aos="fade-right" className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px] flex flex-row">
        <div className="w-[120px] flex flex-col gap-2 mr-4">
          <div
            ref={thumbnailRef}
            className="w-[120px] h-[480px] overflow-y-hidden"
            style={{ scrollBehavior: "smooth" }}
          >
            {transformedProduct.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setMainImage(img)}
                onMouseEnter={() => setMainImage(img)}
                className="w-[120px] h-[120px] p-[10px] cursor-pointer relative mx-auto"
              >
                <img
                  src={img}
                  alt={`Product view ${index + 1}`}
                  className={`w-full h-full object-contain ${
                    mainImage !== img ? "opacity-50" : ""
                  }`}
                />
              </div>
            ))}
          </div>

          {transformedProduct.images.length > 4 && (
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={scrollUp}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-800 hover:bg-slate-950 hover:text-white"
                aria-label="Scroll up"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5L18 11L6 11L12 5Z" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={scrollDown}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-800 hover:bg-slate-950 hover:text-white"
                aria-label="Scroll down"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19L18 13L6 13L12 19Z" fill="currentColor" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div
            className="w-full h-[550px] flex justify-center items-center overflow-hidden relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mainImage || transformedProduct.images[0]}
              alt={transformedProduct.name}
              className={`w-full h-full object-contain transition-transform duration-150 ${
                showZoom ? "scale-150" : "scale-100"
              }`}
              style={zoomStyle}
            />
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1">
        <div className="product-details w-full mt-10 lg:mt-0">
          <span className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block">
            {transformedProduct.category}
          </span>
          <p className="text-xl font-medium text-qblack mb-4">
            {transformedProduct.name}
          </p>

          {/* Rating */}
          <div className="flex space-x-[10px] items-center mb-6">
            <span className="bg-qgreen text-xs font-bold py-1 px-2 rounded">
              {transformedProduct.rating.toFixed(1)} ★
            </span>
            <span className="text-qblack text-sm">
              {transformedProduct.reviewCount} reviews
            </span>
          </div>

          {/* Price Section */}
          <div className="mb-7">
            <div className="flex items-center mb-2">
              <span className="text-2xl font-bold text-qblack">
                ₹{calculatedPrice.sellingPrice.toLocaleString()}
              </span>
              {calculatedPrice.discount > 0 && (
                <>
                  <span className="text-lg font-medium text-qgray line-through ml-3">
                    ₹{calculatedPrice.mrp.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-qred ml-3 bg-qred-light px-2 py-1 rounded">
                    {calculatedPrice.discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-qgray">
              {quantity} item{quantity > 1 ? 's' : ''} • ₹{transformedProduct.sellingPrice.toLocaleString()} per item
            </p>
          </div>

          {/* Color Selection */}
          {transformedProduct.colors.length > 0 && (
            <div className="colors mb-[30px]">
              <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">
                COLOR
              </span>
              <div className="flex space-x-4 items-center">
                {transformedProduct.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    className={`px-4 py-2 border rounded transition-all duration-200 ${
                      selectedColorId === color.id
                        ? "border-black bg-black text-white shadow-md"
                        : "border-gray-300 bg-white text-gray-800 hover:border-gray-500"
                    } ${
                      color.totalStock === 0 ? "opacity-50 cursor-not-allowed grayscale" : ""
                    }`}
                    disabled={color.totalStock === 0}
                    title={color.totalStock === 0 ? "Out of stock" : color.name}
                  >
                    {color.name}
                    {color.totalStock === 0 && " (X)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {availableSizesForSelectedColor.length > 0 && (
            <div className="product-size mb-[30px]">
              <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">
                SIZE
              </span>
              <div className="flex flex-wrap gap-2">
                {availableSizesForSelectedColor.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeChange(size.id)}
                    className={`px-4 py-2 border rounded min-w-[50px] text-center transition-all duration-200 ${
                      selectedSizeId === size.id
                        ? "border-black bg-black text-white shadow-md"
                        : "border-gray-300 bg-white text-gray-800 hover:border-gray-500"
                    } ${
                      size.totalStock === 0 ? "opacity-50 cursor-not-allowed grayscale" : ""
                    }`}
                    disabled={size.totalStock === 0}
                    title={size.totalStock === 0 ? "Out of stock" : size.name}
                  >
                    {size.name}
                    {size.totalStock === 0 && " (X)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
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

          {/* Selected Combination Info */}
          {(selectedColor || selectedSize) && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-qblack">
                Selected:{" "}
                {selectedColor && <span className="font-semibold">{selectedColor.name}</span>}
                {selectedColor && selectedSize && " - "}
                {selectedSize && <span className="font-semibold">{selectedSize.name}</span>}
              </p>
            </div>
          )}

          {/* Quantity and Action Buttons */}
          <div className="quantity-card-wrapper w-full flex flex-col sm:flex-row items-center gap-3 mb-[30px]">
            <div className="w-[120px] h-[50px] px-[26px] flex items-center border border-gray-300 rounded">
              <div className="flex justify-between items-center w-full">
                <button
                  onClick={decrement}
                  type="button"
                  className="text-base text-gray-600 hover:text-black transition-colors"
                  disabled={isOutOfStock || isAddingToCart}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={currentStock}
                  className="w-12 text-center border-none outline-none text-black bg-transparent"
                  disabled={isOutOfStock || isAddingToCart}
                />
                <button
                  onClick={increment}
                  type="button"
                  className="text-base text-gray-600 hover:text-black transition-colors"
                  disabled={isOutOfStock || quantity >= currentStock || isAddingToCart}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons Container */}
            <div className="flex flex-1 w-full sm:w-auto gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-[50px] text-sm font-semibold transition-colors rounded flex items-center justify-center gap-2 ${
                  isOutOfStock || !selectedColorId || !selectedSizeId || isAddingToCart
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
                disabled={isOutOfStock || !selectedColorId || !selectedSizeId || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : isOutOfStock ? (
                  "Out of Stock"
                ) : !selectedColorId || !selectedSizeId ? (
                  "Select Options"
                ) : (
                  `Add To Cart`
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className={`flex-1 h-[50px] text-sm font-semibold transition-colors rounded ${
                  isOutOfStock || !selectedColorId || !selectedSizeId || isAddingToCart
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                disabled={isOutOfStock || !selectedColorId || !selectedSizeId || isAddingToCart}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}