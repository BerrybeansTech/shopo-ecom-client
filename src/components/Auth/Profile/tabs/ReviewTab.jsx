import React, { useState, useEffect } from "react";
import { Star, Upload, X, Image as ImageIcon, ShoppingBag, CheckCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { apiService } from "../../../../services/apiservice";

const ratingLabels = {
  1: "Very Dissatisfied",
  2: "Dissatisfied",
  3: "Satisfactory",
  4: "Very Satisfied",
  5: "Excellent",
};

// Get base URL for images
const BASE_URL = 'http://luxcycs.com:5501';

export default function ReviewTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [productId, setProductId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchUserReviews();
    const productIdFromUrl = searchParams.get('productId');
    if (productIdFromUrl) {
      setProductId(productIdFromUrl);
      fetchProductDetails(productIdFromUrl);
      setTimeout(() => {
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
          reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    // Fetch user's order history for eligible reviews
    fetchOrderHistory();
  }, [searchParams]);

  const fetchOrderHistory = async () => {
    try {
      setLoadingOrders(true);
      // Replace with your actual order history API endpoint
      const response = await apiService.get('/order/user-orders');
      if (response.success) {
        // Filter for delivered/completed orders
        const deliveredOrders = response.data.filter(order => 
          order.status === 'delivered' || order.status === 'completed'
        );
        setOrderHistory(deliveredOrders);
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      setLoadingProduct(true);
      const response = await apiService.get(`/product/get-product/${productId}`);
      console.log('Product details response:', response);
      
      let productData = null;
      if (response.success && response.data) {
        productData = response.data;
      } else if (response.id) {
        productData = response;
      }
      
      if (productData) {
        setSelectedProduct(productData);
      } else {
        console.error('Product not found');
        alert('Product details could not be loaded. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      alert('Failed to load product details. Please try again.');
    } finally {
      setLoadingProduct(false);
    }
  };

  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/images/shirt2.webp";
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}/${imagePath}`;
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (selectedImages.length + files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index].url);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/product/review/get-all');
      if (response.success) {
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
          productImage: getProductImageUrl(review.Product?.thumbnailImage),
          reviewImages: review.images?.map(img => getProductImageUrl(img)) || [],
          orderId: review.OrderItem?.Order?.orderId || null
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
      alert("Please provide a rating, write your review, and select a product!");
      return;
    }

    try {
      setSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('productId', parseInt(productId.trim()));
      formData.append('rating', rating);
      formData.append('comment', comment.trim());
      
      // Append images
      selectedImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await apiService.post('/product/review/create', formData);

      if (response.success) {
        // Create new review object to add to list immediately
        const newReview = {
          id: response.data?.id || Date.now(),
          rating,
          comment: comment.trim(),
          date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          productName: selectedProduct?.name || "Product",
          productImage: getProductImageUrl(selectedProduct?.thumbnailImage),
          reviewImages: response.data?.images?.map(img => getProductImageUrl(img)) || imagePreviews.map(p => p.url)
        };

        // Add new review to the top of the list immediately
        setReviews(prevReviews => [newReview, ...prevReviews]);

        alert("Thank you! Your review has been submitted successfully.");
        
        // Reset form
        setRating(0);
        setComment("");
        setSelectedImages([]);
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        setImagePreviews([]);
        
        if (!searchParams.get('productId')) {
          setProductId("");
        }
        setSelectedProduct(null);
        
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('productId');
        setSearchParams(newParams);
        
        // Scroll to reviews section
        setTimeout(() => {
          const reviewsList = document.getElementById('reviews-list');
          if (reviewsList) {
            reviewsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        
        // Refresh reviews in background
        fetchUserReviews();
      } else {
        if (response.message && response.message.includes("You can only review products you have purchased and received")) {
          alert("You can only review products from orders that have been delivered. Please wait for your order to be delivered before writing a review.");
        } else if (response.message && response.message.includes("already reviewed")) {
          alert("You have already reviewed this product. Thank you for your feedback!");
        } else {
          alert(response.message || "We were unable to submit your review. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setRating(0);
    setComment("");
    setProductId("");
    setSelectedProduct(null);
    setSelectedImages([]);
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    setImagePreviews([]);
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
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">My Reviews & Feedback</h2>
        </div>
        <p className="text-gray-600">
          Share your experiences with products you've purchased. Your reviews help other customers make informed decisions.
        </p>
        
        {reviews.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-300">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} submitted
            </span>
            {orderHistory.length > 0 && (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                {orderHistory.length} eligible product{orderHistory.length !== 1 ? 's' : ''} for review
              </span>
            )}
          </div>
        )}
      </div>

      {/* Eligibility Notice */}
      <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Review Guidelines</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• You can only review products you have purchased and received</li>
              <li>• Reviews must be based on your personal experience with the product</li>
              <li>• Include clear photos to help other customers see the product quality</li>
              <li>• Be honest and constructive in your feedback</li>
              <li>• Your reviews will be publicly visible on the product page</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Review Form */}
      <form 
        id="review-form"
        onSubmit={handleSubmitReview} 
        className="bg-white rounded-xl border border-gray-200 p-6 mb-10 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Write Your Review</h3>
            <p className="text-sm text-gray-500 mt-1">
              Share your honest opinion about this product
            </p>
          </div>
          {searchParams.get('productId') && (
            <button
              type="button"
              onClick={handleClearForm}
              className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
            >
              Clear Form
            </button>
          )}
        </div>

        {/* Selected Product Display */}
        {loadingProduct ? (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-600">Loading product details...</p>
            </div>
          </div>
        ) : selectedProduct ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={getProductImageUrl(selectedProduct.thumbnailImage)}
                  alt={selectedProduct.name}
                  className="w-16 h-16 border border-gray-300 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Eligible for Review
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Product ID: {selectedProduct.id}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Ready to review this product
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : searchParams.get('productId') ? (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Product ID: {searchParams.get('productId')} - Loading details...
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> To write a review, please select a product from your order history or 
              use a product link that includes review eligibility.
            </p>
          </div>
        )}

        {/* Star Rating */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Rating <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              How would you rate your overall experience with this product?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} stars - ${ratingLabels[star]}`}
                >
                  <Star
                    className={`w-10 h-10 ${
                      rating >= star
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                        : "text-gray-300 hover:text-yellow-300"
                    } transition-all duration-200`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="animate-fadeIn flex flex-col">
                <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 font-medium text-sm rounded-lg">
                  {ratingLabels[rating]}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {rating} star{rating !== 1 ? 's' : ''} selected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Review <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs ${comment.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
              {comment.length}/500 characters
            </span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            maxLength={500}
            placeholder="Share your detailed experience with this product. Consider mentioning:
• Product quality and durability
• Fit and comfort (for clothing)
• How it compares to your expectations
• Any issues you encountered
• Would you recommend this to others?"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Upload up to 5 images (5MB max per image) to show product quality, details, or any issues.
          </p>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-300 group-hover:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {imagePreviews.length < 5 && (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600 font-medium">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500">
                  ({5 - imagePreviews.length} remaining • JPG, PNG, GIF up to 5MB)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          {searchParams.get('productId') && (
            <button
              type="button"
              onClick={handleClearForm}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium text-sm transition-colors"
            >
              Cancel Review
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !rating || !comment.trim() || !productId.trim()}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-sm transition-colors shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-lg text-gray-500 mb-2">No Reviews Yet</p>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            You haven't reviewed any products yet. Once you purchase and receive products, 
            you'll be able to share your experiences here.
          </p>
          <button 
            onClick={() => window.location.href = '/orders'}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            View My Orders
          </button>
        </div>
      ) : (
        <div id="reviews-list" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Review History</h3>
            <p className="text-sm text-gray-500">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} • Sorted by most recent
            </p>
          </div>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow animate-slideIn"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-16 h-16 border border-gray-300 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{review.productName}</h3>
                    {review.orderId && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        Order #{review.orderId}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Reviewed on {review.date}
                  </p>
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
                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              )}

              {/* Review Images */}
              {review.reviewImages && review.reviewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Attached Photos:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {review.reviewImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Review photo ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(img, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
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
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        #reviews-list > .animate-slideIn:first-child {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: linear-gradient(to right, rgba(59, 130, 246, 0.02), rgba(59, 130, 246, 0.01));
        }
        
        textarea::placeholder {
          color: #9ca3af;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}