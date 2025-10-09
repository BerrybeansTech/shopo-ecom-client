import React, { useState } from "react";

export default function OrderTab() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(null);

  // Mock data for orders
  const orders = [
    {
      id: "#354",
      date: "Feb 05, 2021",
      status: "Delivered",
      amount: "$757",
      paymentMode: "UPI",
      products: [
        { name: "Wireless Headphones", price: "$299", quantity: 1, thumbnail: "/path/to/image1.jpg" },
        { name: "Smart Watch", price: "$458", quantity: 1, thumbnail: "/path/to/image2.jpg" }
      ],
      shippingAddress: "123 Main St, City, State 12345",
      tracking: { status: "Delivered", estimatedDate: "Feb 10, 2021" },
      discounts: "$50",
      loyaltyPoints: "150",
      canReturn: true
    },
    {
      id: "#355",
      date: "Feb 10, 2021",
      status: "Shipped",
      amount: "$299",
      paymentMode: "COD",
      products: [
        { name: "Bluetooth Speaker", price: "$299", quantity: 1, thumbnail: "/path/to/image3.jpg" }
      ],
      shippingAddress: "456 Oak Ave, City, State 67890",
      tracking: { status: "Out for delivery", estimatedDate: "Feb 15, 2021" },
      discounts: "$0",
      loyaltyPoints: "75",
      canReturn: false
    },
    {
      id: "#356",
      date: "Feb 15, 2021",
      status: "Processing",
      amount: "$150",
      paymentMode: "BNPL (Simpl)",
      products: [
        { name: "Phone Case", price: "$50", quantity: 3, thumbnail: "/path/to/image4.jpg" }
      ],
      shippingAddress: "789 Pine Rd, City, State 54321",
      tracking: { status: "Processing", estimatedDate: "Feb 20, 2021" },
      discounts: "$25",
      loyaltyPoints: "50",
      canReturn: false
    }
  ];

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleReturnRequest = (orderId) => {
    setShowReturnForm(orderId);
  };

  const submitReturnRequest = (orderId) => {
    // Mock return submission
    alert(`Return request submitted for order ${orderId}`);
    setShowReturnForm(null);
  };

  const downloadInvoice = (orderId) => {
    // Mock invoice download
    alert(`Downloading invoice for order ${orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-500 bg-green-100';
      case 'shipped': return 'text-blue-500 bg-blue-100';
      case 'processing': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <>
      <div className="relative w-full overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {/* table heading */}
            <tr className="text-base text-qgray whitespace-nowrap px-2 border-b default-border-bottom ">
              <td className="py-4 block whitespace-nowrap text-center">
                Order
              </td>
              <td className="py-4 whitespace-nowrap text-center">Date</td>
              <td className="py-4 whitespace-nowrap text-center">Status</td>
              <td className="py-4 whitespace-nowrap text-center">Amount</td>
              <td className="py-4 whitespace-nowrap  text-center">Action</td>
            </tr>
            {/* table heading end */}
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <td className="text-center py-4">
                    <span className="text-lg text-qgray font-medium">{order.id}</span>
                  </td>
                  <td className="text-center py-4 px-2">
                    <span className="text-base text-qgray whitespace-nowrap">
                      {order.date}
                    </span>
                  </td>
                  <td className="text-center py-4 px-2">
                    <span className={`text-sm rounded p-2 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center py-4 px-2">
                    <span className="text-base text-qblack whitespace-nowrap px-2">
                      {order.amount}
                    </span>
                  </td>
                  <td className="text-center py-4">
                    <div className="flex flex-col space-y-2">
                      <button
                        type="button"
                        className="w-[116px] h-[36px] bg-qyellow text-qblack font-bold text-sm"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                      {order.canReturn && (
                        <button
                          type="button"
                          className="w-[116px] h-[36px] bg-red-500 text-white font-bold text-sm"
                          onClick={() => handleReturnRequest(order.id)}
                        >
                          Return
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="order-details">
                        {/* Order Tracking */}
                        <div className="tracking-section mb-4">
                          <h4 className="font-semibold text-qblack mb-2">Order Tracking</h4>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.tracking.status)}`}>
                              {order.tracking.status}
                            </span>
                            <span className="text-sm text-qgray">
                              Estimated Delivery: {order.tracking.estimatedDate}
                            </span>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="products-section mb-4">
                          <h4 className="font-semibold text-qblack mb-2">Products</h4>
                          {order.products.map((product, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                              <img src={product.thumbnail} alt={product.name} className="w-12 h-12 object-cover rounded" />
                              <div>
                                <span className="font-medium">{product.name}</span>
                                <span className="text-sm text-qgray ml-2">Qty: {product.quantity}</span>
                                <span className="text-sm text-qgray ml-2">{product.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping & Payment */}
                        <div className="shipping-payment-section mb-4 grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-qblack mb-2">Shipping Address</h4>
                            <p className="text-sm text-qgray">{order.shippingAddress}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-qblack mb-2">Payment Info</h4>
                            <p className="text-sm text-qgray">Mode: {order.paymentMode}</p>
                            {order.paymentMode === 'COD' && (
                              <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded">
                                Complete COD Confirmation
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Offers & Discounts */}
                        <div className="offers-section mb-4">
                          <h4 className="font-semibold text-qblack mb-2">Offers & Discounts</h4>
                          <div className="flex space-x-4">
                            <span className="text-sm">Discount Applied: {order.discounts}</span>
                            <span className="text-sm">Loyalty Points Earned: {order.loyaltyPoints}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="actions-section">
                          <button
                            className="px-4 py-2 bg-qyellow text-qblack font-semibold rounded mr-2"
                            onClick={() => downloadInvoice(order.id)}
                          >
                            Download Invoice
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded"
                            onClick={() => handleReturnRequest(order.id)}
                          >
                            Request Exchange
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {showReturnForm === order.id && (
                  <tr className="bg-red-50">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="return-form">
                        <h4 className="font-semibold text-qblack mb-2">Return Request Form</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-qgray mb-1">Reason for Return</label>
                            <select className="w-full p-2 border rounded">
                              <option>Defective Product</option>
                              <option>Wrong Item</option>
                              <option>Changed Mind</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-qgray mb-1">Quantity to Return</label>
                            <input type="number" min="1" max={order.products[0].quantity} defaultValue="1" className="w-full p-2 border rounded" />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-qgray mb-1">Comments</label>
                          <textarea className="w-full p-2 border rounded" rows="3" placeholder="Additional comments..."></textarea>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded"
                            onClick={() => submitReturnRequest(order.id)}
                          >
                            Submit Return Request
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded"
                            onClick={() => setShowReturnForm(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
