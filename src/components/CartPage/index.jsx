// components/Cart/CartPage.js
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { useCart } from "../CartPage/useCart";
import { resetOrderCompleted } from "../CartPage/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const placeholderSrc = "data:image/svg+xml;base64," + btoa('<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg"><rect width="128" height="128" fill="#f3f4f6"/><text x="64" y="64" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="12" fill="#9ca3af">No Image</text></svg>');
  
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
    dismissError,
    isAuthenticated,
    handleLoginRedirect,
    isItemUpdating,
    isItemDeleting,
    getItemPrice
  } = useCart();

  useEffect(() => {
    dispatch(resetOrderCompleted());
  }, [dispatch]);

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

  const platformFee = 7;

  if (loading && items.length === 0) {
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

            {items.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4 text-gray-800">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <Link
                  to="/all-products"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Shopping Cart ({items.length})
                  </h1>

                  <div className="space-y-6">
                    {items.map((item) => {
                      const product = item.product || {};
                      const productName = product.name || "Product";
                      const thumbnail = product.thumbnailImage || placeholderSrc;
                      const sellingPrice = getItemPrice(item);
                      const quantity = item.quantity || 1;
                      const itemTotal = sellingPrice * quantity;

                      const isUpdating = isItemUpdating(item.id);
                      const isDeleting = isItemDeleting(item.id);

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm relative"
                        >
                          {(isUpdating || isDeleting) && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-10">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                          )}

                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                              <div className="w-32 h-32 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                                <img
                                  src={thumbnail}
                                  alt={productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = placeholderSrc; }}
                                />
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                  {productName}
                                </h2>
                                <p className="text-sm text-gray-600 mb-2">
                                  Delivery by{" "}
                                  <span className="font-medium text-gray-800">
                                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </span>
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                  <span>Size: <strong>{product.size || 'S'}</strong></span>
                                  {/* <span className="text-lg font-semibold text-gray-900">
                                    Price: {formatINR(sellingPrice)}
                                  </span> */}
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                  <span className="text-2xl font-bold text-gray-900">
                                    {formatINR(itemTotal)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-start gap-4 mt-auto">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Qty:</span>
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => updateQuantity(item.id, Math.max(1, quantity - 1))}
                                      disabled={isUpdating || isDeleting}
                                    >
                                      {isUpdating ? "..." : "−"}
                                    </button>
                                    <span className="w-10 text-center font-medium text-gray-900 px-2">
                                      {quantity}
                                    </span>
                                    <button
                                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => updateQuantity(item.id, quantity + 1)}
                                      disabled={isUpdating || isDeleting}
                                    >
                                      {isUpdating ? "..." : "+"}
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-6 text-sm">
                                  <button
                                    onClick={() => handleSaveForLater(item.id)}
                                    className="text-gray-700 hover:text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isUpdating || isDeleting}
                                  >
                                    SAVE FOR LATER
                                  </button>
                                  <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-gray-700 hover:text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isUpdating || isDeleting}
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
                  {savedItems.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Saved For Later ({savedItems.length})
                      </h2>
                      <div className="space-y-4">
                        {savedItems.map((item) => {
                          const product = item.product || {};
                          const productName = product.name || "Product";
                          const thumbnail = product.thumbnailImage || placeholderSrc;
                          const sellingPrice = getItemPrice(item);

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
                                    onError={(e) => { e.target.src = placeholderSrc; }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-md font-semibold text-gray-900 mb-1">
                                    {productName}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Size: {product.size || 'S'} • Seller: {product.seller || 'RedBrocket'}
                                  </p>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg font-bold text-gray-900">
                                      {formatINR(sellingPrice)}
                                    </span>
                                  </div>
                                  <div className="flex gap-6 text-sm">
                                    <button
                                      onClick={() => handleMoveToCart(item.id)}
                                      className="text-gray-700 hover:text-black font-medium disabled:opacity-50"
                                      disabled={loading}
                                    >
                                      MOVE TO CART
                                    </button>
                                    <button
                                      onClick={() => handleRemoveFromSaved(item.id)}
                                      className="text-gray-700 hover:text-black font-medium disabled:opacity-50"
                                      disabled={loading}
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
                  {items.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-lg font-semibold text-gray-900">
                          Total: {formatINR(total)}
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <Link
                            to="/all-products"
                            className="flex-1 sm:flex-initial px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-center"
                          >
                            CONTINUE SHOPPING
                          </Link>
                          <Link
                            to="/checkout"
                            className="flex-1 sm:flex-initial px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-center"
                          >
                            PROCEED TO CHECKOUT ({items.length})
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Details */}
                <div className="lg:w-[370px]">
                  <div className="border border-gray-200 px-[30px] mt-14 py-[26px] rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      PRICE DETAILS
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Price ({items.length} items)
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatINR(subtotal + discount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">
                          -{formatINR(discount)}
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
                        <span>{formatINR(total)}</span>
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                        <p className="text-sm text-center text-green-700">
                          <strong>You will save {formatINR(discount)}</strong> on this order
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Safe and Secure Payments. Easy returns. 100% Authentic products.
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