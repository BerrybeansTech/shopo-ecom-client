import React from 'react';
import { PUBLIC_URL } from '../../constants';

/**
 * ProductImage Component
 * A reusable component to handle product image logic with fallbacks
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object containing image data
 * @param {string} props.className - Additional CSS classes for the img element
 * @param {string} props.alt - Alt text for the image
 */
const ProductImage = ({ product, className, alt, ...props }) => {
    /**
     * Logic to determine the correct product image URL
     * 1. Check thumbnailImage
     * 2. Check galleryImage array
     * 3. Fallback to placeholder
     */
    const getProductImage = (product) => {
        if (!product) {
            return `https://placehold.co/400x400/ffffff/000000?text=No+Product`;
        }

        // 1. Try thumbnail image
        if (product.thumbnailImage) {
            return product.thumbnailImage.startsWith("http")
                ? product.thumbnailImage
                : `${PUBLIC_URL}/${product.thumbnailImage}`;
        }

        // 2. Try first image from gallery
        if (product.galleryImage && Array.isArray(product.galleryImage) && product.galleryImage.length > 0) {
            const firstImage = product.galleryImage[0];
            return firstImage.startsWith("http")
                ? firstImage
                : `${PUBLIC_URL}/${firstImage}`;
        }

        // 3. Fallback to placeholder with product name
        const productName = product.name || product.title || 'Product';
        return `https://placehold.co/400x400/ffffff/000000?text=${encodeURIComponent(productName)}`;
    };

    return (
        <img
            src={getProductImage(product)}
            alt={alt || product?.name || product?.title || 'product'}
            className={className}
            {...props}
        />
    );
};

export default ProductImage;
