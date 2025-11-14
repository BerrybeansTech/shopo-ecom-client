import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/Layout";
import ProductView from "./ProductView";
import { productApi } from "../AllProductPage/productApi";

export default function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch single product
        const response = await productApi.getById(id);
        console.log("Product API Response:", response);
        
        // Handle different response structures
        let productData;
        if (response.success && response.data) {
          productData = response.data;
        } else if (response.data) {
          productData = response.data;
        } else {
          productData = response;
        }
        
        console.log("Product Data:", productData);
        
        if (!productData || !productData.id) {
          throw new Error("Invalid product data received");
        }
        
        setProduct(productData);

        // Fetch related products based on category
        if (productData.categoryId) {
          try {
            const relatedResponse = await productApi.filter({
              categoryId: productData.categoryId,
              limit: 8
            });
            const relatedData = relatedResponse.data || relatedResponse;
            // Filter out current product
            const filtered = Array.isArray(relatedData) 
              ? relatedData.filter(p => p.id !== productData.id)
              : [];
            setRelatedProducts(filtered);
          } catch (relatedErr) {
            console.error("Error fetching related products:", relatedErr);
            // Don't fail the whole page if related products fail
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout childrenClasses="pt-0 pb-0">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <a
              href="/products"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              Browse Products
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="single-product-wrapper w-full">
        <div className="product-view-main-wrapper bg-white pt-[30px] w-full">
          <div className="breadcrumb-wrapper w-full">
            <div className="container-x mx-auto">
              <BreadcrumbCom
                paths={[
                  { name: "home", path: "/" },
                  { name: product.category?.name || "category", path: "/products" },
                  { name: product.name, path: `/single-product/${id}` },
                ]}
              />
            </div>
          </div>
          <div className="w-full bg-white pb-[60px]">
            <div className="container-x mx-auto">
              <ProductView product={product} />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-product w-full bg-white">
            <div className="container-x mx-auto">
              <div className="w-full pb-16">
                <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-[30px]">
                  Related Products
                </h1>
                <div
                  data-aos="fade-up"
                  className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5"
                >
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <div key={relatedProduct.id} className="item">
                      <ProductCardStyleOne datas={relatedProduct} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}