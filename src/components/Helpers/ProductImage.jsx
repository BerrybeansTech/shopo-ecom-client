import React, { useState, useEffect, useRef } from 'react';
import { getProductImage } from '../../utils/imageUtils';

/**
 * Global ProductImage Component
 * Handles image rendering with shimmer loading animation & fallbacks.
 */
const ProductImage = ({ 
  product, 
  src, 
  className = '', 
  alt, 
  placeholder, 
  fit = "cover", 
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef(null);

  const imageSrc = src || (product ? getProductImage(product) : null);
  const fallbackPlaceholder = placeholder || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ELoading...%3C/text%3E%3C/svg%3E";
  const finalSrc = !imageSrc || isError ? fallbackPlaceholder : imageSrc;

  useEffect(() => {
    // If the image is already cached in memory, mark as loaded immediately
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      setIsError(false);
    } else {
      setIsLoaded(false);
      setIsError(false);
    }
  }, [finalSrc]);

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden flex items-center justify-center">
      {/* Premium Shimmer Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex flex-col items-center justify-center z-10 p-2 text-center">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-[11px] font-medium text-gray-500 tracking-wider">Loading...</span>
        </div>
      )}

      {/* Actual Product Image */}
      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt || product?.name || product?.title || 'Product'}
        className={`w-full h-full ${fitClass} transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsError(true);
          setIsLoaded(true);
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default ProductImage;
