import { useState } from "react";
import { Link } from "react-router-dom";
import productsData from "../../data/products.json";

export default function NewArrivals({ className = "" }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Get exactly 8 products for 2 rows × 4 columns
  const products = productsData.products.slice(0, 8);

  const renderStars = (rating, reviewCount) => {
    const safeRating = rating || 0;
    const safeReviewCount = reviewCount || 0;
    const fullStars = Math.floor(safeRating);
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`text-xs ${
              index < fullStars ? "text-black" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-600 ml-1">
          {safeRating.toFixed(1)} ({safeReviewCount})
        </span>
      </div>
    );
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    console.log(`Added product ${productId} to cart`);
    // Add your cart logic here
  };

  return (
    <div className={`bg-[#f8f8f899] py-16 ${className}`}>
      <div className="container-x mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">New Arrivals</h2>
          <Link 
            to="/new-arrivals" 
            className="text-black font-semibold hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1 border-b border-black pb-1"
          >
            <span>View More</span>
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid - 2 Rows × 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-11 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* New Arrival Badge */}
              <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 z-10">
                NEW
              </div>

              {/* Product Card Content */}
              <div className="flex flex-col">
                {/* Product Image */}
                <div className="h-48 relative bg-gray-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  {/* Category */}
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-black mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors duration-200 text-base">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="mb-3">
                    {renderStars(product.rating, product.reviewCount)}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-base font-bold text-black">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                    {product.discount && (
                      <span className="text-xs text-red-600 font-semibold">
                        {product.discount}% off
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className={`text-xs font-medium mb-3 ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => handleAddToCart(product.id, e)}
                    disabled={product.stock === 0}
                    className={`w-full py-2 rounded text-xs font-semibold transition-colors duration-200 flex items-center justify-center space-x-1.5 border ${
                      product.stock > 0 
                        ? "bg-black text-white hover:bg-gray-800 border-black" 
                        : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                    }`}
                  >
                    {product.stock > 0 ? (
                      <>
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
                      </>
                    ) : (
                      <span>Out of Stock</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More Button */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            to="/new-arrivals"
            className="inline-block bg-black text-white px-8 py-3 rounded text-base font-semibold hover:bg-gray-800 transition-colors duration-200 border border-black"
          >
            View More Products
          </Link>
        </div>
      </div>
    </div>
  );
}