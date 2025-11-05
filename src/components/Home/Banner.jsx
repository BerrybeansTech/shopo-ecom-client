import { useState, useEffect } from 'react';
import { Truck, RotateCcw, Shield, Award } from 'lucide-react';

export default function Banner({ className }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
      alt: 'Fashion Store'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
      alt: 'Clothing Collection'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
      alt: 'Accessories'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
      alt: 'Fashion Trends'
    }
  ];

  const services = [
    {
      icon: <Truck className="w-7 h-7" />,
      title: 'Free Shipping',
      description: 'On orders over $100'
    },
    {
      icon: <RotateCcw className="w-7 h-7" />,
      title: 'Easy Returns',
      description: '30 days return policy'
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: 'Best Quality',
      description: 'Original products guaranteed'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Main Slider Section - Full Width */}
      <div className="relative w-full mb-0">
        {/* Slider Container */}
        <div className="relative w-full h-[240px] sm:h-[320px] lg:h-[420px] xl:h-[500px] overflow-hidden bg-gray-100">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <a href="/single-product" className="block w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
          ))}

          {/* Dots Indicator - Bottom Right */}
          <div className="absolute bottom-5 right-5 flex gap-2.5 backdrop-blur-sm rounded-full px-3 py-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-400 rounded-full ${
                  index === currentSlide
                    ? 'bg-white w-10 h-2.5 shadow-lg'
                    : 'bg-white/50 hover:bg-white/75 w-2.5 h-2.5 hover:scale-125'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="w-full bg-white border-t pt-10 border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 lg:p-8 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex-shrink-0 text-yellow-500">
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-semibold text-sm lg:text-base mb-0.5 truncate">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-xs lg:text-sm leading-tight">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}