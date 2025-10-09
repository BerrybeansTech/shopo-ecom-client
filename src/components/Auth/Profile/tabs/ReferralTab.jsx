import React from "react";

export default function ReferralTab() {
  return (
    <div className="referral-tab w-full">
      <h1 className="text-[22px] font-bold text-qblack mb-5">Referral Program</h1>
      <div className="referral-content">
        <p className="text-qgray text-base mb-4">
          Invite your friends and earn rewards when they make their first purchase.
        </p>
        <div className="referral-code bg-primarygray p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-qblack mb-3">Your Referral Code</h2>
          <div className="code-display text-qyellow font-bold text-2xl p-3 bg-white rounded text-center select-all">
            REF12345
          </div>
          <p className="text-sm text-qgray mt-2">
            Share this code with your friends to get rewards.
          </p>
        </div>
        <div className="referral-history mt-6">
          <h3 className="text-lg font-semibold text-qblack mb-3">Referral History</h3>
          <ul className="space-y-2">
            <li className="p-3 bg-white rounded border">
              <span>John Doe - Rewarded $10</span>
            </li>
            <li className="p-3 bg-white rounded border">
              <span>Jane Smith - Rewarded $15</span>
            </li>
            <li className="p-3 bg-white rounded border">
              <span>Michael Brown - Rewarded $5</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
