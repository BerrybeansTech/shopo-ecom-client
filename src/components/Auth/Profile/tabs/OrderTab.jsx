// import React, { useState, useEffect } from "react";
// import { FaTruck, FaDownload } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
// import TabNavigation from "./TabNavigation";

// export default function OrderTab() {
//   const [orders, setOrders] = useState([
//     {
//       id: "73262",
//       date: "Nov 10, 2025",
//       status: "On the way",
//       amount: "USD 340.00",
//       paymentMode: "UPI",
//       products: [
//         { name: "Great product name goes here", price: "$340", quantity: 1, color: "Silver", size: "Large", thumbnail: "/assets/images/pro1.jpg" },
//         { name: "Table lamp for o Great product ", price: "$0", quantity: 1, color: "Silver", size: "Large", thumbnail: "/assets/images/pro.jpg" },
//         { name: "Great product name goes here", price: "$87", quantity: 2, color: "Silver", size: "Large", thumbnail: "/assets/images/pro.jpg" },
//         { name: "Great cup white Great product ", price: "$0", quantity: 1, color: "Silver", size: "Large", thumbnail: "/assets/images/pro1.jpg" },
//       ],
//       shippingAddress: "Great street, New York Brooklyn 5A, PO: 212891",
//       tracking: { status: "On the way", estimatedDate: "Nov 13, 2025" },
//       deliveryDate: "Fri, 13 Nov, 2025",
//       discounts: "$0",
//       loyaltyPoints: "0",
//       canReturn: true,
//       isWishlist: false,
//     },
//     {
//       id: "73263",
//       date: "Nov 11, 2025",
//       status: "On the way",
//       amount: "$450.00",
//       paymentMode: "UPI",
//       products: [
//         { name: "Premium desk organizer", price: "$150", quantity: 1, color: "Black", size: "Medium", thumbnail: "/assets/images/pro1.jpg" },
//         { name: "LED table lamp", price: "$100", quantity: 1, color: "White", size: "Large", thumbnail: "/assets/images/pro.jpg" },
//         { name: "Stylish notebook set", price: "$100", quantity: 2, color: "Blue", size: "Small", thumbnail: "/assets/images/pro1.jpg" },
//         { name: "Ceramic mug", price: "$100", quantity: 1, color: "Gray", size: "Medium", thumbnail: "/assets/images/pro.jpg" },
//       ],
//       shippingAddress: "Park Avenue, Los Angeles CA 90001, PO: 212892",
//       tracking: { status: "On the way", estimatedDate: "Nov 14, 2025" },
//       deliveryDate: "Nov 14, 2025",
//       discounts: "$0",
//       loyaltyPoints: "0",
//       canReturn: true,
//       isWishlist: false,
//     },
//     {
//       id: "73264",
//       date: "Nov 12, 2025",
//       status: "Processing",
//       amount: "$360.00",
//       paymentMode: "Credit Card",
//       products: [
//         { name: "Wooden photo frame", price: "$80", quantity: 1, color: "Natural", size: "Large", thumbnail: "/assets/images/pro.jpg" },
//         { name: "Scented candle", price: "$50", quantity: 1, color: "Ivory", size: "Small", thumbnail: "/assets/images/pro1.jpg" },
//         { name: "Leather wallet", price: "$70", quantity: 1, color: "Brown", size: "Medium", thumbnail: "/assets/images/pro.jpg" },
//         { name: "Keychain set", price: "$80", quantity: 2, color: "Silver", size: "Small", thumbnail: "/assets/images/pro1.jpg" },
//       ],
//       shippingAddress: "Main Street, Chicago IL 60601, PO: 212893",
//       tracking: { status: "Processing", estimatedDate: "Nov 15, 2025" },
//       deliveryDate: "Nov 15, 2025",
//       discounts: "$0",
//       loyaltyPoints: "0",
//       canReturn: true,
//       isWishlist: true,
//     },
//     {
//       id: "73265",
//       date: "Nov 9, 2025",
//       status: "Delivered",
//       amount: "$250.00",
//       paymentMode: "Credit Card",
//       products: [
//         { name: "Wireless earbuds", price: "$120", quantity: 1, color: "Black", size: "One Size", thumbnail: "/assets/images/pro1.jpg" },
//         { name: "Portable charger", price: "$50", quantity: 1, color: "White", size: "Small", thumbnail: "/assets/images/pro.jpg" },
//         { name: "Notebook", price: "$80", quantity: 1, color: "Blue", size: "Medium", thumbnail: "/assets/images/pro1.jpg" },
//       ],
//       shippingAddress: "Elm Street, San Francisco CA 94102, PO: 212894",
//       tracking: { status: "Delivered", estimatedDate: "Nov 9, 2025" },
//       deliveryDate: "Nov 9, 2025",
//       discounts: "$10",
//       loyaltyPoints: "25",
//       canReturn: false,
//       isWishlist: false,
//     },
//   ]);

//   const [activeTab, setActiveTab] = useState("Current");
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const location = useLocation();

//   // Handle URL hash to set active tab on page load
//   useEffect(() => {
//     const hash = location.hash;
//     if (hash === "#current") {
//       setActiveTab("Current");
//     } else if (hash === "#allorders") {
//       setActiveTab("All orders");
//     } else if (hash === "#wishlist") {
//       setActiveTab("Wishlist");
//     } else {
//       setActiveTab("Current");
//     }
//   }, [location]);

//   // Filter orders based on active tab
//   useEffect(() => {
//     if (activeTab === "All orders") {
//       setFilteredOrders(orders);
//     } else if (activeTab === "Current") {
//       setFilteredOrders(
//         orders.filter(
//           (order) =>
//             !["delivered", "cancelled"].includes(order.status.toLowerCase())
//         )
//       );
//     } else if (activeTab === "Wishlist") {
//       setFilteredOrders([]);
//     }
//   }, [activeTab, orders]);

//   const downloadInvoice = (order) => {
//     const invoiceContent = `
//       Order #${order.id}
//       Date: ${order.date}
//       Status: ${order.status}
//       Date of Delivery: ${order.deliveryDate}
//       Delivered to: ${order.shippingAddress}
//       Total: ${order.amount}

//       Products:
//       ${order.products
//         .map(
//           (p) =>
//             `${p.name} - Qty: ${p.quantity}, Color: ${p.color}, Size: ${p.size}, Price: ${p.price}`
//         )
//         .join("\n")}
//     `;
//     const blob = new Blob([invoiceContent], { type: "text/plain" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `invoice_${order.id}.txt`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const showTracking = (order) => {
//     alert(
//       `Tracking for Order #${order.id}: Status - ${order.tracking.status}, Estimated Delivery - ${order.tracking.estimatedDate}`
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "delivered":
//         return "text-green-600 bg-green-100";
//       case "on the way":
//         return "text-orange-600 bg-orange-100";
//       case "shipped":
//         return "text-blue-600 bg-blue-100";
//       case "processing":
//         return "text-yellow-600 bg-yellow-100";
//       case "pending":
//         return "text-qyellow bg-yellow-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   // If Wishlist tab is active
//   if (activeTab === "Wishlist") {
//     return (
//       <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-qblack mb-2">My Orders</h2>
//           <p className="text-qgray">Track and manage your orders</p>
//         </div>
        
//         <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
//         <div className="text-center py-12 bg-white rounded-lg border border-qgray-border">
//           <h3 className="text-lg font-semibold text-qblack mb-2">
//             Wishlist Content
//           </h3>
//           <p className="text-sm text-qgray">
//             Please navigate to the Wishlist section to view your saved items.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // If no orders
//   if (!filteredOrders || filteredOrders.length === 0) {
//     return (
//       <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-qblack mb-2">My Orders</h2>
//           <p className="text-qgray">Track and manage your orders</p>
//         </div>
        
//         <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
//         <div className="text-center py-12 bg-white rounded-lg border border-qgray-border">
//           <div className="mx-auto h-24 w-24 text-qgray mb-4">
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1}
//                 d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-qblack mb-2">
//             No orders found
//           </h3>
//           <p className="text-qgray max-w-sm">
//             {activeTab === "All orders"
//               ? "You haven't placed any orders yet."
//               : `You don't have any ${activeTab.toLowerCase()} orders.`}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-qblack mb-2">My Orders</h2>
//         <p className="text-qgray">
//           {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
//         </p>
//       </div>

//       <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="space-y-6">
//         {filteredOrders.map((order) => (
//           <div
//             key={order.id}
//             className="border border-qgray-border rounded-lg p-4 sm:p-6 bg-white hover:shadow-md transition-shadow duration-200"
//           >
//             {/* Order Header - Mobile Responsive */}
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
//               <div className="space-y-2 flex-1">
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
//                   <h3 className="font-bold text-xl text-qblack">
//                     Order #{order.id}
//                   </h3>
//                   <span
//                     className={`text-sm font-medium ${getStatusColor(
//                       order.status
//                     )} px-3 py-1 rounded-full w-fit`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
//                 <p className="text-sm text-qgray">
//                   By Alex John | {order.date}
//                 </p>
//               </div>
              
//               <button
//                 className="px-4 py-2 border border-qgray-border bg-white text-qblack rounded-lg hover:bg-primarygray flex items-center justify-center space-x-2 text-sm transition-all duration-200 w-full sm:w-auto mt-2 sm:mt-0"
//                 onClick={() => downloadInvoice(order)}
//               >
//                 <FaDownload className="text-lg" />
//                 <span>Download invoice</span>
//               </button>
//             </div>

//             <div className="border-t border-qgray-border my-4"></div>

//             {/* Order Details - Mobile Responsive */}
//             <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
//               <div className="space-y-3 flex-1">
//                 <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
//                   <span className="text-sm text-qgray min-w-[120px]">Status:</span>
//                   <span
//                     className={`text-sm font-medium ${getStatusColor(
//                       order.status
//                     )} px-2 py-1 rounded-full w-fit`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
                
//                 <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
//                   <span className="text-sm text-qgray min-w-[120px]">
//                     Date of delivery:
//                   </span>
//                   <span className="text-sm font-medium text-qblack">
//                     {order.deliveryDate}
//                   </span>
//                 </div>
                
//                 <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
//                   <span className="text-sm text-qgray min-w-[120px]">
//                     Delivered to:
//                   </span>
//                   <span className="text-sm font-medium text-qblack break-words">
//                     {order.shippingAddress}
//                   </span>
//                 </div>
                
//                 <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 pt-2">
//                   <span className="text-base text-qgray min-w-[120px]">Total:</span>
//                   <span className="text-lg font-bold text-qblack">
//                     {order.amount}
//                   </span>
//                 </div>
//               </div>
              
//               <button
//                 className="px-4 py-3 bg-qyellow text-qblack rounded-lg hover:bg-amber-500 flex items-center justify-center space-x-2 text-sm font-semibold transition-all duration-200 w-full lg:w-auto mt-4 lg:mt-0"
//                 onClick={() => showTracking(order)}
//               >
//                 <FaTruck className="text-lg" />
//                 <span>Order Tracking</span>
//               </button>
//             </div>

//             <div className="border-t border-qgray-border my-4"></div>

//             {/* Products Grid - Mobile Responsive */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {order.products.map((product, index) => (
//                 <div 
//                   key={index} 
//                   className="flex items-start space-x-3 p-3 bg-primarygray rounded-lg border border-qgray-border"
//                 >
//                   <img
//                     src={product.thumbnail}
//                     alt={product.name}
//                     className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-qgray-border"
//                   />
//                   <div className="flex-1 space-y-1 min-w-0">
//                     <p className="font-medium text-qblack text-sm leading-tight line-clamp-2">
//                       {product.name}
//                     </p>
//                     <p className="text-xs text-qgray">
//                       Quantity: {product.quantity}x = {product.price}
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       <p className="text-xs text-qgray">
//                         Color: {product.color}
//                       </p>
//                       <p className="text-xs text-qgray">
//                         Size: {product.size}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Additional Actions for Mobile */}
//             <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-qgray-border">
//               <button className="text-sm text-qblack bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors text-center">
//                 View Order Details
//               </button>
              
//               {order.status.toLowerCase() === "delivered" && (
//                 <button className="text-sm text-qyellow bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors text-center">
//                   Buy Again
//                 </button>
//               )}
              
//               {order.canReturn && (
//                 <button className="text-sm text-qred bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors text-center">
//                   Return Item
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { FaTruck, FaDownload } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import TabNavigation from "./TabNavigation";

export default function OrderTab() {
  const [orders, setOrders] = useState([
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
    {
      id: "73265",
      date: "Nov 9, 2025",
      status: "Delivered",
      amount: "$250.00",
      paymentMode: "Credit Card",
      products: [
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
    },
  ]);

  const [activeTab, setActiveTab] = useState("Current");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(1);
  const ordersContainerRef = useRef(null);
  const location = useLocation();

  // Handle URL hash to set active tab on page load
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#current") {
      setActiveTab("Current");
    } else if (hash === "#allorders") {
      setActiveTab("All orders");
    } else if (hash === "#wishlist") {
      setActiveTab("Wishlist");
    } else {
      setActiveTab("Current");
    }
  }, [location]);

  // Filter orders based on active tab
  useEffect(() => {
    if (activeTab === "All orders") {
      setFilteredOrders(orders);
    } else if (activeTab === "Current") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            !["delivered", "cancelled"].includes(order.status.toLowerCase())
        )
      );
    } else if (activeTab === "Wishlist") {
      setFilteredOrders([]);
    }
    setVisibleOrdersCount(1);
  }, [activeTab, orders]);

  const downloadInvoice = (order) => {
    const invoiceContent = `
      Order #${order.id}
      Date: ${order.date}
      Status: ${order.status}
      Date of Delivery: ${order.deliveryDate}
      Delivered to: ${order.shippingAddress}
      Total: ${order.amount}

      Products:
      ${order.products
        .map(
          (p) =>
            `${p.name} - Qty: ${p.quantity}, Color: ${p.color}, Size: ${p.size}, Price: ${p.price}`
        )
        .join("\n")}
    `;
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${order.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const showTracking = (order) => {
    alert(
      `Tracking for Order #${order.id}: Status - ${order.tracking.status}, Estimated Delivery - ${order.tracking.estimatedDate}`
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "on the way":
        return "text-orange-600 bg-orange-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-qyellow bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleShowMore = () => {
    setVisibleOrdersCount(filteredOrders.length);
    if (ordersContainerRef.current) {
      ordersContainerRef.current.scrollTo({
        top: ordersContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // If Wishlist tab is active
  if (activeTab === "Wishlist") {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-qblack mb-2">My Orders</h2>
          <p className="text-qgray">Track and manage your orders</p>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="text-center py-12 bg-white rounded-lg border border-qgray-border">
          <h3 className="text-lg font-semibold text-qblack mb-2">
            Wishlist Content
          </h3>
          <p className="text-sm text-qgray">
            Please navigate to the Wishlist section to view your saved items.
          </p>
        </div>
      </div>
    );
  }

  // If no orders
  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-qblack mb-2">My Orders</h2>
          <p className="text-qgray">Track and manage your orders</p>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="text-center py-12 bg-white rounded-lg border border-qgray-border">
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
          <h3 className="text-lg font-medium text-qblack mb-2">
            No orders found
          </h3>
          <p className="text-qgray max-w-sm">
            {activeTab === "All orders"
              ? "You haven't placed any orders yet."
              : `You don't have any ${activeTab.toLowerCase()} orders.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-qblack mb-2">My Orders</h2>
        <p className="text-qgray">
          {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
        </p>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Scrollable container with proper height and custom scrollbar */}
      <div
        ref={ordersContainerRef}
        className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e0 #f1f5f9'
        }}
      >
        {filteredOrders.slice(0, visibleOrdersCount).map((order) => (
          <div
            key={order.id}
            className="border border-qgray-border rounded-lg p-4 sm:p-6 bg-white hover:shadow-md transition-shadow duration-200"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h3 className="font-bold text-xl text-qblack">
                    Order #{order.id}
                  </h3>
                  {/* <span
                    className={`text-sm font-medium ${getStatusColor(
                      order.status
                    )} px-3 py-1 rounded-full w-fit`}
                  >
                    {order.status}
                  </span> */}
                </div>
                <p className="text-sm text-qgray">
                  By Alex John | {order.date}
                </p>
              </div>

              <button
                className="px-4 py-2 border border-qgray-border bg-white text-qblack rounded-lg hover:bg-primarygray flex items-center justify-center space-x-2 text-sm transition-all duration-200 w-full sm:w-auto mt-2 sm:mt-0"
                onClick={() => downloadInvoice(order)}
              >
                <FaDownload className="text-lg" />
                <span>Download invoice</span>
              </button>
            </div>

            <div className="border-t border-qgray-border my-4"></div>

            {/* Order Details */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
              <div className="space-y-3 flex-1">
                <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                  <span className="text-sm text-qgray min-w-[120px]">Status:</span>
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      order.status
                    )} px-2 py-1 rounded-full w-fit`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                  <span className="text-sm text-qgray min-w-[120px]">
                    Date of delivery:
                  </span>
                  <span className="text-sm font-medium text-qblack">
                    {order.deliveryDate}
                  </span>
                </div>

                <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                  <span className="text-sm text-qgray min-w-[120px]">
                    Delivered to:
                  </span>
                  <span className="text-sm font-medium text-qblack break-words">
                    {order.shippingAddress}
                  </span>
                </div>

                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 pt-2">
                  <span className="text-base text-qgray min-w-[120px]">Total:</span>
                  <span className="text-lg font-bold text-qblack">
                    {order.amount}
                  </span>
                </div>
              </div>

              <button
                className="px-4 py-3 bg-qyellow text-qblack rounded-lg hover:bg-amber-500 flex items-center justify-center space-x-2 text-sm font-semibold transition-all duration-200 w-full lg:w-auto mt-4 lg:mt-0"
                onClick={() => showTracking(order)}
              >
                <FaTruck className="text-lg" />
                <span>Order Tracking</span>
              </button>
            </div>

            <div className="border-t border-qgray-border my-4"></div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-primarygray rounded-lg border border-qgray-border"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-qgray-border"
                  />
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="font-medium text-qblack text-sm leading-tight line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-xs text-qgray">
                      Quantity: {product.quantity}x = {product.price}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <p className="text-xs text-qgray">
                        Color: {product.color}
                      </p>
                      <p className="text-xs text-qgray">
                        Size: {product.size}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-qgray-border">
              <button className="text-sm text-qblack bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors text-center">
                View Order Details
              </button>

              {order.status.toLowerCase() === "delivered" && (
                <button className="text-sm text-qyellow bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors text-center">
                  Buy Again
                </button>
              )}

              {order.canReturn && (
                <button className="text-sm text-qred bg-white border border-qgray-border px-4 py-2 rounded-lg font-medium hover:bg-primarygray transition-colors text-center">
                  Return Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {visibleOrdersCount < filteredOrders.length && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 bg-qyellow text-qblack rounded-lg hover:bg-amber-500 text-sm font-semibold transition-all duration-200"
            onClick={handleShowMore}
          >
            Show More Orders
          </button>
        </div>
      )}
    </div>
  );
}