import React from "react";

export default function Dashboard() {
  const quickAccessItems = [
    {
      id: 1,
      title: "My Orders",
      description: "View and track your orders",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="text-qgray text-base">Hello,</p>
          <h1 className="font-bold text-3xl text-qblack mt-1">
            Welcome to your Profile
          </h1>
          <p className="text-qgraytwo text-sm mt-2">
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
            className="bg-white border-2 border-qgray-border rounded-lg p-6 hover:border-qyellow transition-all duration-300 group flex flex-col h-full min-h-[140px]"
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex items-start space-x-4 flex-1">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-primarygray rounded-lg flex items-center justify-center text-qgray group-hover:bg-qyellow group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-qblack group-hover:text-qyellow transition-colors duration-300 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-qgraytwo mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0 ml-3">
                <svg 
                  className="w-5 h-5 text-qgray group-hover:text-qyellow transition-all duration-300 transform group-hover:translate-x-1" 
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
    </div>
  );
}

// import React from "react";

// export default function Dashboard() {
//   const quickAccessItems = [
//     {
//       id: 1,
//       title: "My Orders",
//       description: "View and track your orders",
//       icon: (
//         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//         </svg>
//       ),
//       link: "/orders",
//     },
//     {
//       id: 2,
//       title: "Order Tracking",
//       description: "Track your shipments",
//       icon: (
//         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       link: "/tracking-order",
//     },
//     {
//       id: 3,
//       title: "Wishlist",
//       description: "Your saved items",
//       icon: (
//         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//         </svg>
//       ),
//       link: "/wishlist",
//     },
//     {
//       id: 4,
//       title: "Addresses",
//       description: "Manage delivery addresses",
//       icon: (
//         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//         </svg>
//       ),
//       link: "/profile#address",
//     },
//     {
//       id: 5,
//       title: "Reviews",
//       description: "Your product reviews",
//       icon: (
//         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//         </svg>
//       ),
//       link: "/profile#review",
//     },
//     {
//       id: 6,
//       title: "Security",
//       description: "Login & account security",
//       icon: (
//         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//         </svg>
//       ),
//       link: "/profile#profile",
//     },
//   ];

//   return (
//     <div className="w-full">
//       {/* Welcome Section */}
//       <div className="welcome-msg mb-8">
//         <div>
//           <p className="text-qgray text-base">Hello,</p>
//           <h1 className="font-bold text-3xl text-qblack mt-1">
//             Welcome to your Profile
//           </h1>
//           <p className="text-qgraytwo text-sm mt-2">
//             Manage your orders, wishlist, and account settings
//           </p>
//         </div>
//       </div>

//       {/* Quick Access Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {quickAccessItems.map((item) => (
//           <a
//             key={item.id}
//             href={item.link}
//             className="bg-white border-2 border-qgray-border rounded-lg p-6 hover:border-qyellow transition-all duration-300 flex items-center h-32" // Fixed height for uniformity
//           >
//             <div className="flex items-center space-x-4 w-full">
//               {/* Icon */}
//               <div className="flex-shrink-0 w-14 h-14 bg-primarygray rounded-lg flex items-center justify-center text-qgray group-hover:bg-qyellow group-hover:text-white transition-all duration-300">
//                 {item.icon}
//               </div>
              
//               {/* Content */}
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-qblack group-hover:text-qyellow transition-colors duration-300">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm text-qgraytwo mt-1 line-clamp-2"> {/* Limits text to 2 lines */}
//                   {item.description}
//                 </p>
//               </div>

//               {/* Arrow Icon */}
//               <div className="flex-shrink-0">
//                 <svg 
//                   className="w-5 h-5 text-qgray group-hover:text-qyellow transition-all duration-300 transform group-hover:translate-x-1" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </div>
//             </div>
//           </a>
//         ))}
//       </div>

//       {/* Help Section */}
//       <div className="mt-8 bg-primarygray border-l-4 border-qyellow rounded-lg p-6">
//         <div className="flex items-start space-x-3">
//           <svg className="w-6 h-6 text-qyellow flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//           </svg>
//           <div>
//             <h3 className="font-semibold text-qblack mb-1">Need Help?</h3>
//             <p className="text-sm text-qgray leading-relaxed">
//               If you need assistance with your orders or account, feel free to{" "}
//               <a href="/contact" className="text-qyellow hover:underline font-medium">
//                 contact our support team
//               </a>
//               . We're here to help!
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }