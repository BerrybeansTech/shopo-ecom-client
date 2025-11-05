import React from "react";
import Star from "../../../Helpers/icons/Star";
import { Link } from "react-router-dom";

export default function ReviewTab({ className, products = [] }) {
  // Safe fallback: ensure products is an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Helper to render stars safely
  const renderStars = (review) => {
    const rating = typeof review === "number" && !isNaN(review) ? review : 0;
    const filledStars = Math.floor(rating);
    const safeFilledStars = Math.min(Math.max(filledStars, 0), 5); // Clamp 0-5

    return Array.from({ length: safeFilledStars }, (_, i) => (
      <span key={i}>
        <Star className="w-3 h-3 sm:w-4 sm:h-4" />
      </span>
    ));
  };

  // Helper to generate dynamic review comment based on product data
  const generateReviewComment = (product) => {
    // Simple dynamic templates; customize as needed
    const templates = [
      `Great quality for the price! Loving the ${product.material || 'material'} in ${product.colors?.[0] || 'this color'}.`,
      `Comfortable fit, perfect for ${product.occasion?.[0] || 'daily'} use. Rated ${product.review || 0} stars.`,
      `Highly recommend this ${product.brand || 'brand'} product. Fast delivery and matches description.`,
      `Stylish and durable. The ${product.subCategory || 'item'} exceeded my expectations.`,
      `Good value at ${product.offer_price || 'this price'}. Would buy again!`,
    ];
    // Randomly pick a template for variety (or make it based on rating/props)
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  };

  // Helper for dynamic review date (last 30 days for realism)
  const generateReviewDate = () => {
    const now = new Date();
    const pastDays = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
    const pastDate = new Date(now.setDate(now.getDate() - pastDays));
    return pastDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Helper for dynamic review count (simulate based on stock/popularity, e.g., 50-500)
  const generateReviewCount = (product) => {
    const base = product.stock > 0 ? product.stock * 10 : 50;
    const randomAddition = Math.floor(Math.random() * 450) + 50;
    return base + randomAddition;
  };

  return (
    <>
      <div className="review-tab-wrapper w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {safeProducts.slice(0, 6).map((datas) => {
            const reviewCount = generateReviewCount(datas);
            return (
              <div key={datas.id || Math.random()} className="item">
                <div
                  style={{ boxShadow: "0px 15px 64px rgba(0, 0, 0, 0.05)" }}
                  className={`product-row-card-style-one w-full bg-white group relative overflow-hidden ${
                    className || ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-x-0 items-center w-full h-full p-4 sm:p-2">
                    {/* Product Image */}
                    <div className="w-full sm:w-1/3 h-[120px] sm:h-full mb-3 sm:mb-0">
                      <img
                        src={datas.image || `${import.meta.env.VITE_PUBLIC_URL}/assets/images/placeholder.jpg`}
                        alt={datas.name || datas.title || "Product"} // Fallback to name or title
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = `${import.meta.env.VITE_PUBLIC_URL}/assets/images/placeholder.jpg`;
                        }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-center h-full w-full text-center sm:text-left">
                      <div>
                        <span className="text-qgray text-xs sm:text-sm mb-2 sm:mb-1.5 block">
                          {generateReviewDate()}
                        </span>
                        
                        {/* Stars and Review Count */}
                        <div className="flex items-center justify-center sm:justify-start mb-2 sm:mb-1.5 space-x-1">
                          {renderStars(datas.review)}
                          <span className="text-qgray text-xs">({reviewCount} reviews)</span>
                        </div>
                        
                        <Link to={`/single-product/${datas.id || ''}`}>
                          <p className="title mb-3 sm:mb-2 text-sm sm:text-[15px] font-600 text-qblack leading-[20px] sm:leading-[24px] line-clamp-2 hover:text-blue-600">
                            {datas.name || datas.title || "Untitled Product"} {/* Use name if exists, else title */}
                          </p>
                        </Link>
                        
                        {/* Description and Review Comment */}
                        <p className="text-qgray text-xs mb-1 line-clamp-1">
                          {datas.description || `A great ${datas.subCategory || 'product'} from ${datas.brand || 'brand'}.`}
                        </p>
                        <p className="price text-xs sm:text-sm text-qgray line-clamp-2 sm:line-clamp-2 leading-[18px] sm:leading-[20px]">
                          {generateReviewComment(datas)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {safeProducts.length === 0 && (
          <div className="text-center py-10 text-qgray">No reviews available.</div>
        )}
      </div>
    </>
  );
}