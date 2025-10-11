import React from "react";
import { FaTruck, FaDownload } from "react-icons/fa";

export default function Wishlist({ orders }) {
  const downloadInvoice = (order) => {
    const invoiceContent = `
      Order #${order.id}
      Date: ${order.date}
      Status: ${order.status}
      Date of Delivery: ${order.deliveryDate}
      Delivered to: ${order.shippingAddress}
      Total: ${order.amount}

      Products:
      ${order.products.map(p => `${p.name} - Qty: ${p.quantity}, Color: ${p.color}, Size: ${p.size}, Price: ${p.price}`).join('\n')}
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
    alert(`Tracking for Order #${order.id}: Status - ${order.tracking.status}, Estimated Delivery - ${order.tracking.estimatedDate}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-500 bg-green-100';
      case 'on the way': return 'text-orange-600';
      case 'shipped': return 'text-blue-500 bg-blue-100';
      case 'processing': return 'text-green-600';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-gray-900">Order #: {order.id}</h3>
              <p className="text-sm text-gray-600">By Alex John | {order.date}</p>
            </div>
            <button
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm transition-all duration-200 shadow-sm"
              onClick={() => downloadInvoice(order)}
            >
              <FaDownload className="text-lg" />
              <span>Download invoice</span>
            </button>
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          <div className="flex justify-between items-start mb-3">
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-sm text-gray-700 w-32">Status:</span>
                <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-700 w-32">Date of delivery:</span>
                <span className="text-sm font-medium">{order.deliveryDate}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-700 w-32">Delivered to:</span>
                <span className="text-sm font-medium">{order.shippingAddress}</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-base text-gray-700 w-32">Total:</span>
                <span className="text-lg font-bold text-gray-900">{order.amount}</span>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm transition-all duration-200 shadow-md"
              onClick={() => showTracking(order)}
            >
              <FaTruck className="text-lg" />
              <span>Order Tracking</span>
            </button>
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          <div className="grid grid-cols-2 gap-4">
            {order.products.map((product, index) => (
              <div key={index} className="flex items-start space-x-3 p-2">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                />
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm leading-tight">{product.name}</p>
                  <p className="text-xs text-gray-600">Quantity: {product.quantity}x = {product.price}</p>
                  <p className="text-xs text-gray-600">Color: {product.color}</p>
                  <p className="text-xs text-gray-600">Size: {product.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}