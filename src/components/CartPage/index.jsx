import { useState } from "react";
import { Link } from "react-router-dom";
import BreadcrumbCom from "../BreadcrumbCom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "METRONAUT Men Solid Casual Yellow Shirt",
      deliveryDate: "Mon Oct 27",
      size: "S",
      seller: "RedBrocket",
      assured: true,
      originalPrice: "₹1,999",
      discountedPrice: "₹256",
      discount: "86% Off",
      image: "/assets/images/shirt1.webp",
      quantity: 1,
      inCart: true,
      originalPriceValue: 1999,
      discountedPriceValue: 256,
    },
    {
      id: 2,
      name: "METRONAUT Men Solid Casual Dark Green Shirt",
      deliveryDate: "Tue Oct 28",
      size: "L",
      seller: "Apple Store",
      assured: true,
      originalPrice: "₹1,999",
      discountedPrice: "₹1,000",
      discount: "50% Off",
      image: "/assets/images/shirt3.webp",
      quantity: 1,
      inCart: true,
      originalPriceValue: 1999,
      discountedPriceValue: 1000,
    },
  ]);

  const [savedItems, setSavedItems] = useState([]);

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleSaveForLater = (id) => {
    const itemToSave = cartItems.find((item) => item.id === id);
    if (itemToSave) {
      setCartItems(cartItems.filter((item) => item.id !== id));
      setSavedItems([...savedItems, { ...itemToSave, inCart: false }]);
    }
  };

  const handleMoveToCart = (id) => {
    const itemToMove = savedItems.find((item) => item.id === id);
    if (itemToMove) {
      setSavedItems(savedItems.filter((item) => item.id !== id));
      setCartItems([...cartItems, { ...itemToMove, inCart: true }]);
    }
  };

  const handleRemoveFromSaved = (id) => {
    setSavedItems(savedItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.discountedPriceValue * item.quantity, 0);
  };

  const calculateItemTotal = (item) => item.discountedPriceValue * item.quantity;
  const calculateOriginalTotal = (item) => item.originalPriceValue * item.quantity;

  const handleImageError = (e) => {
    e.target.alt = "Product image not available";
  };

  // Price Calculations
  const subtotal = calculateTotal(cartItems);
  const originalTotal = cartItems.reduce((sum, i) => sum + i.originalPriceValue * i.quantity, 0);
  const discount = originalTotal - subtotal;
  const platformFee = 7;
  const totalAmount = subtotal + platformFee;

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="cart-page-wrapper w-full bg-white pb-[60px]">
        <div className="w-full">
          <PageTitle
            title="Your Cart"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "cart", path: "/cart" },
            ]}
          />
        </div>

        <div className="w-full mt-[23px]">
          <div className="container-x mx-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4">Empty Cart</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <Link
                  to="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Cart Items + Saved Items */}
                <div className="lg:flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Shopping Cart ({cartItems.length})
                  </h1>

                  {/* Cart Items */}
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                {item.name}
                              </h2>
                              <p className="text-sm text-gray-600 mb-2">
                                Delivery by <span className="font-medium">{item.deliveryDate}</span>
                              </p>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                <span>Size: <strong>{item.size}</strong></span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-bold text-gray-900">
                                  {formatINR(calculateItemTotal(item))}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                  {formatINR(calculateOriginalTotal(item))}
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                  {item.discount}
                                </span>
                              </div>
                            </div>

                            {/* Bottom Actions: Quantity + Buttons */}
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
                                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                  SAVE FOR LATER
                                </button>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                >
                                  REMOVE
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Saved for Later */}
                  {savedItems.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Saved For Later ({savedItems.length})
                      </h2>
                      <div className="space-y-4">
                        {savedItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm opacity-95"
                          >
                            <div className="flex gap-5">
                              <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={handleImageError}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-md font-semibold text-gray-900 mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Size: {item.size} • Seller: {item.seller}
                                </p>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-lg font-bold">
                                    {formatINR(item.discountedPriceValue)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatINR(item.originalPriceValue)}
                                  </span>
                                </div>
                                <div className="flex gap-6 text-sm">
                                  <button
                                    onClick={() => handleMoveToCart(item.id)}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    MOVE TO CART
                                  </button>
                                  <button
                                    onClick={() => handleRemoveFromSaved(item.id)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                  >
                                    REMOVE
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom CTA */}
                  {cartItems.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-lg font-semibold text-gray-900">
                          Total: {formatINR(totalAmount)}
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <Link
                            to="/"
                            className="flex-1 sm:flex-initial px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center"
                          >
                            CONTINUE SHOPPING
                          </Link>
                          <Link
                            to="/checkout"
                            className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                          >
                            PROCEED TO CHECKOUT ({cartItems.length})
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Price Details */}
                <div className="lg:w-[370px]">
                  <div className="border border-[#EDEDED] px-[30px] mt-14  py-[26px] rounded-lg">
                    <h3 className="text-lg font-medium text-qblack mb-4">PRICE DETAILS</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-qgraytwo">Price ({cartItems.length} items)</span>
                        <span className="font-medium">{formatINR(originalTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-qgraytwo">Discount</span>
                        <span className="font-medium text-green-600">- {formatINR(discount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-qgraytwo">Platform Fee</span>
                        <span className="font-medium">{formatINR(platformFee)}</span>
                      </div>
                      <div className="h-px bg-[#EDEDED] my-3"></div>
                      <div className="flex justify-between text-base font-medium">
                        <span className="text-qblack">Total Amount</span>
                        <span className="text-qblack">{formatINR(totalAmount)}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                      <p className="text-sm text-green-700 text-center">
                        <strong>You will save {formatINR(discount)}</strong> on this order
                      </p>
                    </div>
                    <p className="text-xs text-qgraytwo text-center mt-4">
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