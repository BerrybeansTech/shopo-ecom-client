import { useRef, useState } from "react";
import data from "../../data/products.json";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/Layout";
import ProductView from "./ProductView";

export default function SingleProductPage() {
  return (
    <>
      <Layout childrenClasses="pt-0 pb-0">
        <div className="single-product-wrapper w-full ">
          <div className="product-view-main-wrapper bg-white pt-[30px] w-full">
            <div className="breadcrumb-wrapper w-full ">
              <div className="container-x mx-auto">
                <BreadcrumbCom
                  paths={[
                    { name: "home", path: "/" },
                    { name: "single product", path: "/single-product" },
                  ]}
                />
              </div>
            </div>
            <div className="w-full bg-white pb-[60px]">
              <div className="container-x mx-auto">
                <ProductView />
              </div>
            </div>
          </div>

          <div className="related-product w-full bg-white">
            <div className="container-x mx-auto">
              <div className="w-full pb-16">
                <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-[30px]">
                  Related Product
                </h1>
                <div
                  data-aos="fade-up"
                  className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5"
                >
                  <DataIteration
                    datas={data.products}
                    startLength={5}
                    endLength={9}
                  >
                    {({ datas }) => (
                      <div key={datas.id} className="item">
                        <ProductCardStyleOne datas={datas} />
                      </div>
                    )}
                  </DataIteration>
                </div>
              </div>
            </div>
          </div>

          <div className="related-product w-full bg-white">
            <div className="container-x mx-auto">
              <div className="w-full pb-16">
                <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-[30px]">
                  Recently Viewed
                </h1>
                <div
                  data-aos="fade-up"
                  className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5"
                >
                  <DataIteration
                    datas={data.products}
                    startLength={5}
                    endLength={9}
                  >
                    {({ datas }) => (
                      <div key={datas.id} className="item">
                        <ProductCardStyleOne datas={datas} />
                      </div>
                    )}
                  </DataIteration>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Layout>
    </>
  );
}
