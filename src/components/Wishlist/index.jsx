import { useState, useEffect } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyWishlistError from "../EmptyWishlistError";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import ProductsTable from "./ProductsTable";
import { getWishlist, clearWishlist } from "../../services/wishlistApi";

export default function Wishlist({ wishlist = true }) {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist();
      // wishlistData should be an array of product IDs
      setWishlistData(response.wishList || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistUpdate = (updatedWishlist) => {
    setWishlistData(updatedWishlist);
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
        setWishlistData([]);
        alert('Wishlist cleared successfully!');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        alert('Failed to clear wishlist. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Layout childrenClasses={wishlist ? "pt-0 pb-0" : ""}>
        <div className="wishlist-page-wrapper w-full">
          <div className="container-x mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout childrenClasses={wishlist ? "pt-0 pb-0" : ""}>
        <div className="wishlist-page-wrapper w-full">
          <div className="container-x mx-auto">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchWishlist}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout childrenClasses={wishlist ? "pt-0 pb-0" : ""}>
      {wishlistData.length === 0 ? (
        <div className="wishlist-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom
              paths={[
                { name: "home", path: "/" },
                { name: "wishlist", path: "/wishlist" },
              ]}
            />
            <EmptyWishlistError />
          </div>
        </div>
      ) : (
        <div className="wishlist-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="Wishlist"
              breadcrumb={[
                { name: "home", path: "/" },
                { name: "wishlist", path: "/wishlist" },
              ]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable
                className="mb-[30px]"
                wishlistData={wishlistData}
                onWishlistUpdate={handleWishlistUpdate}
              />
              <div className="w-full mt-[30px] flex sm:justify-end justify-start">
                <div className="sm:flex sm:space-x-[30px] items-center">
                  <button
                    type="button"
                    onClick={handleClearWishlist}
                    className="cursor-pointer"
                  >
                    <div className="w-full text-sm font-semibold text-qred mb-5 sm:mb-0">
                      Clean Wishlist
                    </div>
                  </button>
                  <div className="w-[180px] h-[50px]">
                    <button type="button" className="yellow-btn">
                      <div className="w-full text-sm font-semibold">
                        Add to Cart All
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
