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

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
  const [billingSuggestions, setBillingSuggestions] = useState([]);
  const [shippingSuggestions, setShippingSuggestions] = useState([]);
  const [billingErrors, setBillingErrors] = useState({});
  const [shippingErrors, setShippingErrors] = useState({});
  const [selectedExistingBillingAddress, setSelectedExistingBillingAddress] = useState(null);
  const [selectedExistingShippingAddress, setSelectedExistingShippingAddress] = useState(null);

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
          const defaultAddr = response.data.find(addr => addr.isDefault);
          setSelectedBillingAddress(defaultAddr ? defaultAddr.id : response.data[0].id);
        }

        if (!selectedShippingAddress && response.data.length > 0 && !useSameAddress) {
          const defaultAddr = response.data.find(addr => addr.isDefault);
          setSelectedShippingAddress(defaultAddr ? defaultAddr.id : response.data[0].id);
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

  const currentShippingAddress = useSameAddress 
    ? savedAddresses.find(addr => addr.id === selectedBillingAddress)
    : savedAddresses.find(addr => addr.id === selectedShippingAddress);
  
  const isKarnataka = currentShippingAddress?.state?.toLowerCase().trim() === "karnataka";

  const tax = cartItems.reduce((sum, item) => {
    const itemGst = item.product?.gst || 0;
    const itemPrice = item.product?.sellingPrice || item.price || 0;
    return sum + Math.round((itemPrice * item.quantity * itemGst) / 100);
  }, 0);

  const shipping = subtotal >= 999 ? 0 : 80;
  const codFee = selectedPayment === 'cod' ? 50 : 0;
  const couponDiscount = appliedCoupon
    ? (appliedCoupon.type === 'percent'
        ? Math.round((subtotal * appliedCoupon.value) / 100)
        : appliedCoupon.value)
    : 0;
  const finalTotal = Math.max(0, subtotal + tax + shipping + codFee - couponDiscount);

  const formatCartItemsForAPI = () => {
    return cartItems.map(item => ({
      productId: item.productId || item.id,
      productName: item.product?.name || item.name,
      quantity: item.quantity,
      unitPrice: item.product?.sellingPrice || item.price,
      totalPrice: (item.product?.sellingPrice || item.price) * item.quantity,
      gst: item.product?.gst || 0,
      productColorId: item.productColorVariationId || null,
      productSizeId: item.productSizeVariationId || null
    }));
  };

  const handleNewAddressChange = (type, field, value) => {
    let newValue = value;
    if (field === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }
    if (field === 'pincode') {
      newValue = value.replace(/\D/g, '').slice(0, 6);
    }

    if (type === 'billing') {
      const updated = { ...newBillingAddress, [field]: newValue };
      setNewBillingAddress(updated);
      setSelectedExistingBillingAddress(null); // Clear selected if anything changes
      
      // Clear error for this field when user starts typing
      if (billingErrors[field]) {
        setBillingErrors(prev => {
          const newErrs = { ...prev };
          delete newErrs[field];
          return newErrs;
        });
      }

      // Update suggestions
      if (['name', 'fullName', 'address'].includes(field)) {
        if (value.length >= 2) {
          const suggestions = savedAddresses.filter(addr =>
            (addr.name && addr.name.toLowerCase().includes(value.toLowerCase())) ||
            (addr.fullName && addr.fullName.toLowerCase().includes(value.toLowerCase())) ||
            (addr.address && addr.address.toLowerCase().includes(value.toLowerCase()))
          );
          setBillingSuggestions(suggestions);
        } else {
          setBillingSuggestions([]);
        }
      }
    } else {
      const updated = { ...newShippingAddress, [field]: newValue };
      setNewShippingAddress(updated);
      setSelectedExistingShippingAddress(null); // Clear selected if anything changes

      // Clear error for this field when user starts typing
      if (shippingErrors[field]) {
        setShippingErrors(prev => {
          const newErrs = { ...prev };
          delete newErrs[field];
          return newErrs;
        });
      }

      // Update suggestions
      if (['name', 'fullName', 'address'].includes(field)) {
        if (value.length >= 2) {
          const suggestions = savedAddresses.filter(addr =>
            (addr.name && addr.name.toLowerCase().includes(value.toLowerCase())) ||
            (addr.fullName && addr.fullName.toLowerCase().includes(value.toLowerCase())) ||
            (addr.address && addr.address.toLowerCase().includes(value.toLowerCase()))
          );
          setShippingSuggestions(suggestions);
        } else {
          setShippingSuggestions([]);
        }
      }
    }
  };

  const validateAddress = (type) => {
    const address = type === 'billing' ? newBillingAddress : newShippingAddress;
    const errors = {};

    if (!address.fullName || address.fullName.trim().length < 3) {
      errors.fullName = 'Full Name is required (min 3 characters)';
    }
    
    if (!address.phone) {
      errors.phone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(address.phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!address.address || address.address.trim().length < 5) {
      errors.address = 'Detailed address is required';
    }

    if (!address.city || address.city.trim() === '') {
      errors.city = 'City is required';
    }

    if (!address.state || address.state.trim() === '') {
      errors.state = 'State is required';
    }

    if (!address.pincode) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(address.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (type === 'billing') {
      setBillingErrors(errors);
    } else {
      setShippingErrors(errors);
    }

    return Object.keys(errors).length === 0;
  };

  const handleSelectSuggestion = (type, addr) => {
    if (type === 'billing') {
      setNewBillingAddress({
        name: addr.name || '',
        fullName: addr.fullName || addr.customer?.name || '',
        phone: addr.phone || addr.customer?.phone || '',
        address: addr.address || '',
        city: addr.city || '',
        state: addr.state || '',
        pincode: addr.postalCode || addr.pincode || '',
        country: addr.country || 'India',
        type: 'billing'
      });
      setSelectedExistingBillingAddress(addr);
      setBillingSuggestions([]);
      setBillingErrors({});
    } else {
      setNewShippingAddress({
        name: addr.name || '',
        fullName: addr.fullName || addr.customer?.name || '',
        phone: addr.phone || addr.customer?.phone || '',
        address: addr.address || '',
        city: addr.city || '',
        state: addr.state || '',
        pincode: addr.postalCode || addr.pincode || '',
        country: addr.country || 'India',
        type: 'shipping'
      });
      setSelectedExistingShippingAddress(addr);
      setShippingSuggestions([]);
      setShippingErrors({});
    }
  };

  const handleContinueWithExisting = async (type) => {
    const existingAddr = type === 'billing' ? selectedExistingBillingAddress : selectedExistingShippingAddress;
    if (!existingAddr) return;

    setIsUpdatingAddress(true);
    try {
      // Set as default so it appears in single-address view
      await addressApi.setDefaultAddress({
        ...existingAddr,
        isDefault: true
      });
      await fetchAddresses();

      if (type === 'billing') {
        setSelectedBillingAddress(existingAddr.id);
        setShowAddBillingAddress(false);
        setSelectedExistingBillingAddress(null);
      } else {
        setSelectedShippingAddress(existingAddr.id);
        setShowAddShippingAddress(false);
        setUseSameAddress(false);
        setSelectedExistingShippingAddress(null);
      }
    } catch (error) {
      console.error('Failed to select existing address:', error);
      setApiError('Failed to select the existing address.');
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleSaveNewAddress = async (type) => {
    if (!validateAddress(type)) {
      setApiError('Please fix the errors in the form');
      return;
    }

    const newAddress = type === 'billing' ? newBillingAddress : newShippingAddress;

    // Problem 1: Duplicate address check
    const duplicate = savedAddresses.find(addr =>
      addr.address.toLowerCase().trim() === newAddress.address.toLowerCase().trim() &&
      addr.city.toLowerCase().trim() === newAddress.city.toLowerCase().trim() &&
      addr.state.toLowerCase().trim() === newAddress.state.toLowerCase().trim() &&
      (addr.postalCode || addr.pincode) === newAddress.pincode
    );

    if (duplicate) {
      if (window.confirm('This address already exists. Would you like to use it?')) {
        try {
          setIsUpdatingAddress(true);
          // Set as default so it appears in the single-address view
          await addressApi.setDefaultAddress({
            ...duplicate,
            isDefault: true
          });
          await fetchAddresses();

          if (type === 'billing') {
            setSelectedBillingAddress(duplicate.id);
            setShowAddBillingAddress(false);
          } else {
            setSelectedShippingAddress(duplicate.id);
            setShowAddShippingAddress(false);
            setUseSameAddress(false);
          }
        } catch (error) {
          console.error('Failed to set existing address as default:', error);
          setApiError('Failed to select the existing address.');
        } finally {
          setIsUpdatingAddress(false);
        }
        return;
      }
    }

    setIsUpdatingAddress(true);
    setApiError(null);

    try {
      // Both billing and shipping addresses should be saved to database
      const createData = {
        customerId: user.id,
        name: newAddress.fullName,
        phone: newAddress.phone,
        address: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        country: newAddress.country,
        postalCode: newAddress.pincode,
        isDefault: true // Always set as default as we only display default address
      };

      const response = await addressApi.createAddress(createData);

      if (response.success) {
        // If it's successful, set it as default via a separate update call
        if (response.data && response.data.id) {
          try {
            await addressApi.setDefaultAddress({
              ...response.data,
              isDefault: true
            });
          } catch (e) {
            console.error('Failed to set as default:', e);
          }
        }

        // Refresh addresses from API
        await fetchAddresses();

        // Select the newly created address
        if (response.data && response.data.id) {
          if (type === 'billing') {
            setSelectedBillingAddress(response.data.id);
            // Reset billing form
            setNewBillingAddress(prev => ({
              ...prev,
              name: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
            }));
            setShowAddBillingAddress(false);
          } else {
            setSelectedShippingAddress(response.data.id);
            setUseSameAddress(false);
            // Reset shipping form
            setNewShippingAddress(prev => ({
              ...prev,
              name: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
            }));
            setShowAddShippingAddress(false);
          }
        }
        setApiError(null);
      } else {
        setApiError(response.message || `Failed to save ${type} address`);
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
    } catch (error) {
      console.error('Delete address error:', error);
      setApiError(error.message || 'Failed to delete address. Please try again.');
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApiError(null);
    try {
      const response = await ordersApi.validateCoupon(couponCode, subtotal);
      if (response.success && response.coupon) {
        setAppliedCoupon(response.coupon);
        setShowCoupon(false);
        setCouponCode('');
      } else {
        setApiError(response.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Apply coupon error:', error);
      setApiError(error.response?.data?.message || error.message || 'Failed to apply coupon. Please try again.');
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

    if (!billingAddressData) {
      setApiError('Please select a billing address');
      return;
    }

    const shippingAddressData = useSameAddress ? billingAddressData : savedAddresses.find(addr => addr.id === selectedShippingAddress);

    if (!shippingAddressData) {
      setApiError('Please select a shipping address');
      return;
    }

    if (!billingAddressData.phone) {
      setApiError('Billing address is missing a mobile number. Please edit or add a phone number before placing the order.');
      return;
    }

    if (!shippingAddressData.phone) {
      setApiError('Shipping address is missing a mobile number. Please edit or add a phone number before placing the order.');
      return;
    }

    if (!selectedPayment) {
      setApiError('Please select a payment method');
      return;
    }

    setIsPlacingOrder(true);
    setApiError(null);

    const formatAddressForOrder = (addr) => {
      const customerName = addr.name || addr.customer?.name || addr.fullName || user.name;
      const postalCode = addr.postalCode || addr.pincode;
      return `${customerName}, ${addr.address}, ${addr.city}, ${addr.state} - ${postalCode}`;
    };

    const submitOrder = async (extraPaymentFields = {}, isRazorpayPending = false) => {
      const orderData = {
        customerId: user.id,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        billingAddress: formatAddressForOrder(billingAddressData),
        shippingAddress: formatAddressForOrder(shippingAddressData),
        shippingState: shippingAddressData.state,
        subTotal: subtotal,
        tax: tax,
        shippingCharge: shipping,
        totalAmount: finalTotal,
        finalAmount: finalTotal,
        paymentMethod: selectedPayment.toUpperCase(),
        orderNote: 'Urgent delivery',
        productItems: formatCartItemsForAPI(),
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        couponDiscount: couponDiscount,
        ...extraPaymentFields
      };

      const response = await ordersApi.createOrder(orderData);
      if (!response.success) throw new Error(response.message || 'Failed to create order');

      if (isRazorpayPending) {
        return response.data;
      }

      await clearCartAfterSuccessfulOrder();

      setOrderDetails({
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
      });
      setShowThankYou(true);

      return response.data;
    };

    try {
      // COD: skip Razorpay, place order directly
      if (selectedPayment === 'cod') {
        await submitOrder();
        return;
      }

      // Online payment: go through Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway. Please check your connection.');
      }

      // Step 1: Create the internal order in pending state FIRST!
      const createdOrder = await submitOrder({}, true);
      const internalOrderId = createdOrder.id;

      // Step 2: Create the Razorpay Order linked to the internal Order ID!
      const rzpOrderRes = await ordersApi.createRazorpayOrder({
        amount: finalTotal * 100, // paise
        currency: 'INR',
        orderId: internalOrderId // Linked to our newly saved order ID!
      });

      if (!rzpOrderRes.success) {
        throw new Error(rzpOrderRes.message || 'Failed to initiate payment');
      }

      const { razorpay_order_id, amount, currency, key_id } = rzpOrderRes.data;

      const options = {
        key: key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: razorpay_order_id,
        name: 'Shopo',
        description: 'Order Payment',
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: { color: '#000000' },
        handler: async (paymentResponse) => {
          try {
            // Step 3: Verify payment signature and pass both the Razorpay details and the internal Order ID
            const verifyRes = await ordersApi.verifyPayment({
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              orderId: internalOrderId
            });

            if (!verifyRes.success) {
              throw new Error(verifyRes.message || 'Payment verification failed');
            }

            // Step 4: Verification succeeded and backend triggered Shiprocket!
            // Clean up cart, update state to show thank you screen
            await clearCartAfterSuccessfulOrder();

            setOrderDetails({
              orderId: internalOrderId,
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
              apiResponse: createdOrder,
              useSameAddress: useSameAddress
            });
            setShowThankYou(true);

          } catch (error) {
            setApiError(error.message || 'Payment verification failed. Contact support.');
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            setApiError('Payment cancelled.');
            setIsPlacingOrder(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setApiError(response.error?.description || 'Payment failed. Please try again.');
        setIsPlacingOrder(false);
      });
      rzp.open();

    } catch (error) {
      setApiError(error.message || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    } finally {
      // For COD only — online payments reset isPlacingOrder in modal callbacks
      if (selectedPayment === 'cod') {
        setIsPlacingOrder(false);
      }
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= s.num
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-500'
                      }`}>
                      {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${step >= s.num ? 'text-black' : 'text-gray-500'
                      }`}>{s.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`hidden sm:block w-12 lg:w-24 h-0.5 ${step > s.num ? 'bg-black' : 'bg-gray-200'
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
                          {(() => {
                            const defaultAddr = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
                            return defaultAddr ? [defaultAddr] : [];
                          })().map(addr => (
                            <div
                              key={addr.id}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedBillingAddress === addr.id
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
                                      {addr.name || user.name}'s Address
                                    </span>
                                    {addr.isDefault && (
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Main</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-black font-medium">{addr.name || user.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postalCode || addr.pincode}</p>
                                  <p className="text-sm text-gray-600 mt-1">Mobile: {addr.phone || user.phone}</p>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Row 1: Full Name & Mobile */}
                              <div className="relative">
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    placeholder="Full Name *"
                                    value={newBillingAddress.fullName}
                                    onChange={(e) => handleNewAddressChange('billing', 'fullName', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${billingErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                  />
                                  {billingErrors.fullName && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{billingErrors.fullName}</p>}
                                </div>
                                {billingSuggestions.length > 0 && (
                                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {billingSuggestions.map(addr => (
                                      <div
                                        key={addr.id}
                                        onClick={() => handleSelectSuggestion('billing', addr)}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0 border-gray-100"
                                      >
                                        <p className="text-sm font-semibold text-black">{addr.fullName || addr.name || 'Saved Address'}</p>
                                        <p className="text-xs text-gray-600 line-clamp-1">{addr.address}, {addr.city}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  placeholder="Mobile *"
                                  value={newBillingAddress.phone}
                                  onChange={(e) => handleNewAddressChange('billing', 'phone', e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${billingErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                  maxLength="10"
                                />
                                {billingErrors.phone && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{billingErrors.phone}</p>}
                              </div>

                              {/* Row 2: Address & Pincode */}
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  placeholder="Address (House No, Building, Street) *"
                                  value={newBillingAddress.address}
                                  onChange={(e) => handleNewAddressChange('billing', 'address', e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${billingErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {billingErrors.address && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{billingErrors.address}</p>}
                              </div>
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  placeholder="Pincode *"
                                  value={newBillingAddress.pincode}
                                  onChange={(e) => handleNewAddressChange('billing', 'pincode', e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${billingErrors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                  maxLength="6"
                                />
                                {billingErrors.pincode && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{billingErrors.pincode}</p>}
                              </div>

                              {/* Row 3: City & State */}
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  placeholder="City *"
                                  value={newBillingAddress.city}
                                  onChange={(e) => handleNewAddressChange('billing', 'city', e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${billingErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {billingErrors.city && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{billingErrors.city}</p>}
                              </div>
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  placeholder="State *"
                                  value={newBillingAddress.state}
                                  onChange={(e) => handleNewAddressChange('billing', 'state', e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${billingErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {billingErrors.state && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{billingErrors.state}</p>}
                              </div>

                              {/* Row 4: Actions */}
                              <div className="sm:col-span-2 flex space-x-3">
                                {selectedExistingBillingAddress ? (
                                  <button
                                    onClick={() => handleContinueWithExisting('billing')}
                                    disabled={isUpdatingAddress}
                                    className="flex-1 py-3 font-medium rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
                                  >
                                    <Check className="w-5 h-5" />
                                    <span>{isUpdatingAddress ? 'Processing...' : 'Continue with Existing Address'}</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleSaveNewAddress('billing')}
                                    disabled={isUpdatingAddress}
                                    className={`flex-1 py-3 font-medium rounded-lg transition-colors ${isUpdatingAddress
                                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      : 'bg-black hover:bg-gray-800 text-white'
                                      }`}
                                  >
                                    {isUpdatingAddress ? 'Saving...' : 'Save Billing Address'}
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setShowAddBillingAddress(false);
                                    setSelectedExistingBillingAddress(null);
                                    setBillingSuggestions([]);
                                  }}
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
                              {(() => {
                                const defaultAddr = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
                                return defaultAddr ? [defaultAddr] : [];
                              })().map(addr => (
                                <div
                                  key={addr.id}
                                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedShippingAddress === addr.id
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
                                        {addr.isDefault && (
                                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Main</span>
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
                                  <h4 className="font-semibold text-black">Add Shipping Address</h4>                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Row 1: Full Name & Mobile */}
                                    <div className="relative">
                                      <div className="space-y-1">
                                        <input
                                          type="text"
                                          placeholder="Full Name *"
                                          value={newShippingAddress.fullName}
                                          onChange={(e) => handleNewAddressChange('shipping', 'fullName', e.target.value)}
                                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${shippingErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {shippingErrors.fullName && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{shippingErrors.fullName}</p>}
                                      </div>
                                      {shippingSuggestions.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                          {shippingSuggestions.map(addr => (
                                            <div
                                              key={addr.id}
                                              onClick={() => handleSelectSuggestion('shipping', addr)}
                                              className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0 border-gray-100"
                                            >
                                              <p className="text-sm font-semibold text-black">{addr.fullName || addr.name || 'Saved Address'}</p>
                                              <p className="text-xs text-gray-600 line-clamp-1">{addr.address}, {addr.city}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        placeholder="Mobile *"
                                        value={newShippingAddress.phone}
                                        onChange={(e) => handleNewAddressChange('shipping', 'phone', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${shippingErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        maxLength="10"
                                      />
                                      {shippingErrors.phone && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{shippingErrors.phone}</p>}
                                    </div>

                                    {/* Row 2: Address & Pincode */}
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        placeholder="Address (House No, Building, Street) *"
                                        value={newShippingAddress.address}
                                        onChange={(e) => handleNewAddressChange('shipping', 'address', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${shippingErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                      />
                                      {shippingErrors.address && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{shippingErrors.address}</p>}
                                    </div>
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        placeholder="Pincode *"
                                        value={newShippingAddress.pincode}
                                        onChange={(e) => handleNewAddressChange('shipping', 'pincode', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${shippingErrors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        maxLength="6"
                                      />
                                      {shippingErrors.pincode && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{shippingErrors.pincode}</p>}
                                    </div>

                                    {/* Row 3: City & State */}
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        placeholder="City *"
                                        value={newShippingAddress.city}
                                        onChange={(e) => handleNewAddressChange('shipping', 'city', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${shippingErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                      />
                                      {shippingErrors.city && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{shippingErrors.city}</p>}
                                    </div>
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        placeholder="State *"
                                        value={newShippingAddress.state}
                                        onChange={(e) => handleNewAddressChange('shipping', 'state', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black text-sm transition-colors ${shippingErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                      />
                                      {shippingErrors.state && <p className="text-xs text-red-500 font-medium ml-1 mt-1">{shippingErrors.state}</p>}
                                    </div>

                                    {/* Row 4: Actions */}
                                    <div className="sm:col-span-2 flex space-x-3">
                                      {selectedExistingShippingAddress ? (
                                        <button
                                          onClick={() => handleContinueWithExisting('shipping')}
                                          disabled={isUpdatingAddress}
                                          className="flex-1 py-3 font-medium rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
                                        >
                                          <Check className="w-5 h-5" />
                                          <span>{isUpdatingAddress ? 'Processing...' : 'Continue with Existing Address'}</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleSaveNewAddress('shipping')}
                                          disabled={isUpdatingAddress}
                                          className={`flex-1 py-3 font-medium rounded-lg transition-colors ${isUpdatingAddress
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-black hover:bg-gray-800 text-white'
                                            }`}
                                        >
                                          {isUpdatingAddress ? 'Saving...' : 'Save Shipping Address'}
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          setShowAddShippingAddress(false);
                                          setSelectedExistingShippingAddress(null);
                                          setShippingSuggestions([]);
                                        }}
                                        className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
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
                    className={`w-full py-3 sm:py-4 font-semibold rounded-lg transition-all text-sm sm:text-base ${isContinueToPaymentDisabled
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
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPayment === method.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-400'
                              }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedPayment === method.id ? 'bg-black' : 'bg-gray-200'
                                }`}>
                                <method.icon className={`w-5 h-5 ${selectedPayment === method.id ? 'text-white' : 'text-gray-600'
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
                          className={`w-full mt-4 py-3 sm:py-4 font-semibold rounded-lg transition-all text-sm sm:text-base ${isContinueToReviewDisabled
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
                      className={`w-full py-3 sm:py-4 font-semibold rounded-lg transition-all text-sm sm:text-base flex items-center justify-center space-x-2 ${isPlaceOrderDisabled
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

                    {isKarnataka ? (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">CGST</span>
                          <span className="text-black font-medium">{formatINR(tax / 2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">SGST</span>
                          <span className="text-black font-medium">{formatINR(tax / 2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">IGST</span>
                        <span className="text-black font-medium">{formatINR(tax)}</span>
                      </div>
                    )}

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
                  className={`px-6 py-3 font-semibold rounded-lg transition-all ${isContinueToPaymentDisabled
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
                  className={`px-6 py-3 font-semibold rounded-lg transition-all ${isContinueToReviewDisabled
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