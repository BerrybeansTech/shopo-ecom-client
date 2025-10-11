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
import LoginSecurityTab from "./tabs/LoginSecurityTab";
import ReviewTab from "./tabs/ReviewTab";
import WishlistTab from "./tabs/WishlistTab";
import LoyaltyTab from "./tabs/LoyaltyTab";
import ReferralTab from "./tabs/ReferralTab";
import GiftCardTab from "./tabs/GiftCardTab";

export default function Profile() {
  const [switchDashboard, setSwitchDashboard] = useState(false);
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

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/login";
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="profile-page-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="w-full my-10">
            <BreadcrumbCom
              paths={[
                { name: "home", path: "/" },
                { name: "profile", path: "/profile" },
              ]}
            />
            <div className="w-full bg-white px-10 py-9">
              <div className="title-area w-full flex justify-between items-center">
                <h1 className="text-[22px] font-bold text-qblack">
                  Your Dashboard
                </h1>
              </div>
              <div className="profile-wrapper w-full mt-8 flex space-x-10">
                <div className="w-[236px] min-h-[600px] border-r border-[rgba(0, 0, 0, 0.1)]">
                  <div className="flex flex-col space-y-10">
                    <div className="item group">
                      <Link to="/profile#dashboard">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoDashboard />
                          </span>
                          <span className="font-normal text-base">
                            Dashboard
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#profile">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoPeople />
                          </span>
                          <span className="font-normal text-base">
                            Login & Security
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#address">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoAdress />
                          </span>
                          <span className="font-normal text-base">
                            Address
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#order">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoCart />
                          </span>
                          <span className="font-normal text-base">Order</span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#wishlist">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoLove />
                          </span>
                          <span className="font-normal text-base">
                            Wishlist
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#review">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoReviewHand />
                          </span>
                          <span className="font-normal text-base">
                            Reviews
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#loyalty">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoLoyalty />
                          </span>
                          <span className="font-normal text-base">
                            Loyalty Program
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#referral">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoReferral />
                          </span>
                          <span className="font-normal text-base">
                            Referral
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#giftcard">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoGiftCard />
                          </span>
                          <span className="font-normal text-base">
                            Gift Card
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <button
                        onClick={handleLogout}
                        type="button"
                        className="flex space-x-3 items-center text-qgray hover:text-qblack w-full text-left"
                      >
                        <span>
                          <IcoLogout />
                        </span>
                        <span className="font-normal text-base">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="item-body dashboard-wrapper w-full">
                    {active === "dashboard" ? (
                      <Dashboard />
                    ) : active === "profile" ? (
                      <LoginSecurityTab />
                    ) : active === "address" ? (
                      <AddressesTab />
                    ) : active === "order" ? (
                      <OrderTab />
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