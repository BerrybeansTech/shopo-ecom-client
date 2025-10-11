import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import datas from "../../../data/products.json";
import BreadcrumbCom from "../../BreadcrumbCom";
import Layout from "../../Partials/Layout";
import IcoAdress from "./icons/IcoAdress";
import IcoCart from "./icons/IcoCart";
import IcoDashboard from "./icons/IcoDashboard";
import IcoLogout from "./icons/IcoLogout";
import IcoLove from "./icons/IcoLove";
import IcoPeople from "./icons/IcoPeople";
import IcoReviewHand from "./icons/IcoReviewHand";
import IcoLoyalty from "./icons/IcoLoyalty";
import IcoReferral from "./icons/IcoReferral";
import IcoGiftCard from "./icons/IcoGiftCard";
import AddressesTab from "./tabs/AddressesTab";
import Dashboard from "./tabs/Dashboard";
import OrderTab from "./tabs/OrderTab";
import AllOrders from "./tabs/AllOrders";
import LoginSecurityTab from "./tabs/LoginSecurityTab";
import ReviewTab from "./tabs/ReviewTab";
import WishlistTab from "./tabs/WishlistTab";
import LoyaltyTab from "./tabs/LoyaltyTab";
import ReferralTab from "./tabs/ReferralTab";
import GiftCardTab from "./tabs/GiftCardTab";

export default function Profile() {
  const [switchDashboard, setSwitchDashboard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const getHashContent = location.hash.split("#");
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    setActive(
      getHashContent && getHashContent.length > 1
        ? getHashContent[1]
        : "dashboard"
    );
  }, [getHashContent]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.mobile-sidebar') && !event.target.closest('.hamburger-btn')) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-qblack bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="profile-page-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="w-full my-6 md:my-10">
            <BreadcrumbCom
              paths={[
                { name: "home", path: "/" },
                { name: "profile", path: "/profile" },
              ]}
            />
            <div className="w-full bg-white px-4 py-6 md:px-10 md:py-9">
              <div className="title-area w-full flex justify-between items-center">
                <h1 className="text-lg md:text-[22px] font-bold text-qblack">
                  Your Dashboard
                </h1>
                {/* Hamburger menu for mobile */}
                <button
                  className="hamburger-btn md:hidden text-qblack focus:outline-none p-2 hover:bg-primarygray rounded-lg transition-all duration-200"
                  onClick={toggleSidebar}
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {isSidebarOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    )}
                  </svg>
                </button>
              </div>
              <div className="profile-wrapper w-full mt-6 md:mt-8 flex flex-col md:flex-row md:space-x-12">
                {/* Sidebar */}
                <div
                  className={`mobile-sidebar w-[280px] md:w-[256px] min-h-[400px] md:min-h-[600px] border-r border-qgray-border
                    fixed md:static top-0 left-0 h-full md:h-auto bg-white z-50 
                    transition-transform duration-300 ease-in-out 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 shadow-2xl md:shadow-none overflow-y-auto`}
                >
                  {/* Mobile Header */}
                  <div className="md:hidden flex items-center justify-between p-4 border-b border-qgray-border bg-primarygray">
                    <h2 className="text-lg font-semibold text-qblack">Menu</h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-white rounded-lg transition-all duration-200"
                      aria-label="Close menu"
                    >
                      <svg
                        className="w-5 h-5 text-qblack"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col space-y-2 p-4 md:p-0 md:pt-0 md:pr-4">
                    <div className="item group">
                      <Link 
                        to="/profile#dashboard" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'dashboard' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'dashboard' ? 'text-qyellow' : ''}`}>
                          <IcoDashboard />
                        </span>
                        <span className="text-base">
                          Dashboard
                        </span>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link 
                        to="/profile#profile" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'profile' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'profile' ? 'text-qyellow' : ''}`}>
                          <IcoPeople />
                        </span>
                        <span className="text-base">
                          Login & Security
                        </span>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link 
                        to="/profile#address" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'address' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'address' ? 'text-qyellow' : ''}`}>
                          <IcoAdress />
                        </span>
                        <span className="text-base">
                          Address
                        </span>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link 
                        to="/profile#order" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'order' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'order' ? 'text-qyellow' : ''}`}>
                          <IcoCart />
                        </span>
                        <span className="text-base">Order</span>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link 
                        to="/profile#review" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'review' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'review' ? 'text-qyellow' : ''}`}>
                          <IcoReviewHand />
                        </span>
                        <span className="text-base">
                          Reviews
                        </span>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link 
                        to="/profile#loyalty" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'loyalty' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'loyalty' ? 'text-qyellow' : ''}`}>
                          <IcoLoyalty />
                        </span>
                        <span className="text-base">
                          Loyalty Program
                        </span>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link 
                        to="/profile#referral" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'referral' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'referral' ? 'text-qyellow' : ''}`}>
                          <IcoReferral />
                        </span>
                        <span className="text-base">
                          Referral
                        </span>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link 
                        to="/profile#giftcard" 
                        onClick={handleMenuClick}
                        className={`flex space-x-3 items-center p-3 rounded-lg transition-all duration-200 border-l-4 ${
                          active === 'giftcard' 
                            ? 'bg-qyellow bg-opacity-10 border-qyellow text-qblack font-medium' 
                            : 'border-transparent text-qgray hover:bg-qyellow hover:bg-opacity-5 hover:text-qblack hover:border-qyellow'
                        }`}
                      >
                        <span className={`transition-transform group-hover:scale-110 ${active === 'giftcard' ? 'text-qyellow' : ''}`}>
                          <IcoGiftCard />
                        </span>
                        <span className="text-base">
                          Gift Card
                        </span>
                      </Link>
                    </div>
                    
                    {/* Divider and Logout */}
                    <div className="mt-4 pt-4 border-t border-qgray-border">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsSidebarOpen(false);
                        }}
                        type="button"
                        className="flex space-x-3 items-center text-qgray hover:text-qred w-full text-left p-3 rounded-lg hover:bg-qred hover:bg-opacity-5 border-l-4 border-transparent hover:border-qred transition-all duration-200 group"
                      >
                        <span className="transition-transform group-hover:scale-110 group-hover:text-qred">
                          <IcoLogout />
                        </span>
                        <span className="text-base font-medium">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 mt-6 md:mt-0 w-full md:pl-4">
                  <div className="item-body dashboard-wrapper w-full overflow-x-auto">
                    {active === "dashboard" ? (
                      <Dashboard />
                    ) : active === "profile" ? (
                      <LoginSecurityTab />
                    ) : active === "address" ? (
                      <AddressesTab />
                    ) : active === "order" ? (
                      <OrderTab />
                    ) : active === "allorders" ? (
                      <AllOrders />
                    ) : active === "wishlist" ? (
                      <WishlistTab />
                    ) : active === "review" ? (
                      <ReviewTab products={datas.products} />
                    ) : active === "loyalty" ? (
                      <LoyaltyTab />
                    ) : active === "referral" ? (
                      <ReferralTab />
                    ) : active === "giftcard" ? (
                      <GiftCardTab />
                    ) : (
                      <Dashboard />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}