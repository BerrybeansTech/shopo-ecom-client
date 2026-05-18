import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiservice';

export default function Banner({ className }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await apiService.get('/banner/get-active');
        if (res.success && res.data && res.data.length > 0) {
          const formattedSlides = res.data.map((banner, index) => ({
            id: banner.id,
            image: banner.image,
            alt: banner.title || 'Promo Banner',
            tag: index === 0 ? 'NEW ARRIVAL' : (index === 1 ? 'TRENDING' : (index === 2 ? 'EXCLUSIVE' : 'BESTSELLER')),
            title: banner.title || 'Rabbit Finch Fashion',
            subtitle: banner.subtitle || 'Shop Premium Styles',
            link: banner.link || '/all-products'
          }));
          setSlides(formattedSlides);
        }
      } catch (e) {
        console.error("Failed to load active banners from backend", e);
      }
    };

    fetchBanners();
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

  return (
    <div className={`w-full bg-white ${className || ''}`}>
      <div className="relative w-full border-b border-gray-200">
        <div className="relative w-full h-[518px] sm:h-[380px] md:h-[420px] lg:h-[500px] overflow-hidden bg-gray-200">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[800ms] ease-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
              }`}
            >
              <div className="relative w-full h-full group">
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center sm:object-cover grayscale transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent md:from-black/90 md:via-black/50"></div>
                </div>

                <div className="absolute inset-0 flex items-end pb-20 sm:items-center sm:pb-0">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl w-full">
                    <div className={`max-w-2xl transition-all duration-700 ${
                      index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="inline-block mb-2 sm:mb-4">
                        <span className="text-[10px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-white bg-black px-3 sm:px-4 py-1 sm:py-1.5 uppercase">
                          {slide.tag}
                        </span>
                      </div>
                      <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-sm sm:text-sm md:text-base lg:text-lg text-gray-300 mb-4 sm:mb-6 md:mb-8 font-light">
                        {slide.subtitle}
                      </p>
                      <a 
                        href={slide.link || '/all-products'} 
                        className="inline-block bg-white text-black px-8 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 border border-white hover:border-black text-center"
                      >
                        Explore Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

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