import { useEffect, useState } from "react";
import datas from "../../data/products.json";
import Layout from "../Partials/Layout";
import Ads from "./Ads";
import Banner from "./Banner";
import CategorySection from "./CategorySection";
import ProductsAds from "./ProductsAds";
import TopProducts from "./TopProducts";
import NewArrivals from "./NewArrivals";
import Accessories from "./Accessories";
import ProductsAd from "./ProductsAd";

export default function Home() {
  const { products } = datas;
  const brands = [];
  products.forEach((product) => {
    brands.push(product.brand);
  });
  const [ads, setAds] = useState(false);
  const adsHandle = () => {
    setAds(false);
  };
  useEffect(() => {
    setAds(false);
  }, []);
  return (
    <>
      <Layout>
        {ads && <Ads handler={adsHandle} />}
        <Banner className="banner-wrapper" />
        <CategorySection
          sectionTitle="Shop by Category"
          className="brand-section-wrapper"
        />
        <TopProducts
          className="top-selling-product"
          seeMoreUrl="/all-products"
          categoryTitle="Top Selling Products"
        />
        {/* <ProductsAds
          ads={[
            "assets/images/banner1.jpg",
          ]}
          className="products-ads-section"
        /> */}
        <NewArrivals />
        {/* <ProductsAd
          ads={[
            "assets/images/banner1.jpg",
          ]}
          className="products-ads-section"
        /> */}
        <Accessories
          className="accessories"
          seeMoreUrl="/all-products"
          categoryTitle="Accessories"
        />
      </Layout>
    </>
  );
}
