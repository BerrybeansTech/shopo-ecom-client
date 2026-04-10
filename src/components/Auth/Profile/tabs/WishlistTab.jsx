import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Heart } from "lucide-react";
import TabNavigation from "./TabNavigation";
import { getWishlist, updateWishlist, clearWishlist, wishlistEvents } from "../../../../services/wishlistApi";
import { apiService } from "../../../../services/apiservice";
import { getProductImage } from "../../../../utils/imageUtils";

export default function WishlistTab({ className }) {
  const [activeTab, setActiveTab] = useState("Wishlist");
  const [wishlistData, setWishlistData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


  const fetchProductDetails = React.useCallback(async (productIds) => {
    try {
      if (!productIds || productIds.length === 0) {
        setProducts([]);
        return;
      }
      
      setLoading(true);
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
      setProducts(productDetails.filter(product => product !== null));
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = React.useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist(force);
      const wishlistIds = response.wishList || [];
      setWishlistData(wishlistIds);
      // fetchProductDetails will be triggered by the useEffect below
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message || 'Failed to load wishlist');
      setLoading(false);
    }
  }, []);

  // Effect to fetch product details whenever wishlist IDs change
  useEffect(() => {
    if (wishlistData && wishlistData.length > 0) {
      fetchProductDetails(wishlistData);
    } else {
      setProducts([]);
      // Only stop loading if we're not currently fetching the wishlist itself
      setLoading(false);
    }
  }, [wishlistData, fetchProductDetails]);

  // Subscribe to wishlist changes from other components
  useEffect(() => {
    const unsubscribe = wishlistEvents.subscribe((wishlistResponse) => {
      const wishlistIds = wishlistResponse.wishList || [];
      setWishlistData(wishlistIds);
    });

    return () => unsubscribe();
  }, []);


  // Handle URL hash and trigger fetches
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#wishlist" || !hash) {
      setActiveTab("Wishlist");
      fetchWishlist(true); // Force refresh from server
    } else if (hash === "#allorders") {
      setActiveTab("All orders");
    } else if (hash === "#current" || hash === "#order") {
      setActiveTab("Current");
    }
  }, [location.hash, fetchWishlist]);



  const handleRemoveItem = async (itemId) => {
    setRemovingItem(itemId);
    try {
      // This will update backend and emit event to sync all components
      await updateWishlist(itemId);
      
      // Optimistically update local state immediately
      const updatedWishlist = wishlistData.filter(id => id !== itemId);
      setWishlistData(updatedWishlist);
      setProducts(products.filter(product => product.id !== itemId));
      setShowRemoveConfirm(null);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item from wishlist');
      // Revert on error
      fetchWishlist();
    } finally {
      setRemovingItem(null);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        // This will update backend and emit event to sync all components
        await clearWishlist();
        
        // Optimistically update local state
        setWishlistData([]);
        setProducts([]);
        alert('Wishlist cleared successfully!');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        alert('Failed to clear wishlist. Please try again.');
        // Revert on error
        fetchWishlist();
      }
    }
  };

  const handleStartShopping = () => {
    navigate("/all-products");
  };


  const getProductName = (product) => {
    return product.name || 'Product Name';
  };

  const getProductPrice = (product) => {
    return product.sellingPrice || product.price || 0;
  };

  const getOriginalPrice = (product) => {
    return product.originalPrice || product.mrp || product.sellingPrice * 1.5;
  };

  const getDiscountPercentage = (product) => {
    const sellingPrice = getProductPrice(product);
    const originalPrice = getOriginalPrice(product);
    if (originalPrice > sellingPrice) {
      return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const isProductInStock = (product) => {
    if (product.inventories && product.inventories.length > 0) {
      return product.inventories.some(inv => inv.availableQuantity > 0);
    }
    return product.inStock !== false;
  };

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 py-4 ${className || ""}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black-900 mb-2">My Wishlist</h2>
        <p className="text-black-300">
          {wishlistData.length} {wishlistData.length === 1 ? "item" : "items"} saved
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
                className="px-4 py-2 bg-black-900 text-white-50 rounded hover:bg-black-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2 bg-red-600 text-white-50 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Clear All Wishlist
                </button>
              </div>
              
              {/* Horizontal Layout Container */}
              <div className="space-y-4">
                {products.map((item) => {
                  const productImage = getProductImage(item);
                  const productName = getProductName(item);
                  const inStock = isProductInStock(item);
                  const originalPrice = getOriginalPrice(item);
                  const sellingPrice = getProductPrice(item);
                  const discountPercentage = getDiscountPercentage(item);

                  return (
                    <div
                      key={item.id}
                      className="border rounded-lg bg-white-50 transition-all duration-300 border-white-500 hover:border-black-500 hover:shadow-lg overflow-hidden"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="w-full sm:w-24 h-24 flex-shrink-0 rounded-lg border border-white-500 overflow-hidden bg-white-400 mx-auto sm:mx-0">
                            <img
                              src={getProductImage(item)}
                              alt={productName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-base text-black-900 mb-2 line-clamp-2">
                                  {productName}
                                </h3>
                                
                                {/* Assured Badge & Stock Status */}
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                    Assured
                                  </div>
                                  {!inStock && (
                                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                                      Currently unavailable
                                    </span>
                                  )}
                                </div>

                                {/* Price Section */}
                                <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-lg font-bold text-black-900">
                                    ₹{sellingPrice.toLocaleString()}
                                  </span>
                                  {discountPercentage > 0 && (
                                    <>
                                      <span className="text-sm text-black-300 line-through">
                                        ₹{originalPrice.toLocaleString()}
                                      </span>
                                      <span className="text-xs text-green-600 font-bold">
                                        {discountPercentage}% off
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => setShowRemoveConfirm(item.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600/10 transition-colors group self-end sm:self-start"
                              >
                                <X className="w-4 h-4 text-black-300 group-hover:text-red-600 transition-colors" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remove Confirmation Modal */}
                      {showRemoveConfirm === item.id && (
                        <div className="fixed inset-0 bg-black-900/50 flex items-center justify-center z-50 p-4">
                          <div className="bg-white-50 rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-semibold text-black-900 mb-2">
                              Remove from Wishlist?
                            </h3>
                            <p className="text-sm text-black-300 mb-4">
                              Are you sure you want to remove this product from your wishlist?
                            </p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setShowRemoveConfirm(null)}
                                className="flex-1 px-4 py-2 border border-white-500 text-black-900 rounded-lg hover:bg-white-400 transition-colors"
                              >
                                CANCEL
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={removingItem === item.id}
                                className="flex-1 px-4 py-2 bg-red-600 text-white-50 rounded-lg hover:bg-red-700 transition-colors font-medium"
                              >
                                {removingItem === item.id ? "REMOVING..." : "YES, REMOVE"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white-50 rounded-lg border border-white-500">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white-400 flex items-center justify-center">
                <Heart className="w-12 h-12 text-black-300" />
              </div>
              <h3 className="text-xl font-semibold text-black-900 mb-3">Your Wishlist is Empty</h3>
              <p className="text-sm text-black-300 mb-8 max-w-sm mx-auto leading-relaxed">
                Save items you love for later. Click the heart icon on any product to add it here.
              </p>
              <button 
                onClick={handleStartShopping}
                className="px-8 py-3 bg-black-900 text-white-50 rounded-lg font-semibold hover:bg-black-700 transition-colors shadow-sm"
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