import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, X, Minus, Plus, Heart } from "lucide-react";
import TabNavigation from "./TabNavigation";
import { getWishlist, updateWishlist, clearWishlist } from "../../../../services/wishlistApi";
import { apiService } from "../../../../services/apiservice";

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
  const location = useLocation();

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
          return response.data || response;
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
    return (item.price || 0) * getQuantity(item.id);
  };

  const handleAddToCart = (itemId) => {
    alert("Add to cart functionality to be implemented");
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
                            src={item.images?.[0] || "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=300&h=300&fit=crop"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          {/* Header with title and remove button */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-black-900 mb-1 line-clamp-2 sm:line-clamp-1">
                                {item.name || 'Product Name'}
                              </h3>
                              {!item.inStock && (
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
                                <p className="text-lg font-bold text-black-900">${totalPrice}</p>
                              </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => handleAddToCart(item.id)}
                              disabled={!item.inStock}
                              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto mt-2 sm:mt-0 ${
                                item.inStock
                                  ? "bg-black-900 text-white-50 hover:bg-black-700 hover:shadow-md"
                                  : "bg-white-500 text-black-300 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {item.inStock ? "Add to Cart" : "Out of Stock"}
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
              <button className="px-6 py-3 bg-black-900 text-white-50 rounded-lg font-semibold hover:bg-black-700 transition-colors">
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
