import React, { useState, useEffect } from 'react';
import { Check, Download, Share2, Home, ShoppingBag, MapPin, Shield, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThankYouPopup({ 
  isOpen, 
  onClose, 
  orderDetails,
  onContinueShopping 
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden border border-gray-200">
          
          {/* Header */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Order Confirmed</h2>
                  <p className="text-gray-600 text-sm">Thank you for your purchase</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-black">{orderDetails?.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-black">₹{orderDetails?.totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-black mb-3">Order Items</h3>
              <div className="space-y-3">
                {orderDetails?.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-black text-sm truncate">{item.name}</h4>
                      <p className="text-gray-600 text-xs">{item.color} • Size: {item.size}</p>
                      <p className="font-semibold text-black text-sm">₹{item.price}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 justify-end">
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        <span className="font-medium text-black text-xs">Confirmed</span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-black" />
                  <h4 className="font-semibold text-black text-sm">Delivery Address</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-black">{orderDetails?.deliveryAddress?.fullName}</p>
                  <p className="text-gray-600">{orderDetails?.deliveryAddress?.address}</p>
                  <p className="text-gray-600">{orderDetails?.deliveryAddress?.city}, {orderDetails?.deliveryAddress?.state}</p>
                  <p className="text-gray-600">{orderDetails?.deliveryAddress?.pincode}</p>
                  <p className="text-gray-600 font-medium mt-2">{orderDetails?.deliveryAddress?.phone}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-black" />
                  <h4 className="font-semibold text-black text-sm">Payment Method</h4>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-black text-sm capitalize">{orderDetails?.paymentMethod}</p>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                    <span className="font-medium text-black text-xs">Payment Successful</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="flex gap-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded text-black hover:bg-gray-50 transition-all font-medium text-xs">
                  <Download className="w-3 h-3" />
                  <span>Invoice</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded text-black hover:bg-gray-50 transition-all font-medium text-xs">
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
              </div>
              
              <div className="flex gap-2">
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded text-black hover:bg-gray-50 transition-all font-medium text-xs"
                >
                  <Home className="w-3 h-3" />
                  <span>Home</span>
                </Link>
                <button
                  onClick={onContinueShopping}
                  className="flex items-center space-x-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition-all font-semibold text-xs"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}