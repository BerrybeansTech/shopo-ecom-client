// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../components/Auth/authSlice';
import cartReducer from '../components/CartPage/cartSlice';
import ordersReducer from '../components/CheakoutPage/ordersSlice'; 
import productReducer from '../components/AllProductPage/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;