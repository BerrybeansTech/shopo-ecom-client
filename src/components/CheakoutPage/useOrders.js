// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../CheakoutPage/ordersApi';
import { useAuth } from '../Auth/hooks/useAuth';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Format order data from API response
  const formatOrderFromAPI = useCallback((apiOrder) => {
    if (!apiOrder) return null;

    const orderDate = new Date(apiOrder.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    return {
      id: apiOrder.id,
      date: orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: apiOrder.status || 'pending',
      amount: `₹${apiOrder.finalAmount || apiOrder.totalAmount || 0}`,
      paymentMode: apiOrder.paymentMethod || 'Unknown',
      customerName: apiOrder.Customer?.name || 'Customer',
      // Build fully-qualified thumbnail URLs so images load from the remote host
      items: apiOrder.OrderItems?.map(item => {
        const rawThumb = item.Product?.thumbnailImage || '';
        const IMAGE_HOST = 'http://luxcycs.com:5501';

        let thumbnail = '';
        if (!rawThumb) {
          // fallback default hosted image (keep host so image resolves)
          thumbnail = `${IMAGE_HOST}/rabbit-and-finch-uploads/default.jpg`;
        } else if (/^https?:\/\//i.test(rawThumb)) {
          // already absolute URL
          thumbnail = rawThumb;
        } else {
          // relative path - ensure we don't produce double slashes
          thumbnail = `${IMAGE_HOST}/${rawThumb.replace(/^\/+/, '')}`;
        }

        return {
          name: item.Product?.name || 'Product',
          price: `₹${item.unitPrice || item.totalPrice || 0}`,
          quantity: item.quantity,
          color: 'Default',
          size: 'Standard',
          thumbnail
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
      canReturn: apiOrder.status?.toLowerCase() === 'delivered',
      isWishlist: false,
      isReviewed: false,
      tracking: {
        status: apiOrder.status || 'pending',
        estimatedDate: deliveryDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      }
    };
  }, []);

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
            ? { ...order, status: 'cancelled' }
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

  // Get current orders (not delivered or cancelled)
  const getCurrentOrders = useCallback(() => {
    return orders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status.toLowerCase())
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

  // Load orders on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, loadOrders]);

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
    hasOrders: orders.length > 0
  };
};