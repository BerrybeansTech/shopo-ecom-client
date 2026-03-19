import React from 'react';
import { getProductImage } from '../../utils/imageUtils';

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
