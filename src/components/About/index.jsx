import { useRef } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function About() {
  const settings = {
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    dots: false,
    responsive: [
      {
        breakpoint: 1026,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },

      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  };
  const slider = useRef(null);
  const prev = () => {
    slider.current.slickPrev();
  };
  const next = () => {
    slider.current.slickNext();
  };
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="about-page-wrapper w-full">
        <div className="title-area w-full">
          <PageTitle
            title="About Us"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "About us", path: "/about" },
            ]}
          />
        </div>

        {/* About Content Section */}
        <div className="aboutus-wrapper w-full pt-20 pb-16 bg-white">
          <div className="container-x mx-auto">
            <div className="w-full lg:flex lg:space-x-12 items-center">
              <div 
                className="md:w-[570px] w-full md:h-[560px] h-auto overflow-hidden my-5 lg:my-0 shadow-lg"
                data-aos="fade-right"
              >
                <img
                  src="/assets/images/about-banner.png"
                  alt="Our professional team working in a modern office environment"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div 
                className="content flex-1"
                data-aos="fade-left"
              >
                <div className="inline-flex items-center px-4 py-2 bg-qyellow rounded-full text-sm font-semibold mb-6 shadow-lg">
                  About Our Company
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-qblack mb-6 leading-tight">
                  We Build Products That 
                  <span className="text-qyellow"> Make Difference</span>
                </h1>
                <p className="text-lg text-qgraytwo leading-8 mb-6">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type 
                  specimen book.
                </p>
                <ul className="text-qgraytwo leading-8 space-y-3 mb-8">
                  {[
                    "Innovative e-commerce solutions",
                    "Latest technology stack implementation",
                    "High-performance cloud infrastructure",
                    "24/7 customer support system"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact">
                    <button className="bg-qyellow hover:bg-qblack text-qblack hover:text-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Contact Us
                    </button>
                  </Link>
                  <Link to="/all-products">
                    <button className="border-2 border-qblack hover:border-qyellow text-qblack hover:text-qyellow px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                      Explore Products
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
