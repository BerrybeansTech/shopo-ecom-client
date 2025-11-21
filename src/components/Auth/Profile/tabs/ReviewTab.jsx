import React, { useState, useEffect } from "react";
import { Star, Upload, X, Image as ImageIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { apiService } from "../../../../services/apiservice";

const ratingLabels = {
  1: "Very Bad",
  2: "Bad",
  3: "Good",
  4: "Very Good",
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
  }, [searchParams]);

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
        alert(`${file.name} is too large. Max size is 5MB`);
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
          reviewImages: review.images?.map(img => getProductImageUrl(img)) || []
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

        alert("Review submitted successfully!");
        
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
        {loadingProduct ? (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-600">Loading product details...</p>
            </div>
          </div>
        ) : selectedProduct ? (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={getProductImageUrl(selectedProduct.thumbnailImage)}
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
        ) : searchParams.get('productId') ? (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Product ID: {searchParams.get('productId')} - Loading details...
            </p>
          </div>
        ) : null}

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

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Upload up to 5 images (Max 5MB each)
          </p>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
                className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload images ({5 - imagePreviews.length} remaining)
                </span>
              </label>
            </div>
          )}
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
        <div id="reviews-list" className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Previous Reviews</h3>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow animate-slideIn"
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
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.comment}</p>
              )}

              {/* Review Images */}
              {review.reviewImages && review.reviewImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                  {review.reviewImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(img, '_blank')}
                    />
                  ))}
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
        }
      `}</style>
    </div>
  );
}