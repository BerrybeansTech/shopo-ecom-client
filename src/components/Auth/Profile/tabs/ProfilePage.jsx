import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TabNavigation from "./TabNavigation";
import OrderTab from "./OrderTab";
import AllOrders from "./AllOrders";
import WishlistTab from "./WishlistTab";

export default function ProfilePage({ orders }) {
  const [activeTab, setActiveTab] = useState("Current");
  const location = useLocation();

  // Handle URL hash to set active tab on page load
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#wishlist") {
      setActiveTab("Wishlist");
    } else if (hash === "#allorders") {
      setActiveTab("All orders");
    } else {
      setActiveTab("Current");
    }
  }, [location]);

  return (
    <div className="w-full p-4">
      {/* Reusable TabNavigation component */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Render content based on active tab */}
      <div className="space-y-6">
        {activeTab === "Current" && <OrderTab orders={orders} />}
        {activeTab === "All orders" && <AllOrders orders={orders} />}
        {activeTab === "Wishlist" && <WishlistTab />}
      </div>
    </div>
  );
}