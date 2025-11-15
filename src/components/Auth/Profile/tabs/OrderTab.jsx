import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Truck, 
  Download, 
  Eye, 
  ShoppingCart,
  Calendar,
  MapPin,
  DollarSign,
  Package,
  Clock,
  X,
  AlertCircle
} from "lucide-react";
import TabNavigation from "./TabNavigation";
import { useOrders } from "../../../CheakoutPage/useOrders";
import { useAuth } from "../../hooks/useAuth";

export default function OrderTab() {
  const [activeTab, setActiveTab] = useState("Current");
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(1);
  const ordersContainerRef = useRef(null);
  const navigate = useNavigate();

  const { currentOrders, loading, error, loadOrders, cancelOrder, dismissError } = useOrders();
  const { isAuthenticated } = useAuth();

  // Handle URL hash to set active tab on page load
  useEffect(() => {
    const hash = window.location.hash;
    const tabMap = {
      "#current": "Current",
      "#allorders": "All orders",
      "#wishlist": "Wishlist"
    };
    setActiveTab(tabMap[hash] || "Current");
  }, []);

  // Handle show more functionality
  const handleShowMore = () => {
    setVisibleOrdersCount(currentOrders.length);
    if (ordersContainerRef.current) {
      ordersContainerRef.current.scrollTo({
        top: ordersContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = async (order) => {
    alert(
      `Tracking for Order #${order.id}: Status - ${order.tracking?.status || order.status}, Estimated Delivery - ${order.tracking?.estimatedDate || order.estimatedDelivery}`
    );
  };

  const handleReorder = (order) => {
    alert(`Adding items from order #${order.id} to cart`);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancellingOrder(orderId);
    const result = await cancelOrder(orderId);
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error || 'Failed to cancel order');
    }
    setCancellingOrder(null);
  };

  const downloadInvoice = async (order) => {
    try {
      const invoiceContent = `
        SHOPO STORE - CURRENT ORDER
        ===========================
        
        Order #${order.id}
        Date: ${order.date}
        Status: ${order.status}
        Estimated Delivery: ${order.tracking?.estimatedDate || order.estimatedDelivery}
        
        Shipping Address:
        ${order.shippingAddress}
        
        ITEMS:
        ${order.items.map((item, index) => 
          `${index + 1}. ${item.name}
           Quantity: ${item.quantity}
           Color: ${item.color}
           Size: ${item.size}
           Price: ${item.price}
          `
        ).join('\n')}
        
        Total: ${order.amount}
        Payment Method: ${order.paymentMode}
        
        Track your order for real-time updates!
      `;
      
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shopo-current-order-${order.id}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
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
      default:
        return "text-black-300 bg-white-400";
    }
  };

  const getStatusConfig = (status) => {
    const statusLower = status.toLowerCase();
    const configs = {
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
      }
    };
    
    return configs[statusLower] || {
      color: "text-black-300 bg-white-400",
      icon: AlertCircle,
      label: status
    };
  };

  const canCancelOrder = (order) => {
    const status = order.status.toLowerCase();
    return ['pending', 'processing'].includes(status);
  };

  const canReturnItem = (order) => {
    return order.canReturn && order.status.toLowerCase() === "delivered";
  };

  // Loading state
  if (loading && !cancellingOrder) {
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
        <div className="text-center py-12 bg-white-400 rounded-lg border border-black-300">
          <div className="w-16 h-16 bg-white-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-black-600" />
          </div>
          <h3 className="text-lg font-semibold text-black-900 mb-2">Please Login</h3>
          <p className="text-sm text-black-600 mb-4">
            You need to be logged in to view your current orders.
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

  // No current orders
  if (currentOrders.length === 0) {
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
          <h3 className="text-lg font-medium text-black-900 mb-2">
            No active orders
          </h3>
          <p className="text-black-300 max-w-sm">
            {activeTab === "Current"
              ? "You don't have any orders in progress. All your orders have been delivered or cancelled."
              : "You haven't placed any orders yet."}
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

  const displayedOrders = currentOrders.slice(0, visibleOrdersCount);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black-900 mb-2">My Orders</h2>
        <p className="text-black-300">
          {displayedOrders.length} active {displayedOrders.length === 1 ? "order" : "orders"} in progress
        </p>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Scrollable container */}
      <div
        ref={ordersContainerRef}
        className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e0 #f1f5f9'
        }}
      >
        {displayedOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          const isCancelling = cancellingOrder === order.id;

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
                  </div>
                  <p className="text-sm text-black-300">
                    By Alex John | {order.date}
                  </p>
                </div>

                <button
                  className="px-4 py-2 border border-white-500 bg-white-50 text-black-900 rounded-lg hover:bg-white-400 flex items-center justify-center space-x-2 text-sm transition-all duration-200 w-full sm:w-auto mt-2 sm:mt-0"
                  onClick={() => downloadInvoice(order)}
                >
                  <Download className="text-lg" />
                  <span>Download invoice</span>
                </button>
              </div>

              <div className="border-t border-white-500 my-4"></div>

              {/* Order Details */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                    <span className="text-sm text-black-300 min-w-[120px]">Status:</span>
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        order.status
                      )} px-2 py-1 rounded-full w-fit`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                    <span className="text-sm text-black-300 min-w-[120px]">
                      Date of delivery:
                    </span>
                    <span className="text-sm font-medium text-black-900">
                      {order.tracking?.estimatedDate || order.estimatedDelivery}
                    </span>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                    <span className="text-sm text-black-300 min-w-[120px]">
                      Delivered to:
                    </span>
                    <span className="text-sm font-medium text-black-900 break-words">
                      {order.shippingAddress}
                    </span>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 pt-2">
                    <span className="text-base text-black-300 min-w-[120px]">Total:</span>
                    <span className="text-lg font-bold text-black-900">
                      {order.amount}
                    </span>
                  </div>
                </div>

                <button
                  className="px-4 py-3 bg-black-900 text-white-50 rounded-lg hover:bg-black-700 flex items-center justify-center space-x-2 text-sm font-semibold transition-all duration-200 w-full lg:w-auto mt-4 lg:mt-0"
                  onClick={() => handleTrackOrder(order)}
                >
                  <Truck className="text-lg" />
                  <span>Order Tracking</span>
                </button>
              </div>

              <div className="border-t border-white-500 my-4"></div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.items.map((product, index) => (
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

              {/* Additional Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-white-500">
                <button 
                  onClick={() => handleViewDetails(order.id)}
                  className="text-sm text-black-900 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center"
                >
                  View Order Details
                </button>

                {order.status.toLowerCase() === "delivered" && (
                  <button 
                    onClick={() => handleReorder(order)}
                    className="text-sm text-black-900 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center"
                  >
                    Buy Again
                  </button>
                )}

                {canReturnItem(order) && (
                  <button className="text-sm text-red-600 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center">
                    Return Item
                  </button>
                )}

                {canCancelOrder(order) && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={isCancelling}
                    className={`text-sm text-red-600 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium transition-colors text-center ${
                      isCancelling 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-white-400'
                    }`}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {visibleOrdersCount < currentOrders.length && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 bg-black-900 text-white-50 rounded-lg hover:bg-black-700 text-sm font-semibold transition-all duration-200"
            onClick={handleShowMore}
          >
            Show More Orders
          </button>
        </div>
      )}
    </div>
  );
}