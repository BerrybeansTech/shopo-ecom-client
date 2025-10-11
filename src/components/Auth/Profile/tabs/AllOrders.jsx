import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabNavigation from "./TabNavigation";

export default function AllOrders() {
  const [orders, setOrders] = useState([
    {
      id: "73262",
      date: "Nov 10, 2025",
      status: "On the way",
      amount: "USD 340.00",
      paymentMode: "UPI",
      customerName: "Alex John",
      items: [
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
      isReviewed: false,
    },
    {
      id: "73263",
      date: "Nov 11, 2025",
      status: "On the way",
      amount: "$450.00",
      paymentMode: "UPI",
      customerName: "Alex John",
      items: [
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
      isReviewed: false,
    },
    {
      id: "73264",
      date: "Nov 12, 2025",
      status: "Processing",
      amount: "$360.00",
      paymentMode: "Credit Card",
      customerName: "Alex John",
      items: [
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
      isReviewed: false,
    },
    {
      id: "73265",
      date: "Nov 9, 2025",
      status: "Delivered",
      amount: "$250.00",
      paymentMode: "Credit Card",
      customerName: "Alex John",
      items: [
        { name: "Wireless earbuds", price: "$120", quantity: 1, color: "Black", size: "One Size", thumbnail: "/assets/images/pro1.jpg" },
        { name: "Portable charger", price: "$50", quantity: 1, color: "White", size: "Small", thumbnail: "/assets/images/pro.jpg" },
        { name: "Notebook", price: "$80", quantity: 1, color: "Blue", size: "Medium", thumbnail: "/assets/images/pro1.jpg" },
      ],
      shippingAddress: "Elm Street, San Francisco CA 94102, PO: 212894",
      tracking: { status: "Delivered", estimatedDate: "Nov 9, 2025" },
      deliveryDate: "Nov 9, 2025",
      discounts: "$10",
      loyaltyPoints: "25",
      canReturn: false,
      isWishlist: false,
      isReviewed: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState("All orders");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle URL hash to set active tab on page load
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#allorders") {
      setActiveTab("All orders");
    } else if (hash === "#current") {
      setActiveTab("Current");
    } else if (hash === "#wishlist") {
      setActiveTab("Wishlist");
    } else {
      setActiveTab("All orders"); // Default to All orders
    }
  }, [location]);

  // Filter orders based on active tab
  useEffect(() => {
    if (activeTab === "All orders") {
      setFilteredOrders(orders);
    } else if (activeTab === "Current") {
      setFilteredOrders(
        orders.filter(
          (order) => !["delivered", "cancelled"].includes(order.status.toLowerCase())
        )
      );
    } else if (activeTab === "Wishlist") {
      setFilteredOrders([]); // Wishlist handled by WishlistTab
    }
  }, [activeTab, orders]);

  const handleReviewClick = (orderId) => {
    navigate("/profile#review", {
      state: { orderId },
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "delivered":
        return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium";
      case "on the way":
      case "shipped":
        return "text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs font-medium";
      case "processing":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium";
      case "cancelled":
        return "text-qred bg-red-100 px-2 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "text-qyellow bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "text-qgray bg-primarygray px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if order is eligible for review
  const canReviewOrder = (order) => {
    const status = order.status.toLowerCase();
    return status === "delivered" && !order.isReviewed;
  };

  // If no orders or Wishlist tab is active
  if (activeTab === "Wishlist") {
    return (
      <div className="w-full p-4">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="text-center py-12 bg-white rounded-lg border border-qgray-border">
          <h3 className="text-lg font-semibold text-qblack mb-2">Wishlist Content</h3>
          <p className="text-sm text-qgray">
            Please navigate to the Wishlist section to view your saved items.
          </p>
        </div>
      </div>
    );
  }

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div className="w-full p-4">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-qgray mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-qblack mb-2">No orders found</h3>
            <p className="text-qgray max-w-sm">
              {activeTab === "All orders"
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab.toLowerCase()} orders.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-qblack mb-2">My Orders</h2>
        <p className="text-qgray">
          {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
        </p>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="space-y-4 mt-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="border border-qgray-border rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold text-lg text-qblack">Order #{order.id}</h3>
                  <span className={getStatusColor(order.status)}>{order.status}</span>
                </div>
                <p className="text-sm text-qgray">Placed on {formatDate(order.date)}</p>
                {order.customerName && (
                  <p className="text-sm text-qgray">By {order.customerName}</p>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm text-qgray">Total Amount</p>
                <p className="text-xl font-bold text-qblack">{order.amount}</p>
              </div>
            </div>

       
            <div className="flex flex-wrap gap-3 justify-between items-center mt-4">
              <div className="flex flex-wrap gap-2">
                <button className="border border-qgray-border text-qblack rounded-lg font-medium text-sm hover:border-qyellow hover:bg-qyellow hover:text-white transition-all duration-300 px-4 py-2">
                  View Details
                </button>
                
                {order.status.toLowerCase() !== "delivered" &&
                  order.status.toLowerCase() !== "cancelled" && (
                    <button className="text-sm text-qred bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors">
                      Track Order
                    </button>
                  )}
              </div>

              <div className="flex flex-wrap gap-2">
                {canReviewOrder(order) && (
                  <button
                    onClick={() => handleReviewClick(order.id)}
                    className="text-sm text-white bg-qyellow border border-qyellow px-4 py-2 rounded-lg font-medium hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    Write Review
                  </button>
                )}

                {order.status.toLowerCase() === "delivered" && (
                  <button className="text-sm text-qyellow bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors">
                    Reorder
                  </button>
                )}
              </div>
            </div>

            {/* Review prompt for delivered orders */}
            {canReviewOrder(order) && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                      Share your experience!
                    </p>
                    <p className="text-xs text-amber-600">
                      Help other customers by reviewing this order
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}