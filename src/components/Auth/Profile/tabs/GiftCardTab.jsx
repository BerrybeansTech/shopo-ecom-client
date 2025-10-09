import React from "react";

export default function GiftCardTab() {
  return (
    <div className="giftcard-tab w-full">
      <h1 className="text-[22px] font-bold text-qblack mb-5">Gift Cards</h1>
      <div className="giftcard-content">
        <p className="text-qgray text-base mb-4">
          Manage your gift cards and check balances here.
        </p>
        <div className="giftcard-list bg-primarygray p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-qblack mb-3">Your Gift Cards</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center p-3 bg-white rounded border">
              <span>Gift Card #123456</span>
              <span className="text-qyellow font-semibold">$50.00</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-white rounded border">
              <span>Gift Card #789012</span>
              <span className="text-qyellow font-semibold">$25.00</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-white rounded border">
              <span>Gift Card #345678</span>
              <span className="text-qyellow font-semibold">$100.00</span>
            </li>
          </ul>
        </div>
        <div className="add-giftcard mt-6">
          <button className="bg-qyellow text-qblack px-6 py-3 rounded font-semibold hover:bg-qblack hover:text-white transition-colors">
            Add New Gift Card
          </button>
        </div>
      </div>
    </div>
  );
}
