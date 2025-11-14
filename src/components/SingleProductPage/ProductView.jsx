import { useState, useRef, useEffect, useMemo } from "react";
import { reviewApi } from "../AllProductPage/productApi";
import { useCart } from "../CartPage/useCart";

export default function ProductView({ product, className, reportHandler }) {
  const { addItemToCart } = useCart();

  // Transform API product data
  const transformedProduct = useMemo(() => {
    if (!product) return null;

    const mrp = parseFloat(product.mrp || 0);
    const sellingPrice = parseFloat(product.sellingPrice || product.mrp || 0);
    const discount = mrp > 0 && sellingPrice < mrp
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

    // Get images - prioritize galleryImage, fallback to thumbnailImage
    const images = product.galleryImage && product.galleryImage.length > 0
      ? product.galleryImage
      : product.thumbnailImage
      ? [product.thumbnailImage]
      : [];

    // Get available colors and sizes from inventories
    const availableColors = product.inventories?.length > 0
      ? product.inventories.map(inv => ({
          id: inv.colorId || inv.color?.id || 1,
          name: inv.color?.name || inv.color || 'Default',
          inventoryId: inv.id,
          stock: inv.quantity || 0
        }))
      : [{ id: 1, name: 'Default', inventoryId: null, stock: 100 }];

    const availableSizes = product.inventories?.length > 0
      ? product.inventories.map(inv => ({
          id: inv.sizeId || inv.size?.id || 1,
          name: inv.size?.name || inv.size || 'One Size',
          inventoryId: inv.id,
          stock: inv.quantity || 0
        }))
      : [{ id: 1, name: 'One Size', inventoryId: null, stock: 100 }];

    // Remove duplicates
    const uniqueColors = Array.from(
      new Map(availableColors.map(c => [c.name, c])).values()
    );
    
    const uniqueSizes = Array.from(
      new Map(availableSizes.map(s => [s.name, s])).values()
    );

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category?.name || 'Uncategorized',
      mrp: mrp,
      sellingPrice: sellingPrice,
      discount: discount,
      gst: product.gst || 0,
      images: images,
      colors: uniqueColors,
      sizes: uniqueSizes,
      inventories: product.inventories || [],
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
      totalStock: product.inventories?.reduce((sum, inv) => sum + (inv.quantity || 0), 0) || 0
    };
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

  // Initialize states when product changes
  useEffect(() => {
    if (transformedProduct) {
      setMainImage(transformedProduct.images[0] || null);
      if (transformedProduct.colors.length > 0) {
        setSelectedColorId(transformedProduct.colors[0].id);
      }
      if (transformedProduct.sizes.length > 0) {
        setSelectedSizeId(transformedProduct.sizes[0].id);
      }
    }
  }, [transformedProduct]);

  // Fetch reviews
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

  if (!transformedProduct) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  // Get selected inventory
  const selectedInventory = useMemo(() => {
    // If no inventories, create a mock inventory for display
    if (!transformedProduct.inventories || transformedProduct.inventories.length === 0) {
      return {
        id: 'mock-inventory',
        quantity: transformedProduct.totalStock || 100,
        colorId: selectedColorId,
        sizeId: selectedSizeId
      };
    }
    
    if (!selectedColorId || !selectedSizeId) return null;
    return transformedProduct.inventories.find(
      inv => 
        (inv.colorId === selectedColorId || inv.color?.id === selectedColorId) &&
        (inv.sizeId === selectedSizeId || inv.size?.id === selectedSizeId)
    );
  }, [selectedColorId, selectedSizeId, transformedProduct.inventories, transformedProduct.totalStock]);

  const currentStock = selectedInventory?.quantity || 100;

  // Handlers
  const handleColorChange = (colorId) => {
    setSelectedColorId(colorId);
  };

  const handleSizeChange = (sizeId) => {
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

  const handleAddToCart = async () => {
    if (!selectedColorId || !selectedSizeId) {
      alert("Please select color and size");
      return;
    }

    try {
      // For products without inventory system
      if (!selectedInventory || selectedInventory.id === 'mock-inventory') {
        console.log("Adding product to cart (no inventory):", {
          productId: transformedProduct.id,
          quantity: quantity,
          color: transformedProduct.colors.find(c => c.id === selectedColorId)?.name,
          size: transformedProduct.sizes.find(s => s.id === selectedSizeId)?.name
        });
        alert("Product added to cart successfully!");
        return;
      }

      const cartData = {
        productId: transformedProduct.id,
        inventoryId: selectedInventory.id,
        quantity: quantity,
      };

      await addItemToCart(cartData);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
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

          {/* Price */}
          <div className="mb-7">
            <div className="flex items-center mb-2">
              <span className="text-2xl font-bold text-qblack">
                ₹{transformedProduct.sellingPrice.toLocaleString()}
              </span>
              {transformedProduct.discount > 0 && (
                <>
                  <span className="text-lg font-medium text-qgray line-through ml-3">
                    ₹{transformedProduct.mrp.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-qred ml-3 bg-qred-light px-2 py-1 rounded">
                    {transformedProduct.discount}% off
                  </span>
                </>
              )}
            </div>
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
                    className={`px-4 py-2 border rounded ${
                      selectedColorId === color.id
                        ? "border-qblack bg-qblack text-white"
                        : "border-qgray-border hover:border-qblack"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {transformedProduct.sizes.length > 0 && (
            <div className="product-size mb-[30px]">
              <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">
                SIZE
              </span>
              <div className="flex space-x-2">
                {transformedProduct.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeChange(size.id)}
                    className={`px-4 py-2 border rounded ${
                      selectedSizeId === size.id
                        ? "border-qblack bg-qblack text-white"
                        : "border-qgray-border hover:border-qblack"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          {isLowStock && (
            <p className="text-orange-600 font-semibold mb-4">
              Only {currentStock} left in stock!
            </p>
          )}

          {/* Quantity and Add to Cart */}
          <div className="quantity-card-wrapper w-full flex items-center h-[50px] space-x-[10px] mb-[30px]">
            <div className="w-[120px] h-full px-[26px] flex items-center border border-qgray-border">
              <div className="flex justify-between items-center w-full">
                <button
                  onClick={decrement}
                  type="button"
                  className="text-base text-qgray"
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <span className="text-qblack">{quantity}</span>
                <button
                  onClick={increment}
                  type="button"
                  className="text-base text-qgray"
                  disabled={isOutOfStock || quantity >= currentStock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-full text-sm font-semibold ${
                isOutOfStock || !selectedColorId || !selectedSizeId
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              disabled={isOutOfStock || !selectedColorId || !selectedSizeId}
            >
              {isOutOfStock
                ? "Out of Stock"
                : !selectedColorId || !selectedSizeId
                ? "Select Options"
                : "Add To Cart"}
            </button>
          </div>

          {/* Product Details */}
          <div className="product-details-section mb-[20px] p-4 bg-white border border-qgray-border">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowProductDetails(!showProductDetails)}
            >
              <h3 className="text-lg font-semibold text-qblack">Product Details</h3>
              <span className="text-2xl font-bold">
                {showProductDetails ? "−" : "+"}
              </span>
            </div>
            {showProductDetails && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex">
                  <span className="text-qgray w-1/3">Fabric:</span>
                  <span className="text-qblack font-medium">
                    {transformedProduct.specifications.fabric}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-qgray w-1/3">Fit Type:</span>
                  <span className="text-qblack font-medium">
                    {transformedProduct.specifications.fitType}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-qgray w-1/3">Occasion:</span>
                  <span className="text-qblack font-medium">
                    {transformedProduct.specifications.occasion}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-qgray w-1/3">Care:</span>
                  <span className="text-qblack font-medium">
                    {transformedProduct.specifications.careInstructions}
                  </span>
                </div>
                {transformedProduct.specifications.description && (
                  <div className="mt-2">
                    <p className="text-qblack">
                      {transformedProduct.specifications.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="reviews-section mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-qblack">
                Customer Reviews
              </h3>
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="px-4 py-2 bg-qblack text-white rounded hover:bg-qgray"
              >
                Write Review
              </button>
            </div>

            {reviewsLoading ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, visibleReviews).map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border border-qgray-border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                        <span className="text-yellow-500">
                          {'★'.repeat(review.rating)}
                        </span>
                      </div>
                      <span className="text-xs text-qgray">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-qblack">{review.comment}</p>
                  </div>
                ))}
                {reviews.length > visibleReviews && (
                  <button
                    onClick={() => setVisibleReviews(prev => prev + 2)}
                    className="text-qblue hover:underline text-sm font-medium"
                  >
                    Load More Reviews
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}