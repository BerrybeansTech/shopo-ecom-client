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
  Package,
  Award
} from "lucide-react";
import TabNavigation from "./TabNavigation";
import { useOrders } from "../../../CheakoutPage/useOrders";
import { useAuth } from "../../hooks/useAuth";
import { getProductImage } from "../../../../utils/imageUtils";
import PleaseLogin from "./PleaseLogin";

export default function AllOrders() {
  const [activeTab, setActiveTab] = useState("All orders");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ORDER_LIMIT = 2;

  const { orders, loading, error, loadOrders, dismissError, currentOrders, pagination } = useOrders();
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
    setCurrentPage(1); // Reset page on tab change
  }, [location]);

  // Load orders when page or authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders({ page: currentPage, limit: ORDER_LIMIT });
      // Smooth scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isAuthenticated, currentPage, loadOrders]);

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

  const handleReviewClick = (order) => {
    // Find the first unreviewed product
    const unreviewedItem = order.items.find(item => item.canReview);
    
    if (unreviewedItem && unreviewedItem.productId) {
      // Navigate to review tab with product ID
      navigate(`/profile?productId=${unreviewedItem.productId}#review`);
    } else if (order.items.length > 0) {
      // If all items are reviewed, show message
      alert('You have already reviewed all products in this order.');
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = (order) => {
    alert(
      `Tracking for Order #${order.orderId || order.id}: Status - ${order.displayStatus}, Estimated Delivery - ${order.tracking?.estimatedDate || order.estimatedDelivery}`
    );
  };

  const handleReorder = (order) => {
    alert(`Adding items from order #${order.id} to cart`);
  };

  const downloadInvoice = async (order) => {
    try {
      const invoiceContent = `
        Rabbit and Finch
        ============
        
        Order #${order.orderId || order.id}
        Date: ${order.date}
        Status: ${order.displayStatus}
        Payment Method: ${order.paymentMode}
        Payment Status: ${order.paymentStatus}
        Delivery Date: ${order.deliveryDate}
        
        Shipping Address:
        ${order.shippingAddress}
        
        ${order.orderNote ? `Order Note: ${order.orderNote}\n` : ''}
        
        ORDER SUMMARY:
        ${order.items.map((item, index) => 
          `${index + 1}. ${item.name}
           Quantity: ${item.quantity}
           Color: ${item.color}
           Size: ${item.size}
           Price: ${item.price}
           ${item.isReviewed ? 'Status: Reviewed' : 'Status: Not Reviewed'}
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
      link.download = `shopo-invoice-${order.orderId || order.id}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const getStatusConfig = (status) => {
    const statusLower = status.toLowerCase();
    const configs = {
      'pending': {
        color: "text-yellow-600 bg-yellow-100",
        icon: Clock,
        label: "Pending"
      },
      'shipped': {
        color: "text-blue-600 bg-blue-100",
        icon: Truck,
        label: "Shipped"
      },
      'delivered': {
        color: "text-green-600 bg-green-100",
        icon: CheckCircle,
        label: "Delivered"
      },
      'cancelled': {
        color: "text-red-600 bg-red-100",
        icon: XCircle,
        label: "Cancelled"
      },
      'returned': {
        color: "text-purple-600 bg-purple-100",
        icon: Package,
        label: "Returned"
      },
      'complete': {
        color: "text-green-700 bg-green-100",
        icon: Award,
        label: "Complete"
      }
    };
    
    return configs[statusLower] || {
      color: "text-gray-600 bg-gray-100",
      icon: AlertCircle,
      label: status
    };
  };

  const canReviewOrder = (order) => {
    return order.canReview;
  };

  const canTrackOrder = (order) => {
    return ['shipped', 'delivered'].includes(order.status);
  };

  const canReturnItem = (order) => {
    return order.canReturn;
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
        <PleaseLogin message="You need to be logged in to view your orders." />
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
            onClick={() => navigate('/all-products')}
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
        <h2 className="text-2xl font-bold text-black-900 mb-2">All Orders</h2>
        <p className="text-black-300">
          {pagination?.totalItems || filteredOrders.length} { (pagination?.totalItems || filteredOrders.length) === 1 ? "order" : "orders"} found
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
                      Order #{order.orderId || order.id}
                    </h3>
                    <span
                      className={`text-sm font-medium ${statusConfig.color} px-2 py-1 rounded-full w-fit flex items-center gap-1`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-black-300">
                    By {order.customerName} | {order.date}
                  </p>
                  {order.orderNote && (
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Note:</span> {order.orderNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-black-300">Total Amount</p>
                  <p className="text-xl font-bold text-black-900">{order.amount}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment: {order.paymentStatus}
                  </p>
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
                      src={getProductImage(product)}
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
                      {product.isReviewed && (
                        <p className="text-xs text-green-600 font-medium">
                          ✓ Reviewed
                        </p>
                      )}
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
                    <button className="text-sm text-purple-600 bg-white-50 border border-white-500 px-4 py-2 rounded-lg font-medium hover:bg-white-400 transition-colors text-center">
                      Return Item
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {canReviewOrder(order) && (
                    <button
                      onClick={() => handleReviewClick(order)}
                      className="text-sm text-white-50 bg-black-900 border border-black-900 px-4 py-2 rounded-lg font-medium hover:bg-black-700 hover:border-black-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Write Review
                    </button>
                  )}

                  {['delivered', 'complete'].includes(order.status) && (
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
                        Help other customers by reviewing products from this order
                      </p>
                    </div>
                    <button
                      onClick={() => handleReviewClick(order)}
                      className="text-sm bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Review Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 mb-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 border border-white-500 rounded-lg text-sm font-medium hover:bg-white-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Only show a limited number of page buttons
              if (
                pageNum === 1 || 
                pageNum === pagination.totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum 
                        ? "bg-black-900 text-white-50" 
                        : "border border-white-500 hover:bg-white-400"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === 2 && currentPage > 3) || 
                (pageNum === pagination.totalPages - 1 && currentPage < pagination.totalPages - 2)
              ) {
                return <span key={pageNum} className="px-1 text-black-300 text-xs">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-3 py-2 border border-white-500 rounded-lg text-sm font-medium hover:bg-white-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}