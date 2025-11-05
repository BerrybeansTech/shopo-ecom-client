import { useState } from "react";
import { Link } from "react-router-dom";
import productsData from "../../data/products.json";

export default function TopProducts({ className = "" }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Get top 4 products from the JSON data for 2 columns × 2 rows
  const products = productsData.products.slice(0, 4);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
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
          <h2 className="text-2xl font-bold text-black">Top Selling Products</h2>
          <Link 
            to="/products" 
            className="text-black font-semibold hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1 border-b border-black pb-1"
          >
            <span>View More</span>
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid - 2 Columns × 2 Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Card Content - Horizontal Layout */}
              <div className="flex h-48">
                {/* Product Image - Left Side */}
                <div className="w-2/5 flex-shrink-0">
                  <div className="h-full relative bg-gray-100 rounded-l-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Product Details - Right Side */}
                <div className="w-3/5 flex flex-col p-4 justify-center">
                  <div className="flex flex-col items-center text-center">
                    {/* Product Name */}
                    <h3 className="font-semibold text-black mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200 text-sm leading-snug">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-left justify-left mb-2">
                      <div className="flex">
                        {renderStars(Math.floor(product.review))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        ({product.review})
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <span className="text-base font-bold text-black">
                        ${parseFloat(product.offer_price.replace('₹', '')).toFixed(2)}
                      </span>
                      {parseFloat(product.offer_price.replace('₹', '')) !== parseFloat(product.price.replace('₹', '')) && (
                        <span className="text-xs text-gray-500 line-through">
                          ${parseFloat(product.price.replace('₹', '')).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button - Centered with Reduced Width */}
                    <button 
                      onClick={(e) => handleAddToCart(product.id, e)}
                      className="bg-black text-white px-6 py-2 rounded text-xs font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-1.5 border border-black"
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
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More Button */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            to="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded text-base font-semibold hover:bg-gray-800 transition-colors duration-200 border border-black"
          >
            View More Products
          </Link>
        </div>
      </div>
    </div>
  );
}