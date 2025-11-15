import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Truck, 
  Download, 
  Star, 
  Eye, 
  ShoppingCart,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package
} from "lucide-react";
import TabNavigation from "./TabNavigation";
import { useOrders } from "../../../CheakoutPage/useOrders";
import { useAuth } from "../../hooks/useAuth";

export default function AllOrders() {
  const [activeTab, setActiveTab] = useState("All orders");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { orders, loading, error, loadOrders, dismissError, currentOrders } = useOrders();
  const { isAuthenticated } = useAuth();

  // Handle URL hash to set active tab on page load
  useEffect(() => {
    const hash = location.hash;
    const tabMap = {
      "#allorders": "All orders",
      "#current": "Current",
      "#wishlist": "Wishlist"
    };
    setActiveTab(tabMap[hash] || "All orders");
  }, [location]);

  // Filter orders based on active tab
  useEffect(() => {
    if (activeTab === "All orders") {
      setFilteredOrders(orders);
    } else if (activeTab === "Current") {
      setFilteredOrders(currentOrders);
    } else if (activeTab === "Wishlist") {
      setFilteredOrders([]);
    }
  }, [activeTab, orders, currentOrders]);

  const handleReviewClick = (orderId) => {
    navigate("/profile#review", {
      state: { orderId },
    });
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = (order) => {
    alert(
      `Tracking for Order #${order.id}: Status - ${order.tracking?.status || order.status}, Estimated Delivery - ${order.tracking?.estimatedDate || order.estimatedDelivery}`
    );
  };

  const handleReorder = (order) => {
    alert(`Adding items from order #${order.id} to cart`);
  };

  const downloadInvoice = async (order) => {
    try {
      const invoiceContent = `
        SHOPO STORE
        ============
        
        Order #${order.id}
        Date: ${order.date}
        Status: ${order.status}
        Payment Method: ${order.paymentMode}
        Delivery Date: ${order.deliveryDate}
        
        Shipping Address:
        ${order.shippingAddress}
        
        ORDER SUMMARY:
        ${order.items.map((item, index) => 
          `${index + 1}. ${item.name}
           Quantity: ${item.quantity}
           Color: ${item.color}
           Size: ${item.size}
           Price: ${item.price}
          `
        ).join('\n')}
        
        Total Amount: ${order.amount}
        Discounts: ${order.discounts || '$0'}
        Loyalty Points: ${order.loyaltyPoints || '0'}
        
        Thank you for shopping with us!
      `;
      
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shopo-invoice-${order.id}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
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
        return "text-black-900 bg-white-400";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-black-300 bg-white-400";
    }
  };

  const getStatusConfig = (status) => {
    const statusLower = status.toLowerCase();
    const configs = {
      delivered: {
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
        label: "Delivered"
      },
      "on the way": {
        color: "text-orange-600 bg-orange-100",
        icon: Truck,
        label: "On the way"
      },
      shipped: {
        color: "text-blue-600 bg-blue-100",
        icon: Truck,
        label: "Shipped"
      },
      processing: {
        color: "text-yellow-600 bg-yellow-100",
        icon: Clock,
        label: "Processing"
      },
      pending: {
        color: "text-black-900 bg-white-400",
        icon: Clock,
        label: "Pending"
      },
      cancelled: {
        color: "text-red-600 bg-red-100",
        icon: XCircle,
        label: "Cancelled"
      }
    };
    
    return configs[statusLower] || {
      color: "text-black-300 bg-white-400",
      icon: AlertCircle,
      label: status
    };
  };

  const canReviewOrder = (order) => {
    const status = order.status.toLowerCase();
    return status === "delivered" && !order.isReviewed;
  };

  const canTrackOrder = (order) => {
    const status = order.status.toLowerCase();
    return !["delivered", "cancelled"].includes(status);
  };

  const canReturnItem = (order) => {
    return order.canReturn && order.status.toLowerCase() === "delivered";
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black-900 mb-2">My Orders</h2>
          <p className="text-black-300">Track and manage your orders</p>
        </div>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black-900"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black-900 mb-2">My Orders</h2>
          <p className="text-black-300">Unable to load orders</p>
        </div>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="bg-white-500 border border-black-300 rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-black-700 mr-2" />
              <p className="text-black-800 text-sm">{error}</p>
            </div>
            <button
              onClick={() => loadOrders()}
              className="text-black-800 hover:text-black-900 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black-900 mb-2">My Orders</h2>
          <p className="text-black-300">Track and manage your orders</p>
        </div>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500">
          <div className="w-16 h-16 bg-white-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-black-600" />
          </div>
          <h3 className="text-lg font-semibold text-black-900 mb-2">Please Login</h3>
          <p className="text-sm text-black-600 mb-4">
            You need to be logged in to view your orders.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-black-900 text-white-50 px-6 py-2 rounded-lg hover:bg-black-800 transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // Wishlist tab
  if (activeTab === "Wishlist") {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black-900 mb-2">My Orders</h2>
          <p className="text-black-300">Track and manage your orders</p>
        </div>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500">
          <h3 className="text-lg font-semibold text-black-900 mb-2">Wishlist Content</h3>
          <p className="text-sm text-black-300">
            Please navigate to the Wishlist section to view your saved items.
          </p>
        </div>
      </div>
    );
  }

  // No orders
  if (filteredOrders.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black-900 mb-2">My Orders</h2>
          <p className="text-black-300">Track and manage your orders</p>
        </div>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500">
          <div className="mx-auto h-24 w-24 text-black-300 mb-4">
            <Package className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-black-900 mb-2">No orders found</h3>
          <p className="text-black-300 max-w-sm">
            {activeTab === "All orders"
              ? "You haven't placed any orders yet."
              : `You don't have any ${activeTab.toLowerCase()} orders.`}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 bg-black-900 text-white-50 px-6 py-2 rounded-lg hover:bg-black-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black-900 mb-2">My Orders</h2>
        <p className="text-black-300">
          {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
        </p>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="space-y-6 mt-6">
        {filteredOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={order.id}
              className="border border-white-500 rounded-lg p-4 sm:p-6 bg-white-50 hover:shadow-md transition-all duration-200"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h3 className="font-bold text-xl text-black-900">
                      Order #{order.id}
                    </h3>
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        order.status
                      )} px-2 py-1 rounded-full w-fit`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-black-300">
                    By {order.customerName || "Alex John"} | {order.date}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-black-300">Total Amount</p>
                  <p className="text-xl font-bold text-black-900">{order.amount}</p>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {order.items.slice(0, 4).map((product, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white-400 rounded-lg border border-white-500"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-white-500"
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="font-medium text-black-900 text-sm leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-black-300">
                        Quantity: {product.quantity}x = {product.price}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <p className="text-xs text-black-300">
                          Color: {product.color}
                        </p>
                        <p className="text-xs text-black-300">
                          Size: {product.size}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white-500">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="text-sm text-black-900 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center"
                  >
                    View Details
                  </button>
                  
                  {canTrackOrder(order) && (
                    <button
                      onClick={() => handleTrackOrder(order)}
                      className="text-sm text-black-900 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center"
                    >
                      Track Order
                    </button>
                  )}

                  {canReturnItem(order) && (
                    <button className="text-sm text-red-600 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center">
                      Return Item
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {canReviewOrder(order) && (
                    <button
                      onClick={() => handleReviewClick(order.id)}
                      className="text-sm text-white-50 bg-black-900 border border-black-900 px-4 py-2 rounded-lg font-medium hover:bg-black-700 hover:border-black-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Write Review
                    </button>
                  )}

                  {order.status.toLowerCase() === "delivered" && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="text-sm text-black-900 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center"
                    >
                      Buy Again
                    </button>
                  )}

                  <button
                    onClick={() => downloadInvoice(order)}
                    className="text-sm text-black-900 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Invoice
                  </button>
                </div>
              </div>

              {/* Review Prompt */}
              {canReviewOrder(order) && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Star className="w-5 h-5 text-amber-600" />
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
          );
        })}
      </div>
    </div>
  );
}