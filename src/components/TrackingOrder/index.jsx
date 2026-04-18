import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../Partials/Layout";
import PageTitle from "../Helpers/PageTitle";
import InputCom from "../Helpers/InputCom";
import Thumbnail from "./Thumbnail";
import { Check, Package, MapPin, Truck, RefreshCw } from 'lucide-react';

export default function TrackingOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (location.state?.orderId) {
      setOrderId(location.state.orderId);
      setIsTracking(true);
    }
  }, [location.state]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId) {
      setIsTracking(true);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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
            
            {!isTracking ? (
              <div className="w-full bg-white lg:px-[30px] px-5 py-[23px] lg:flex items-center rounded shadow-sm border border-gray-100">
                <div className="lg:w-[642px] w-full">
                  <h1 className="text-[22px] text-qblack font-semibold leading-9">
                    Track Your Order
                  </h1>
                  <p className="text-[15px] text-gray-500 leading-8 mb-5">
                    Enter your order tracking number or Order ID to see updates.
                  </p>
                  <form onSubmit={handleTrack}>
                    <div className="mb-3">
                      <InputCom
                        placeholder="Order Number e.g ORD-..."
                        label="Order Tracking Number*"
                        inputClasses="w-full h-[50px]"
                        value={orderId}
                        inputHandler={(e) => setOrderId(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="w-[142px] h-[50px] bg-black text-white flex justify-center items-center mt-5 rounded font-semibold transition hover:bg-gray-800">
                      <span>Track Now</span>
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
                    onClick={handleRefresh} 
                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded border border-gray-100 shadow-sm mb-10">
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</span>
                      <span className="font-bold text-gray-800">{orderId}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tracking ID</span>
                      <span className="font-bold text-gray-800">TRK-998822</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Courier</span>
                      <span className="font-bold text-gray-800">FedEx Express</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Est. Delivery</span>
                      <span className="font-bold text-blue-600">Oct 24, 2026</span>
                    </div>
                  </div>

                  {/* Standard Timeline UI */}
                  <div className="relative max-w-3xl mx-auto px-4 py-8">
                    <div className="absolute left-[39px] sm:left-1/2 sm:-ml-px top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Step 1 */}
                    <div className="relative flex items-center justify-between sm:justify-normal sm:odd:flex-row-reverse group mb-8">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-[#22c55e] text-white shadow shrink-0 z-10 sm:mx-[-20px] ml-4">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] ml-6 sm:ml-0 sm:pr-8 text-left sm:text-right">
                        <h4 className="font-bold text-gray-800 text-lg">Order Confirmed</h4>
                        <p className="text-sm text-gray-500 mt-1">We have received your order.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex items-center justify-between sm:justify-normal sm:odd:flex-row-reverse group mb-8">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-[#22c55e] text-white shadow shrink-0 z-10 sm:mx-[-20px] ml-4">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] ml-6 sm:ml-0 sm:pl-8 text-left">
                        <h4 className="font-bold text-gray-800 text-lg">Picked Up</h4>
                        <p className="text-sm text-gray-500 mt-1">Package picked up by courier partner.</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex items-center justify-between sm:justify-normal sm:odd:flex-row-reverse group mb-8">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-[#2563eb] text-white shadow shrink-0 z-10 sm:mx-[-20px] ml-4">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] ml-6 sm:ml-0 sm:pr-8 text-left sm:text-right">
                        <h4 className="font-bold text-[#2563eb] text-lg">In Transit</h4>
                        <p className="text-sm text-gray-500 mt-1">Package is on the way to destination.</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative flex items-center justify-between sm:justify-normal sm:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-gray-200 text-gray-400 shadow shrink-0 z-10 sm:mx-[-20px] ml-4">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] ml-6 sm:ml-0 sm:pl-8 text-left">
                        <h4 className="font-bold text-gray-400 text-lg">Delivered</h4>
                        <p className="text-sm text-gray-400 mt-1">Package delivered to the customer.</p>
                      </div>
                    </div>

                  </div>

                  <div className="mt-12 text-center border-t border-gray-200 pt-8">
                     <button 
                       onClick={() => {
                         setIsTracking(false); 
                         setOrderId('');
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
