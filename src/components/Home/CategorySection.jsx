import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../AllProductPage/hooks/useProducts";

export default function CategorySection({ className, sectionTitle = "Shop by Category" }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Use the products hook to get categories
  const { 
    categories: productCategories, 
    fetchCategoriesOnly,
    loading: categoriesLoading, 
    hasCategories
  } = useProducts();

  // Fetch categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (hasCategories && productCategories.length > 0) {
          setCategories(productCategories);
        } else {
          await fetchCategoriesOnly();
        }
      } catch (err) {
        console.error('CategorySection: Failed to load categories', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [hasCategories, productCategories.length, fetchCategoriesOnly]);

  // Update local categories state when productCategories changes
  useEffect(() => {
    if (productCategories && productCategories.length > 0) {
      setCategories(productCategories);
    }
  }, [productCategories]);

  // Handle image errors
  const handleImageError = (categoryId) => {
    setImageErrors(prev => new Set(prev.add(categoryId)));
  };

  // Check if image should be shown or use fallback
  const getImageUrl = (category) => {
    if (imageErrors.has(category.id) || !category.image) {
      // Use a reliable placeholder image service or SVG
      return `https://placehold.co/400x500/ffffff/000000?text=${encodeURIComponent(category.name)}`;
    }
    
    // Construct proper image URL
    if (category.image.startsWith('http')) {
      return category.image;
    } else if (category.image.startsWith('/')) {
      return `http://luxcycs.com:5501${category.image}`;
    } else {
      return `http://luxcycs.com:5501/${category.image}`;
    }
  };

  // Transform categories for display
  const displayCategories = categories
    .filter(category => category && category.name)
    .map(category => ({
      id: category.id,
      name: category.name.replace(/\.+$/, '').trim(),
      image: getImageUrl(category),
      link: `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}-${category.id}`,
      originalImage: category.image // Keep original for reference
    }))
    .slice(0, 6);

  // Loading state
  if (loading || categoriesLoading) {
    return (
      <section className={`py-10 lg:py-16 ${className || ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-3xl font-bold text-center text-gray-900 mb-11 tracking-tight">
            {sectionTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="group relative block overflow-hidden rounded-2xl shadow-lg bg-gray-200 animate-pulse"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-300">
                  <div className="w-full h-full" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                  <div className="h-6 bg-gray-400 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={`py-10 lg:py-16 ${className || ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-3xl font-bold text-center text-gray-900 mb-11 tracking-tight">
            {sectionTitle}
          </h2>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (displayCategories.length === 0) {
    return (
      <section className={`py-10 lg:py-16 ${className || ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-3xl font-bold text-center text-gray-900 mb-11 tracking-tight">
            {sectionTitle}
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-10 lg:py-16 ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-3xl font-bold text-center text-gray-900 mb-11 tracking-tight">
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayCategories.map((category, index) => (
            <Link
              to={category.link}
              key={category.id}
              className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={() => handleImageError(category.id)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-semibold text-white mb-3 leading-tight">
                  {category.name}
                </h3>
                <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="text-sm font-medium tracking-wider">SHOP NOW</span>
                  <ArrowRight className="ml-2 w-5 h-5 transform translate-x-0 group-hover:translate-x-3 transition-transform duration-300" />
                </div>
              </div>

              <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Optional: View all categories link */}
        {categories.length > 6 && (
          <div className="text-center mt-12">
            <Link
              to="/all-categories"
              className="inline-flex items-center px-6 py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              View All Categories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}