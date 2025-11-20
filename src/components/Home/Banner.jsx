import { useState, useEffect } from 'react';

export default function Banner({ className }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80',
      alt: 'Premium Electronics',
      tag: 'NEW ARRIVAL',
      title: 'Premium Headphones',
      subtitle: 'Experience Superior Sound Quality'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80',
      alt: 'Smart Watches',
      tag: 'TRENDING',
      title: 'Smart Watches',
      subtitle: 'Technology Meets Style'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1600&q=80',
      alt: 'Designer Sunglasses',
      tag: 'EXCLUSIVE',
      title: 'Designer Eyewear',
      subtitle: 'Elevate Your Look'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1600&q=80',
      alt: 'Luxury Bags',
      tag: 'BESTSELLER',
      title: 'Premium Backpacks',
      subtitle: 'Style & Functionality Combined'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

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
    <div className={`w-full bg-white-50 ${className || ''}`}>
      {/* Main Slider Section */}
      <div className="relative w-full border-b border-white-700">
        <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] overflow-hidden bg-white-200">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[800ms] ease-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
              }`}
            >
              <div className="relative w-full h-full group">
                {/* Image with grayscale filter */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black-200/90 via-black-200/50 to-transparent"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                    <div className={`max-w-xl transition-all duration-700 ${
                      index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="inline-block mb-4">
                        <span className="text-[10px] tracking-[0.2em] font-semibold text-white-50 bg-black-900 px-4 py-1.5 uppercase">
                          {slide.tag}
                        </span>
                      </div>
                      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white-50 mb-4 tracking-tight leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-base lg:text-lg text-white-300 mb-8 font-light">
                        {slide.subtitle}
                      </p>
                      <button className="bg-white-50 text-black-900 px-10 py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-black-900 hover:text-white-50 transition-all duration-300 border border-white-50 hover:border-black-900">
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Controls - Both on Right Side */}
          <div className="absolute bottom-8 right-6 lg:right-12 flex items-center gap-4 z-10">
            {/* Minimalist Dots Indicator */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-400 ${
                    index === currentSlide
                      ? 'bg-white-50 w-10 h-0.5'
                      : 'bg-white-50/40 hover:bg-white-50/70 w-6 h-0.5'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="text-white-50 text-sm font-light tracking-wider">
              <span className="text-base font-medium">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="text-white-400 mx-1">/</span>
              <span className="text-white-400">{String(slides.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}