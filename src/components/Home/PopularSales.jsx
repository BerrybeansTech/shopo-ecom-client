import { useState } from "react";
import { Link } from "react-router-dom";
import productsData from "../../data/products.json";

export default function PopularSales({ className = "" }) {
  const products = productsData.products.slice(0, 12);

  return (
    <div className={`bg-white ${className}`}>
      <div className="container-x mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-black">Popular Sales</h2>
          <Link 
            to="/popular-sales" 
            className="text-black font-semibold hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1 border-b border-black pb-1"
          >
            <span>View More</span>
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10">
          {/* Column 1 */}
          <div className="space-y-3">
            {products.slice(0, 4).map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            {products.slice(4, 8).map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            {products.slice(8, 12).map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Product Row Component
function ProductRow({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating) => {
    const starCount = Math.floor(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xs ${
          index < starCount ? "text-black" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div 
      className="bg-white border border-gray-300 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-gray-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3 ">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 border border-gray-300">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Product Name - Tight spacing */}
          <Link to="/single-product">
            <h3 className={`font-medium text-black mb-1 line-clamp-2 transition-colors duration-200 text-sm leading-tight ${
              isHovered ? 'text-gray-700' : ''
            }`}>
              {product.name}
            </h3>
          </Link>

          {/* Pricing - Tight spacing */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-bold text-black">
              ${parseFloat(product.offer_price.replace('₹', '')).toFixed(2)}
            </span>
            {parseFloat(product.offer_price.replace('₹', '')) !== parseFloat(product.price.replace('₹', '')) && (
              <span className="text-xs text-gray-500 line-through">
                ${parseFloat(product.price.replace('₹', '')).toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating - Tight spacing */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {renderStars(product.review)}
            </div>
            <span className="text-xs text-gray-600">
              ({product.review})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}