import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../Partials/Layout";
import PageTitle from "../Helpers/PageTitle";
import InputCom from "../Helpers/InputCom";
import Thumbnail from "./Thumbnail";
import { Check, Package, MapPin, Truck, RefreshCw, AlertCircle, XCircle } from 'lucide-react';
import { ordersApi } from '../CheakoutPage/ordersApi';

const STEP_MAP = {
  // Shiprocket standard statuses
  PENDING: 1, INFORECEIVED: 1, AWB_ASSIGNED: 1, PICKUP_QUEUED: 1, PICKUP_EXCEPTION: 1,
  PICKUP: 2, PICKUP_COMPLETE: 2, MANIFESTED: 2,
  INTRANSIT: 3, IN_TRANSIT: 3, REACHED_AT_HUB: 3,
  OUTFORDELIVERY: 3, OUT_FOR_DELIVERY: 3, ATTEMPTFAIL: 3, AVAILABLEFORPICKUP: 3,
  DELIVERED: 4,
};

const CANCELLED_STATUSES = [
  'CANCELLED', 'RTO', 'RTO_INITIATED', 'RTO_DELIVERED', 'EXCEPTION', 'EXPIRED',
];

const STEPS = [
  { label: 'Order Confirmed', desc: 'We have received your order.', icon: Check },
  { label: 'Picked Up', desc: 'Package picked up by courier partner.', icon: Package },
  { label: 'In Transit', desc: 'Package is on the way to destination.', icon: Truck },
  { label: 'Delivered', desc: 'Package delivered to the customer.', icon: MapPin },
];

const getTimelineStep = (status) => STEP_MAP[status?.toUpperCase()] ?? 1;
const isCancelledStatus = (s) => CANCELLED_STATUSES.includes(s?.toUpperCase());

export default function TrackingOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);

  const fetchTracking = useCallback(async (id) => {
    if (!id?.trim()) return;
    setLoading(true);
    setError(null);
    setTrackingData(null);
    try {
      const res = await ordersApi.trackOrder(id.trim());
      if (res.success) {
        setTrackingData(res.data);
        setIsTracking(true);
      } else {
        setError(res.message || 'Could not fetch tracking info.');
        setIsTracking(true);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsTracking(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state?.orderId) {
      setOrderId(location.state.orderId);
      fetchTracking(location.state.orderId);
    }
  }, [location.state, fetchTracking]);

  const handleTrack = (e) => {
    e.preventDefault();
    fetchTracking(orderId);
  };

  const handleRefresh = () => {
    fetchTracking(orderId);
  };

  const handleTrackAnother = () => {
    setIsTracking(false);
    setTrackingData(null);
    setError(null);
    setOrderId('');
    navigate('/track-order', { replace: true, state: {} });
  };

  const activeStep = getTimelineStep(trackingData?.currentStatus);
  const cancelled = isCancelledStatus(trackingData?.currentStatus);

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
                    <button
                      type="submit"
                      disabled={loading || !orderId.trim()}
                      className="w-[142px] h-[50px] bg-black text-white flex justify-center items-center mt-5 rounded font-semibold transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <span>Track Now</span>
                      )}
                    </button>
                  </form>
                </div>
                <div className="flex-1 flex justify-center mt-5 lg:mt-0">
                  <Thumbnail />
                </div>
              </div>
            ) : (
              <div className="w-full bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 inline-block pb-1">Tracking Results</h2>
                    <p className="text-gray-500 mt-2 text-sm">Real-time status updates for your shipment.</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors bg-transparent disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-6 md:p-8">
                  {/* Loading state */}
                  {loading && !trackingData && (
                    <div className="flex justify-center items-center py-16 gap-3 text-gray-500">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Fetching tracking info...</span>
                    </div>
                  )}

                  {/* Error state */}
                  {error && !trackingData && (
                    <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800 text-sm mb-6">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Tracking unavailable</p>
                        <p className="mt-0.5">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Tracking data */}
                  {trackingData && (
                    <>
                      {/* Info card */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded border border-gray-100 shadow-sm mb-10">
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</span>
                          <span className="font-bold text-gray-800">{orderId}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">AWB / Tracking ID</span>
                          <span className="font-bold text-gray-800">{trackingData.awbCode ?? '—'}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Courier</span>
                          <span className="font-bold text-gray-800">{trackingData.courierName ?? '—'}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Est. Delivery</span>
                          <span className="font-bold text-blue-600">
                            {trackingData.estimatedDelivery ?? '—'}
                          </span>
                        </div>
                      </div>

                      {/* Origin → Destination */}
                      {(trackingData.origin || trackingData.destination) && (
                        <div className="flex items-center gap-3 bg-white rounded border border-gray-100 px-6 py-4 mb-8 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="text-gray-600">
                            <span className="font-semibold text-gray-800">{trackingData.origin ?? '—'}</span>
                            <span className="mx-2 text-gray-400">→</span>
                            <span className="font-semibold text-gray-800">{trackingData.destination ?? '—'}</span>
                          </span>
                        </div>
                      )}

                      {/* Cancelled / RTO banner */}
                      {cancelled ? (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm mb-6">
                          <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Shipment {trackingData.currentStatus.replace(/_/g, ' ')}</p>
                            <p className="mt-0.5 text-red-600">Please contact support if you have any questions.</p>
                          </div>
                        </div>
                      ) : (
                        /* Dynamic 4-step timeline */
                        <div className="relative max-w-3xl mx-auto px-4 py-8">
                          <div className="absolute left-[39px] sm:left-1/2 sm:-ml-px top-0 bottom-0 w-0.5 bg-gray-200" />

                          {STEPS.map((step, i) => {
                            const stepNumber = i + 1;
                            const done = stepNumber < activeStep;
                            const current = stepNumber === activeStep;
                            const pending = stepNumber > activeStep;
                            const Icon = step.icon;

                            const bgColor = done
                              ? 'bg-[#22c55e] text-white'
                              : current
                                ? 'bg-[#2563eb] text-white'
                                : 'bg-gray-200 text-gray-400';

                            const labelColor = current ? 'text-[#2563eb]' : pending ? 'text-gray-400' : 'text-gray-800';
                            const descColor = pending ? 'text-gray-400' : 'text-gray-500';
                            const isRight = i % 2 === 0; // odd steps → right side on desktop

                            return (
                              <div
                                key={step.label}
                                className={`relative flex items-center justify-between sm:justify-normal sm:odd:flex-row-reverse group ${i < STEPS.length - 1 ? 'mb-8' : ''}`}
                              >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 ${bgColor} shadow shrink-0 z-10 sm:mx-[-20px] ml-4`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className={`w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] ml-6 sm:ml-0 ${isRight ? 'sm:pr-8 text-left sm:text-right' : 'sm:pl-8 text-left'}`}>
                                  <h4 className={`font-bold text-lg ${labelColor}`}>{step.label}</h4>
                                  <p className={`text-sm mt-1 ${descColor}`}>{step.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Activity log */}
                      {trackingData.activities?.length > 0 && (
                        <div className="mt-8 bg-white rounded border border-gray-100 p-6">
                          <h3 className="font-semibold text-gray-800 mb-4">Tracking Activity</h3>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {trackingData.activities.map((act, i) => (
                              <div key={i} className="flex gap-4 text-sm border-b border-gray-50 pb-3 last:border-0">
                                <span className="text-gray-400 whitespace-nowrap w-44 shrink-0">{act.date}</span>
                                <div>
                                  <p className="text-gray-800 font-medium">{act.activity}</p>
                                  {act.location && (
                                    <p className="text-gray-500 text-xs mt-0.5">{act.location}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="mt-12 text-center border-t border-gray-200 pt-8">
                    <button
                      onClick={handleTrackAnother}
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
