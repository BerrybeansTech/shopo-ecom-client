import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import BreadcrumbCom from "../BreadcrumbCom";
import Layout from "../Partials/Layout";
import ProductView from "./ProductView";
import { productApi } from "../AllProductPage/productApi";
import { Heart } from "lucide-react";

export default function SingleProductPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const writeReview = searchParams.get('writeReview') === 'true';
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const PLACEHOLDER_IMAGE = "/images/placeholder-product.jpg"; 

  const handleImageError = (e) => {
  if (!e.target.dataset.errorHandled) {
    e.target.src = PLACEHOLDER_IMAGE;
    e.target.dataset.errorHandled = "true";  // prevents infinite requests
  }
};

  

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await productApi.getById(id);
        console.log("Product API Response:", response);

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
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      setRelatedLoading(true);
      try {
        if (product.categoryId || product.category?.id) {
          const categoryId = product.categoryId || product.category?.id;
          const relatedResponse = await productApi.getRelatedProducts(
            product.id,
            categoryId,
            8
          );

          const relatedData = relatedResponse.data || relatedResponse || [];
          const validRelatedProducts = Array.isArray(relatedData)
            ? relatedData.filter((p) => p && p.id)
            : [];

          setRelatedProducts(validRelatedProducts);
          console.log("Related products:", validRelatedProducts);
        } else {
          console.warn("No category ID found for related products");
          setRelatedProducts([]);
        }
      } catch (relatedErr) {
        console.error("Error fetching related products:", relatedErr);
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);




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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Product
            </h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
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
                  {
                    name: product.category?.name || "category",
                    path: "/products",
                  },
                  { name: product.name, path: `/single-product/${id}` },
                ]}
              />
            </div>
          </div>
          <div className="w-full bg-white pb-[60px]">
            <div className="container-x mx-auto">
              <ProductView product={product} writeReview={writeReview} />
            </div>
          </div>
        </div>

        {/* Related Products Section - Professional E-commerce Design */}
        {relatedProducts.length > 0 && (
          <div className="related-product w-full bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
            <div className="container-x mx-auto">
              <div className="w-full">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      You May Also Like
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Similar products from the same category
                    </p>
                  </div>
                </div>

                {relatedLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-600 font-medium">
                        Loading related products...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {relatedProducts.map((relatedProduct) => (
                      <Link
                        key={relatedProduct.id}
                        to={`/single-product/${relatedProduct.id}`}
                        className="group"
                      >
                        <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                          {/* Image Section */}
                          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                            <img
                              src={relatedProduct.thumbnailImage ? (relatedProduct.thumbnailImage.startsWith('http') ? relatedProduct.thumbnailImage : `http://luxcycs.com/rabbit-and-finch-uploads/${relatedProduct.thumbnailImage.startsWith('/') ? relatedProduct.thumbnailImage.substring(1) : relatedProduct.thumbnailImage}`) : (relatedProduct.image ? (relatedProduct.image.startsWith('http') ? relatedProduct.image : `http://luxcycs.com/rabbit-and-finch-uploads/${relatedProduct.image.startsWith('/') ? relatedProduct.image.substring(1) : relatedProduct.image}`) : PLACEHOLDER_IMAGE)}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={handleImageError}
                            />

                            {/* Discount Badge */}
                            {relatedProduct.discount > 0 && (
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                                {relatedProduct.discount}% OFF
                              </div>
                            )}

                            {/* Product Type Badge */}
                            {relatedProduct.product_type && relatedProduct.discount === 0 && (
                              <div className="absolute top-3 left-3">
                                <span
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase text-white shadow-lg ${
                                    relatedProduct.product_type === "popular"
                                      ? "bg-gradient-to-r from-orange-500 to-orange-600"
                                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                                  }`}
                                >
                                  {relatedProduct.product_type}
                                </span>
                              </div>
                            )}

                            {/* Wishlist Button */}
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add wishlist logic here
                              }}
                              className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Heart className="w-4 h-4 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                            </button>

                            {/* Quick View Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                              <div className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                View Details →
                              </div>
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="p-4 flex flex-col flex-grow">
                            {/* Category */}
                            <p className="text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                              {String(
                                relatedProduct.subCategory?.name ||
                                  relatedProduct.category?.name ||
                                  "Category"
                              )}
                            </p>

                            {/* Product Title */}
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-tight min-h-[2.5rem]">
                              {relatedProduct.name || relatedProduct.title}
                            </h3>

                            {/* Rating Section */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                      star <= Math.floor(relatedProduct.averageRating || 0)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300 fill-current"
                                    }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 font-medium">
                                ({relatedProduct.reviewCount || 0})
                              </span>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-baseline gap-2 mb-2 mt-auto">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{relatedProduct.sellingPrice || relatedProduct.offer_price || relatedProduct.price}
                              </span>
                              {relatedProduct.discount > 0 && relatedProduct.mrp && (
                                <>
                                  <span className="text-sm text-gray-400 line-through">
                                    ₹{relatedProduct.mrp}
                                  </span>
                                  <span className="text-xs text-green-600 font-bold">
                                    Save ₹{relatedProduct.mrp - relatedProduct.sellingPrice}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Stock Info */}
                            {relatedProduct.stock > 0 && relatedProduct.stock < 10 && (
                              <p className="text-xs text-orange-600 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></span>
                                Only {relatedProduct.stock} left
                              </p>
                            )}

                            {relatedProduct.stock === 0 && (
                              <p className="text-xs text-red-600 font-semibold">
                                Out of Stock
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
