// src/features/cart/hooks/useCart.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  moveToSaved,
  moveToCart,
  removeFromSaved,
  updateLocalQuantity,
  clearError,
  setAuthStatus,
  resetOrderCompleted,
  setUpdatingItem,
  setDeletingItem
} from './cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector(state => state.cart);

  // Get item price from multiple possible fields
  const getItemPrice = useCallback((item) => {
    return item.price || item.product?.sellingPrice || 0;
  }, []);

  // Check authentication and load cart
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isAuth = !!localStorage.getItem('accessToken');
        dispatch(setAuthStatus(isAuth));
      }
    };
    
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (cartState.isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, cartState.isAuthenticated]);

  // Cart actions
  const addItemToCart = useCallback(async (cartData) => {
    try {
      const result = await dispatch(addToCart(cartData)).unwrap();
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: result };
    } catch (error) {
      if (error.includes('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to add items to cart'
          } 
        });
      }
      return { success: false, error };
    }
  }, [dispatch, navigate]);

  const updateItemQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return { success: false, error: 'Quantity must be at least 1' };
    
    dispatch(setUpdatingItem({ itemId, updating: true }));
    dispatch(updateLocalQuantity({ itemId, quantity }));
    
    try {
      await dispatch(updateCartItem({
        itemId,
        updateData: { quantity }
      })).unwrap();
      
      dispatch(setUpdatingItem({ itemId, updating: false }));
      return { success: true };
    } catch (error) {
      dispatch(setUpdatingItem({ itemId, updating: false }));
      dispatch(fetchCartItems());
      
      if (error?.includes?.('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to update cart'
          } 
        });
      }
      return { success: false, error };
    }
  }, [dispatch, navigate]);

  const removeItem = useCallback(async (itemId) => {
    dispatch(setDeletingItem({ itemId, deleting: true }));
    
    try {
      await dispatch(deleteCartItem(itemId)).unwrap();
      dispatch(setDeletingItem({ itemId, deleting: false }));
      return { success: true };
    } catch (error) {
      dispatch(setDeletingItem({ itemId, deleting: false }));
      
      if (error.includes('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to remove items from cart'
          } 
        });
      }
      return { success: false, error };
    }
  }, [dispatch, navigate]);

  const clearAllItems = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
      return { success: true };
    } catch (error) {
      if (error.includes('Please login')) {
        navigate('/login', {
          state: {
            returnUrl: window.location.pathname,
            message: 'Please login to clear cart'
          }
        });
      }
      return { success: false, error };
    }
  }, [dispatch, navigate]);

  const clearCartAfterSuccessfulOrder = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart after order:', error);
      return { success: false, message: error };
    }
  }, [dispatch]);

  const saveForLater = useCallback((itemId) => {
    dispatch(moveToSaved(itemId));
  }, [dispatch]);

  const moveItemToCart = useCallback((itemId) => {
    dispatch(moveToCart(itemId));
  }, [dispatch]);

  const removeFromSavedItems = useCallback((itemId) => {
    dispatch(removeFromSaved(itemId));
  }, [dispatch]);

  const refreshCart = useCallback(() => {
    const isAuth = !!localStorage.getItem('accessToken');
    if (isAuth) {
      dispatch(setAuthStatus(true));
      dispatch(resetOrderCompleted());
      dispatch(fetchCartItems());
    }
  }, [dispatch]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLoginRedirect = useCallback((message = 'Please login to continue') => {
    navigate('/login', { 
      state: { 
        returnUrl: window.location.pathname,
        message 
      } 
    });
  }, [navigate]);

  const isItemUpdating = useCallback((itemId) => {
    return !!cartState.updatingItems[itemId];
  }, [cartState.updatingItems]);

  const isItemDeleting = useCallback((itemId) => {
    return !!cartState.deletingItems[itemId];
  }, [cartState.deletingItems]);

  const formatINR = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Calculate computed values based on cart state
  const itemCount = cartState.items.reduce((total, item) => total + (item.quantity || 0), 0);
  const uniqueItemCount = cartState.items.length;
  const isEmpty = cartState.items.length === 0;

  // Ensure total is 0 when cart is empty
  const displayTotal = isEmpty ? 0 : cartState.total;

  return {
    // State
    items: cartState.items,
    savedItems: cartState.savedItems,
    loading: cartState.loading,
    error: cartState.error,
    subtotal: cartState.subtotal,
    discount: cartState.discount,
    total: displayTotal, // Use displayTotal instead of cartState.total
    isAuthenticated: cartState.isAuthenticated,
    addingToCart: cartState.addingToCart,
    
    // Individual loading states
    isItemUpdating,
    isItemDeleting,
    
    // Actions
    addItemToCart,
    updateItemQuantity,
    removeItem,
    clearAllItems,
    clearCartAfterSuccessfulOrder,
    saveForLater,
    moveItemToCart,
    removeFromSavedItems,
    refreshCart,
    dismissError,
    handleLoginRedirect,
    formatINR,
    getItemPrice,
    
    // Computed values
    itemCount,
    uniqueItemCount,
    isEmpty
  };
};