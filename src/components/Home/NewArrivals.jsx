import { useState } from "react";
import { Link } from "react-router-dom";
import productsData from "../../data/products.json";

export default function NewArrivals({ className = "" }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Get 10 products from the JSON data (5 products x 2 rows)
  const products = productsData.products.slice(0, 10);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xs ${
          index < rating ? "text-black" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    console.log(`Added product ${productId} to cart`);
    // Add your cart logic here
  };

  return (
    <div className={`bg-white py-8 ${className}`}>
      <div className="container-x mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">New Arrivals</h2>
          <Link 
            to="/new-arrivals" 
            className="text-black font-semibold hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1 border-b border-black pb-1"
          >
            <span>View More</span>
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid - 5 Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image Container */}
              <div className="aspect-square overflow-hidden rounded-t-lg relative bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* New Arrival Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                    NEW
                  </span>
                </div>

                {/* Add to Cart Button - Appears on Hover (Desktop) */}
                <div className={`
                  absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
                  transition-all duration-300 ease-in-out hidden lg:flex items-center justify-center
                `}>
                  <button
                    onClick={(e) => handleAddToCart(product.id, e)}
                    className={`
                      bg-white text-black px-4 py-2 rounded-full font-semibold 
                      transform transition-all duration-300 ease-out flex items-center space-x-1.5
                      hover:bg-black hover:text-white
                      shadow-lg border border-gray-200 text-xs
                      ${hoveredProduct === product.id ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'}
                    `}
                  >
                    <svg 
                      className="w-3.5 h-3.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                      />
                    </svg>
                    <span>Add To Cart</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 flex flex-col flex-grow">
                {/* Product Name */}
                <h3 className="font-medium text-black mb-1.5 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200 text-sm leading-snug min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {renderStars(Math.floor(product.review))}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">
                    ({product.review})
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-center space-x-1.5 mb-3">
                  <span className="text-base font-bold text-black">
                    ${parseFloat(product.offer_price.replace('₹', '')).toFixed(2)}
                  </span>
                  {parseFloat(product.offer_price.replace('₹', '')) !== parseFloat(product.price.replace('₹', '')) && (
                    <span className="text-xs text-gray-500 line-through">
                      ${parseFloat(product.price.replace('₹', '')).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Mobile Add to Cart Button */}
                <button 
                  onClick={(e) => handleAddToCart(product.id, e)}
                  className="w-full bg-black text-white py-2 rounded text-xs font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-1.5 border border-black lg:hidden mt-auto"
                >
                  <svg 
                    className="w-3.5 h-3.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More Button */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            to="/new-arrivals"
            className="inline-block bg-black text-white px-8 py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-colors duration-200 border border-black"
          >
            View More Products
          </Link>
        </div>
      </div>
    </div>
  );
}