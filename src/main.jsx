// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-range-slider-input/dist/style.css";
import "./index.css";

import { store } from "./app/store"; // ✅ Make sure your store file path is correct
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ Initialize animations
AOS.init();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
