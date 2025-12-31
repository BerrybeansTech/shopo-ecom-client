import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../AllProductPage/hooks/useProducts";
import { getCategoryImage } from "../../utils/imageUtils";

export default function CategorySection({ className, sectionTitle = "Shop by Category" }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Use the products hook to get categories
  const { 
    categories: productCategories, 
    fetchCategoriesOnly,
    loading: categoriesLoading, 
    hasCategories
  } = useProducts();

  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        if (!hasCategories || productCategories.length === 0) {
          await fetchCategoriesOnly();
        }
      } catch (err) {
        console.error('CategorySection: Failed to load categories', err);
      }
    };

    loadCategories();
  }, [hasCategories, productCategories.length, fetchCategoriesOnly]);

  // Transform categories for display
  const displayCategories = (productCategories || [])
    .filter(category => category && category.name)
    .map(category => ({
      id: category.id,
      name: category.name.replace(/\.+$/, '').trim(),
      image: getCategoryImage(category),
      hasImage: !!(category.image && category.image !== 'null' && category.image !== null),
      link: `/all-products?categoryId=${category.id}`,
    }))
    .slice(0, 6);

  // Loading state
  if (categoriesLoading) {
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
              <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {category.hasImage ? (
                  <>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      onError={(e) => {
                        console.log(`Image failed to load: ${category.image}`);
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                      onLoad={() => console.log(`Image loaded: ${category.image}`)}
                      loading="lazy"
                    />
                    {/* Fallback content - hidden by default */}
                    <div className="hidden w-full h-full absolute inset-0 flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="text-gray-500 mb-4">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-16 w-16 mx-auto opacity-50"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={1.5} 
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </>
                ) : (
                  // Fallback UI for categories without images
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="text-gray-500 mb-4">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-16 w-16 mx-auto opacity-50"
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700">
                        {category.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2">
                        Coming Soon
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              </div>

              <div className={`absolute bottom-0 left-0 right-0 ${
                category.hasImage 
                  ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white' 
                  : 'bg-gradient-to-t from-gray-800/90 via-gray-800/50 to-transparent text-white'
              } p-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500`}>
                <h3 className="text-2xl font-semibold mb-3 leading-tight">
                  {category.name}
                </h3>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="text-sm font-medium tracking-wider">
                    {category.hasImage ? 'SHOP NOW' : 'EXPLORE'}
                  </span>
                  <ArrowRight className="ml-2 w-5 h-5 transform translate-x-0 group-hover:translate-x-3 transition-transform duration-300" />
                </div>
              </div>

              <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Optional: View all categories link */}
        {productCategories.length > 6 && (
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