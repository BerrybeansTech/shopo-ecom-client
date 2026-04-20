// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../CheakoutPage/ordersApi';
import { useAuth } from '../Auth/hooks/useAuth';
import { colorApi, sizeApi } from '../AllProductPage/productApi';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [allColors, setAllColors] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Fetch variations
  useEffect(() => {
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
  }, []);

  const getColorName = useCallback((id) => {
    if (!id) return 'Default';
    if (isNaN(id)) return id; // Already a name
    const color = allColors.find(c => c.id === parseInt(id));
    return color ? color.color : id;
  }, [allColors]);

  const getSizeName = useCallback((id) => {
    if (!id) return 'Standard';
    if (isNaN(id)) return id; // Already a name
    const size = allSizes.find(s => s.id === parseInt(id));
    return size ? (Array.isArray(size.size) ? size.size[0] : size.size) : id;
  }, [allSizes]);

  // Status mapping for display
  const statusDisplayMap = {
    'pending': 'Pending',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'returned': 'Returned',
    'complete': 'Complete'
  };

  // Format order data from API response
  const formatOrderFromAPI = useCallback((apiOrder) => {
    if (!apiOrder) return null;

    const orderDate = new Date(apiOrder.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    // Get order status for display
    const displayStatus = statusDisplayMap[apiOrder.status] || apiOrder.status;

    // Determine if order can be reviewed
    // Only delivered/complete orders with unreviewed items can be reviewed
    const canReview = (apiOrder.status === 'delivered' || apiOrder.status === 'complete') &&
      apiOrder.OrderItems?.some(item => !item.isReviewed);

    return {
      id: apiOrder.id,
      orderId: apiOrder.orderId, // Use backend orderId if available
      date: orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: apiOrder.status,
      displayStatus: displayStatus,
      amount: `₹${apiOrder.finalAmount || apiOrder.totalAmount || 0}`,
      paymentMode: apiOrder.paymentMethod || 'Unknown',
      paymentStatus: apiOrder.paymentStatus || 'pending',
      customerName: apiOrder.Customer?.name || 'Customer',
      orderNote: apiOrder.orderNote || '',

      // Build fully-qualified thumbnail URLs
      items: apiOrder.OrderItems?.map(item => {
        const rawThumb = item.Product?.thumbnailImage || '';
        const IMAGE_HOST = import.meta.env.VITE_PUBLIC_URL || import.meta.env.VITE_API_BASE_URL || 'http://luxcycs.com:5501';

        let thumbnail = '';
        if (!rawThumb) {
          thumbnail = `${IMAGE_HOST}/rabbit-and-finch-uploads/default.jpg`;
        } else if (/^https?:\/\//i.test(rawThumb)) {
          thumbnail = rawThumb;
        } else {
          thumbnail = `${IMAGE_HOST}/${rawThumb.replace(/^\/+/, '')}`;
        }

        return {
          name: item.Product?.name || 'Product',
          price: `₹${item.unitPrice || item.totalPrice || 0}`,
          quantity: item.quantity,
          color: getColorName(item.productColorId || item.productColorVariationId || item.color),
          size: getSizeName(item.productSizeId || item.productSizeVariationId || item.size),
          thumbnail,
          productId: item.productId,
          orderItemId: item.id,
          isReviewed: item.isReviewed || false,
          canReview: !item.isReviewed && (apiOrder.status === 'delivered' || apiOrder.status === 'complete')
        };
      }) || [],

      shippingAddress: apiOrder.shippingAddress || 'Address not available',
      deliveryDate: deliveryDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      discounts: `₹${apiOrder.discount || 0}`,
      loyaltyPoints: '0',
      canReturn: apiOrder.status === 'delivered' || apiOrder.status === 'complete',
      canReview: canReview,
      tracking: {
        status: apiOrder.status,
        estimatedDate: deliveryDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      }
    };
  }, [getColorName, getSizeName]);

  // Load orders from API
  const loadOrders = useCallback(async (filters = {}) => {
    if (!isAuthenticated || !user?.id) {
      setError('Please login to view orders');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getCustomerOrders(user.id, filters);

      if (response.success) {
        const formattedOrders = response.data.map(formatOrderFromAPI);
        setOrders(formattedOrders);
        if (response.pagination) {
          setPagination({
            currentPage: parseInt(response.pagination.page),
            totalPages: parseInt(response.pagination.totalPages),
            totalItems: parseInt(response.pagination.total),
            limit: parseInt(response.pagination.limit)
          });
        }
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, formatOrderFromAPI]);

  // Cancel order function
  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ordersApi.cancelOrder(orderId);

      if (response.success) {
        // Update local state to reflect cancelled status
        setOrders(prev => prev.map(order =>
          order.id === orderId
            ? {
              ...order,
              status: 'cancelled',
              displayStatus: 'Cancelled',
              canCancel: false
            }
            : order
        ));
        return { success: true, message: response.message || 'Order cancelled successfully' };
      } else {
        return { success: false, error: response.message || 'Failed to cancel order' };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to cancel order';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current orders (not delivered, complete, cancelled, or returned)
  const getCurrentOrders = useCallback(() => {
    return orders.filter(order =>
      !['delivered', 'complete', 'cancelled', 'returned'].includes(order.status.toLowerCase())
    );
  }, [orders]);

  // Get orders by status
  const getOrdersByStatus = useCallback((status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  }, [orders]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  // Removed automatic load on mount to allow components to control pagination
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     loadOrders();
  //   }
  // }, [isAuthenticated, loadOrders]);

  return {
    // State
    orders,
    loading,
    error,

    // Actions
    loadOrders,
    cancelOrder,
    dismissError,

    // Computed values
    currentOrders: getCurrentOrders(),
    getOrdersByStatus,
    hasOrders: orders.length > 0,
    pagination
  };
};