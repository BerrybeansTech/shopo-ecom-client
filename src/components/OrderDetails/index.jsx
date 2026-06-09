import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "../Partials/Layout";
import PageTitle from "../Helpers/PageTitle";
import { CheckCircle, Truck, Package, Download, ArrowLeft } from 'lucide-react';
import { useOrders } from '../CheakoutPage/useOrders';
import { downloadInvoicePDF } from '../../utils/invoiceHelper';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, loading, loadOrders } = useOrders();
  const [order, setOrder] = useState(null);

  const handleDownloadInvoice = async () => {
    await downloadInvoicePDF(order, (newFileName) => {
      setOrder(prev => ({ ...prev, invoiceFile: newFileName }));
    });
  };

  useEffect(() => {
    if (orders.length === 0) {
      loadOrders();
    }
  }, [loadOrders, orders.length]);

  useEffect(() => {
    if (orders.length > 0) {
      const found = orders.find(o => String(o.id) === String(orderId) || String(o.orderId) === String(orderId));
      if (found) {
        setOrder(found);
      }
    }
  }, [orders, orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </Layout>
    );
  }

  if (!order && !loading && orders.length > 0) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't locate the order you're looking for.</p>
          <button onClick={() => navigate('/profile')} className="bg-black text-white px-6 py-2 rounded">
            Back to Profile
          </button>
        </div>
      </Layout>
    );
  }

  if (!order) return <Layout><div className="min-h-screen bg-gray-50"></div></Layout>;

  return (
    <Layout childrenClasses="pt-0 pb-0 min-h-[70vh] bg-gray-50">
      <div className="tracking-page-wrapper w-full">
        <div className="page-title mb-[40px]">
          <PageTitle
            title="Order Details"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "Profile", path: "/profile" },
              { name: "Order Details", path: `/orders/${orderId}` },
            ]}
          />
        </div>

        <div className="container-x mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">Order #{order.orderId || order.id}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full capitalize">
                    {order.displayStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Placed on {order.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => navigate('/track-order', { state: { orderId: order.orderId || order.id } })}
                  className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Track Order
                </button>
                <button 
                  onClick={handleDownloadInvoice}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Invoice
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Order Items */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Items in Order</h3>
              <div className="space-y-4 mb-8">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 rounded-lg">
                    <img 
                      src={item.thumbnail} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">
                        <span>Color: <span className="font-medium text-gray-700">{item.color}</span></span>
                        <span>Size: <span className="font-medium text-gray-700">{item.size}</span></span>
                        <span>Qty: <span className="font-medium text-gray-700">{item.quantity}</span></span>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0 w-full sm:w-auto">
                      <p className="font-bold text-gray-900 text-lg">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" /> Payment Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method</span>
                      <span className="font-medium text-gray-800 capitalize">{order.paymentMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-green-600 capitalize">{order.paymentStatus}</span>
                    </div>
                    {order.couponCode && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Coupon ({order.couponCode})</span>
                        <span>-₹{parseFloat(order.couponDiscount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 my-2 pt-3 flex justify-between">
                      <span className="text-gray-700 font-semibold">Total Amount</span>
                      <span className="font-bold text-gray-900 text-base">{order.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" /> Shipping Details
                  </h3>
                  <div className="space-y-2 text-sm leading-relaxed">
                    <p className="font-medium text-gray-800">{order.customerName}</p>
                    <p className="text-gray-600">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center border-t border-gray-100 pt-8">
                <button onClick={() => navigate('/profile')} className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform">
                  <ArrowLeft className="w-4 h-4" /> Back to My Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
