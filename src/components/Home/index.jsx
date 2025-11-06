import { useEffect, useState } from "react";
import datas from "../../data/products.json";
import SectionStyleFour from "../Helpers/SectionStyleFour";
import SectionStyleThree from "../Helpers/SectionStyleThree";
import ViewMoreTitle from "../Helpers/ViewMoreTitle";
import Layout from "../Partials/Layout";
import Ads from "./Ads";
import Banner from "./Banner";
import BestSellers from "./BestSellers";
import BrandSection from "./BrandSection";
import CampaignCountDown from "./CampaignCountDown";
import ProductsAds from "./ProductsAds";
import TopProducts from "./TopProducts";
import NewArrivals from "./NewArrivals";
import PopularSales from "./PopularSales";

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
        <Banner className="banner-wrapper mb-[60px]" />
        <BrandSection
          sectionTitle="Shop by Brand"
          className="brand-section-wrapper mb-[60px]"
        />
        <CampaignCountDown
          className="mb-[60px]"
          lastDate="2025-10-04 4:00:00"
        />
        <TopProducts
          className="top-selling-product mb-[60px]"
          seeMoreUrl="/all-products"
          categoryTitle="Top Selling Products"
        />
        <ViewMoreTitle
          className="best-sallers-section mb-[60px]"
          seeMoreUrl="/sallers"
          categoryTitle="Best Saller"
        >
          <BestSellers />
        </ViewMoreTitle>
        <ProductsAds
          ads={[
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=626&h=295&fit=crop",
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=626&h=295&fit=crop",
          ]}
          sectionHeight="sm:h-[295px] h-full"
          className="products-ads-section mb-[60px]"
        />
        <NewArrivals />
        <ProductsAds
          ads={[
            "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1252&h=295&fit=crop",
          ]}
          sectionHeight="sm:h-[295px] h-full"
          className="products-ads-section mb-[60px]"
        />
        <PopularSales
          products={products}
          sectionTitle="Popular Sales"
          seeMoreUrl="/all-products"
          className="category-products "
        />
      </Layout>
    </>
  );
}
