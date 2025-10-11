import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, X, Minus, Plus, Heart } from "lucide-react";
import TabNavigation from "./TabNavigation";

// Quantity Input Component
const QuantityInput = ({ value, onChange }) => {
  return (
    <div className="flex items-center border border-qgray-border rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center hover:bg-primarygray transition-colors"
      >
        <Minus className="w-4 h-4 text-qgray" />
      </button>
      <input
        type="text"
        value={value}
        readOnly
        className="w-12 h-8 text-center text-sm font-medium text-qblack border-x border-qgray-border bg-white"
      />
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center hover:bg-primarygray transition-colors"
      >
        <Plus className="w-4 h-4 text-qgray" />
      </button>
    </div>
  );
};

export default function WishlistTab({ className }) {
  const [activeTab, setActiveTab] = useState("Wishlist");
  const [quantities, setQuantities] = useState({});
  const location = useLocation();

  // Mock wishlist data
  const wishlistItems = [
    {
      id: 1,
      name: "iPhone 12 Pro Max 128GB - Space Gray with premium leather case",
      thumbnail: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=300&h=300&fit=crop",
      price: 38,
      inStock: true,
    },
    {
      id: 2,
      name: "Samsung Galaxy S21 Ultra 5G with S Pen",
      thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
      price: 45,
      inStock: true,
    },
    {
      id: 3,
      name: "MacBook Pro 13 inch M1 Chip 256GB Storage",
      thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
      price: 120,
      inStock: false,
    },
  ];

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

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  const getQuantity = (itemId) => quantities[itemId] || 1;

  const getTotalPrice = (item) => {
    return item.price * getQuantity(item.id);
  };

  const handleAddToCart = (itemId) => {
    alert("Item added to cart!");
  };

  const handleRemoveItem = (itemId) => {
    alert("Item removed from wishlist!");
  };

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 py-4 ${className || ""}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-qblack mb-2">My Wishlist</h2>
        <p className="text-qgray">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Wishlist" ? (
        <div className="space-y-4">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => {
              const quantity = getQuantity(item.id);
              const totalPrice = getTotalPrice(item);

              return (
                <div
                  key={item.id}
                  className="border rounded-lg bg-white transition-all duration-300 border-qgray-border hover:border-qyellow"
                >
                  <div className="p-4 sm:p-6">
                    {/* Mobile Layout - Stacked */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-24 h-24 flex-shrink-0 rounded-lg border border-qgray-border overflow-hidden bg-primarygray mx-auto sm:mx-0">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        {/* Header with title and remove button */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base text-qblack mb-1 line-clamp-2 sm:line-clamp-1">
                              {item.name}
                            </h3>
                            {!item.inStock && (
                              <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-qred/10 transition-colors group self-end sm:self-start"
                          >
                            <X className="w-4 h-4 text-qgray group-hover:text-qred transition-colors" />
                          </button>
                        </div>

                        {/* Quantity, Price, and Actions - Mobile Stacked */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Quantity and Price Section */}
                          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4">
                            {/* Quantity Input */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <p className="text-xs text-qgraytwo mb-1 sm:mb-0">Quantity</p>
                              <QuantityInput
                                value={quantity}
                                onChange={(newQty) => handleQuantityChange(item.id, newQty)}
                              />
                            </div>

                            {/* Vertical Divider - Hidden on mobile */}
                            <div className="h-px xs:h-8 xs:w-px bg-qgray-border my-2 xs:my-0 xs:mx-2 hidden xs:block"></div>

                            {/* Total Price */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <p className="text-xs text-qgraytwo mb-1 sm:mb-0">Total</p>
                              <p className="text-lg font-bold text-qblack">${totalPrice}</p>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            disabled={!item.inStock}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto mt-2 sm:mt-0 ${
                              item.inStock
                                ? "bg-qyellow text-qblack hover:bg-amber-500 hover:shadow-md"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {item.inStock ? "Add to Cart" : "Out of Stock"}
                          </button>
                        </div>

                        {/* Unit Price - Mobile Only */}
                        
                      </div>
                    </div>

                    {/* Additional Actions - Mobile Only */}
                   
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-qgray-border">
              <Heart className="w-16 h-16 text-qgray mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-qblack mb-2">Your Wishlist is Empty</h3>
              <p className="text-sm text-qgray mb-6 max-w-sm mx-auto">
                Save items you love for later. Click the heart icon on any product to add it here.
              </p>
              <button className="px-6 py-3 bg-qyellow text-qblack rounded-lg font-semibold hover:bg-amber-500 transition-colors">
                Start Shopping
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-qgray-border">
          <h3 className="text-lg font-semibold text-qblack mb-2">
            {activeTab} Content
          </h3>
          <p className="text-sm text-qgray mb-6">
            Please navigate to the {activeTab} section to view details.
          </p>
          <button 
            onClick={() => setActiveTab("Wishlist")}
            className="px-6 py-3 bg-qyellow text-qblack rounded-lg font-semibold hover:bg-amber-500 transition-colors"
          >
            Back to Wishlist
          </button>
        </div>
      )}
    </div>
  );
}