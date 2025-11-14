// features/cart/hooks/useCart.js - FIXED VERSION
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
  calculateTotals,
  clearError,
  setAuthStatus,
  clearCartState
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
    if (cartState.isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, cartState.isAuthenticated]);

  // Calculate totals whenever items change
  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartState.items]);

  const addItemToCart = useCallback(async (cartData) => {
    try {
      console.log("Adding item to cart:", cartData);
      
      const result = await dispatch(addToCart(cartData)).unwrap();
      
      console.log("Add to cart result:", result);
      
      // The cart will be automatically refreshed by the addToCart thunk
      // Wait a bit for the refresh to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: result };
    } catch (error) {
      console.error("Add to cart error:", error);
      
      if (error.includes('Please login')) {
        // Redirect to login if not authenticated
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
      if (error.includes('Please login')) {
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to update cart'
          } 
        });
      } else {
        dispatch(fetchCartItems()); // Reload from server
      }
      return { success: false, error };
    }
  }, [dispatch, navigate]);

  const removeItem = useCallback(async (itemId) => {
    try {
      await dispatch(deleteCartItem(itemId)).unwrap();
      return { success: true };
    } catch (error) {
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

  const clearAllItems = useCallback(async (cartId) => {
    try {
      await dispatch(clearCart(cartId)).unwrap();
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
    
    // Actions
    addItemToCart,
    updateItemQuantity,
    removeItem,
    clearAllItems,
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
    isEmpty: cartState.items.length === 0
  };
};