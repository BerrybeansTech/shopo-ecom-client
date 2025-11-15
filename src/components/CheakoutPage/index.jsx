// components/Checkout/Checkout.js
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Plus, CreditCard, Wallet, Smartphone, Package, Shield, Clock, Edit2, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../Partials/Layout';
import ThankYouPopup from './ThankYouPopup';
import { ordersApi } from './ordersApi';
import { useCart } from '../CartPage/useCart';
import { useAuth } from '../Auth/hooks/useAuth';

// Main Checkout Component
export default function Checkout() {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [apiError, setApiError] = useState(null);

  const { 
    items: cartItems, 
    subtotal, 
    discount, 
    total, 
    clearCartAfterSuccessfulOrder,
    refreshCart,
    formatINR,
    isAuthenticated 
  } = useCart();
  
  const { user } = useAuth();

  // Sample addresses - in real app, fetch from user profile
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      fullName: user?.name || 'John Doe',
      phone: user?.phone || '+91 9876543210',
      address: '123, MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true
    },
  ]);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, subtitle: 'Google Pay, PhonePe, Paytm & more' },
    { id: 'card', name: 'Cards', icon: CreditCard, subtitle: 'Credit/Debit cards, EMI available' },
    { id: 'wallet', name: 'Wallets', icon: Wallet, subtitle: 'Paytm, Amazon Pay, Mobikwik' },
    { id: 'bnpl', name: 'Pay Later', icon: Clock, subtitle: 'Simpl, LazyPay, ICICI PayLater' },
    { id: 'cod', name: 'Cash on Delivery', icon: Package, subtitle: '₹50 handling fee' }
  ];

  // Calculate order summary
  const shipping = subtotal >= 999 ? 0 : 80;
  const codFee = selectedPayment === 'cod' ? 50 : 0;
  const couponDiscount = appliedCoupon ? 200 : 0;
  const finalTotal = subtotal + shipping + codFee - couponDiscount;

  // Format cart items for API
  const formatCartItemsForAPI = () => {
    return cartItems.map(item => ({
      productId: item.productId || item.id,
      quantity: item.quantity,
      price: item.product?.sellingPrice || item.price,
      productColorVariationId: item.productColorVariationId || null,
      productSizeVariationId: item.productSizeVariationId || null
    }));
  };

  // Handle new address input changes
  const handleNewAddressChange = (field, value) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save new address
  const handleSaveNewAddress = () => {
    if (!newAddress.pincode || !newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state) {
      setApiError('Please fill all address fields');
      return;
    }

    const newAddressObj = {
      id: savedAddresses.length + 1,
      name: newAddress.name || 'New Address',
      fullName: newAddress.fullName,
      phone: newAddress.phone,
      address: newAddress.address,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      isDefault: false
    };

    setSavedAddresses(prev => [...prev, newAddressObj]);
    setSelectedAddress(newAddressObj.id);
    setNewAddress({
      name: '',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
    setShowAddAddress(false);
    setApiError(null);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST500') {
      setAppliedCoupon({ code: 'FIRST500', discount: 200 });
      setShowCoupon(false);
      setCouponCode('');
      setApiError(null);
    } else {
      setApiError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setApiError(null);
  };

  // MAIN FUNCTION: Place order and clear cart
  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      setApiError('Please login to place order');
      return;
    }

    if (cartItems.length === 0) {
      setApiError('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    setApiError(null);

    try {
      const selectedAddressData = savedAddresses.find(addr => addr.id === selectedAddress);
      
      if (!selectedAddressData) {
        throw new Error('Please select a delivery address');
      }

      if (!selectedPayment) {
        throw new Error('Please select a payment method');
      }

      const orderData = {
        customerId: user.id,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        shippingAddress: `${selectedAddressData.fullName}, ${selectedAddressData.address}, ${selectedAddressData.city}, ${selectedAddressData.state} - ${selectedAddressData.pincode}`,
        subTotal: subtotal,
        tax: Math.round(subtotal * 0.18), // 18% GST
        shippingCharge: shipping,
        totalAmount: finalTotal,
        finalAmount: finalTotal,
        paymentMethod: selectedPayment.toUpperCase(),
        orderNote: 'Urgent delivery',
        productItems: formatCartItemsForAPI()
      };

      console.log('Placing order with data:', orderData);

      // Call the API to create order
      const response = await ordersApi.createOrder(orderData);

      if (response.success) {
        console.log('Order created successfully, clearing cart...');
        
        // CLEAR CART AFTER SUCCESSFUL ORDER
        const clearCartResult = await clearCartAfterSuccessfulOrder();
        
        if (clearCartResult.success) {
          console.log('Cart cleared successfully after order');
        } else {
          console.warn('Cart clearing had issues:', clearCartResult.message);
        }

        // Set order details for thank you popup
        const orderDetailsData = {
          orderId: response.data.id,
          items: cartItems,
          deliveryAddress: selectedAddressData,
          paymentMethod: paymentMethods.find(m => m.id === selectedPayment)?.name,
          totalAmount: finalTotal,
          savings: discount + couponDiscount,
          apiResponse: response.data
        };

        setOrderDetails(orderDetailsData);
        setShowThankYou(true);
        
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setApiError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleContinueShopping = () => {
    setShowThankYou(false);
    window.location.href = '/products';
  };

  // Validation states
  const isContinueToPaymentDisabled = !selectedAddress;
  const isContinueToReviewDisabled = !selectedPayment;
  const isPlaceOrderDisabled = !selectedAddress || !selectedPayment || isPlacingOrder || cartItems.length === 0;

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to proceed with checkout.</p>
            <Link
              to="/login"
              state={{ returnUrl: '/checkout' }}
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Login Now
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Show empty cart message
  if (cartItems.length === 0 && !showThankYou) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before proceeding to checkout.</p>
            <Link
              to="/products"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="min-h-screen bg-gray-50 font-inter">
        {/* Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{apiError}</span>
              <button 
                onClick={() => setApiError(null)} 
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-8">
              {[
                { num: 1, label: 'Address' },
                { num: 2, label: 'Payment' },
                { num: 3, label: 'Review' }
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= s.num 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${
                      step >= s.num ? 'text-black' : 'text-gray-500'
                    }`}>{s.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`hidden sm:block w-12 lg:w-24 h-0.5 ${
                      step > s.num ? 'bg-black' : 'bg-gray-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Step 1: Delivery Address */}
              {step >= 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-black" />
                        Delivery Address
                      </h2>
                      {step > 1 && selectedAddress && (
                        <button 
                          onClick={() => setStep(1)}
                          className="text-sm text-black hover:text-gray-700 transition-colors flex items-center"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    {step === 1 ? (
                      <div className="space-y-3">
                        {savedAddresses.map(addr => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddress(addr.id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedAddress === addr.id
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold text-black">{addr.name}</span>
                                  {addr.isDefault && (
                                    <span className="px-2 py-0.5 bg-black text-white text-xs rounded">Default</span>
                                  )}
                                </div>
                                <p className="text-sm text-black font-medium">{addr.fullName}</p>
                                <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                <p className="text-sm text-gray-600 mt-1">Mobile: {addr.phone}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                  <Edit2 className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => setShowAddAddress(!showAddAddress)}
                          className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-black rounded-lg text-gray-600 hover:text-black transition-all flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-5 h-5" />
                          <span className="font-medium">Add New Address</span>
                        </button>

                        {showAddAddress && (
                          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Address Name (e.g., Home, Office)"
                                value={newAddress.name}
                                onChange={(e) => handleNewAddressChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Pincode"
                                value={newAddress.pincode}
                                onChange={(e) => handleNewAddressChange('pincode', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={newAddress.fullName}
                                onChange={(e) => handleNewAddressChange('fullName', e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                              />
                              <input 
                                type="text" 
                                placeholder="Mobile" 
                                value={newAddress.phone}
                                onChange={(e) => handleNewAddressChange('phone', e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                              />
                            </div>
                            <input 
                              type="text" 
                              placeholder="Address (House No, Building, Street)" 
                              value={newAddress.address}
                              onChange={(e) => handleNewAddressChange('address', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                placeholder="City" 
                                value={newAddress.city}
                                onChange={(e) => handleNewAddressChange('city', e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                              />
                              <input 
                                type="text" 
                                placeholder="State" 
                                value={newAddress.state}
                                onChange={(e) => handleNewAddressChange('state', e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button 
                                onClick={handleSaveNewAddress}
                                className="flex-1 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                              >
                                Save Address
                              </button>
                              <button 
                                onClick={() => setShowAddAddress(false)}
                                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => setStep(2)}
                          disabled={isContinueToPaymentDisabled}
                          className={`w-full mt-4 py-3 sm:py-4 font-semibold rounded-lg transition-all text-sm sm:text-base ${
                            isContinueToPaymentDisabled
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-black hover:bg-gray-800 text-white'
                          }`}
                        >
                          Continue to Payment
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        {savedAddresses.find(a => a.id === selectedAddress) && (
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-black">
                                {savedAddresses.find(a => a.id === selectedAddress).name}
                              </span>
                              {savedAddresses.find(a => a.id === selectedAddress).isDefault && (
                                <span className="px-2 py-0.5 bg-black text-white text-xs rounded">Default</span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-black">
                              {savedAddresses.find(a => a.id === selectedAddress).fullName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {savedAddresses.find(a => a.id === selectedAddress).address}, {savedAddresses.find(a => a.id === selectedAddress).city}
                            </p>
                            <p className="text-sm text-gray-600">
                              {savedAddresses.find(a => a.id === selectedAddress).state} - {savedAddresses.find(a => a.id === selectedAddress).pincode}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Mobile: {savedAddresses.find(a => a.id === selectedAddress).phone}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step >= 2 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-black" />
                      Payment Method
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6">
                    {step === 2 ? (
                      <div className="space-y-3">
                        {paymentMethods.map(method => (
                          <div
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedPayment === method.id
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                selectedPayment === method.id ? 'bg-black' : 'bg-gray-200'
                              }`}>
                                <method.icon className={`w-5 h-5 ${
                                  selectedPayment === method.id ? 'text-white' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-black">{method.name}</p>
                                <p className="text-xs text-gray-600">{method.subtitle}</p>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => setStep(3)}
                          disabled={isContinueToReviewDisabled}
                          className={`w-full mt-4 py-3 sm:py-4 font-semibold rounded-lg transition-all text-sm sm:text-base ${
                            isContinueToReviewDisabled
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-black hover:bg-gray-800 text-white'
                          }`}
                        >
                          Continue to Review
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                            {React.createElement(paymentMethods.find(m => m.id === selectedPayment)?.icon, { className: 'w-5 h-5 text-white' })}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-black">
                              {paymentMethods.find(m => m.id === selectedPayment)?.name}
                            </span>
                            <p className="text-xs text-gray-600">
                              {paymentMethods.find(m => m.id === selectedPayment)?.subtitle}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setStep(2)}
                          className="text-sm text-black hover:text-gray-700 transition-colors flex items-center"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Change
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
                      <Package className="w-5 h-5 mr-2 text-black" />
                      Review Your Order
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-start space-x-2 p-3 bg-gray-100 rounded-lg">
                      <Clock className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black">Estimated Delivery</p>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                      </div>
                    </div>

                    {cartItems.map(item => {
                      const product = item.product || {};
                      const productName = product.name || "Product";
                      const thumbnail = product.thumbnailImage || "https://via.placeholder.com/80";
                      const sellingPrice = product.sellingPrice || item.price || 0;
                      const mrp = product.mrp || sellingPrice;

                      return (
                        <div key={item.id} className="flex space-x-3 pb-4 border-b border-gray-200 last:border-0">
                          <img 
                            src={thumbnail} 
                            alt={productName}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200" 
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-black">{productName}</h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.productColorVariationId ? `Color: ${item.productColorVariationId}` : ''} 
                              {item.productSizeVariationId ? ` | Size: ${item.productSizeVariationId}` : ''}
                            </p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-black">
                              {formatINR(sellingPrice * item.quantity)}
                            </p>
                            {mrp > sellingPrice && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatINR(mrp * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlaceOrderDisabled}
                      className={`w-full py-3 sm:py-4 font-semibold rounded-lg transition-all text-sm sm:text-base flex items-center justify-center space-x-2 ${
                        isPlaceOrderDisabled
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-black hover:bg-gray-800 text-white'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                      <span>
                        {isPlacingOrder ? 'Placing Order...' : `Place Order - ${formatINR(finalTotal)}`}
                      </span>
                    </button>

                    {isPlacingOrder && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Processing your order...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Sticky Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-black">Order Summary</h3>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {/* Coupon Section */}
                  <div>
                    {!appliedCoupon ? (
                      <button
                        onClick={() => setShowCoupon(!showCoupon)}
                        className="w-full text-left px-4 py-3 border border-dashed border-gray-300 hover:border-black rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600">Have a coupon code?</span>
                        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showCoupon ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <div className="px-4 py-3 bg-gray-100 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-black" />
                          <span className="text-sm font-medium text-black">{appliedCoupon.code} Applied</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-xs text-gray-600 hover:text-black"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {showCoupon && !appliedCoupon && (
                      <div className="mt-2 flex space-x-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span className="text-black font-medium">{formatINR(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-black font-medium">FREE</span>
                      ) : (
                        <span className="text-black font-medium">{formatINR(shipping)}</span>
                      )}
                    </div>

                    {codFee > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">COD Handling</span>
                        <span className="text-black font-medium">{formatINR(codFee)}</span>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">Coupon Discount</span>
                        <span className="text-green-600 font-medium">-{formatINR(couponDiscount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">You Save</span>
                      <span className="text-green-600 font-medium">{formatINR(discount + couponDiscount)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t-2 border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-black">Total</span>
                      <span className="text-2xl font-bold text-black">{formatINR(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Shield className="w-4 h-4 text-black" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Package className="w-4 h-4 text-black" />
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Promise */}
              {step > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-black">Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      <p className="text-xs text-gray-600 mt-1">Order within 2 hours for same day dispatch</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        {step < 3 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-black">{formatINR(finalTotal)}</p>
              </div>
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  disabled={isContinueToPaymentDisabled}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                    isContinueToPaymentDisabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  Continue
                </button>
              )}
              {step === 2 && (
                <button
                  onClick={() => setStep(3)}
                  disabled={isContinueToReviewDisabled}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                    isContinueToReviewDisabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Thank You Popup */}
      <ThankYouPopup
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        orderDetails={orderDetails}
        onContinueShopping={handleContinueShopping}
      />
    </Layout>
  );
}