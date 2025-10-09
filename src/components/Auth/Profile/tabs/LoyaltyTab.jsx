import React from "react";

export default function LoyaltyTab() {
  return (
    <div className="loyalty-tab w-full">
      <h1 className="text-[22px] font-bold text-qblack mb-5">Loyalty Program</h1>
      <div className="loyalty-content">
        <p className="text-qgray text-base mb-4">
          Earn points on every purchase and redeem them for exclusive rewards.
        </p>
        <div className="loyalty-points bg-primarygray p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-qblack mb-3">Your Points</h2>
          <div className="points-display flex items-center">
            <span className="text-3xl font-bold text-qyellow mr-3">1,250</span>
            <span className="text-base text-qgray">points</span>
          </div>
          <p className="text-sm text-qgray mt-2">
            Next reward at 1,500 points
          </p>
        </div>
        <div className="loyalty-rewards mt-6">
          <h3 className="text-lg font-semibold text-qblack mb-3">Available Rewards</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center p-3 bg-white rounded border">
              <span>10% Discount Coupon</span>
              <span className="text-qyellow font-semibold">500 points</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-white rounded border">
              <span>Free Shipping</span>
              <span className="text-qyellow font-semibold">300 points</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-white rounded border">
              <span>$5 Gift Card</span>
              <span className="text-qyellow font-semibold">750 points</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
