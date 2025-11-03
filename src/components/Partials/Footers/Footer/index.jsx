import { Link } from "react-router-dom";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";
import Youtube from "../../../Helpers/icons/Youtube";

export default function Footer({ type }) {
  return (
    <footer className="footer-section-wrapper bg-black text-white print:hidden">
      <div className="container-x block mx-auto pt-10 pb-5">
        {/* Main Footer Content */}
        <div className="lg:flex lg:gap-12 justify-between mb-10">
          {/* 1. Get To Know Us */}
          <div className="lg:w-1/4 w-full mb-10 lg:mb-0">
            <div className="mb-6">
              <h6 className="text-xl font-semibold text-white tracking-wide mb-2">
                Get To Know Us
              </h6>
              <div className="w-12 h-0.5 bg-gray-700"></div>
            </div>
            <ul className="flex flex-col space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Press", path: "/press" },
                { name: "Contact Us", path: "/contact" },
                { name: "Referral", path: "/referral" },
                { name: "Loyalty Program", path: "/loyalty" },
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="group flex items-center">
                    <span className="text-gray-300 text-[15px] hover:text-white border-b border-transparent hover:border-white transition-all duration-300 cursor-pointer capitalize">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Work Inquiries - Extra Space */}
          <div className="lg:w-1/4 w-full mb-10 lg:mb-0 lg:pr-8">
            <div className="mb-6">
              <h6 className="text-xl font-semibold text-white tracking-wide mb-2">
                Let Us Help You
              </h6>
              <div className="w-12 h-0.5 bg-gray-700"></div>
            </div>
            <div className="text-gray-300 text-[15px] leading-[28px] space-y-4">
              <p className="text-[15px]">
                Interested in working with us?
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:atcarabia21@gmail.com"
                  className="block text-[15px] text-gray-300 hover:text-white transition-colors"
                >
                  atcarabia21@gmail.com
                </a>
                <a
                  href="mailto:sales@atc-arabia.com"
                  className="block text-[15px] text-gray-300 hover:text-white transition-colors"
                >
                  sales@atc-arabia.com
                </a>
              </div>
              <p className="text-[15px] mt-6">
                Have questions? We're here to help!
              </p>
              <a
                href="mailto:contact@atc-arabia.com"
                className="block text-[15px] text-gray-300 hover:text-white transition-colors font-medium"
              >
                contact@atc-arabia.com
              </a>
            </div>
          </div>

          {/* 3. Let Us Help You */}
          <div className="lg:w-1/4 w-full mb-10 lg:mb-0">
            <div className="mb-6">
              <h6 className="text-xl font-semibold text-white tracking-wide mb-2">
                Special Collections
              </h6>
              <div className="w-12 h-0.5 bg-gray-700"></div>
            </div>
            <ul className="flex flex-col space-y-3">
              {[
                { name: "Winter Wear", path: "/winter-wear" },
                { name: "Summer Essentials", path: "/summer-essentials" },
                { name: "Festive / Designer Drop", path: "/festive-designer" },
                { name: "Co-ords / Matching Sets", path: "/co-ords" },
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="group flex items-center">
                    <span className="text-gray-300 text-[15px] hover:text-white border-b border-transparent hover:border-white transition-all duration-300 cursor-pointer capitalize">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Accessories + Follow Us */}
          <div className="lg:w-1/4 w-full mb-10 lg:mb-0">
            <div className="mb-6">
              <h6 className="text-xl font-semibold text-white tracking-wide mb-2">
                Accessories
              </h6>
              <div className="w-12 h-0.5 bg-gray-700"></div>
            </div>
            <ul className="flex flex-col space-y-3 mb-6">
              {[
                { name: "Sunglasses", path: "/sunglasses" },
                { name: "Scarves / Mufflers", path: "/scarves-mufflers" },
                { name: "Socks", path: "/socks" },
                { name: "Towels", path: "/towels" },
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="group flex items-center">
                    <span className="text-gray-300 text-[15px] hover:text-white border-b border-transparent hover:border-white transition-all duration-300 cursor-pointer capitalize">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Follow Us */}
            <div>
              <p className="text-[15px] text-gray-300 font-medium mb-3">Follow Us</p>
              <div className="flex space-x-6 items-center">
                <a href="#" className="group" aria-label="Instagram">
                  <Instagram className="fill-current text-gray-400 hover:text-pink-500 transition-colors duration-300 transform group-hover:scale-110 w-5 h-5" />
                </a>
                <a href="#" className="group" aria-label="Facebook">
                  <Facebook className="fill-current text-gray-400 hover:text-blue-500 transition-colors duration-300 transform group-hover:scale-110 w-5 h-5" />
                </a>
                <a href="#" className="group" aria-label="YouTube">
                  <Youtube className="fill-current text-gray-400 hover:text-red-500 transition-colors duration-300 transform group-hover:scale-110 w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="border-t border-gray-700 pt-5 mb-5">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { name: "FAQ", path: "/faqs" },
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Terms & Conditions", path: "/terms-condition" },
              { name: "Shipping Policy", path: "/shipping-policy" },
              { name: "Cancellation & Return", path: "/return-policy" },
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Copyright Left */}
        <div className="border-t border-gray-700 pt-5">
          <div className="lg:flex justify-between items-center text-sm text-gray-400">
            <span className="block lg:inline">
              ©2025
              <a
                href="#"
                rel="noreferrer"
                className="font-semibold text-white mx-1 hover:underline"
              >
                Rabbit & Finch
              </a>
              All rights reserved
            </span>
            <div></div>
          </div>
        </div>
      </div>
    </footer>
  );
}