import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../AllProductPage/productApi";
import { getProductImage } from "../../utils/imageUtils";

export default function NewArrivals({ className = "" }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll({
          page: 1,
          limit: 12,
          minPrice: 0,
          maxPrice: 10000,
          newArrival: true
        });

        if (response.success && Array.isArray(response.data)) {
          setProducts(response.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const renderStars = (rating, reviewCount) => {
    const safeRating = parseFloat(rating) || 0;
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

  if (loading) {
    return (
      <div className={`bg-[#f8f8f899] py-16 ${className}`}>
        <div className="container-x mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-11 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className={`bg-[#f8f8f899] py-16 ${className}`}>
      <div className="container-x mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">New Arrivals</h2>
          <Link 
            to="/products?sort=New Arrivals" 
            className="text-black font-semibold hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1 border-b border-black pb-1"
          >
            <span>View More</span>
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid - 2 Rows × 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-11 gap-6">
          {products.map((product) => {
            const mrp = parseFloat(product.mrp || 0);
            const sellingPrice = parseFloat(product.sellingPrice || product.mrp || 0);
            const discount = mrp > 0 && sellingPrice < mrp
              ? Math.round(((mrp - sellingPrice) / mrp) * 100)
              : 0;
            const productImage = getProductImage(product);

            return (
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
                    <Link to={`/single-product/${product.id}`}>
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { e.target.src = "assets/images/placeholder.png" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.category?.name || "Uncategorized"}
                    </div>

                    {/* Product Name */}
                    <Link to={`/single-product/${product.id}`}>
                      <h3 className="font-semibold text-black mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors duration-200 text-base">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="mb-3">
                      {renderStars(product.averageRating, product.reviewCount)}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-base font-bold text-black">
                        ₹{sellingPrice.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{mrp.toLocaleString()}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="text-xs text-red-600 font-semibold">
                          {discount}% off
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {(() => {
                      const totalStock = product.inventories?.reduce((sum, inv) => sum + (inv.availableQuantity || 0), 0) || 0;
                      return (
                        <div className={`text-xs font-medium mb-3 ${
                          totalStock > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {totalStock > 0 ? `In Stock (${totalStock})` : "Out of Stock"}
                        </div>
                      );
                    })()}

                    {/* Action Button */}
                    <Link 
                      to={`/single-product/${product.id}`}
                      className={`w-full py-2 rounded text-xs font-semibold transition-colors duration-200 flex items-center justify-center space-x-1.5 border border-black bg-black text-white hover:bg-gray-800`}
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View More Button */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            to="/products?sort=New Arrivals"
            className="inline-block bg-black text-white px-8 py-3 rounded text-base font-semibold hover:bg-gray-800 transition-colors duration-200 border border-black"
          >
            View More Products
          </Link>
        </div>
      </div>
    </div>
  );
}