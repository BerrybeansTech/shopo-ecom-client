// components/Cart/CartPage.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { useCart } from "../CartPage/useCart";

export default function CartPage() {
  const {
    items,
    savedItems,
    loading,
    error,
    subtotal,
    discount,
    total,
    updateItemQuantity,
    removeItem,
    saveForLater,
    moveItemToCart,
    removeFromSavedItems,
    formatINR,
    refreshCart,
    dismissError,
    isAuthenticated,
    handleLoginRedirect
  } = useCart();

  const [localCartItems, setLocalCartItems] = useState([]);
  const [localSavedItems, setLocalSavedItems] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setLocalCartItems(items);
  }, [items]);

  useEffect(() => {
    setLocalSavedItems(savedItems);
  }, [savedItems]);

  const handleRemove = async (id) => {
    await removeItem(id);
  };

  const handleSaveForLater = (id) => {
    saveForLater(id);
  };

  const handleMoveToCart = (id) => {
    moveItemToCart(id);
  };

  const handleRemoveFromSaved = (id) => {
    removeFromSavedItems(id);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    await updateItemQuantity(id, newQuantity);
  };

  // Calculate totals based on API data
  const calculatedSubtotal = localCartItems.reduce(
    (t, i) => t + (i.product?.sellingPrice || i.discountedPriceValue || 0) * i.quantity,
    0
  );

  const calculatedOriginalTotal = localCartItems.reduce(
    (t, i) => t + (i.product?.mrp || i.originalPriceValue || 0) * i.quantity,
    0
  );

  const calculatedDiscount = calculatedOriginalTotal - calculatedSubtotal;
  const platformFee = 7;
  const calculatedTotalAmount = calculatedSubtotal + platformFee;

  // Use API data if available, otherwise use calculated values
  const displaySubtotal = subtotal || calculatedSubtotal;
  const displayDiscount = discount || calculatedDiscount;
  const displayTotal = total || calculatedTotalAmount;

  if (loading) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <div className="cart-page-wrapper w-full bg-white pb-[30px]">
          <div className="w-full">
            <PageTitle
              title="Your Cart"
              breadcrumb={[
                { name: "home", path: "/" },
                { name: "cart", path: "/cart" },
              ]}
            />
          </div>
          <div className="w-full mt-[50px]">
            <div className="container-x mx-auto text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <div className="cart-page-wrapper w-full bg-white pb-[30px]">
          <div className="w-full">
            <PageTitle
              title="Your Cart"
              breadcrumb={[
                { name: "home", path: "/" },
                { name: "cart", path: "/cart" },
              ]}
            />
          </div>
          <div className="w-full mt-[50px]">
            <div className="container-x mx-auto">
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4 text-gray-800">🔐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Login Required
                </h3>
                <p className="text-gray-600 mb-6">Please login to view your cart</p>
                <button
                  onClick={() => handleLoginRedirect()}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Login to Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="cart-page-wrapper w-full bg-white pb-[30px]">
        <div className="w-full">
          <PageTitle
            title="Your Cart"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "cart", path: "/cart" },
            ]}
          />
        </div>

        <div className="w-full mt-[50px]">
          <div className="container-x mx-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                  <button
                    onClick={dismissError}
                    className="text-red-800 hover:text-red-900"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {localCartItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4 text-gray-800">Empty Cart</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <Link
                  to="/products"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Cart Items + Saved Items */}
                <div className="lg:flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Shopping Cart ({localCartItems.length})
                  </h1>

                  {/* Cart Items */}
                  <div className="space-y-6">
                    {localCartItems.map((item) => {
                      const product = item.product || {};
                      const productName = product.name || "Product";
                      const thumbnail = product.thumbnailImage || "Product thumbnail";
                      const sellingPrice = product.sellingPrice || item.discountedPriceValue || 0;
                      const mrp = product.mrp || item.originalPriceValue || sellingPrice;
                      const discountPercentage = mrp > sellingPrice 
                        ? Math.round(((mrp - sellingPrice) / mrp) * 100)
                        : 0;

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                        >
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="w-32 h-32 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                                <img
                                  src={thumbnail}
                                  alt={productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                  {productName}
                                </h2>
                                <p className="text-sm text-gray-600 mb-2">
                                  Delivery by{" "}
                                  <span className="font-medium text-gray-800">
                                    Mon Oct 27
                                  </span>
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                  <span>
                                    Size: <strong>S</strong>
                                  </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-4">
                                  <span className="text-2xl font-bold text-gray-900">
                                    {formatINR(sellingPrice * item.quantity)}
                                  </span>
                                  <span className="text-lg text-gray-500 line-through">
                                    {formatINR(mrp * item.quantity)}
                                  </span>
                                  <span className="text-xs font-semibold px-2 py-1 rounded border border-gray-400 text-gray-700">
                                    {discountPercentage}% Off
                                  </span>
                                </div>
                              </div>

                              {/* Bottom Actions */}
                              <div className="flex items-center justify-between md:justify-start gap-4 mt-auto">
                                {/* Quantity Selector */}
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Qty:</span>
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      −
                                    </button>
                                    <span className="w-10 text-center font-medium text-gray-900">
                                      {item.quantity}
                                    </span>
                                    <button
                                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-6 text-sm">
                                  <button
                                    onClick={() => handleSaveForLater(item.id)}
                                    className="text-gray-700 hover:text-black font-medium transition-colors"
                                  >
                                    SAVE FOR LATER
                                  </button>
                                  <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-gray-700 hover:text-black font-medium transition-colors"
                                  >
                                    REMOVE
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Saved for Later */}
                  {localSavedItems.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Saved For Later ({localSavedItems.length})
                      </h2>
                      <div className="space-y-4">
                        {localSavedItems.map((item) => {
                          const product = item.product || {};
                          const productName = product.name || "Product";
                          const thumbnail = product.thumbnailImage || "/assets/images/shirt1.webp";
                          const sellingPrice = product.sellingPrice || item.discountedPriceValue || 0;
                          const mrp = product.mrp || item.originalPriceValue || sellingPrice;

                          return (
                            <div
                              key={item.id}
                              className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm opacity-95"
                            >
                              <div className="flex gap-5">
                                <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                                  <img
                                    src={thumbnail}
                                    alt={productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-md font-semibold text-gray-900 mb-1">
                                    {productName}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Size: S • Seller: RedBrocket
                                  </p>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg font-bold text-gray-900">
                                      {formatINR(sellingPrice)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatINR(mrp)}
                                    </span>
                                  </div>
                                  <div className="flex gap-6 text-sm">
                                    <button
                                      onClick={() => handleMoveToCart(item.id)}
                                      className="text-gray-700 hover:text-black font-medium"
                                    >
                                      MOVE TO CART
                                    </button>
                                    <button
                                      onClick={() => handleRemoveFromSaved(item.id)}
                                      className="text-gray-700 hover:text-black font-medium"
                                    >
                                      REMOVE
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bottom CTA */}
                  {localCartItems.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-lg font-semibold text-gray-900">
                          Total: {formatINR(displayTotal)}
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <Link
                            to="/products"
                            className="flex-1 sm:flex-initial px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-center"
                          >
                            CONTINUE SHOPPING
                          </Link>
                          <Link
                            to="/checkout"
                            className="flex-1 sm:flex-initial px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-center"
                          >
                            PROCEED TO CHECKOUT ({localCartItems.length})
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Price Details */}
                <div className="lg:w-[370px]">
                  <div className="border border-gray-200 px-[30px] mt-14 py-[26px] rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      PRICE DETAILS
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Price ({localCartItems.length} items)
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatINR(calculatedOriginalTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-gray-800">
                          -{formatINR(displayDiscount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-medium text-gray-900">
                          {formatINR(platformFee)}
                        </span>
                      </div>
                      <div className="h-px bg-gray-300 my-3"></div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <span>Total Amount</span>
                        <span>{formatINR(displayTotal)}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-4">
                      <p className="text-sm text-center text-gray-700">
                        <strong>You will save {formatINR(displayDiscount)}</strong> on this
                        order
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Safe and Secure Payments. Easy returns. 100% Authentic
                      products.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}