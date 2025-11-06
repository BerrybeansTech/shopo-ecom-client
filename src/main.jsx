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

// ✅ Initialize animations
AOS.init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
