import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/Auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
