import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, X, Minus, Plus, Heart } from "lucide-react";
import TabNavigation from "./TabNavigation";
import { getWishlist, updateWishlist, clearWishlist } from "../../../../services/wishlistApi";
import { apiService } from "../../../../services/apiservice";
import { useCart } from "../../../CartPage/useCart";
import InputQuantityCom from "../../../Helpers/InputQuantityCom";

// Quantity Input Component
const QuantityInput = ({ value, onChange }) => {
  return (
    <div className="flex items-center border border-white-500 rounded-lg overflow-hidden bg-white-50">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center hover:bg-white-400 transition-colors"
      >
        <Minus className="w-4 h-4 text-black-300" />
      </button>
      <input
        type="text"
        value={value}
        readOnly
        className="w-12 h-8 text-center text-sm font-medium text-black-900 border-x border-white-500 bg-white-50"
      />
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center hover:bg-white-400 transition-colors"
      >
        <Plus className="w-4 h-4 text-black-300" />
      </button>
    </div>
  );
};

export default function WishlistTab({ className }) {
  const [activeTab, setActiveTab] = useState("Wishlist");
  const [quantities, setQuantities] = useState({});
  const [wishlistData, setWishlistData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { addItemToCart, items: cartItems, updateItemQuantity } = useCart();

  // Placeholder image data URL to avoid network requests
  const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

  // Handle URL hash to set active tab on page load
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#wishlist") {
      setActiveTab("Wishlist");
    } else if (hash === "#allorders") {
      setActiveTab("All orders");
    } else if (hash === "#current") {
      setActiveTab("Current");
    } else {
      setActiveTab("Wishlist");
    }
  }, [location]);

  useEffect(() => {
    if (activeTab === "Wishlist") {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist();
      const wishlistIds = response.wishList || [];
      setWishlistData(wishlistIds);

      if (wishlistIds.length > 0) {
        await fetchProductDetails(wishlistIds);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const productPromises = productIds.map(async (productId) => {
        try {
          const response = await apiService.get(`/product/get-product/${productId}`);
          // Handle both response formats: response.data or direct response
          const productData = response.data || response;
          return productData;
        } catch (err) {
          console.error(`Error fetching product ${productId}:`, err);
          return null;
        }
      });

      const productDetails = await Promise.all(productPromises);
      const validProducts = productDetails.filter(product => product !== null);
      setProducts(validProducts);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details');
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  const getQuantity = (itemId) => quantities[itemId] || 1;

  const getTotalPrice = (item) => {
    return (item.sellingPrice || item.price || 0) * getQuantity(item.id);
  };

  const handleAddToCart = async (item) => {
    const quantity = getQuantity(item.id);

    // Find matching inventory based on color and size
    let matchingInventory = null;
    if (item.inventories && item.inventories.length > 0) {
      // For now, use the first available inventory since we don't have color/size selection in wishlist
      // In a full implementation, you'd need to add color/size selection UI
      matchingInventory = item.inventories.find(inv => inv.availableQuantity >= quantity);
    }

    // Check if we have a valid inventory
    if (!matchingInventory) {
      alert('No available inventory for this product');
      return;
    }

    // Validate inventory has required IDs
    if (!matchingInventory.productColor?.id || !matchingInventory.productSize?.id) {
      console.error('Inventory missing required IDs:', matchingInventory);
      alert('Invalid inventory configuration');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [item.id]: true }));

    try {
      // Check if item is already in cart
      const existingCartItem = cartItems.find(cartItem =>
        cartItem.productId === item.id &&
        cartItem.productColorVariationId === matchingInventory.productColor.id &&
        cartItem.productSizeVariationId === matchingInventory.productSize.id
      );

      if (existingCartItem) {
        // Update existing cart item quantity
        const newQuantity = existingCartItem.quantity + quantity;
        const result = await updateItemQuantity(existingCartItem.id, newQuantity);

        if (result.success) {
          alert('Product quantity updated in cart successfully!');
          handleRemoveItem(item.id);
        } else {
          alert(result.error || 'Failed to update product quantity in cart');
        }
      } else {
        // Add new item to cart
        const cartData = {
          productId: item.id,
          productColorVariationId: matchingInventory.productColor.id,
          productSizeVariationId: matchingInventory.productSize.id,
          quantity: quantity
        };

        console.log('Adding to cart with data:', cartData);

        const result = await addItemToCart(cartData);

      if (result.success) {
        alert('Product added to cart successfully!');
        handleRemoveItem(item.id);
      } else {
        alert(result.error || 'Failed to add product to cart');
      }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await updateWishlist(itemId);
      // Update local state
      const updatedWishlist = wishlistData.filter(id => id !== itemId);
      setWishlistData(updatedWishlist);
      setProducts(products.filter(product => product.id !== itemId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item from wishlist');
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
        setWishlistData([]);
        setProducts([]);
        alert('Wishlist cleared successfully!');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        alert('Failed to clear wishlist. Please try again.');
      }
    }
  };

  const handleStartShopping = () => {
    navigate("/all-products");
  };

  // Get product image - prioritize thumbnailImage, fallback to first gallery image or placeholder
  const getProductImage = (product) => {
    if (product.thumbnailImage) {
      return product.thumbnailImage;
    }
    if (product.galleryImage && product.galleryImage.length > 0) {
      return product.galleryImage[0];
    }
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Return a data URL for a placeholder image to avoid network requests
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
  };

  // Get product name
  const getProductName = (product) => {
    return product.name || 'Product Name';
  };

  // Get product price
  const getProductPrice = (product) => {
    return product.sellingPrice || product.price || 0;
  };

  // Get product color from inventories
  const getProductColor = (product) => {
    if (product.inventories && product.inventories.length > 0) {
      return product.inventories[0].productColor?.color || 'N/A';
    }
    return 'N/A';
  };

  // Get product size from inventories
  const getProductSize = (product) => {
    if (product.inventories && product.inventories.length > 0) {
      const sizes = product.inventories[0].productSize?.size || [];
      return sizes.length > 0 ? sizes[0] : 'N/A';
    }
    return 'N/A';
  };

  // Check if product is in stock
  const isProductInStock = (product) => {
    if (product.inventories && product.inventories.length > 0) {
      return product.inventories.some(inv => inv.availableQuantity > 0);
    }
    return product.inStock !== false; // Default to true if no inventory data
  };

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 py-4 ${className || ""}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black-900 mb-2">My Wishlist</h2>
        <p className="text-black-300">
          {products.length} {products.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Wishlist" ? (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-sm text-black-300">Loading wishlist...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchWishlist}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Clear Wishlist Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Clear All Wishlist
                </button>
              </div>
              {products.map((item) => {
                const quantity = getQuantity(item.id);
                const totalPrice = getTotalPrice(item);
                const productImage = getProductImage(item);
                const productName = getProductName(item);
                const inStock = isProductInStock(item);

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg bg-white-50 transition-all duration-300 border-white-500 hover:border-black-500"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Mobile Layout - Stacked */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="w-full sm:w-24 h-24 flex-shrink-0 rounded-lg border border-white-500 overflow-hidden bg-white-400 mx-auto sm:mx-0">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = PLACEHOLDER_IMAGE;
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          {/* Header with title and remove button */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-black-900 mb-1 line-clamp-2 sm:line-clamp-1">
                                {productName}
                              </h3>
                              {!inStock && (
                                <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600/10 transition-colors group self-end sm:self-start"
                            >
                              <X className="w-4 h-4 text-black-300 group-hover:text-red-600 transition-colors" />
                            </button>
                          </div>

                          {/* Quantity, Price, and Actions - Mobile Stacked */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Quantity and Price Section */}
                            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4">
                              {/* Quantity Input */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <p className="text-xs text-black-300 mb-1 sm:mb-0">Quantity</p>
                                <QuantityInput
                                  value={quantity}
                                  onChange={(newQty) => handleQuantityChange(item.id, newQty)}
                                />
                              </div>

                              {/* Vertical Divider - Hidden on mobile */}
                              <div className="h-px xs:h-8 xs:w-px bg-white-500 my-2 xs:my-0 xs:mx-2 hidden xs:block"></div>

                              {/* Total Price */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <p className="text-xs text-black-300 mb-1 sm:mb-0">Total</p>
                                <p className="text-lg font-bold text-black-900">₹{totalPrice.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={!inStock || addingToCart[item.id]}
                              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto mt-2 sm:mt-0 ${
                                inStock && !addingToCart[item.id]
                                  ? "bg-black-900 text-white-50 hover:bg-black-700 hover:shadow-md"
                                  : "bg-white-500 text-black-300 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {addingToCart[item.id] ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500">
              <Heart className="w-16 h-16 text-black-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black-900 mb-2">Your Wishlist is Empty</h3>
              <p className="text-sm text-black-300 mb-6 max-w-sm mx-auto">
                Save items you love for later. Click the heart icon on any product to add it here.
              </p>
              <button 
                onClick={handleStartShopping}
                className="px-6 py-3 bg-black-900 text-white-50 rounded-lg font-semibold hover:bg-black-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500">
          <h3 className="text-lg font-semibold text-black-900 mb-2">
            {activeTab} Content
          </h3>
          <p className="text-sm text-black-300 mb-6">
            Please navigate to the {activeTab} section to view details.
          </p>
          <button
            onClick={() => setActiveTab("Wishlist")}
            className="px-6 py-3 bg-black-900 text-white-50 rounded-lg font-semibold hover:bg-black-700 transition-colors"
          >
            Back to Wishlist
          </button>
        </div>
      )}
    </div>
  );
}