import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../AllProductPage/hooks/useProducts";
import { getCategoryImage } from "../../utils/imageUtils";

export default function CategorySection({ className, sectionTitle = "Shop by Category" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef(null);

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
    }));

  const totalSlides = displayCategories.length;

  // Auto-play carousel - smooth right-to-left animation
  useEffect(() => {
    if (!isAutoPlay || totalSlides <= 1) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 2000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, totalSlides]);

  // Get visible cards (5 cards: -2, -1, 0, 1, 2)
  const getVisibleCards = () => {
    const positions = [-2, -1, 0, 1, 2];
    return positions.map((pos) => {
      const index = (currentIndex + pos + totalSlides) % totalSlides;
      return {
        ...displayCategories[index],
        position: pos,
        actualIndex: index
      };
    });
  };

  // Calculate transform for right-to-left animation
  const getCardTransform = (position) => {
    const baseWidth = 384; // w-96
    const gap = 24; // lg:gap-6
    const spacing = baseWidth + gap;

    return {
      transform: `translateX(calc(-${position * spacing}px))`,
      opacity: position === 0 ? 1 : position === -1 || position === 1 ? 0.5 : 0.2,
      zIndex: position === 0 ? 20 : position === -1 || position === 1 ? 10 : 0,
    };
  };

  // Loading state
  if (categoriesLoading) {
    return (
      <section className={`py-8 sm:py-10 md:py-12 lg:py-16 ${className || ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-10 md:mb-11 tracking-tight">
            {sectionTitle}
          </h2>
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse text-gray-400">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (displayCategories.length === 0) {
    return (
      <section className={`py-8 sm:py-10 md:py-12 lg:py-16 ${className || ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-10 md:mb-11 tracking-tight">
            {sectionTitle}
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const visibleCards = getVisibleCards();

  return (
    <section className={`py-8 sm:py-10 md:py-12 lg:py-16 ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-10 md:mb-11 tracking-tight">
          {sectionTitle}
        </h2>

        {/* Carousel Container */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Carousel Wrapper */}
          <div className="flex items-center justify-center min-h-[400px] lg:min-h-[520px] overflow-hidden">
            <div className="relative w-full flex items-center justify-center">
              {/* Cards Container - Right-to-left animation */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 w-full">
                {visibleCards.map((card, idx) => {
                  const transform = getCardTransform(card.position);
                  const isCenter = card.position === 0;
                  const isAdjacent = card.position === -1 || card.position === 1;

                  return (
                    <div
                      key={`${card.id}-${card.position}-${idx}`}
                      className={`flex-shrink-0 transition-all duration-700 ease-in-out ${
                        isCenter
                          ? 'w-72 sm:w-80 lg:w-96 h-96 sm:h-[420px] lg:h-[480px] scale-100'
                          : isAdjacent
                          ? 'w-56 sm:w-64 lg:w-80 h-80 sm:h-96 lg:h-[420px] scale-85'
                          : 'w-40 sm:w-48 lg:w-64 h-72 sm:h-80 lg:h-96 scale-70'
                      }`}
                      style={{
                        opacity: transform.opacity,
                        zIndex: transform.zIndex,
                      }}
                    >
                      <Link
                        to={card.link}
                        className="group relative block overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 w-full h-full"
                      >
                        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {card.hasImage ? (
                            <>
                              <img
                                src={card.image}
                                alt={card.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                onError={(e) => {
                                  console.log(`Image failed to load: ${card.image}`);
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling?.classList.remove('hidden');
                                }}
                                onLoad={() => console.log(`Image loaded: ${card.image}`)}
                                loading="lazy"
                              />
                              {/* Fallback content */}
                              <div className="hidden w-full h-full absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-gray-200">
                                <div className="text-center">
                                  <div className="text-gray-500 mb-4">
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      className="h-12 w-12 lg:h-16 lg:w-16 mx-auto opacity-50"
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
                                  <h3 className="text-xs lg:text-sm font-semibold text-gray-700">
                                    {card.name}
                                  </h3>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-6">
                              <div className="text-center">
                                <div className="text-gray-500 mb-4">
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-12 w-12 lg:h-16 lg:w-16 mx-auto opacity-50"
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
                                <h3 className="text-sm lg:text-base font-semibold text-gray-700">
                                  {card.name}
                                </h3>
                                <p className="text-gray-500 text-xs lg:text-sm mt-2">
                                  Coming Soon
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                        </div>

                        {/* Content shown only on hover - center card */}
                        {isCenter && (
                          <div className={`absolute bottom-0 left-0 right-0 ${
                            card.hasImage 
                              ? 'bg-gradient-to-t from-black/95 via-black/75 to-transparent' 
                              : 'bg-gradient-to-t from-gray-900/95 via-gray-900/75 to-transparent'
                          } p-6 lg:p-8 opacity-0 group-hover:opacity-100 translate-y-8 lg:translate-y-10 group-hover:translate-y-0 transition-all duration-500 text-white`}>
                            <h3 className="text-lg lg:text-2xl font-bold mb-2 lg:mb-3 leading-tight">
                              {card.name}
                            </h3>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                              <span className="text-xs lg:text-sm font-semibold tracking-widest">
                                {card.hasImage ? 'SHOP NOW' : 'EXPLORE'}
                              </span>
                              <ArrowRight className="ml-3 w-4 h-4 lg:w-5 lg:h-5 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-500 pointer-events-none" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pagination Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 lg:mt-10">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex(index);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex
                      ? 'bg-black w-8'
                      : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile Counter */}
          {totalSlides > 1 && (
            <div className="lg:hidden text-center mt-4 text-xs text-gray-600">
              {currentIndex + 1} of {totalSlides}
            </div>
          )}
        </div>

        {/* View all categories link */}
        {productCategories.length > displayCategories.length && (
          <div className="text-center mt-12 lg:mt-16">
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