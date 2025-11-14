import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BreadcrumbCom from "../BreadcrumbCom";
import Layout from "../Partials/Layout";
import ProductView from "./ProductView";
import { useCart } from "../CartPage/useCart";
import { productApi } from "../AllProductPage/productApi";
import { Heart, ShoppingCart, Eye } from "lucide-react";

export default function SingleProductPage() {
  const { id } = useParams();
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


  const handleAddToCart = async (product) => {
    try {
      const cartData = {
        cartId: 1,
        productId: product.id,
        productColorVariationId: 1,
        productSizeVariationId: 1,
        quantity: 1,
      };

      const result = await addItemToCart(cartData);

      if (result.success) {
        console.log("Product added to cart successfully");
        alert("Add to cart")
      } else {
        console.error("Failed to add product to cart:", result.error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

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
              <ProductView product={product} />
            </div>
          </div>
        </div>

        {/* Related Products Section - Using your main product card UI */}
        {relatedProducts.length > 0 && (
          <div className="related-product w-full bg-white py-8">
            <div className="container-x mx-auto">
              <div className="w-full">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
                  Related Products
                </h1>

                {relatedLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-600 font-medium">
                        Loading related products...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
                    {relatedProducts.map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
                      >
                        {/* Image Section */}
                        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          <img
                            src={relatedProduct.image || PLACEHOLDER_IMAGE}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={handleImageError}
                          />

                          <button className="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                          </button>

                          {relatedProduct.discount > 0 && (
                            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-xs font-bold shadow-lg">
                              {relatedProduct.discount}% OFF
                            </div>
                          )}

                          {relatedProduct.product_type &&
                            relatedProduct.discount === 0 && (
                              <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                <span
                                  className={`text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded uppercase text-white shadow-lg ${
                                    relatedProduct.product_type === "popular"
                                      ? "bg-orange-500"
                                      : "bg-red-600"
                                  }`}
                                >
                                  {relatedProduct.product_type}
                                </span>
                              </div>
                            )}

                          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={() =>handleAddToCart(product)}
                                className="flex-1 bg-white hover:bg-gray-900 text-gray-800 hover:text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                  Add to Cart
                                </span>
                                <span className="sm:hidden">Add</span>
                              </button>
                              <Link to={`/single-product/${product.id}`}>
                                <button className="bg-white hover:bg-blue-600 text-gray-800 hover:text-white p-2 sm:p-2.5 rounded-lg shadow-lg transition-all duration-300">
                                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              </Link>
                          </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-3 sm:p-4 flex flex-col flex-grow">
                          {/* Category */}
                          <p className="text-xs text-gray-500 font-medium mb-1 sm:mb-1.5 uppercase">
                            {String(
                              relatedProduct.subCategory?.name ||
                                relatedProduct.category?.name ||
                                "Category"
                            )}
                          </p>

                          {/* Product Title */}
                          <Link to={`/single-product/${relatedProduct.id}`}>
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                              {relatedProduct.name || relatedProduct.title}
                            </h3>
                          </Link>

                          {/* Rating Section */}
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                    star <=
                                    Math.floor(relatedProduct.review || 0)
                                      ? "text-yellow-400 fill-current"
                                      : (relatedProduct.review || 0) % 1 >=
                                          0.5 &&
                                        star ===
                                          Math.ceil(relatedProduct.review || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300 fill-current"
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>

                            <span className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-semibold transition-colors">
                              {(relatedProduct.review || 0).toFixed(1)}
                            </span>

                            <span className="text-xs text-gray-600 font-medium">
                              (
                              {relatedProduct.reviewCount
                                ? relatedProduct.reviewCount.toLocaleString()
                                : "0"}
                              )
                            </span>
                          </div>

                          {/* Price Section */}
                          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              {relatedProduct.offer_price ||
                                relatedProduct.sellingPrice ||
                                relatedProduct.price}
                            </span>
                            {relatedProduct.discount > 0 &&
                              relatedProduct.price && (
                                <>
                                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                                    {relatedProduct.price}
                                  </span>
                                  <span className="text-xs text-green-600 font-bold">
                                    {relatedProduct.discount}% off
                                  </span>
                                </>
                              )}
                          </div>

                          {/* Stock Info */}
                          {relatedProduct.stock > 0 &&
                            relatedProduct.stock < 30 && (
                              <p className="text-xs text-orange-600 font-semibold mt-auto">
                                Only {relatedProduct.stock} left in stock
                              </p>
                            )}

                          {relatedProduct.stock === 0 && (
                            <p className="text-xs text-red-600 font-semibold mt-auto">
                              Out of Stock
                            </p>
                          )}
                        </div>
                      </div>
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
