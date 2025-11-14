// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../components/Auth/authSlice';
import cartReducer from '../components/CartPage/cartSlice';
import productReducer from '../components/AllProductPage/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
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