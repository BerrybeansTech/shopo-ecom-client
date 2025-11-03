import React from "react";

export default function Dashboard() {
  const quickAccessItems = [
    {
      id: 1,
      title: "My Orders",
      description: "View and track your orders",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: "/orders",
    },
    {
      id: 2,
      title: "Order Tracking",
      description: "Track your shipments",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: "/tracking-order",
    },
    {
      id: 3,
      title: "Wishlist",
      description: "Your saved items",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      link: "/profile#wishlist",
    },
    {
      id: 4,
      title: "Addresses",
      description: "Manage delivery addresses",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      link: "/profile#address",
    },
    {
      id: 5,
      title: "Reviews",
      description: "Your product reviews",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      link: "/profile#review",
    },
    {
      id: 6,
      title: "Security",
      description: "Login & account security",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      link: "/profile#profile",
    },
  ];

  return (
    <div className="w-full">
      {/* Welcome Section */}
      <div className="welcome-msg mb-8">
        <div>
          <p className="text-gray-600 text-base">Hello,</p>
          <h1 className="font-bold text-3xl text-gray-800 mt-1">
            Welcome to your Profile
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Manage your orders, wishlist, and account settings
          </p>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickAccessItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            className="bg-white border border-gray-100 rounded-lg p-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group flex flex-col h-full min-h-[140px]"
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex items-start space-x-4 flex-1">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-700 transition-all duration-200">
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0 ml-3">
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200 transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
            View All
          </button>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-lg p-6 hover:bg-gray-50 transition-all duration-200">
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No recent activity</p>
            <p className="text-gray-500 text-sm mt-1">Your recent orders and activities will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}