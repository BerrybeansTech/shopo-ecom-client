// components/Checkout/Checkout.js
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Plus, CreditCard, Wallet, Smartphone, Package, Shield, Clock, Edit2, Trash2, Check, Truck, Home, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductImage } from '../../utils/imageUtils';
import Layout from '../Partials/Layout';
import ThankYouPopup from './ThankYouPopup';
import { ordersApi } from './ordersApi';
import { useCart } from '../CartPage/useCart';
import { useAuth } from '../Auth/hooks/useAuth';
import { addressApi } from '../Auth/addressApi';
import { colorApi, sizeApi } from '../AllProductPage/productApi';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showAddBillingAddress, setShowAddBillingAddress] = useState(false);
  const [showAddShippingAddress, setShowAddShippingAddress] = useState(false);
  const [newBillingAddress, setNewBillingAddress] = useState({
    name: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    type: 'billing'
  });
  const [newShippingAddress, setNewShippingAddress] = useState({
    name: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    type: 'shipping'
  });
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [allSizes, setAllSizes] = useState([]);

  const { 
    items: cartItems, 
    subtotal, 
    discount, 
    total, 
    clearCartAfterSuccessfulOrder,
    formatINR,
    isAuthenticated 
  } = useCart();
  
  const { user, accessToken } = useAuth();

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      setIsUpdatingAddress(true);
      const response = await addressApi.getAllAddresses();
      
      if (response.success && response.data) {
        setSavedAddresses(response.data);
        
        // Set default addresses if not already set
        if (!selectedBillingAddress && response.data.length > 0) {
          // Select first address as default billing
          setSelectedBillingAddress(response.data[0].id);
        }
        
        if (!selectedShippingAddress && response.data.length > 0 && !useSameAddress) {
          // Select first address as default shipping if not using same as billing
          setSelectedShippingAddress(response.data[0].id);
        }
      } else {
        setSavedAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setApiError('Failed to load addresses. Please try again.');
      setSavedAddresses([]);
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
      
      // Fetch variations
      const fetchVariations = async () => {
        try {
          const [colorRes, sizeRes] = await Promise.all([
            colorApi.getAll(),
            sizeApi.getAll()
          ]);
          if (colorRes.success) setAllColors(colorRes.data);
          if (sizeRes.success) setAllSizes(sizeRes.data);
        } catch (error) {
          console.error('Error fetching color/size variations:', error);
        }
      };
      fetchVariations();
      
      // Pre-fill new address forms with user data
      setNewBillingAddress(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || ''
      }));
      
      setNewShippingAddress(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const getColorName = (id) => {
    if (!id) return '';
    const color = allColors.find(c => c.id === parseInt(id));
    return color ? color.color : id;
  };

  const getSizeName = (id) => {
    if (!id) return '';
    const size = allSizes.find(s => s.id === parseInt(id));
    return size ? (Array.isArray(size.size) ? size.size[0] : size.size) : id;
  };

  // Auto-update shipping address when useSameAddress is true
  useEffect(() => {
    if (useSameAddress && selectedBillingAddress) {
      setSelectedShippingAddress(selectedBillingAddress);
    }
  }, [useSameAddress, selectedBillingAddress]);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, subtitle: 'Google Pay, PhonePe, Paytm & more' },
    { id: 'card', name: 'Cards', icon: CreditCard, subtitle: 'Credit/Debit cards, EMI available' },
    { id: 'wallet', name: 'Wallets', icon: Wallet, subtitle: 'Paytm, Amazon Pay, Mobikwik' },
    { id: 'bnpl', name: 'Pay Later', icon: Clock, subtitle: 'Simpl, LazyPay, ICICI PayLater' },
    { id: 'cod', name: 'Cash on Delivery', icon: Package, subtitle: '₹50 handling fee' }
  ];

  const shipping = subtotal >= 999 ? 0 : 80;
  const codFee = selectedPayment === 'cod' ? 50 : 0;
  const couponDiscount = appliedCoupon ? 200 : 0;
  const finalTotal = subtotal + shipping + codFee - couponDiscount;

  const formatCartItemsForAPI = () => {
    return cartItems.map(item => ({
      productId: item.productId || item.id,
      productName: item.product?.name || item.name,
      quantity: item.quantity,
      unitPrice: item.product?.sellingPrice || item.price,
      totalPrice: (item.product?.sellingPrice || item.price) * item.quantity,
      productColorId: item.productColorVariationId || null,
      productSizeId: item.productSizeVariationId || null
    }));
  };

  const handleNewAddressChange = (type, field, value) => {
    if (type === 'billing') {
      setNewBillingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setNewShippingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveNewAddress = async (type) => {
    const newAddress = type === 'billing' ? newBillingAddress : newShippingAddress;
    
    if (!newAddress.pincode || !newAddress.fullName || !newAddress.phone || 
        !newAddress.address || !newAddress.city || !newAddress.state) {
      setApiError('Please fill all required fields');
      return;
    }

    if (!/^\d{10}$/.test(newAddress.phone)) {
      setApiError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!/^\d{6}$/.test(newAddress.pincode)) {
      setApiError('Please enter a valid 6-digit pincode');
      return;
    }

    setIsUpdatingAddress(true);
    setApiError(null);

    try {
      // For billing addresses, save to database via API
      if (type === 'billing') {
        const createData = {
          customerId: user.id,
          address: newAddress.address,
          city: newAddress.city,
          state: newAddress.state,
          country: newAddress.country,
          postalCode: newAddress.pincode
        };
        
        const response = await addressApi.createAddress(createData);
        
        if (response.success) {
          // Refresh addresses from API
          await fetchAddresses();
          
          // Select the newly created address
          if (response.data && response.data.id) {
            setSelectedBillingAddress(response.data.id);
          }
          
          // Reset form
          setNewBillingAddress({
            name: '',
            fullName: user.name || '',
            phone: user.phone || '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            type: 'billing'
          });
          setShowAddBillingAddress(false);
          setApiError(null);
        } else {
          setApiError(response.message || 'Failed to save address');
        }
      } else {
        // For shipping addresses, keep as temporary (not saved to database)
        // Create a temporary address object
        const tempShippingId = `temp_shipping_${Date.now()}`;
        const tempShippingAddress = {
          id: tempShippingId,
          name: newAddress.name || 'Shipping Address',
          fullName: newAddress.fullName,
          phone: newAddress.phone,
          address: newAddress.address,
          city: newAddress.city,
          state: newAddress.state,
          postalCode: newAddress.pincode,
          country: newAddress.country,
          isTemporary: true
        };
        
        // Add to local state only (not saved to database)
        setSavedAddresses(prev => [...prev, tempShippingAddress]);
        setSelectedShippingAddress(tempShippingId);
        
        // Reset form
        setNewShippingAddress({
          name: '',
          fullName: user.name || '',
          phone: user.phone || '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          type: 'shipping'
        });
        setShowAddShippingAddress(false);
        setApiError(null);
      }
    } catch (error) {
      console.error('Save address error:', error);
      setApiError(error.message || 'Failed to save address. Please try again.');
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setIsUpdatingAddress(true);
    setApiError(null);

    try {
      const addressToDelete = savedAddresses.find(addr => addr.id === addressId);
      
      // Check if it's a temporary shipping address
      if (addressToDelete?.isTemporary) {
        // Just remove from local state
        setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
        
        if (selectedShippingAddress === addressId) {
          setSelectedShippingAddress(null);
        }
      } else {
        // Delete from database via API
        const response = await addressApi.deleteAddress(addressId);
        
        if (response.success) {
          // Refresh addresses from API
          await fetchAddresses();
          
          // Clear selection if deleted address was selected
          if (selectedBillingAddress === addressId) {
            setSelectedBillingAddress(null);
          }
          if (selectedShippingAddress === addressId) {
            setSelectedShippingAddress(null);
          }
        } else {
          setApiError(response.message || 'Failed to delete address');
        }
      }
    } catch (error) {
      console.error('Delete address error:', error);
      setApiError(error.message || 'Failed to delete address. Please try again.');
    } finally {
      setIsUpdatingAddress(false);
    }
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

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      setApiError('Please login to place order');
      return;
    }

    if (cartItems.length === 0) {
      setApiError('Your cart is empty');
      return;
    }

    const billingAddressData = savedAddresses.find(addr => addr.id === selectedBillingAddress);
    const shippingAddressData = useSameAddress ? billingAddressData : savedAddresses.find(addr => addr.id === selectedShippingAddress);
    
    if (!billingAddressData) {
      setApiError('Please select a billing address');
      return;
    }

    if (!selectedPayment) {
      setApiError('Please select a payment method');
      return;
    }

    setIsPlacingOrder(true);
    setApiError(null);

    try {
      // Format addresses for order API
      const formatAddressForOrder = (addr) => {
        const customerName = addr.customer?.name || addr.fullName || user.name;
        const postalCode = addr.postalCode || addr.pincode;
        return `${customerName}, ${addr.address}, ${addr.city}, ${addr.state} - ${postalCode}`;
      };

      const orderData = {
        customerId: user.id,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        billingAddress: formatAddressForOrder(billingAddressData),
        shippingAddress: formatAddressForOrder(shippingAddressData),
        subTotal: subtotal,
        tax: Math.round(subtotal * 0.18),
        shippingCharge: shipping,
        totalAmount: finalTotal,
        finalAmount: finalTotal,
        paymentMethod: selectedPayment.toUpperCase(),
        orderNote: 'Urgent delivery',
        productItems: formatCartItemsForAPI()
      };

      const response = await ordersApi.createOrder(orderData);

      if (response.success) {
        await clearCartAfterSuccessfulOrder();

        const orderDetailsData = {
          orderId: response.data.id,
          items: cartItems.map(item => ({
            ...item,
            colorName: getColorName(item.productColorVariationId),
            sizeName: getSizeName(item.productSizeVariationId)
          })),
          billingAddress: billingAddressData,
          shippingAddress: shippingAddressData,
          paymentMethod: selectedPayment,
          totalAmount: finalTotal,
          savings: discount + couponDiscount,
          apiResponse: response.data,
          useSameAddress: useSameAddress
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

  const getAddressesByType = (type) => {
    return savedAddresses.filter(addr => addr.type === type);
  };

  const isContinueToPaymentDisabled = !selectedBillingAddress || (useSameAddress ? false : !selectedShippingAddress);
  const isContinueToReviewDisabled = !selectedPayment;
  const isPlaceOrderDisabled = !selectedBillingAddress || (useSameAddress ? false : !selectedShippingAddress) || 
                               !selectedPayment || isPlacingOrder || cartItems.length === 0;

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

        {isUpdatingAddress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Updating addresses...</p>
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
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Billing & Shipping Address */}
              {step >= 1 && (
                <div className="space-y-6">
                  {/* Billing Address */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
                          <Home className="w-5 h-5 mr-2 text-black" />
                          Billing Address
                        </h2>
                        {step > 1 && selectedBillingAddress && (
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
                          {savedAddresses.filter(addr => !addr.isTemporary).map(addr => (
                            <div
                              key={addr.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedBillingAddress === addr.id
                                  ? 'border-black bg-gray-50'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div 
                                  className="flex-1"
                                  onClick={() => setSelectedBillingAddress(addr.id)}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="font-semibold text-black">
                                      {addr.customer?.name || user.name}'s Address
                                    </span>
                                  </div>
                                  <p className="text-sm text-black font-medium">{addr.customer?.name || user.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postalCode || addr.pincode}</p>
                                  <p className="text-sm text-gray-600 mt-1">Mobile: {addr.customer?.email || user.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteAddress(addr.id);
                                    }}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                    title="Delete address"
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => setShowAddBillingAddress(!showAddBillingAddress)}
                            className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-black rounded-lg text-gray-600 hover:text-black transition-all flex items-center justify-center space-x-2"
                          >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add New Billing Address</span>
                          </button>

                          {showAddBillingAddress && (
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                              <h4 className="font-semibold text-black">Add Billing Address</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  placeholder="Address Name (e.g., Home, Office)"
                                  value={newBillingAddress.name}
                                  onChange={(e) => handleNewAddressChange('billing', 'name', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="Pincode *"
                                  value={newBillingAddress.pincode}
                                  onChange={(e) => handleNewAddressChange('billing', 'pincode', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                                  maxLength="6"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input 
                                  type="text" 
                                  placeholder="Full Name *" 
                                  value={newBillingAddress.fullName}
                                  onChange={(e) => handleNewAddressChange('billing', 'fullName', e.target.value)}
                                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                />
                                <input 
                                  type="text" 
                                  placeholder="Mobile *" 
                                  value={newBillingAddress.phone}
                                  onChange={(e) => handleNewAddressChange('billing', 'phone', e.target.value)}
                                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                  maxLength="10"
                                />
                              </div>
                              <input 
                                type="text" 
                                placeholder="Address (House No, Building, Street) *" 
                                value={newBillingAddress.address}
                                onChange={(e) => handleNewAddressChange('billing', 'address', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input 
                                  type="text" 
                                  placeholder="City *" 
                                  value={newBillingAddress.city}
                                  onChange={(e) => handleNewAddressChange('billing', 'city', e.target.value)}
                                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                />
                                <input 
                                  type="text" 
                                  placeholder="State *" 
                                  value={newBillingAddress.state}
                                  onChange={(e) => handleNewAddressChange('billing', 'state', e.target.value)}
                                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                />
                              </div>
                              <div className="flex space-x-3">
                                <button 
                                  onClick={() => handleSaveNewAddress('billing')}
                                  disabled={isUpdatingAddress}
                                  className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
                                    isUpdatingAddress
                                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      : 'bg-black hover:bg-gray-800 text-white'
                                  }`}
                                >
                                  {isUpdatingAddress ? 'Saving...' : 'Save Billing Address'}
                                </button>
                                <button 
                                  onClick={() => setShowAddBillingAddress(false)}
                                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          {savedAddresses.find(a => a.id === selectedBillingAddress) && (() => {
                            const addr = savedAddresses.find(a => a.id === selectedBillingAddress);
                            return (
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold text-black">
                                    {addr.customer?.name || addr.fullName || 'Billing'}
                                  </span>
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Billing</span>
                                </div>
                                <p className="text-sm font-medium text-black">
                                  {addr.customer?.name || addr.fullName || user.name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {addr.address}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {addr.city}, {addr.state} - {addr.postalCode || addr.pincode}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Mobile: {addr.customer?.phone || addr.phone || user.phone}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold text-black flex items-center">
                          <Truck className="w-5 h-5 mr-2 text-black" />
                          Shipping Address
                        </h2>
                        {step > 1 && selectedShippingAddress && (
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
                          {/* Same as Billing Address Toggle */}
                          <div className="flex items-center space-x-2 mb-4">
                            <input
                              type="checkbox"
                              id="sameAddress"
                              checked={useSameAddress}
                              onChange={(e) => setUseSameAddress(e.target.checked)}
                              className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="sameAddress" className="text-sm font-medium text-gray-700">
                              Same as billing address
                            </label>
                          </div>

                          {useSameAddress ? (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2 text-green-700">
                                <Check className="w-4 h-4" />
                                <span className="text-sm font-medium">Shipping address same as billing address</span>
                              </div>
                              <p className="text-xs text-green-600 mt-1">
                                Your order will be shipped to your billing address
                              </p>
                            </div>
                          ) : (
                            <>
                              {savedAddresses.map(addr => (
                                <div
                                  key={addr.id}
                                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedShippingAddress === addr.id
                                      ? 'border-black bg-gray-50'
                                      : 'border-gray-200 hover:border-gray-400'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div 
                                      className="flex-1"
                                      onClick={() => setSelectedShippingAddress(addr.id)}
                                    >
                                      <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-semibold text-black">
                                          {addr.customer?.name || addr.fullName || user.name}'s Address
                                        </span>
                                        {addr.isTemporary && (
                                          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">Temporary</span>
                                        )}
                                      </div>
                                      <p className="text-sm text-black font-medium">{addr.customer?.name || addr.fullName || user.name}</p>
                                      <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postalCode || addr.pincode}</p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {addr.isTemporary ? `Mobile: ${addr.phone}` : `Email: ${addr.customer?.email || user.email}`}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAddress(addr.id);
                                        }}
                                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        title="Delete address"
                                      >
                                        <Trash2 className="w-4 h-4 text-gray-600" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <button
                                onClick={() => setShowAddShippingAddress(!showAddShippingAddress)}
                                className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-black rounded-lg text-gray-600 hover:text-black transition-all flex items-center justify-center space-x-2"
                              >
                                <Plus className="w-5 h-5" />
                                <span className="font-medium">Add New Shipping Address</span>
                              </button>

                              {showAddShippingAddress && (
                                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                  <h4 className="font-semibold text-black">Add Shipping Address</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      placeholder="Address Name (e.g., Home, Office)"
                                      value={newShippingAddress.name}
                                      onChange={(e) => handleNewAddressChange('shipping', 'name', e.target.value)}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Pincode *"
                                      value={newShippingAddress.pincode}
                                      onChange={(e) => handleNewAddressChange('shipping', 'pincode', e.target.value)}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                                      maxLength="6"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input 
                                      type="text" 
                                      placeholder="Full Name *" 
                                      value={newShippingAddress.fullName}
                                      onChange={(e) => handleNewAddressChange('shipping', 'fullName', e.target.value)}
                                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="Mobile *" 
                                      value={newShippingAddress.phone}
                                      onChange={(e) => handleNewAddressChange('shipping', 'phone', e.target.value)}
                                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                      maxLength="10"
                                    />
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="Address (House No, Building, Street) *" 
                                    value={newShippingAddress.address}
                                    onChange={(e) => handleNewAddressChange('shipping', 'address', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                  />
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input 
                                      type="text" 
                                      placeholder="City *" 
                                      value={newShippingAddress.city}
                                      onChange={(e) => handleNewAddressChange('shipping', 'city', e.target.value)}
                                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="State *" 
                                      value={newShippingAddress.state}
                                      onChange={(e) => handleNewAddressChange('shipping', 'state', e.target.value)}
                                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" 
                                    />
                                  </div>
                                  <div className="flex space-x-3">
                                    <button 
                                      onClick={() => handleSaveNewAddress('shipping')}
                                      disabled={isUpdatingAddress}
                                      className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
                                        isUpdatingAddress
                                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                          : 'bg-black hover:bg-gray-800 text-white'
                                      }`}
                                    >
                                      {isUpdatingAddress ? 'Saving...' : 'Save Shipping Address'}
                                    </button>
                                    <button 
                                      onClick={() => setShowAddShippingAddress(false)}
                                      className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          {useSameAddress ? (
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold text-black">Same as Billing Address</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded flex items-center">
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copied from Billing
                                </span>
                              </div>
                              {savedAddresses.find(a => a.id === selectedBillingAddress) && (() => {
                                const addr = savedAddresses.find(a => a.id === selectedBillingAddress);
                                return (
                                  <div>
                                    <p className="text-sm font-medium text-black">
                                      {addr.customer?.name || addr.fullName || user.name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {addr.address}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {addr.city}, {addr.state} - {addr.postalCode || addr.pincode}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Mobile: {addr.customer?.phone || addr.phone || user.phone}
                                    </p>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : savedAddresses.find(a => a.id === selectedShippingAddress) && (() => {
                            const addr = savedAddresses.find(a => a.id === selectedShippingAddress);
                            return (
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold text-black">
                                    {addr.customer?.name || addr.fullName || user.name}
                                  </span>
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                    {addr.isTemporary ? 'Temporary Shipping' : 'Shipping'}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-black">
                                  {addr.customer?.name || addr.fullName || user.name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {addr.address}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {addr.city}, {addr.state} - {addr.postalCode || addr.pincode}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Mobile: {addr.isTemporary ? addr.phone : (addr.customer?.phone || addr.phone || user.phone)}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={isContinueToPaymentDisabled}
                    className={`w-full py-3 sm:py-4 font-semibold rounded-lg transition-all text-sm sm:text-base ${
                      isContinueToPaymentDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    Continue to Payment
                  </button>
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

                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Addresses Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-black mb-2 flex items-center">
                          <Home className="w-4 h-4 mr-2" />
                          Billing Address
                        </h3>
                        {savedAddresses.find(a => a.id === selectedBillingAddress) && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium text-black">{savedAddresses.find(a => a.id === selectedBillingAddress).fullName}</p>
                            <p>{savedAddresses.find(a => a.id === selectedBillingAddress).address}</p>
                            <p>{savedAddresses.find(a => a.id === selectedBillingAddress).city}, {savedAddresses.find(a => a.id === selectedBillingAddress).state} - {savedAddresses.find(a => a.id === selectedBillingAddress).pincode}</p>
                            <p>Mobile: {savedAddresses.find(a => a.id === selectedBillingAddress).phone}</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-black mb-2 flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Shipping Address
                        </h3>
                        {useSameAddress ? (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center">
                                <Copy className="w-3 h-3 mr-1" />
                                Same as Billing Address
                              </span>
                            </div>
                            <p className="font-medium text-black">{savedAddresses.find(a => a.id === selectedBillingAddress)?.fullName}</p>
                            <p>{savedAddresses.find(a => a.id === selectedBillingAddress)?.address}</p>
                            <p>{savedAddresses.find(a => a.id === selectedBillingAddress)?.city}, {savedAddresses.find(a => a.id === selectedBillingAddress)?.state} - {savedAddresses.find(a => a.id === selectedBillingAddress)?.pincode}</p>
                            <p>Mobile: {savedAddresses.find(a => a.id === selectedBillingAddress)?.phone}</p>
                          </div>
                        ) : savedAddresses.find(a => a.id === selectedShippingAddress) && (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium text-black">{savedAddresses.find(a => a.id === selectedShippingAddress).fullName}</p>
                            <p>{savedAddresses.find(a => a.id === selectedShippingAddress).address}</p>
                            <p>{savedAddresses.find(a => a.id === selectedShippingAddress).city}, {savedAddresses.find(a => a.id === selectedShippingAddress).state} - {savedAddresses.find(a => a.id === selectedShippingAddress).pincode}</p>
                            <p>Mobile: {savedAddresses.find(a => a.id === selectedShippingAddress).phone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 p-3 bg-gray-100 rounded-lg">
                      <Clock className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black">Estimated Delivery</p>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                      </div>
                    </div>
                    {cartItems.map(item => {
                      const product = item.product || {};
                      const sellingPrice = product.sellingPrice || item.price || 0;
                      const mrp = product.mrp || sellingPrice;

                      return (
                        <div key={item.id} className="flex space-x-3 pb-4 border-b border-gray-200 last:border-0">
                          <img 
                            src={getProductImage(product)} 
                            alt={product?.name || "Product"}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200" 
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-black">
                              {product?.name || "Product"}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.productColorVariationId ? `Color: ${getColorName(item.productColorVariationId)}` : ''} 
                              {item.productColorVariationId && item.productSizeVariationId ? ' | ' : ''}
                              {item.productSizeVariationId ? `Size: ${getSizeName(item.productSizeVariationId)}` : ''}
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