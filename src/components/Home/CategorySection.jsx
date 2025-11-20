import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // or Next.js Link

// ⭐ Updated categories with perfect 693x832 Unsplash images
const categories = [
  { 
    name: "Topwear",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=693&h=832&q=80",
    link: "/category/topwear"
  },
  { 
    name: "Bottomwear",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=693&h=832&q=80",
    link: "/category/bottomwear"
  },
  { 
    name: "Underwear, Loungewear & Nightwear",
    image: "https://images.unsplash.com/photo-1551024739-78e9d60c45ca?auto=format&fit=crop&w=693&h=832&q=80",
    link: "/category/underwear-loungewear-and-nightwear"
  },
  { 
    name: "Activewear / Sportswear",
    image: "https://images.pexels.com/photos/4662343/pexels-photo-4662343.jpeg?auto=compress&cs=tinysrgb&w=693&h=832&fit=crop",
    link: "/category/activewear-sportswear"
  },
  { 
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=693&h=832&q=80",
    link: "/category/accessories"
  },
  { 
    name: "Seasonal / Special Collections",
    image: "https://images.pexels.com/photos/7940620/pexels-photo-7940620.jpeg?auto=compress&cs=tinysrgb&w=693&h=832&fit=crop",
    link: "/category/seasonal-special-collections"
  },
];

export default function CategorySection({ className, sectionTitle = "Shop by Category" }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className={`py-10 lg:py-16  ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-4xl md:text-3xl font-bold text-center text-gray-900 mb-11 tracking-tight">
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <Link
              to={category.link}
              key={index}
              className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >

              <div className="aspect-w-4 aspect-h-5 relative overflow-hidden bg-gray-200">
                {/* ⭐ Updated image path to load real URL */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
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
      </div>
    </section>
  );
}
