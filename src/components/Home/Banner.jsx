// import { useState, useEffect } from 'react';
// import { Truck, RotateCcw, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';

// export default function Banner({ className }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   const slides = [
//     {
//       id: 1,
//       image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
//       alt: 'Fashion Store',
//       title: 'New Collection',
//       subtitle: 'Discover the latest trends'
//     },
//     {
//       id: 2,
//       image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
//       alt: 'Clothing Collection',
//       title: 'Premium Quality',
//       subtitle: 'Crafted with perfection'
//     },
//     {
//       id: 3,
//       image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
//       alt: 'Accessories',
//       title: 'Exclusive Accessories',
//       subtitle: 'Complete your look'
//     },
//     {
//       id: 4,
//       image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
//       alt: 'Fashion Trends',
//       title: 'Trending Now',
//       subtitle: 'Shop the hottest styles'
//     }
//   ];

//   const services = [
//     {
//       icon: <Truck className="w-6 h-6" />,
//       title: 'Free Shipping',
//       description: 'On orders over $100'
//     },
//     {
//       icon: <RotateCcw className="w-6 h-6" />,
//       title: 'Easy Returns',
//       description: '30 days return policy'
//     },
//     {
//       icon: <Shield className="w-6 h-6" />,
//       title: 'Secure Payment',
//       description: '100% secure transactions'
//     },
//     {
//       icon: <Award className="w-6 h-6" />,
//       title: 'Best Quality',
//       description: 'Original products guaranteed'
//     }
//   ];

//   useEffect(() => {
//     if (!isAutoPlaying) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [isAutoPlaying, slides.length]);

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     setIsAutoPlaying(false);
//     setTimeout(() => setIsAutoPlaying(true), 10000);
//   };

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//     setIsAutoPlaying(false);
//     setTimeout(() => setIsAutoPlaying(true), 10000);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//     setIsAutoPlaying(false);
//     setTimeout(() => setIsAutoPlaying(true), 10000);
//   };

//   return (
//     <div className={`w-full ${className || ''}`}>
//       {/* Main Slider Section */}
//       <div className="relative w-full">
//         {/* Slider Container */}
//         <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden bg-gray-100">
//           {/* Slides */}
//           {slides.map((slide, index) => (
//             <div
//               key={slide.id}
//               className={`absolute inset-0 transition-all duration-700 ease-out ${
//                 index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
//               }`}
//             >
//               <div className="relative w-full h-full group cursor-pointer">
//                 <img
//                   src={slide.image}
//                   alt={slide.alt}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
//                 />
//                 {/* Overlay Content */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-center">
//                   <div className="container mx-auto px-6 md:px-12 max-w-7xl">
//                     <div className={`text-white max-w-xl transition-all duration-700 delay-200 ${
//                       index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
//                     }`}>
//                       <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
//                         {slide.title}
//                       </h2>
//                       <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-6">
//                         {slide.subtitle}
//                       </p>
//                       <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
//                         Shop Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Navigation Arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
//             aria-label="Next slide"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>

//           {/* Dots Indicator */}
//           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`transition-all duration-300 rounded-full ${
//                   index === currentSlide
//                     ? 'bg-white w-8 h-2'
//                     : 'bg-white/50 hover:bg-white/75 w-2 h-2'
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Services Section */}
//       <div className="w-full bg-white py-8 border-b border-gray-100">
//         <div className="container mx-auto px-4 max-w-7xl">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {services.map((service, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
//               >
//                 <div className="mb-3 text-gray-700 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:scale-110">
//                   {service.icon}
//                 </div>
//                 <h3 className="text-gray-900 font-semibold text-sm mb-1">
//                   {service.title}
//                 </h3>
//                 <p className="text-gray-600 text-xs leading-relaxed">
//                   {service.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Truck, RotateCcw, Shield, Award } from 'lucide-react';

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

  const services = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Delivery',
      description: 'On orders above ₹500'
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: '7 Day Replacement',
      description: 'Easy return policy'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Payments',
      description: '100% safe transactions'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Top Quality',
      description: 'Verified products only'
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

          {/* Minimalist Dots Indicator */}
          <div className="absolute bottom-8 left-6 lg:left-12 flex gap-2 z-10">
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
          <div className="absolute bottom-8 right-6 lg:right-12 text-white-50 text-sm font-light tracking-wider z-10">
            <span className="text-base font-medium">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="text-white-400 mx-1">/</span>
            <span className="text-white-400">{String(slides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Services Section - Flipkart Style */}
      <div className="w-full bg-white-50 mt-20 ">
        <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 py-5 px-4 bg-white-100 hover:bg-white-200 transition-colors duration-200 group"
              >
                <div className="text-black-900 group-hover:scale-110 transition-transform duration-200">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-black-900 font-semibold text-xs lg:text-sm mb-0.5">
                    {service.title}
                  </h3>
                  <p className="text-black-100 text-[10px] lg:text-xs">
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