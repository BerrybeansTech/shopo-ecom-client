import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiservice';

export default function Banner({ className }) {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await apiService.get('/banner/get-active');
        let activeBanners = [];
        if (response && Array.isArray(response.data)) {
          activeBanners = response.data;
        } else if (response && Array.isArray(response.data?.data)) {
          activeBanners = response.data.data;
        } else if (response && Array.isArray(response)) {
          activeBanners = response;
        }

        const formattedSlides = activeBanners.map((banner) => ({
          id: banner.id,
          image: banner.image,
          mobileImage: banner.mobileImage,
          alt: banner.title || 'Promo Banner',
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          link: banner.link || '',
          buttonText: banner.buttonText || ''
        }));
        setSlides(formattedSlides);
      } catch (err) {
        console.error('Error fetching active banners:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  if (isLoading) {
    return (
      <div className={`w-full bg-gray-50 flex items-center justify-center min-h-[250px] aspect-[16/6] ${className || ''}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
          <span className="text-gray-400 text-sm">Loading promotions...</span>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={`w-full bg-white ${className || ''}`}>
      <div className="relative w-full border-b border-gray-200">
        <div className="relative w-full overflow-hidden bg-gray-200">
          {slides.map((slide, index) => {
            const bannerImage = isMobile && slide.mobileImage ? slide.mobileImage : slide.image;

            return (
              <div
                key={slide.id}
                className={`transition-all duration-[800ms] ease-out ${
                  index === currentSlide
                    ? 'relative z-10 opacity-100 scale-100'
                    : 'absolute inset-0 z-0 opacity-0 scale-[1.02] pointer-events-none'
                }`}
              >
                <div className="relative w-full group">
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={bannerImage}
                      alt={slide.alt}
                      className="w-full h-auto block"
                    />
                  </div>

                  {(slide.title || slide.subtitle || slide.link) && (
                    <div className="absolute inset-0 flex items-end pb-24 sm:items-center sm:pb-0">
                      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl w-full">
                        <div className={`max-w-2xl transition-all duration-700 ${
                          index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                          {slide.title && (
                            <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight">
                              {slide.title}
                            </h2>
                          )}
                          {slide.subtitle && (
                            <p className="text-sm sm:text-sm md:text-base lg:text-lg text-gray-300 mb-4 sm:mb-6 md:mb-8 font-light">
                              {slide.subtitle}
                            </p>
                          )}
                          {slide.link && (
                            <Link 
                              to={slide.link} 
                              className="inline-block bg-white text-black px-8 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 border border-white hover:border-black text-center"
                            >
                              {slide.buttonText || 'Explore Now'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {slides.length > 1 && (
            <div className="absolute bottom-8 sm:bottom-6 md:bottom-8 right-4 sm:right-6 lg:right-12 flex items-center gap-3 sm:gap-4 z-10">
              <div className="flex gap-2 sm:gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-400 ${
                      index === currentSlide
                        ? 'bg-white w-10 sm:w-10 h-0.5'
                        : 'bg-white/40 hover:bg-white/70 w-6 sm:w-6 h-0.5'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="text-white text-sm sm:text-sm font-light tracking-wider">
                <span className="text-base sm:text-base font-medium">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-gray-400 mx-1 sm:mx-1">/</span>
                <span className="text-gray-400 text-sm sm:text-sm">{String(slides.length).padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}