import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { apiService } from "../../../../services/apiservice";

const ratingLabels = {
  1: "Very Bad",
  2: "Bad",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function ReviewTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [productId, setProductId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchUserReviews();
    // Check if there's a productId in URL params (from order page)
    const productIdFromUrl = searchParams.get('productId');
    if (productIdFromUrl) {
      setProductId(productIdFromUrl);
      // Fetch product details
      fetchProductDetails(productIdFromUrl);
      // Scroll to review form
      setTimeout(() => {
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
          reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await apiService.get(`/product/get/${productId}`);
      if (response.success) {
        setSelectedProduct(response.data);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/product/review/get-all');
      if (response.success) {
        // Transform API response to match component's expected format
        const transformedReviews = response.data.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment || "",
          date: new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          productName: review.Product?.name || "Unknown Product",
          productImage: review.Product?.thumbnailImage
            ? `${apiService.getBaseURL()}/${review.Product.thumbnailImage}`
            : "/assets/images/shirt2.webp"
        }));
        setReviews(transformedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim() || !productId.trim()) {
      alert("Rating, comment, and product ID are required!");
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        productId: parseInt(productId.trim()),
        rating,
        comment: comment.trim()
      };

      const response = await apiService.post('/product/review/create', reviewData);

      if (response.success) {
        alert("Review submitted successfully!");
        // Reset form
        setRating(0);
        setComment("");
        // Only reset productId if it wasn't from URL params
        if (!searchParams.get('productId')) {
          setProductId("");
        }
        setSelectedProduct(null);
        // Remove productId from URL after submission
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('productId');
        setSearchParams(newParams);
        // Refresh reviews
        await fetchUserReviews();
      } else {
        // Handle specific error messages from backend
        if (response.message && response.message.includes("You can only review products you have purchased and received")) {
          alert("You can only review products from orders that have been delivered. Please wait for your order to be delivered before writing a review.");
        } else {
          alert(response.message || "Failed to submit review");
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Function to clear the form and URL params
  const handleClearForm = () => {
    setRating(0);
    setComment("");
    setProductId("");
    setSelectedProduct(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('productId');
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-lg text-gray-500 mt-4">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Reviews</h2>
        {reviews.length > 0 && (
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {reviews.length}
          </span>
        )}
      </div>

      {/* Create Review Form */}
      <form 
        id="review-form"
        onSubmit={handleSubmitReview} 
        className="bg-white rounded-lg border border-gray-200 p-6 mb-10 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
          {searchParams.get('productId') && (
            <button
              type="button"
              onClick={handleClearForm}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear Form
            </button>
          )}
        </div>

        {/* Selected Product Display */}
        {selectedProduct && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.thumbnailImage 
                  ? `${apiService.getBaseURL()}/${selectedProduct.thumbnailImage}`
                  : "/assets/images/shirt2.webp"}
                alt={selectedProduct.name}
                className="w-16 h-16 border border-gray-300 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600">Product ID: {selectedProduct.id}</p>
                <p className="text-xs text-blue-600 mt-1">Ready to review this product</p>
              </div>
            </div>
          </div>
        )}

        {/* Product ID - Hidden from UI */}
        <div className="hidden">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            placeholder="Enter product ID"
            readOnly={!!searchParams.get('productId')}
            className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none ${
              searchParams.get('productId')
                ? 'bg-gray-50 text-gray-600 cursor-not-allowed'
                : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {searchParams.get('productId') && (
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Product automatically selected from your order
            </p>
          )}
        </div>

        {/* Star Rating */}
        <div className="flex flex-col gap-4 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Dynamic Label */}
            {rating > 0 && (
              <div className="animate-fadeIn">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 font-medium text-xs rounded-full">
                  {ratingLabels[rating]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            placeholder="Share your experience with this product..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length} / 500 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          {searchParams.get('productId') && (
            <button
              type="button"
              onClick={handleClearForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !rating || !comment.trim() || !productId.trim()}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide transition-colors shadow-sm"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg text-gray-500 mb-2">No reviews yet.</p>
          <p className="text-sm text-gray-400">You haven't reviewed any products yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Previous Reviews</h3>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-16 h-16 border border-gray-300 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{review.productName}</h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  {ratingLabels[review.rating]}
                </span>
              </div>

              {review.comment && (
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}