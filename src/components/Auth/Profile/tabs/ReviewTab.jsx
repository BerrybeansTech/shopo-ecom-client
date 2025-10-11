import React from "react";
import DataIteration from "../../../Helpers/DataIteration";
import Star from "../../../Helpers/icons/Star";
import { Link } from "react-router-dom";

export default function ReviewTab({ className, products }) {
  return (
    <>
      <div className="review-tab-wrapper w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <DataIteration datas={products} startLength={0} endLength={6}>
            {({ datas }) => (
              <div key={datas.id} className="item">
                <div
                  style={{ boxShadow: "0px 15px 64px rgba(0, 0, 0, 0.05)" }}
                  className={`product-row-card-style-one w-full bg-white group relative overflow-hidden ${
                    className || ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-x-0 items-center w-full h-full p-4 sm:p-2">
                    {/* Product Image - Full width on mobile, 1/3 on sm+ */}
                    <div className="w-full sm:w-1/3 h-[120px] sm:h-full mb-3 sm:mb-0">
                      <img
                        src={`${
                          import.meta.env.VITE_PUBLIC_URL
                        }/assets/images/${datas.image}`}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Product Details - Stacked on mobile, flex on sm+ */}
                    <div className="flex-1 flex flex-col justify-center h-full w-full text-center sm:text-left">
                      <div>
                        <span className="text-qgray text-xs sm:text-sm mb-2 sm:mb-1.5 block">
                          July 22, 2022
                        </span>
                        
                        {/* Reviews - Centered on mobile, left on sm+ */}
                        <div className="flex justify-center sm:justify-start mb-2 sm:mb-1.5">
                          {Array.from(Array(datas.review), () => (
                            <span key={datas.review + Math.random()}>
                              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                            </span>
                          ))}
                        </div>
                        
                        <Link to="/single-product">
                          <p className="title mb-3 sm:mb-2 text-sm sm:text-[15px] font-600 text-qblack leading-[20px] sm:leading-[24px] line-clamp-2 hover:text-blue-600">
                            {datas.title}
                          </p>
                        </Link>
                        
                        <p className="price text-xs sm:text-sm text-qgray line-clamp-2 sm:line-clamp-2 leading-[18px] sm:leading-[20px]">
                          Didn't I tell you not put your phone on charge because
                          weekend?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DataIteration>
        </div>
      </div>
    </>
  );
}