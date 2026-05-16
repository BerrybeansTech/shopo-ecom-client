import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../Partials/Layout";
import PageTitle from "../Helpers/PageTitle";
import InputCom from "../Helpers/InputCom";
import Thumbnail from "./Thumbnail";
import { 
  Check, Package, MapPin, Truck, RefreshCw, AlertCircle, 
  Calendar, ExternalLink, Download, MessageSquare,
  Search, Box, Clock, ChevronRight
} from 'lucide-react';
import { useOrders } from '../CheakoutPage/useOrders';

export default function TrackingOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackOrderData, loading: apiLoading } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (location.state?.orderId) {
      setOrderId(location.state.orderId);
      handleTrack(null, location.state.orderId);
    }
  }, [location.state]);

  const handleTrack = async (e, id = orderId) => {
    if (e) e.preventDefault();
    if (!id) return;

    setError(null);
    setIsTracking(true);
    
    const res = await trackOrderData(id);
    if (res.success) {
      setTrackingData(res.data);
    } else {
      setError(res.error);
      setIsTracking(false);
    }
  };

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    if (['delivered', 'completed'].includes(s)) return { color: 'text-green-600', bg: 'bg-green-100', icon: Check, label: 'Delivered' };
    if (['shipped', 'picked up', 'pickup_scheduled', 'shipped'].includes(s)) return { color: 'text-blue-600', bg: 'bg-blue-100', icon: Box, label: 'Shipped' };
    if (['in transit', 'in_transit'].includes(s)) return { color: 'text-orange-600', bg: 'bg-orange-100', icon: Truck, label: 'In Transit' };
    if (['out for delivery', 'out_for_delivery'].includes(s)) return { color: 'text-purple-600', bg: 'bg-purple-100', icon: MapPin, label: 'Out for Delivery' };
    if (['cancelled', 'failed'].includes(s)) return { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, label: 'Cancelled' };
    return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock, label: 'Pending' };
  };

  const statusConfig = getStatusConfig(trackingData?.status);

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="tracking-page-wrapper w-full bg-[#F8F9FA] min-h-screen">
        <div className="page-title mb-[40px]">
          <PageTitle
            title="Track Your Order"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "Track Order", path: "/track-order" },
            ]}
          />
        </div>
        
        <div className="content-wrapper w-full pb-[80px]">
          <div className="container-x mx-auto px-4 max-w-5xl">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {!isTracking ? (
              <div className="w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-6 w-fit">
                    <Search className="w-3 h-3" />
                    SHIPROCKET TRACKING
                  </div>
                  <h1 className="text-3xl lg:text-4xl text-qblack font-bold leading-tight mb-4">
                    Track Your Package
                  </h1>
                  <p className="text-[16px] text-gray-500 leading-relaxed mb-8">
                    Enter your Order ID to see real-time updates. Stay informed about your delivery journey from our warehouse to your doorstep.
                  </p>
                  <form onSubmit={handleTrack} className="relative">
                    <div className="mb-4">
                      <InputCom
                        placeholder="Order ID e.g. RF1001"
                        label="Order ID*"
                        inputClasses="w-full h-[60px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-lg"
                        value={orderId}
                        inputHandler={(e) => setOrderId(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={apiLoading || !orderId}
                      className="w-full h-[60px] bg-qblack text-white flex justify-center items-center mt-6 rounded-xl font-bold text-lg transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50 disabled:scale-100"
                    >
                      {apiLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <span>Track Order</span>}
                    </button>
                  </form>
                </div>
                <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                   <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                   <Thumbnail className="relative z-10 w-full max-w-[400px]" />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => { setIsTracking(false); setTrackingData(null); }}
                      className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200"
                    >
                      <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-qblack">Tracking Summary</h2>
                      <p className="text-gray-500 text-sm">Updated just now</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button 
                      onClick={() => handleTrack(null)} 
                      disabled={apiLoading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${apiLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    <button 
                      className="flex items-center gap-2 px-5 py-2.5 bg-qblack text-white rounded-xl font-semibold hover:bg-black transition-all shadow-md shadow-black/10"
                    >
                      <Download className="h-4 w-4" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Top Card - Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                   {[
                     { label: 'Order ID', value: `#${orderId}`, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                     { label: 'AWB Number', value: trackingData?.awbCode || 'Pending', icon: Box, color: 'text-purple-600', bg: 'bg-purple-50' },
                     { label: 'Courier', value: trackingData?.courier || 'Assigning...', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
                     { label: 'Current Status', value: trackingData?.status || 'Processing', icon: statusConfig.icon, color: statusConfig.color, bg: statusConfig.bg },
                     { label: 'Expected Delivery', value: trackingData?.estimatedDelivery || 'TBA', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' }
                   ].map((stat, idx) => (
                     <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</span>
                        <span className="text-[15px] font-bold text-qblack truncate block" title={stat.value}>{stat.value}</span>
                     </div>
                   ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Timeline Section */}
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                      <h3 className="font-bold text-qblack flex items-center gap-2">
                         <Clock className="w-5 h-5 text-blue-500" />
                         Journey Timeline
                      </h3>
                    </div>
                    <div className="p-8">
                      {trackingData?.timeline && trackingData.timeline.length > 0 ? (
                        <div className="relative">
                          {/* Vertical Line */}
                          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500 via-gray-200 to-gray-200"></div>
                          
                          <div className="space-y-10">
                            {trackingData.timeline.map((item, index) => (
                              <div key={index} className="relative pl-10 group">
                                {/* Dot */}
                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-125 ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                
                                <div className="flex flex-col">
                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                      <h4 className={`font-bold text-lg ${index === 0 ? 'text-qblack' : 'text-gray-600'}`}>
                                        {item.activity}
                                      </h4>
                                      <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                        {item.time ? new Date(item.time).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                                      </span>
                                   </div>
                                   {item.location && (
                                     <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                                       <MapPin className="w-3.5 h-3.5" />
                                       <span>{item.location}</span>
                                   </div>
                                   )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16">
                           <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Package className="w-10 h-10 text-blue-200" />
                           </div>
                           <h4 className="text-xl font-bold text-qblack mb-2">Tracking data being prepared</h4>
                           <p className="text-gray-500 max-w-[280px] mx-auto">Please have some patience. It usually takes a few hours for the courier to update the status.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Actions */}
                  <div className="lg:w-80 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                       <h4 className="font-bold text-qblack mb-4 flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-blue-500" />
                          External Tracking
                       </h4>
                       <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                         Want more detailed info? You can track this package directly on the courier's official website.
                       </p>
                       <a 
                         href={trackingData?.trackingUrl || '#'} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className={`w-full py-3 px-4 ${trackingData?.trackingUrl ? 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100' : 'bg-gray-50 text-gray-400 cursor-not-allowed'} rounded-xl font-bold flex items-center justify-center gap-2 transition-all group`}
                       >
                         <span>Track on {trackingData?.courier || 'Courier'}</span>
                         <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </a>
                    </div>

                    <div className="bg-gradient-to-br from-qblack to-gray-800 p-6 rounded-2xl shadow-lg text-white">
                       <h4 className="font-bold mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-orange-400" />
                          Need Help?
                       </h4>
                       <p className="text-gray-300 text-sm mb-6">
                         Having issues with your delivery? Our support team is here to help you 24/7.
                       </p>
                       <button className="w-full py-3 px-4 bg-white text-qblack rounded-xl font-bold hover:bg-gray-100 transition-all">
                         Contact Support
                       </button>
                    </div>

                    <div className="text-center pt-4">
                       <button 
                         onClick={() => { setIsTracking(false); setOrderId(''); setTrackingData(null); }}
                         className="text-gray-500 font-bold hover:text-qblack transition-colors flex items-center justify-center gap-2 mx-auto"
                       >
                         <Search className="w-4 h-4" />
                         Track another package
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
