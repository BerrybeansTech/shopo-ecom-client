// src/features/cart/hooks/useCart.js - FIXED VERSION
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  clearCartAfterOrder,
  moveToSaved,
  moveToCart,
  removeFromSaved,
  updateLocalQuantity,
  calculateTotals,
  clearError,
  setAuthStatus,
  clearCartState,
  resetOrderCompleted
} from './cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector(state => state.cart);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isAuth = !!localStorage.getItem('accessToken');
        dispatch(setAuthStatus(isAuth));
      }
    };
    
    checkAuth();
  }, [dispatch]);

  // Load cart items on mount if authenticated
  useEffect(() => {
    if (cartState.isAuthenticated && !cartState.orderCompleted) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, cartState.isAuthenticated, cartState.orderCompleted]);

  // Calculate totals whenever items change
  useEffect(() => {
    if (!cartState.orderCompleted) {
      dispatch(calculateTotals());
    }
  }, [dispatch, cartState.items, cartState.orderCompleted]);

  const addItemToCart = useCallback(async (cartData) => {
    try {
      // Reset order completed flag when adding new items
      if (cartState.orderCompleted) {
        dispatch(resetOrderCompleted());
      }

      console.log("Adding item to cart:", cartData);
      
      const result = await dispatch(addToCart(cartData)).unwrap();
      
      console.log("Add to cart result:", result);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: result };
    } catch (error) {
      console.error("Add to cart error:", error);
      
      if (error?.includes?.('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to add items to cart'
          } 
        });
      }
      return { success: false, error: error?.message || error };
    }
  }, [dispatch, navigate, cartState.orderCompleted]);

  const updateItemQuantity = useCallback(async (itemId, quantity) => {
    // Update locally first for immediate UI response
    dispatch(updateLocalQuantity({ itemId, quantity }));
    
    try {
      await dispatch(updateCartItem({
        itemId,
        updateData: { quantity }
      })).unwrap();
      return { success: true };
    } catch (error) {
      // Revert local change if API fails
      if (error?.includes?.('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to update cart'
          } 
        });
      } else {
        dispatch(fetchCartItems()); // Reload from server
      }
      return { success: false, error: error?.message || error };
    }
  }, [dispatch, navigate]);

  const removeItem = useCallback(async (itemId) => {
    try {
      await dispatch(deleteCartItem(itemId)).unwrap();
      return { success: true };
    } catch (error) {
      if (error?.includes?.('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to remove items from cart'
          } 
        });
      }
      return { success: false, error: error?.message || error };
    }
  }, [dispatch, navigate]);

  const clearAllItems = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
      return { success: true };
    } catch (error) {
      if (error?.includes?.('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to clear cart'
          } 
        });
      }
      return { success: false, error: error?.message || error };
    }
  }, [dispatch, navigate]);

  // NEW: Clear cart after successful order
  const clearCartAfterSuccessfulOrder = useCallback(async () => {
    try {
      console.log("Clearing cart after successful order...");
      await dispatch(clearCartAfterOrder()).unwrap();
      return { success: true, message: 'Cart cleared after order' };
    } catch (error) {
      console.error("Error clearing cart after order:", error);
      // Even if it fails, we still want to proceed
      return { success: false, error: error?.message || error, message: 'Cart cleared locally' };
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
    if (cartState.isAuthenticated) {
      dispatch(resetOrderCompleted()); // Reset flag before refresh
      console.log("Refreshing cart...");
      dispatch(fetchCartItems());
    }
  }, [dispatch, cartState.isAuthenticated]);

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

  // Helper function to format currency
  const formatINR = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  return {
    // State
    items: cartState.items,
    savedItems: cartState.savedItems,
    loading: cartState.loading,
    error: cartState.error,
    subtotal: cartState.subtotal,
    discount: cartState.discount,
    total: cartState.total,
    isAuthenticated: cartState.isAuthenticated,
    orderCompleted: cartState.orderCompleted,
    
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
    
    // Computed values
    itemCount: cartState.items.reduce((total, item) => total + item.quantity, 0),
    uniqueItemCount: cartState.items.length,
    isEmpty: cartState.items.length === 0 && !cartState.loading
  };
};