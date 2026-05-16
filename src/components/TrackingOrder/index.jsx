import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../Partials/Layout";
import PageTitle from "../Helpers/PageTitle";
import InputCom from "../Helpers/InputCom";
import Thumbnail from "./Thumbnail";
import { Check, Package, MapPin, Truck, RefreshCw, AlertCircle } from 'lucide-react';
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

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (['delivered', 'completed'].includes(s)) return 'bg-green-500';
    if (['shipped', 'in transit', 'out for delivery'].includes(s)) return 'bg-blue-500';
    if (['cancelled', 'returned'].includes(s)) return 'bg-red-500';
    return 'bg-gray-400';
  };

  // Helper to get tracking info safely
  const getTrackInfo = () => {
    if (!trackingData) return null;
    
    // Shiprocket structure usually has tracking_data
    const data = trackingData.tracking_data || trackingData;
    const activities = data.shipment_track_activities || [];
    const latest = activities[0] || {};
    
    return {
      awb: data.awb_code || 'N/A',
      courier: data.courier_name || 'Processing',
      status: data.shipment_status || 'Pending',
      estDelivery: data.expected_delivery_date || 'TBD',
      activities: activities.map(act => ({
        date: act.date,
        status: act.status,
        location: act.location,
        description: act.activity
      }))
    };
  };

  const trackInfo = getTrackInfo();

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="tracking-page-wrapper w-full">
        <div className="page-title mb-[40px]">
          <PageTitle
            title="Track Order"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "Track Order", path: "/track-order" },
            ]}
          />
        </div>
        
        <div className="content-wrapper w-full mb-[40px]">
          <div className="container-x mx-auto px-4">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            {!isTracking ? (
              <div className="w-full bg-white lg:px-[30px] px-5 py-[23px] lg:flex items-center rounded shadow-sm border border-gray-100">
                <div className="lg:w-[642px] w-full">
                  <h1 className="text-[22px] text-qblack font-semibold leading-9">
                    Track Your Order
                  </h1>
                  <p className="text-[15px] text-gray-500 leading-8 mb-5">
                    Enter your Order ID to see real-time updates from Shiprocket.
                  </p>
                  <form onSubmit={handleTrack}>
                    <div className="mb-3">
                      <InputCom
                        placeholder="Order ID e.g 101"
                        label="Order ID*"
                        inputClasses="w-full h-[50px]"
                        value={orderId}
                        inputHandler={(e) => setOrderId(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={apiLoading}
                      className="w-[142px] h-[50px] bg-black text-white flex justify-center items-center mt-5 rounded font-semibold transition hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {apiLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>Track Now</span>}
                    </button>
                  </form>
                </div>
                <div className="flex-1 flex justify-center mt-5 lg:mt-0">
                  <Thumbnail />
                </div>
              </div>
            ) : (
              <div className="w-full bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 inline-block pb-1">Tracking Results</h2>
                    <p className="text-gray-500 mt-2 text-sm">Real-time status updates for your shipment.</p>
                  </div>
                  <button 
                    onClick={() => handleTrack(null)} 
                    disabled={apiLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors bg-transparent disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${apiLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-6 md:p-8">
                  {trackInfo && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded border border-gray-100 shadow-sm mb-10">
                      <div>
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</span>
                        <span className="font-bold text-gray-800">#{orderId}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">AWB Code</span>
                        <span className="font-bold text-gray-800">{trackInfo.awb}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Courier</span>
                        <span className="font-bold text-gray-800">{trackInfo.courier}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-xs text-white ${getStatusColor(trackInfo.status)}`}>
                          {trackInfo.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timeline UI */}
                  <div className="relative max-w-3xl mx-auto px-4 py-8">
                    {trackInfo?.activities && trackInfo.activities.length > 0 ? (
                      <>
                        <div className="absolute left-[39px] sm:left-1/2 sm:-ml-px top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {trackInfo.activities.map((activity, index) => (
                          <div key={index} className="relative flex items-center justify-between sm:justify-normal sm:odd:flex-row-reverse group mb-8">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 ${index === 0 ? 'bg-blue-600' : 'bg-green-500'} text-white shadow shrink-0 z-10 sm:mx-[-20px] ml-4`}>
                              {index === 0 ? <Truck className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </div>
                            <div className={`w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] ml-6 sm:ml-0 ${index % 2 === 0 ? 'sm:pr-8 text-left sm:text-right' : 'sm:pl-8 text-left'}`}>
                              <h4 className="font-bold text-gray-800 text-lg">{activity.status}</h4>
                              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 justify-start sm:justify-end">
                                <MapPin className="w-3 h-3" />
                                <span>{activity.location}</span>
                                <span className="mx-1">•</span>
                                <span>{activity.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Tracking information is being updated. Please check back later.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-12 text-center border-t border-gray-200 pt-8">
                     <button 
                       onClick={() => {
                         setIsTracking(false); 
                         setOrderId('');
                         setTrackingData(null);
                         navigate('/track-order', { replace: true, state: {} });
                       }} 
                       className="text-blue-600 font-medium hover:underline inline-flex items-center gap-2"
                     >
                       Track Another Order
                     </button>
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

