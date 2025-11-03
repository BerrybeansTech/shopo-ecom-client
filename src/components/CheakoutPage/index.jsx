import React, { useState } from 'react';
import { ChevronDown, MapPin, Plus, CreditCard, Wallet, Smartphone, Package, Shield, Clock, Edit2, Trash2, Check } from 'lucide-react';
import Layout from '../Partials/Layout';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [pincode, setPincode] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const cartItems = [
    {
      id: 1,
      name: 'Premium Cotton Shirt',
      color: 'Navy Blue',
      size: 'L',
      price: 1299,
      mrp: 1999,
      qty: 1,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Classic Chinos',
      color: 'Khaki',
      size: '32',
      price: 1599,
      mrp: 2499,
      qty: 1,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop'
    }
  ];

  const savedAddresses = [
    {
      id: 1,
      name: 'Home',
      fullName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '123, MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true
    },
    {
      id: 2,
      name: 'Office',
      fullName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '456, Tech Park, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      isDefault: false
    }
  ];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, subtitle: 'Google Pay, PhonePe, Paytm & more' },
    { id: 'card', name: 'Cards', icon: CreditCard, subtitle: 'Credit/Debit cards, EMI available' },
    { id: 'wallet', name: 'Wallets', icon: Wallet, subtitle: 'Paytm, Amazon Pay, Mobikwik' },
    { id: 'bnpl', name: 'Pay Later', icon: Clock, subtitle: 'Simpl, LazyPay, ICICI PayLater' },
    { id: 'cod', name: 'Cash on Delivery', icon: Package, subtitle: '₹50 handling fee' }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.mrp - item.price) * item.qty), 0);
  const shipping = subtotal >= 999 ? 0 : 80;
  const codFee = selectedPayment === 'cod' ? 50 : 0;
  const discount = appliedCoupon ? 200 : 0;
  const total = subtotal + shipping + codFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST500') {
      setAppliedCoupon({ code: 'FIRST500', discount: 200 });
      setShowCoupon(false);
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
    <div className="min-h-screen bg-gray-50 font-inter">

      {/* Progress Steps */}
      <div className="bg-white-50 border-b border-gray-200">
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
                      ? 'bg-black-900 text-white-50' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${
                    step >= s.num ? 'text-black-900' : 'text-gray-500'
                  }`}>{s.label}</span>
                </div>
                {idx < 2 && (
                  <div className={`hidden sm:block w-12 lg:w-24 h-0.5 ${
                    step > s.num ? 'bg-black-900' : 'bg-gray-200'
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
              <div className="bg-white-50 rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-black-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-black-900" />
                      Delivery Address
                    </h2>
                    {step > 1 && selectedAddress && (
                      <button 
                        onClick={() => setStep(1)}
                        className="text-sm text-black-900 hover:text-gray-700 transition-colors flex items-center"
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
                              ? 'border-black-900 bg-gray-100'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold text-black-900">{addr.name}</span>
                                {addr.isDefault && (
                                  <span className="px-2 py-0.5 bg-black-900 text-white-50 text-xs rounded">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-black-900 font-medium">{addr.fullName}</p>
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
                        className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-black-900 rounded-lg text-gray-600 hover:text-black-900 transition-all flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add New Address</span>
                      </button>

                      {showAddAddress && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                          <input
                            type="text"
                            placeholder="Pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black-900 text-sm"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Full Name" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black-900 text-sm" />
                            <input type="text" placeholder="Mobile" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black-900 text-sm" />
                          </div>
                          <input type="text" placeholder="Address (House No, Building, Street)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black-900 text-sm" />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="City" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black-900 text-sm" />
                            <input type="text" placeholder="State" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black-900 text-sm" />
                          </div>
                          <button className="w-full py-3 bg-black-900 hover:bg-black-800 text-white-50 font-medium rounded-lg transition-colors">
                            Save Address
                          </button>
                        </div>
                      )}

                      {selectedAddress && (
                        <button
                          onClick={() => setStep(2)}
                          className="w-full mt-4 py-3 sm:py-4 bg-black-900 hover:bg-black-800 text-white-50 font-semibold rounded-lg transition-all text-sm sm:text-base"
                        >
                          Continue to Payment
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {savedAddresses.find(a => a.id === selectedAddress) && (
                        <div>
                          <p className="text-sm font-semibold text-black-900">
                            {savedAddresses.find(a => a.id === selectedAddress).fullName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {savedAddresses.find(a => a.id === selectedAddress).address}, {savedAddresses.find(a => a.id === selectedAddress).city}
                          </p>
                          <p className="text-sm text-gray-600">
                            {savedAddresses.find(a => a.id === selectedAddress).pincode}
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
              <div className="bg-white-50 rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-black-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-black-900" />
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
                              ? 'border-black-900 bg-gray-100'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedPayment === method.id ? 'bg-black-900' : 'bg-gray-200'
                            }`}>
                              <method.icon className={`w-5 h-5 ${
                                selectedPayment === method.id ? 'text-white-50' : 'text-gray-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-black-900">{method.name}</p>
                              <p className="text-xs text-gray-600">{method.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {selectedPayment && (
                        <button
                          onClick={() => setStep(3)}
                          className="w-full mt-4 py-3 sm:py-4 bg-black-900 hover:bg-black-800 text-white-50 font-semibold rounded-lg transition-all text-sm sm:text-base"
                        >
                          Continue to Review
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-black-900 flex items-center justify-center">
                          {React.createElement(paymentMethods.find(m => m.id === selectedPayment)?.icon, { className: 'w-5 h-5 text-white-50' })}
                        </div>
                        <span className="text-sm font-semibold text-black-900">
                          {paymentMethods.find(m => m.id === selectedPayment)?.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white-50 rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-black-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-black-900" />
                    Review Your Order
                  </h2>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-start space-x-2 p-3 bg-gray-100 rounded-lg">
                    <Clock className="w-5 h-5 text-black-900 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-black-900">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">3-5 business days</p>
                    </div>
                  </div>

                  {cartItems.map(item => (
                    <div key={item.id} className="flex space-x-3 pb-4 border-b border-gray-200 last:border-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-black-900">{item.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{item.color} | Size: {item.size}</p>
                        <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-black-900">₹{item.price}</p>
                        <p className="text-xs text-gray-500 line-through">₹{item.mrp}</p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => alert('Order placed successfully!')}
                    className="w-full py-3 sm:py-4 bg-black-900 hover:bg-black-800 text-white-50 font-semibold rounded-lg transition-all text-sm sm:text-base flex items-center justify-center space-x-2"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Place Order</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white-50 rounded-lg shadow-sm">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black-900">Order Summary</h3>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Coupon Section */}
                <div>
                  {!appliedCoupon ? (
                    <button
                      onClick={() => setShowCoupon(!showCoupon)}
                      className="w-full text-left px-4 py-3 border border-dashed border-gray-300 hover:border-black-900 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">Have a coupon code?</span>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showCoupon ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <div className="px-4 py-3 bg-gray-100 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-black-900" />
                        <span className="text-sm font-medium text-black-900">{appliedCoupon.code} Applied</span>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-xs text-gray-600 hover:text-black-900"
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black-900"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-black-900 hover:bg-black-800 text-white-50 text-sm font-medium rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="text-black-900 font-medium">₹{subtotal}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-black-900 font-medium">FREE</span>
                    ) : (
                      <span className="text-black-900 font-medium">₹{shipping}</span>
                    )}
                  </div>

                  {codFee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">COD Handling</span>
                      <span className="text-black-900 font-medium">₹{codFee}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Coupon Discount</span>
                      <span className="text-gray-700 font-medium">-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">You Save</span>
                    <span className="text-gray-700 font-medium">₹{savings + discount}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-black-900">Total</span>
                    <span className="text-2xl font-bold text-black-900">₹{total}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Shield className="w-4 h-4 text-black-900" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Package className="w-4 h-4 text-black-900" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Promise */}
            {step > 0 && (
              <div className="mt-4 p-4 bg-white-50 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-black-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-black-900">Delivery by Nov 3</p>
                    <p className="text-xs text-gray-600 mt-1">Order within 2 hours</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white-50 border-t border-gray-200 p-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-black-900">₹{total}</p>
          </div>
          {step === 1 && selectedAddress && (
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-black-900 hover:bg-black-800 text-white-50 font-semibold rounded-lg transition-all"
            >
              Continue
            </button>
          )}
          {step === 2 && selectedPayment && (
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-black-900 hover:bg-black-800 text-white-50 font-semibold rounded-lg transition-all"
            >
              Continue
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => alert('Order placed successfully!')}
              className="px-6 py-3 bg-black-900 hover:bg-black-800 text-white-50 font-semibold rounded-lg transition-all"
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Checkout;

// // import React, { useState } from 'react';
// // import { CreditCard, Truck, ShoppingBag, Lock, ChevronRight, Check, MapPin, Phone, Mail, User, Package, ArrowLeft } from 'lucide-react';
// // import Layout from '../Partials/Layout';

// // export default function CheckoutPage() {
// //   const [activeStep, setActiveStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     phone: '',
// //     address: '',
// //     pincode: '',
// //     city: '',
// //     state: '',
// //     country: 'India',
// //     createAccount: false,
// //     differentShipping: false,
// //     paymentMethod: ''
// //   });

// //   const [deliveryEstimate, setDeliveryEstimate] = useState(null);

// //   const products = [
// //     {
// //       id: 1,
// //       name: 'Classic Oxford Shirt',
// //       variant: 'Size: L, Color: Navy Blue',
// //       quantity: 1,
// //       price: 1299,
// //       image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop'
// //     },
// //     {
// //       id: 2,
// //       name: 'Premium Chinos',
// //       variant: 'Size: 32, Color: Khaki',
// //       quantity: 2,
// //       price: 1899,
// //       image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100&h=100&fit=crop'
// //     }
// //   ];

// //   const subtotal = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
// //   const shipping = subtotal > 999 ? 0 : 99;
// //   const discount = 150;
// //   const total = subtotal + shipping - discount;

// //   const handleInputChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value
// //     }));

// //     if (name === 'pincode' && value.length === 6) {
// //       setTimeout(() => {
// //         setDeliveryEstimate('Delivery by Wed, Oct 30');
// //       }, 500);
// //     }
// //   };

// //   const validateStep = () => {
// //     if (activeStep === 1) {
// //       return formData.firstName && formData.lastName && formData.email && 
// //              formData.phone && formData.address && formData.pincode;
// //     }
// //     return true;
// //   };

// //   const handleContinue = () => {
// //     if (validateStep()) {
// //       setActiveStep(2);
// //     }
// //   };

// //   const handleBackToCart = () => {
// //     window.history.back();
// //   };

// //   const handlePlaceOrder = () => {
// //     if (formData.paymentMethod) {
// //       alert('Order placed successfully! Order ID: RNF' + Math.random().toString(36).substr(2, 9).toUpperCase());
// //     }
// //   };

// //   return (
// //     <Layout childrenClasses="pt-0 pb-0">
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Main Content */}
// //           <div className="lg:col-span-2">
// //             {activeStep === 1 ? (
// //               <InformationStep 
// //                 formData={formData}
// //                 handleInputChange={handleInputChange}
// //                 deliveryEstimate={deliveryEstimate}
// //                 handleContinue={handleContinue}
// //                 handleBackToCart={handleBackToCart}
// //                 products={products}
// //                 subtotal={subtotal}
// //                 shipping={shipping}
// //                 discount={discount}
// //                 total={total}
// //               />
// //             ) : (
// //               <PaymentStep
// //                 formData={formData}
// //                 handleInputChange={handleInputChange}
// //                 setActiveStep={setActiveStep}
// //                 handlePlaceOrder={handlePlaceOrder}
// //                 handleBackToCart={handleBackToCart}
// //                 total={total}
// //               />
// //             )}
// //           </div>

// //           {/* Order Summary Sidebar */}
// //           <div className="lg:col-span-1">
// //             <OrderSummary 
// //               products={products}
// //               subtotal={subtotal}
// //               shipping={shipping}
// //               discount={discount}
// //               total={total}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //     </Layout>
// //   );
// // }

// // const InformationStep = ({ 
// //   formData, 
// //   handleInputChange, 
// //   deliveryEstimate, 
// //   handleContinue, 
// //   handleBackToCart,
// //   products,
// //   subtotal,
// //   shipping,
// //   discount,
// //   total
// // }) => {
// //   return (
// //     <div className="space-y-6">
// //       <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100">
// //         <div className="mb-8">
// //           <div className="flex items-center space-x-3 mb-3">
// //             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
// //               <MapPin className="w-5 h-5 text-white" />
// //             </div>
// //             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-inter">Delivery Information</h2>
// //           </div>
// //           <p className="text-sm text-gray-500 font-inter ml-13">Please provide your delivery details</p>
// //         </div>

// //         <div className="space-y-6">
// //           {/* Contact Information */}
// //           <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-6 border border-blue-100">
// //             <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center font-inter">
// //               <User className="w-5 h-5 mr-2 text-blue-600" />
// //               Contact Details
// //             </h3>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">
// //                   First Name <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="firstName"
// //                   value={formData.firstName}
// //                   onChange={handleInputChange}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                   placeholder="John"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">
// //                   Last Name <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="lastName"
// //                   value={formData.lastName}
// //                   onChange={handleInputChange}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                   placeholder="Doe"
// //                 />
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center font-inter">
// //                   <Mail className="w-4 h-4 mr-1.5 text-blue-600" />
// //                   Email Address <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="email"
// //                   name="email"
// //                   value={formData.email}
// //                   onChange={handleInputChange}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                   placeholder="john@example.com"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center font-inter">
// //                   <Phone className="w-4 h-4 mr-1.5 text-blue-600" />
// //                   Phone Number <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="tel"
// //                   name="phone"
// //                   value={formData.phone}
// //                   onChange={handleInputChange}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                   placeholder="+91 98765 43210"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Delivery Address */}
// //           <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-6 border border-green-100">
// //             <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center font-inter">
// //               <Truck className="w-5 h-5 mr-2 text-green-600" />
// //               Delivery Address
// //             </h3>
            
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">
// //                   Street Address <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="address"
// //                   value={formData.address}
// //                   onChange={handleInputChange}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                   placeholder="House no., Building, Street"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">
// //                     Pincode <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="pincode"
// //                     value={formData.pincode}
// //                     onChange={handleInputChange}
// //                     maxLength="6"
// //                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                     placeholder="600001"
// //                   />
// //                   {deliveryEstimate && (
// //                     <div className="mt-2 px-3 py-2 bg-green-100 rounded-lg border border-green-200">
// //                       <p className="text-xs text-green-700 font-semibold flex items-center font-inter">
// //                         <Check className="w-3.5 h-3.5 mr-1.5" />
// //                         {deliveryEstimate}
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">
// //                     City <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="city"
// //                     value={formData.city}
// //                     onChange={handleInputChange}
// //                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                     placeholder="Chennai"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">
// //                     State
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="state"
// //                     value={formData.state}
// //                     onChange={handleInputChange}
// //                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white font-inter text-gray-900 placeholder-gray-400"
// //                     placeholder="Tamil Nadu"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2 font-inter">
// //                     Country
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="country"
// //                     value={formData.country}
// //                     onChange={handleInputChange}
// //                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 font-inter cursor-not-allowed"
// //                     disabled
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Mobile Order Summary */}
// //           <div className="lg:hidden">
// //             <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-xl border border-purple-100 p-6">
// //               <h3 className="text-lg font-bold text-gray-900 mb-4 font-inter">Price Details</h3>
              
// //               <div className="space-y-3">
// //                 <div className="flex justify-between text-sm font-inter">
// //                   <span className="text-gray-600">Price ({products.length} items)</span>
// //                   <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
// //                 </div>
                
// //                 {discount > 0 && (
// //                   <div className="flex justify-between text-sm font-inter">
// //                     <span className="text-gray-600">Discount</span>
// //                     <span className="font-semibold text-green-600">-₹{discount.toLocaleString()}</span>
// //                   </div>
// //                 )}
                
// //                 <div className="flex justify-between text-sm font-inter">
// //                   <span className="text-gray-600">Delivery Charges</span>
// //                   <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
// //                     {shipping === 0 ? 'FREE' : `₹${shipping}`}
// //                   </span>
// //                 </div>
                
// //                 <div className="border-t-2 border-purple-200 pt-3 mt-3">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-base font-bold text-gray-900 font-inter">Total Amount</span>
// //                     <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-inter">₹{total.toLocaleString()}</span>
// //                   </div>
// //                 </div>
                
// //                 {discount > 0 && (
// //                   <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
// //                     <p className="text-xs text-green-700 font-semibold font-inter text-center">
// //                       🎉 You will save ₹{discount.toLocaleString()} on this order
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex flex-col sm:flex-row gap-4 pt-6">
// //             <button
// //               onClick={handleBackToCart}
// //               className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-inter shadow-sm"
// //             >
// //               <ArrowLeft className="w-5 h-5" />
// //               <span>Back to Cart</span>
// //             </button>
// //             <button
// //               onClick={handleContinue}
// //               className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/50 font-inter"
// //             >
// //               <span>Continue to Payment</span>
// //               <ChevronRight className="w-5 h-5" />
// //             </button>
// //           </div>

// //           {/* Privacy Notice */}
// //           <div className="pt-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
// //             <p className="text-xs text-gray-600 font-inter text-center">
// //               🔒 Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const PaymentStep = ({ formData, handleInputChange, setActiveStep, handlePlaceOrder, handleBackToCart, total }) => {
// //   return (
// //     <div className="space-y-6">
// //       {/* Delivery Summary */}
// //       <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100">
// //         <div className="flex items-center justify-between mb-6">
// //           <div className="flex items-center space-x-3">
// //             <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
// //               <Check className="w-5 h-5 text-white" />
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 font-inter">Delivery Address</h3>
// //           </div>
// //           <button
// //             onClick={() => setActiveStep(1)}
// //             className="text-sm text-blue-600 hover:text-blue-700 font-semibold font-inter px-4 py-2 rounded-lg hover:bg-blue-50 transition"
// //           >
// //             Change
// //           </button>
// //         </div>
// //         <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200">
// //           <div className="text-sm text-gray-700 space-y-1.5 font-inter">
// //             <p className="font-bold text-gray-900 text-base">{formData.firstName} {formData.lastName}</p>
// //             <p>{formData.address}</p>
// //             <p>{formData.city}, {formData.state} - {formData.pincode}</p>
// //             <p className="flex items-center text-blue-600 font-semibold">
// //               <Phone className="w-3.5 h-3.5 mr-1.5" />
// //               {formData.phone}
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Payment Methods */}
// //       <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100">
// //         <div className="mb-8">
// //           <div className="flex items-center space-x-3 mb-3">
// //             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
// //               <CreditCard className="w-5 h-5 text-white" />
// //             </div>
// //             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-inter">Payment Method</h2>
// //           </div>
// //           <p className="text-sm text-gray-500 font-inter ml-13">Select your preferred payment method</p>
// //         </div>

// //         <div className="space-y-4">
// //           {/* UPI */}
// //           <label className="block cursor-pointer">
// //             <input
// //               type="radio"
// //               name="paymentMethod"
// //               value="upi"
// //               checked={formData.paymentMethod === 'upi'}
// //               onChange={handleInputChange}
// //               className="peer hidden"
// //             />
// //             <div className="border-2 border-gray-200 rounded-xl p-5 peer-checked:border-blue-600 peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-indigo-50/50 hover:border-gray-300 transition-all duration-200 peer-checked:shadow-lg peer-checked:shadow-blue-500/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
// //                     UPI
// //                   </div>
// //                   <div>
// //                     <p className="font-bold text-gray-900 font-inter text-base">UPI Payment</p>
// //                     <p className="text-xs text-gray-500 font-inter mt-0.5">Pay via Google Pay, PhonePe, Paytm</p>
// //                   </div>
// //                 </div>
// //                 <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
// //                   formData.paymentMethod === 'upi' 
// //                     ? 'border-blue-600 bg-blue-600' 
// //                     : 'border-gray-300'
// //                 } flex items-center justify-center`}>
// //                   {formData.paymentMethod === 'upi' && (
// //                     <Check className="w-4 h-4 text-white" />
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </label>

// //           {/* Credit/Debit Card */}
// //           <label className="block cursor-pointer">
// //             <input
// //               type="radio"
// //               name="paymentMethod"
// //               value="card"
// //               checked={formData.paymentMethod === 'card'}
// //               onChange={handleInputChange}
// //               className="peer hidden"
// //             />
// //             <div className="border-2 border-gray-200 rounded-xl p-5 peer-checked:border-blue-600 peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-indigo-50/50 hover:border-gray-300 transition-all duration-200 peer-checked:shadow-lg peer-checked:shadow-blue-500/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
// //                     <CreditCard className="w-6 h-6 text-gray-600" />
// //                   </div>
// //                   <div>
// //                     <p className="font-bold text-gray-900 font-inter text-base">Credit / Debit Card</p>
// //                     <p className="text-xs text-gray-500 font-inter mt-0.5">Visa, Mastercard, Amex, Rupay</p>
// //                   </div>
// //                 </div>
// //                 <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
// //                   formData.paymentMethod === 'card' 
// //                     ? 'border-blue-600 bg-blue-600' 
// //                     : 'border-gray-300'
// //                 } flex items-center justify-center`}>
// //                   {formData.paymentMethod === 'card' && (
// //                     <Check className="w-4 h-4 text-white" />
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </label>

// //           {/* Net Banking */}
// //           <label className="block cursor-pointer">
// //             <input
// //               type="radio"
// //               name="paymentMethod"
// //               value="netbanking"
// //               checked={formData.paymentMethod === 'netbanking'}
// //               onChange={handleInputChange}
// //               className="peer hidden"
// //             />
// //             <div className="border-2 border-gray-200 rounded-xl p-5 peer-checked:border-blue-600 peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-indigo-50/50 hover:border-gray-300 transition-all duration-200 peer-checked:shadow-lg peer-checked:shadow-blue-500/20">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
// //                     <span className="text-green-700 font-bold text-sm">NET</span>
// //                   </div>
// //                   <div>
// //                     <p className="font-bold text-gray-900 font-inter text-base">Net Banking</p>
// //                     <p className="text-xs text-gray-500 font-inter mt-0.5">All Indian banks supported</p>
// //                   </div>
// //                 </div>
// //                 <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
// //                   formData.paymentMethod === 'netbanking' 
// //                     ? 'border-blue-600 bg-blue-600' 
// //                     : 'border-gray-300'
// //                 } flex items-center justify-center`}>
// //                   {formData.paymentMethod === 'netbanking' && (
// //                     <Check className="w-4 h-4 text-white" />
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </label>

// //           {/* Cash on Delivery */}
// //           <label className="block">
// //             <input
// //               type="radio"
// //               name="paymentMethod"
// //               value="cod"
// //               checked={formData.paymentMethod === 'cod'}
// //               onChange={handleInputChange}
// //               className="peer hidden"
// //             />
// //             <div className="border-2 border-qgray-border rounded-lg p-4 cursor-pointer peer-checked:border-qh3-blue peer-checked:bg-qblue-white hover:border-qgray transition">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-3">
// //                   <Package className="w-10 h-10 text-qgray" />
// //                   <div>
// //                     <p className="font-semibold text-qblacktext font-inter">Cash on Delivery</p>
// //                     <p className="text-xs text-qgray font-inter">Pay when you receive</p>
// //                   </div>
// //                 </div>
// //                 <div className="w-5 h-5 rounded-full border-2 border-qgray peer-checked:border-qh3-blue peer-checked:bg-qh3-blue flex items-center justify-center">
// //                   {formData.paymentMethod === 'cod' && (
// //                     <div className="w-2 h-2 bg-white rounded-full"></div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </label>
// //         </div>

// //         {/* Security Note */}
// //         <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
// //           <div className="flex items-start space-x-3">
// //             <Lock className="w-5 h-5 text-qh2-green mt-0.5" />
// //             <div className="text-sm text-qh2-green font-inter">
// //               <p className="font-medium">Secure Payment</p>
// //               <p className="text-qh2-green">Your payment information is encrypted and secure</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="flex flex-col sm:flex-row gap-4">
// //         <button
// //           onClick={handlePlaceOrder}
// //           disabled={!formData.paymentMethod}
// //           className="flex-1 bg-qh3-blue hover:bg-blue-800 disabled:bg-qgray disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 font-inter"
// //         >
// //           <Lock className="w-5 h-5" />
// //           <span>Place Order - ₹{total.toLocaleString()}</span>
// //         </button>
// //       </div>

// //       <p className="text-xs text-center text-qgray font-inter">
// //         By placing your order, you agree to our Terms & Conditions and Privacy Policy
// //       </p>
// //     </div>
// //   );
// // };

// // const OrderSummary = ({ products, subtotal, shipping, discount, total }) => {
// //   const [showDetails, setShowDetails] = useState(true);

// //   return (
// //     <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
// //       <div className="flex items-center justify-between mb-4">
// //         <h3 className="text-lg font-bold text-qblacktext font-inter">Order Summary</h3>
// //         <button
// //           onClick={() => setShowDetails(!showDetails)}
// //           className="lg:hidden text-sm text-qh3-blue font-medium font-inter"
// //         >
// //           {showDetails ? 'Hide' : 'Show'}
// //         </button>
// //       </div>

// //       {showDetails && (
// //         <>
// //           {/* Products */}
// //           <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
// //             {products.map((product) => (
// //               <div key={product.id} className="flex space-x-3">
// //                 <div className="relative">
// //                   <img
// //                     src={product.image}
// //                     alt={product.name}
// //                     className="w-16 h-16 object-cover rounded-lg"
// //                   />
// //                   <div className="absolute -top-2 -right-2 w-5 h-5 bg-qblack text-white text-xs rounded-full flex items-center justify-center">
// //                     {product.quantity}
// //                   </div>
// //                 </div>
// //                 <div className="flex-1 min-w-0">
// //                   <h4 className="text-sm font-medium text-qblacktext truncate font-inter">{product.name}</h4>
// //                   <p className="text-xs text-qgray mt-1 font-inter">{product.variant}</p>
// //                   <p className="text-sm font-semibold text-qblacktext mt-1 font-inter">₹{product.price.toLocaleString()}</p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           <div className="border-t border-qgray-border pt-4 space-y-3">
// //             <div className="flex justify-between text-sm font-inter">
// //               <span className="text-qgray">Subtotal</span>
// //               <span className="font-medium text-qblacktext">₹{subtotal.toLocaleString()}</span>
// //             </div>
// //             <div className="flex justify-between text-sm font-inter">
// //               <span className="text-qgray">Shipping</span>
// //               <span className={`font-medium ${shipping === 0 ? 'text-qh2-green' : 'text-qblacktext'}`}>
// //                 {shipping === 0 ? 'FREE' : `₹${shipping}`}
// //               </span>
// //             </div>
// //             {discount > 0 && (
// //               <div className="flex justify-between text-sm font-inter">
// //                 <span className="text-qgray">Discount</span>
// //                 <span className="font-medium text-qh2-green">-₹{discount.toLocaleString()}</span>
// //               </div>
// //             )}
// //           </div>

// //           <div className="border-t border-qgray-border mt-4 pt-4">
// //             <div className="flex justify-between items-center">
// //               <span className="text-base font-bold text-qblacktext font-inter">Total</span>
// //               <span className="text-2xl font-bold text-qh3-blue font-inter">₹{total.toLocaleString()}</span>
// //             </div>
// //           </div>

// //           {shipping === 0 && (
// //             <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
// //               <p className="text-xs text-qh2-green font-medium font-inter">
// //                 🎉 Congratulations! You've got FREE shipping
// //               </p>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// import React, { useState } from 'react';
// import { CreditCard, Truck, ShoppingBag, Lock, ChevronRight, Check, MapPin, Phone, Mail, User, Package, ArrowLeft, Shield, Clock, Gift } from 'lucide-react';
// import Layout from '../Partials/Layout';

// export default function CheckoutPage() {
//   const [activeStep, setActiveStep] = useState(1);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     pincode: '',
//     city: '',
//     state: '',
//     country: 'India',
//     createAccount: false,
//     differentShipping: false,
//     paymentMethod: '',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     upiId: '',
//     saveCard: false
//   });

//   const [deliveryEstimate, setDeliveryEstimate] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const products = [
//     {
//       id: 1,
//       name: 'Classic Oxford Shirt',
//       variant: 'Size: L, Color: Navy Blue',
//       quantity: 1,
//       price: 1299,
//       image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&h=120&fit=crop&crop=center'
//     },
//     {
//       id: 2,
//       name: 'Premium Chinos',
//       variant: 'Size: 32, Color: Khaki',
//       quantity: 2,
//       price: 1899,
//       image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=120&h=120&fit=crop&crop=center'
//     },
//     {
//       id: 3,
//       name: 'Designer Sneakers',
//       variant: 'Size: 42, Color: White',
//       quantity: 1,
//       price: 2999,
//       image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&crop=center'
//     }
//   ];

//   const subtotal = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const shipping = subtotal > 1999 ? 0 : 99;
//   const discount = 350;
//   const tax = Math.round(subtotal * 0.18);
//   const total = subtotal + shipping - discount + tax;

//   const steps = [
//     { number: 1, title: 'Delivery', completed: activeStep > 1 },
//     { number: 2, title: 'Payment', completed: activeStep > 2 },
//     { number: 3, title: 'Confirmation', completed: false }
//   ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     if (name === 'pincode' && value.length === 6) {
//       setTimeout(() => {
//         setDeliveryEstimate({
//           date: 'Wed, Oct 30',
//           time: '2-4 Business Days',
//           freeDelivery: subtotal > 1999
//         });
//       }, 500);
//     }
//   };

//   const validateStep = () => {
//     if (activeStep === 1) {
//       return formData.firstName && formData.lastName && formData.email && 
//              formData.phone && formData.address && formData.pincode && formData.city;
//     }
//     if (activeStep === 2) {
//       return formData.paymentMethod;
//     }
//     return true;
//   };

//   const handleContinue = () => {
//     if (validateStep()) {
//       setActiveStep(activeStep + 1);
//     }
//   };

//   const handleBackToCart = () => {
//     window.history.back();
//   };

//   const handlePlaceOrder = async () => {
//     if (!formData.paymentMethod) return;
    
//     setIsProcessing(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setIsProcessing(false);
    
//     alert(`Order placed successfully! Order ID: RNF${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
//   };

//   return (
//     <Layout childrenClasses="pt-0 pb-0">
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center justify-center">
//               <div className="flex items-center space-x-8">
//                 {steps.map((step, index) => (
//                   <React.Fragment key={step.number}>
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
//                         step.completed 
//                           ? 'bg-green-500 border-green-500 text-white' 
//                           : activeStep === step.number
//                           ? 'bg-blue-600 border-blue-600 text-white'
//                           : 'bg-white border-gray-300 text-gray-400'
//                       }`}>
//                         {step.completed ? (
//                           <Check className="w-5 h-5" />
//                         ) : (
//                           <span className="font-semibold text-sm">{step.number}</span>
//                         )}
//                       </div>
//                       <span className={`font-medium hidden sm:block ${
//                         activeStep === step.number ? 'text-blue-600' : 'text-gray-500'
//                       }`}>
//                         {step.title}
//                       </span>
//                     </div>
//                     {index < steps.length - 1 && (
//                       <div className={`w-16 h-0.5 rounded-full transition-all duration-300 ${
//                         step.completed ? 'bg-green-500' : 'bg-gray-300'
//                       }`} />
//                     )}
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Content */}
//             <div className="lg:col-span-2 space-y-6">
//               {activeStep === 1 && (
//                 <InformationStep 
//                   formData={formData}
//                   handleInputChange={handleInputChange}
//                   deliveryEstimate={deliveryEstimate}
//                   handleContinue={handleContinue}
//                   handleBackToCart={handleBackToCart}
//                   validateStep={validateStep}
//                 />
//               )}
              
//               {activeStep === 2 && (
//                 <PaymentStep
//                   formData={formData}
//                   handleInputChange={handleInputChange}
//                   setActiveStep={setActiveStep}
//                   handlePlaceOrder={handlePlaceOrder}
//                   isProcessing={isProcessing}
//                   total={total}
//                   validateStep={validateStep}
//                 />
//               )}
//             </div>

//             {/* Order Summary Sidebar */}
//             <div className="lg:col-span-1">
//               <OrderSummary 
//                 products={products}
//                 subtotal={subtotal}
//                 shipping={shipping}
//                 discount={discount}
//                 tax={tax}
//                 total={total}
//                 deliveryEstimate={deliveryEstimate}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// const InformationStep = ({ 
//   formData, 
//   handleInputChange, 
//   deliveryEstimate, 
//   handleContinue, 
//   handleBackToCart,
//   validateStep
// }) => {
//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//           <div className="flex items-center space-x-3">
//             <MapPin className="w-6 h-6 text-white" />
//             <h2 className="text-xl font-bold text-white font-inter">Delivery Information</h2>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Contact Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-900 flex items-center font-inter">
//               <User className="w-5 h-5 mr-2 text-blue-600" />
//               Contact Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                   placeholder="John"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                   placeholder="Doe"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center font-inter">
//                   <Mail className="w-4 h-4 mr-2 text-blue-600" />
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                   placeholder="john@example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center font-inter">
//                   <Phone className="w-4 h-4 mr-2 text-blue-600" />
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                   placeholder="+91 98765 43210"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Delivery Address */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-900 flex items-center font-inter">
//               <Truck className="w-5 h-5 mr-2 text-green-600" />
//               Delivery Address
//             </h3>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
//                 Street Address *
//               </label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                 placeholder="House no., Building, Street, Area"
//               />
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="md:col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
//                   Pincode *
//                 </label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   maxLength="6"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                   placeholder="600001"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
//                   City *
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                   placeholder="Chennai"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white font-inter"
//                   placeholder="Tamil Nadu"
//                 />
//               </div>
//             </div>

//             {deliveryEstimate && (
//               <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Clock className="w-5 h-5 text-green-600" />
//                     <div>
//                       <p className="font-semibold text-green-800 font-inter">Estimated Delivery</p>
//                       <p className="text-sm text-green-700 font-inter">{deliveryEstimate.date} • {deliveryEstimate.time}</p>
//                     </div>
//                   </div>
//                   {deliveryEstimate.freeDelivery && (
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium font-inter">
//                       Free Delivery
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={handleBackToCart}
//               className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-inter"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Cart</span>
//             </button>
//             <button
//               onClick={handleContinue}
//               disabled={!validateStep()}
//               className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 font-inter disabled:cursor-not-allowed"
//             >
//               <span>Continue to Payment</span>
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PaymentStep = ({ formData, handleInputChange, setActiveStep, handlePlaceOrder, isProcessing, total, validateStep }) => {
//   const [cardFocused, setCardFocused] = useState(false);

//   return (
//     <div className="space-y-6">
//       {/* Delivery Summary */}
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Check className="w-6 h-6 text-white" />
//               <h2 className="text-xl font-bold text-white font-inter">Delivery Address</h2>
//             </div>
//             <button
//               onClick={() => setActiveStep(1)}
//               className="text-white hover:text-gray-200 font-medium text-sm font-inter px-4 py-2 rounded-lg hover:bg-green-800 transition"
//             >
//               Change
//             </button>
//           </div>
//         </div>
//         <div className="p-6">
//           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//             <div className="text-sm text-gray-700 space-y-1.5 font-inter">
//               <p className="font-bold text-gray-900 text-base">{formData.firstName} {formData.lastName}</p>
//               <p>{formData.address}</p>
//               <p>{formData.city}, {formData.state} - {formData.pincode}</p>
//               <p className="flex items-center text-blue-600 font-semibold">
//                 <Phone className="w-4 h-4 mr-2" />
//                 {formData.phone}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Methods */}
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
//           <div className="flex items-center space-x-3">
//             <CreditCard className="w-6 h-6 text-white" />
//             <h2 className="text-xl font-bold text-white font-inter">Payment Method</h2>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* UPI */}
//           <label className="block cursor-pointer">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="upi"
//               checked={formData.paymentMethod === 'upi'}
//               onChange={handleInputChange}
//               className="peer hidden"
//             />
//             <div className="border-2 border-gray-200 rounded-xl p-5 peer-checked:border-purple-500 peer-checked:bg-purple-50 hover:border-gray-300 transition-all duration-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
//                     UPI
//                   </div>
//                   <div>
//                     <p className="font-bold text-gray-900 font-inter text-base">UPI Payment</p>
//                     <p className="text-sm text-gray-500 font-inter">Google Pay, PhonePe, Paytm & more</p>
//                   </div>
//                 </div>
//                 <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
//                   formData.paymentMethod === 'upi' 
//                     ? 'border-purple-500 bg-purple-500' 
//                     : 'border-gray-300'
//                 } flex items-center justify-center`}>
//                   {formData.paymentMethod === 'upi' && (
//                     <Check className="w-4 h-4 text-white" />
//                   )}
//                 </div>
//               </div>
              
//               {formData.paymentMethod === 'upi' && (
//                 <div className="mt-4 pl-16">
//                   <input
//                     type="text"
//                     name="upiId"
//                     value={formData.upiId}
//                     onChange={handleInputChange}
//                     placeholder="yourname@upi"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-inter"
//                   />
//                 </div>
//               )}
//             </div>
//           </label>

//           {/* Credit/Debit Card */}
//           <label className="block cursor-pointer">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="card"
//               checked={formData.paymentMethod === 'card'}
//               onChange={handleInputChange}
//               className="peer hidden"
//             />
//             <div className="border-2 border-gray-200 rounded-xl p-5 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 transition-all duration-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
//                     <CreditCard className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-gray-900 font-inter text-base">Credit / Debit Card</p>
//                     <p className="text-sm text-gray-500 font-inter">Visa, Mastercard, Amex, Rupay</p>
//                   </div>
//                 </div>
//                 <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
//                   formData.paymentMethod === 'card' 
//                     ? 'border-blue-500 bg-blue-500' 
//                     : 'border-gray-300'
//                 } flex items-center justify-center`}>
//                   {formData.paymentMethod === 'card' && (
//                     <Check className="w-4 h-4 text-white" />
//                   )}
//                 </div>
//               </div>
              
//               {formData.paymentMethod === 'card' && (
//                 <div className="mt-4 pl-16 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">Card Number</label>
//                     <input
//                       type="text"
//                       name="cardNumber"
//                       value={formData.cardNumber}
//                       onChange={handleInputChange}
//                       placeholder="1234 5678 9012 3456"
//                       maxLength="19"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-inter"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">Expiry Date</label>
//                       <input
//                         type="text"
//                         name="expiryDate"
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         placeholder="MM/YY"
//                         maxLength="5"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-inter"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">CVV</label>
//                       <input
//                         type="text"
//                         name="cvv"
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         placeholder="123"
//                         maxLength="3"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-inter"
//                       />
//                     </div>
//                   </div>
//                   <label className="flex items-center space-x-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="saveCard"
//                       checked={formData.saveCard}
//                       onChange={handleInputChange}
//                       className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-gray-700 font-inter">Save card for future payments</span>
//                   </label>
//                 </div>
//               )}
//             </div>
//           </label>

//           {/* Net Banking */}
//           <label className="block cursor-pointer">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="netbanking"
//               checked={formData.paymentMethod === 'netbanking'}
//               onChange={handleInputChange}
//               className="peer hidden"
//             />
//             <div className="border-2 border-gray-200 rounded-xl p-5 peer-checked:border-green-500 peer-checked:bg-green-50 hover:border-gray-300 transition-all duration-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
//                     NB
//                   </div>
//                   <div>
//                     <p className="font-bold text-gray-900 font-inter text-base">Net Banking</p>
//                     <p className="text-sm text-gray-500 font-inter">All Indian banks supported</p>
//                   </div>
//                 </div>
//                 <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
//                   formData.paymentMethod === 'netbanking' 
//                     ? 'border-green-500 bg-green-500' 
//                     : 'border-gray-300'
//                 } flex items-center justify-center`}>
//                   {formData.paymentMethod === 'netbanking' && (
//                     <Check className="w-4 h-4 text-white" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </label>

//           {/* Cash on Delivery */}
//           <label className="block cursor-pointer">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="cod"
//               checked={formData.paymentMethod === 'cod'}
//               onChange={handleInputChange}
//               className="peer hidden"
//             />
//             <div className="border-2 border-gray-200 rounded-xl p-5 peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:border-gray-300 transition-all duration-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
//                     <Package className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-gray-900 font-inter text-base">Cash on Delivery</p>
//                     <p className="text-sm text-gray-500 font-inter">Pay when you receive your order</p>
//                   </div>
//                 </div>
//                 <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
//                   formData.paymentMethod === 'cod' 
//                     ? 'border-orange-500 bg-orange-500' 
//                     : 'border-gray-300'
//                 } flex items-center justify-center`}>
//                   {formData.paymentMethod === 'cod' && (
//                     <Check className="w-4 h-4 text-white" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </label>
//         </div>

//         {/* Action Buttons */}
//         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={() => setActiveStep(1)}
//               className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-inter"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Delivery</span>
//             </button>
//             <button
//               onClick={handlePlaceOrder}
//               disabled={!validateStep() || isProcessing}
//               className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/30 font-inter disabled:cursor-not-allowed"
//             >
//               {isProcessing ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <>
//                   <Lock className="w-5 h-5" />
//                   <span>Pay ₹{total.toLocaleString()}</span>
//                 </>
//               )}
//             </button>
//           </div>
          
//           <p className="text-xs text-center text-gray-500 mt-4 font-inter">
//             By placing your order, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const OrderSummary = ({ products, subtotal, shipping, discount, tax, total, deliveryEstimate }) => {
//   const [isExpanded, setIsExpanded] = useState(true);

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-8">
//       <div 
//         className="p-6 border-b border-gray-200 cursor-pointer"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900 font-inter">Order Summary</h3>
//           <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
//         </div>
//       </div>

//       {isExpanded && (
//         <>
//           {/* Products */}
//           <div className="p-6 max-h-80 overflow-y-auto">
//             <div className="space-y-4">
//               {products.map((product) => (
//                 <div key={product.id} className="flex space-x-4">
//                   <div className="relative flex-shrink-0">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-16 h-16 object-cover rounded-lg"
//                     />
//                     <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
//                       {product.quantity}
//                     </div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h4 className="text-sm font-semibold text-gray-900 truncate font-inter">{product.name}</h4>
//                     <p className="text-xs text-gray-500 mt-1 font-inter">{product.variant}</p>
//                     <p className="text-sm font-bold text-gray-900 mt-2 font-inter">₹{(product.price * product.quantity).toLocaleString()}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pricing Breakdown */}
//           <div className="px-6 pb-6 space-y-3">
//             <div className="flex justify-between text-sm font-inter">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
//             </div>
            
//             {discount > 0 && (
//               <div className="flex justify-between text-sm font-inter">
//                 <span className="text-gray-600 flex items-center">
//                   <Gift className="w-4 h-4 mr-1 text-green-600" />
//                   Discount
//                 </span>
//                 <span className="font-medium text-green-600">-₹{discount.toLocaleString()}</span>
//               </div>
//             )}
            
//             <div className="flex justify-between text-sm font-inter">
//               <span className="text-gray-600">Tax (18% GST)</span>
//               <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
//             </div>
            
//             <div className="flex justify-between text-sm font-inter">
//               <span className="text-gray-600">Shipping</span>
//               <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                 {shipping === 0 ? 'FREE' : `₹${shipping}`}
//               </span>
//             </div>

//             {deliveryEstimate && (
//               <div className="bg-blue-50 rounded-lg p-3 mt-4">
//                 <div className="flex items-center space-x-2 text-sm text-blue-800 font-inter">
//                   <Clock className="w-4 h-4" />
//                   <span>Delivery: {deliveryEstimate.date}</span>
//                 </div>
//               </div>
//             )}

//             <div className="border-t border-gray-200 pt-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-base font-bold text-gray-900 font-inter">Total Amount</span>
//                 <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-inter">
//                   ₹{total.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {shipping === 0 && (
//               <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
//                 <p className="text-xs text-green-700 font-medium font-inter text-center">
//                   🎉 You saved ₹{(discount + shipping).toLocaleString()} on this order
//                 </p>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };