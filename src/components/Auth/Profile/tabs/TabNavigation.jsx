// TabNavigation.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "Current", label: "Current", hash: "#order" },
    { key: "All orders", label: "All orders", hash: "#allorders" },
    { key: "Wishlist", label: "Wishlist", hash: "#wishlist" }
  ];

  return (
    <div className="flex space-x-1 max-w-96 mb-6 bg-[#eef0f2] p-1 rounded-lg w-full overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          to={`/profile${tab.hash}`}
          className={`flex-1 min-w-[100px] py-3 px-2 rounded-md text-sm font-medium text-center transition-colors duration-200 whitespace-nowrap ${
            activeTab === tab.key
              ? "bg-[#fcfefe] text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}