import React from "react";

export default function AllOrders({ orders }) {
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
              <div className="flex items-center mt-1">
                <span className="text-base text-gray-700 w-32">Total:</span>
                <span className="text-lg font-bold text-gray-900">{order.amount}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}