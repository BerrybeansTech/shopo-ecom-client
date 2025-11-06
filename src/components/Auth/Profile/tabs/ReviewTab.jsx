import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

// 5 STARS × 3 TEXTS EACH = 15 RANDOM TEXTS
const randomTexts = {
  1: ["Total Waste", "Big Mistake", "Avoid This"],
  2: ["Not Good", "Below Average", "Meh"],
  3: ["It's Okay", "Normal Only", "Average"],
  4: ["Nice One!", "Worth Buying", "Happy!"],
  5: ["Mind Blowing!", "Superb Quality", "Best Ever!"],
};

const ratingLabels = {
  1: "Very Bad",
  2: "Bad",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function ProductReviewPage({ product }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  // AUTO + RANDOM TITLE ON EVERY STAR CLICK
  useEffect(() => {
    if (rating > 0) {
      const texts = randomTexts[rating];
      const randomIndex = Math.floor(Math.random() * 3);
      setTitle(texts[randomIndex]);
    }
  }, [rating]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !description.trim()) return alert("Rating & review required!");

    const newReview = {
      id: Date.now(),
      rating,
      title: title || "No Title",
      description: description.trim(),
      image,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setTitle("");
    setDescription("");
    setImage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Product Info */}
      <div className="flex items-start gap-4 border-b border-gray-200 pb-6 mb-8">
        <img
          src={product?.image || "/assets/images/shirt2.webp"}
          alt={product?.name || "Product"}
          className="w-20 h-20 border border-gray-300 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            {product?.name || "ESSENCE Slip On For Men"}
          </h1>
          <p className="text-sm text-gray-600">{product?.brand || "ESSENCE"}</p>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Rate this product</h2>

        {/* Star Rating with Label */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
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

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review this product <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            placeholder="Share your experience with this product..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Title - Auto + Random */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Click on stars to generate a random title"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Add Photo</label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              {image ? (
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              ) : (
                <>
                  <span className="text-2xl text-gray-400">+</span>
                  <span className="text-xs text-gray-500 mt-1">Add photo</span>
                </>
              )}
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {image && (
              <button 
                type="button"
                onClick={() => setImage(null)} 
                className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide transition-colors shadow-sm"
          >
            Submit Review
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {reviews.length}
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-lg text-gray-500 mb-2">No reviews yet.</p>
            <p className="text-sm text-gray-400">Be the first to share your experience! ⭐</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    {ratingLabels[rev.rating]}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{rev.date}</span>
              </div>

              {/* Review Content */}
              {rev.title && rev.title !== "No Title" && (
                <h3 className="font-semibold text-gray-900 mb-2">{rev.title}</h3>
              )}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{rev.description}</p>
              
              {/* Review Image */}
              {rev.image && (
                <img
                  src={rev.image}
                  alt="Customer review"
                  className="w-28 h-28 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
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