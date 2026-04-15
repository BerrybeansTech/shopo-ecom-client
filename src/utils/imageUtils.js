import { PUBLIC_URL } from '../constants';

/**
 * Normalizes a list of product images, ensuring at least one image exists
 * @param {Object} product - The product object
 * @returns {string[]} - List of normalized image URLs
 */
export const normalizeProductImages = (product) => {
    if (!product) return [getPlaceholderImage('No Product')];

    let images = [];
    // galleryImage can arrive as an array, a JSON-stringified array, or a single string
    let gallery = product.galleryImage;
    if (typeof gallery === 'string') {
        try {
            const parsed = JSON.parse(gallery);
            gallery = Array.isArray(parsed) ? parsed : gallery;
        } catch {
            // leave as-is
        }
    }

    if (Array.isArray(gallery) && gallery.length > 0) {
        images = gallery.map(img => getImageUrl(img));
    } else if (product.thumbnailImage) {
        images = [getImageUrl(product.thumbnailImage)];
    }

    if (images.length === 0) {
        images = [getPlaceholderImage(product.name || 'Product')];
    }

    return images;
};

/**
 * Generates a placeholder image URL using placehold.co
 * @param {string} text - The text to display on the placeholder
 * @param {string} size - The size of the image (e.g., '400x400')
 * @returns {string} - The placeholder URL
 */
export const getPlaceholderImage = (text = 'Product', size = '400x400') => {
    return `https://placehold.co/${size}/ffffff/000000?text=${encodeURIComponent(text)}`;
};

/**
 * Normalizes an image path to a full URL
 * @param {string} path - The image path or full URL
 * @returns {string} - The normalized URL
 */
export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Remove leading slash if present to avoid double slashes
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    return `${PUBLIC_URL}/${normalizedPath}`;
};

/**
 * Determines the best image for a product object
 * @param {Object} product - The product object
 * @returns {string} - The final image URL or placeholder
 */
export const getProductImage = (product) => {
    if (!product) return getPlaceholderImage('No Product');

    // 1. Try thumbnail image
    if (product.thumbnailImage || product.thumbnail) {
        return getImageUrl(product.thumbnailImage || product.thumbnail);
    }

    // 2. Try first image from gallery
    let gallery = product.galleryImage;
    if (typeof gallery === 'string') {
        try {
            const parsed = JSON.parse(gallery);
            gallery = Array.isArray(parsed) ? parsed : gallery;
        } catch {
            // leave as-is
        }
    }
    if (Array.isArray(gallery) && gallery.length > 0) {
        return getImageUrl(gallery[0]);
    }

    // 3. Try first image from images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return getImageUrl(product.images[0]);
    }

    // 4. Fallback to placeholder
    const productName = product.name || product.title || 'Product';
    return getPlaceholderImage(productName);
};

/**
 * Determines the best image for a category object
 * @param {Object} category - The category object
 * @returns {string} - The final image URL or placeholder
 */
export const getCategoryImage = (category) => {
    if (!category) return getPlaceholderImage('No Category');

    if (category.image && category.image !== 'null') {
        return getImageUrl(category.image);
    }

    const categoryName = category.name || 'Category';
    return getPlaceholderImage(categoryName);
};

/**
 * Determines the best image for a blog object
 * @param {Object} blog - The blog object
 * @returns {string} - The final image URL or placeholder
 */
export const getBlogImage = (blog) => {
    if (!blog) return getPlaceholderImage('No Blog');

    const imagePath = blog.featuredImage || blog.bannerImage;
    if (imagePath && imagePath !== 'null') {
        return getImageUrl(imagePath);
    }

    const blogTitle = blog.title || 'Blog';
    return getPlaceholderImage(blogTitle);
};

/**
 * Common static asset paths
 */
export const IMAGES = {
    logo: '/assets/images/logo.svg',
    logoPng: '/assets/images/logo.png',
    placeholder: 'https://placehold.co/400x400/ffffff/000000?text=Shopo',
    noProduct: 'https://placehold.co/400x400/ffffff/000000?text=No+Product',
    noCategory: 'https://placehold.co/400x400/ffffff/000000?text=No+Category',
    noBlog: 'https://placehold.co/400x400/ffffff/000000?text=No+Blog',
};
