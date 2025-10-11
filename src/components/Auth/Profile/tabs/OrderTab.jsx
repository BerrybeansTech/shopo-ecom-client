import React, { useState } from "react";
import CurrentOrders from "./CurrentOrders";
import AllOrders from "./AllOrders";
import Wishlist from "./Wishlist";

export default function OrderTab() {
  const [activeTab, setActiveTab] = useState("Current");

  // Mock data with 3 orders, each with 4 products, and a wishlist flag
  const orders = [
    {
      id: "73262",
      date: "Nov 10, 2025",
      status: "On the way",
      amount: "USD 340.00",
      paymentMode: "UPI",
      products: [
        { name: "Great product name goes here", price: "$340", quantity: 1, color: "Silver", size: "Large", thumbnail: "/assets/images/pro1.jpg" },
        { name: "Table lamp for o Great product ", price: "$0", quantity: 1, color: "Silver", size: "Large", thumbnail: "/assets/images/pro.jpg" },
        { name: "Great product name goes here", price: "$87", quantity: 2, color: "Silver", size: "Large", thumbnail: "/assets/images/pro.jpg" },
        { name: "Great cup white Great product ", price: "$0", quantity: 1, color: "Silver", size: "Large", thumbnail: "/assets/images/pro1.jpg" },
      ],
      shippingAddress: "Great street, New York Brooklyn 5A, PO: 212891",
      tracking: { status: "On the way", estimatedDate: "Nov 13, 2025" },
      deliveryDate: "Fri, 13 Nov, 2025",
      discounts: "$0",
      loyaltyPoints: "0",
      canReturn: true,
      isWishlist: false,
    },
    {
      id: "73263",
      date: "Nov 11, 2025",
      status: "On the way",
      amount: "$450.00",
      paymentMode: "UPI",
      products: [
        { name: "Premium desk organizer", price: "$150", quantity: 1, color: "Black", size: "Medium", thumbnail: "/assets/images/pro1.jpg" },
        { name: "LED table lamp", price: "$100", quantity: 1, color: "White", size: "Large", thumbnail: "/assets/images/pro.jpg" },
        { name: "Stylish notebook set", price: "$100", quantity: 2, color: "Blue", size: "Small", thumbnail: "/assets/images/pro1.jpg" },
        { name: "Ceramic mug", price: "$100", quantity: 1, color: "Gray", size: "Medium", thumbnail: "/assets/images/pro.jpg" },
      ],
      shippingAddress: "Park Avenue, Los Angeles CA 90001, PO: 212892",
      tracking: { status: "On the way", estimatedDate: "Nov 14, 2025" },
      deliveryDate: "Nov 14, 2025",
      discounts: "$0",
      loyaltyPoints: "0",
      canReturn: true,
      isWishlist: false,
    },
    {
      id: "73264",
      date: "Nov 12, 2025",
      status: "Processing",
      amount: "$360.00",
      paymentMode: "Credit Card",
      products: [
        { name: "Wooden photo frame", price: "$80", quantity: 1, color: "Natural", size: "Large", thumbnail: "/assets/images/pro.jpg" },
        { name: "Scented candle", price: "$50", quantity: 1, color: "Ivory", size: "Small", thumbnail: "/assets/images/pro1.jpg" },
        { name: "Leather wallet", price: "$70", quantity: 1, color: "Brown", size: "Medium", thumbnail: "/assets/images/pro.jpg" },
        { name: "Keychain set", price: "$80", quantity: 2, color: "Silver", size: "Small", thumbnail: "/assets/images/pro1.jpg" },
      ],
      shippingAddress: "Main Street, Chicago IL 60601, PO: 212893",
      tracking: { status: "Processing", estimatedDate: "Nov 15, 2025" },
      deliveryDate: "Nov 15, 2025",
      discounts: "$0",
      loyaltyPoints: "0",
      canReturn: true,
      isWishlist: true,
    },
  ];

  return (
    <div className="w-full p-4">
      {/* Tabs with updated design */}
      <div className="flex space-x-1 max-w-96 mb-6 bg-[#eef0f2] p-1 rounded-lg">
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === "Current"
              ? "bg-[#fcfefe] text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("Current")}
        >
          Current
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === "All orders"
              ? "bg-[#fcfefe] text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("All orders")}
        >
          All orders
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === "Wishlist"
              ? "bg-[#fcfefe] text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("Wishlist")}
        >
          Wishlist
        </button>
      </div>

      {/* Orders Container */}
      <div className="space-y-6">
        {activeTab === "Current" && <CurrentOrders orders={orders.filter(order => order.status === "On the way")} />}
        {activeTab === "All orders" && <AllOrders orders={orders} />}
        {activeTab === "Wishlist" && <Wishlist orders={orders.filter(order => order.isWishlist)} />}
      </div>
    </div>
  );
}