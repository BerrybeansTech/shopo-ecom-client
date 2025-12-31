import { useState, useEffect } from "react";
import InputQuantityCom from "../Helpers/InputQuantityCom";
import { updateWishlist } from "../../services/wishlistApi";
import { apiService } from "../../services/apiservice";
import { useCart } from "../CartPage/useCart";
import { getProductImage } from "../../utils/imageUtils";

export default function ProductsTable({ className, wishlistData, onWishlistUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const { addItemToCart } = useCart();

  useEffect(() => {
    if (wishlistData && wishlistData.length > 0) {
      fetchProductDetails();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [wishlistData]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch details for each product in wishlist
      const productPromises = wishlistData.map(async (productId) => {
        try {
          const response = await apiService.get(`/product/get-product/${productId}`);
          // Handle both response formats
          return response.data || response;
        } catch (err) {
          console.error(`Error fetching product ${productId}:`, err);
          return null;
        }
      });

      const productDetails = await Promise.all(productPromises);
      const validProducts = productDetails.filter(product => product !== null);

      setProducts(validProducts);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // Get product name
  const getProductName = (product) => {
    return product.name || 'Product Name';
  };

  // Get product price
  const getProductPrice = (product) => {
    return product.sellingPrice || product.price || 0;
  };

  // Get product color from inventories
  const getProductColor = (product) => {
    if (product.inventories && product.inventories.length > 0) {
      return product.inventories[0].productColor?.color || 'N/A';
    }
    return 'N/A';
  };

  // Get product size from inventories
  const getProductSize = (product) => {
    if (product.inventories && product.inventories.length > 0) {
      const sizes = product.inventories[0].productSize?.size || [];
      return sizes.length > 0 ? sizes[0] : 'N/A';
    }
    return 'N/A';
  };

  // Get quantity for a product
  const getQuantity = (productId) => {
    return quantities[productId] || 1;
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  // Calculate total price for a product
  const getTotalPrice = (product) => {
    const quantity = getQuantity(product.id);
    const price = getProductPrice(product);
    return quantity * price;
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await updateWishlist(productId);
      if (response.success) {
        // Update local state
        const updatedWishlist = wishlistData.filter(id => id !== productId);
        onWishlistUpdate(updatedWishlist);
      } else {
        alert('Failed to remove item from wishlist');
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    const quantity = getQuantity(product.id);
    const color = getProductColor(product);
    const size = getProductSize(product);

    // Check if product is in stock
    if (product.inventories && product.inventories.length > 0) {
      const inventory = product.inventories[0];
      if (inventory.availableQuantity < quantity) {
        alert('Insufficient stock for this quantity');
        return;
      }
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      const cartData = {
        productId: product.id,
        quantity: quantity,
        color: color !== 'N/A' ? color : undefined,
        size: size !== 'N/A' ? size : undefined,
      };

      const result = await addItemToCart(cartData);

      if (result.success) {
        alert('Product added to cart successfully!');
        // Optionally remove from wishlist after adding to cart
        // handleRemoveFromWishlist(product.id);
      } else {
        alert(result.error || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className={`w-full ${className || ""}`}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${className || ""}`}>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`w-full ${className || ""}`}>
        <div className="text-center py-12">
          <p className="text-gray-500">No products in wishlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {/* table heading */}
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap  w-[380px]">
                product
              </td>
              <td className="py-4 whitespace-nowrap text-center">color</td>
              <td className="py-4 whitespace-nowrap text-center">size</td>
              <td className="py-4 whitespace-nowrap text-center">price</td>
              <td className="py-4 whitespace-nowrap  text-center">quantity</td>
              <td className="py-4 whitespace-nowrap  text-center">total</td>
              <td className="py-4 whitespace-nowrap text-right w-[114px] block"></td>
            </tr>
            {/* table heading end */}
            {products.map((product) => {
              const productImage = getProductImage(product);
              const productName = getProductName(product);
              const productPrice = getProductPrice(product);
              const productColor = getProductColor(product);
              const productSize = getProductSize(product);
              const quantity = getQuantity(product.id);
              const totalPrice = getTotalPrice(product);
              const isAddingToCart = addingToCart[product.id];

              return (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="pl-10  py-4 ">
                    <div className="flex space-x-6 items-center">
                      <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                        <img
                          src={getProductImage(product)}
                          alt={productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <p className="font-medium text-[15px] text-qblack">
                          {productName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">
                    <div className=" flex justify-center items-center">
                      <span className="w-[20px] h-[20px] bg-[#E4BC87] block rounded-full"></span>
                      <span className="ml-2 text-[12px] text-gray-600">{productColor}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">
                    <div className="flex space-x-1 items-center justify-center">
                      <span className="text-[15px] font-normal">{productSize}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">
                    <div className="flex space-x-1 items-center justify-center">
                      <span className="text-[15px] font-normal">${productPrice}</span>
                    </div>
                  </td>
                  <td className=" py-4">
                    <div className="flex justify-center items-center">
                      <InputQuantityCom
                        value={quantity}
                        onChange={(newQty) => handleQuantityChange(product.id, newQty)}
                      />
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <span className="text-[15px] font-normal">${totalPrice.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isAddingToCart}
                        className="mr-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.7 0.3C9.3 -0.1 8.7 -0.1 8.3 0.3L5 3.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L3.6 5L0.3 8.3C-0.1 8.7 -0.1 9.3 0.3 9.7C0.7 10.1 1.3 10.1 1.7 9.7L5 6.4L8.3 9.7C8.7 10.1 9.3 10.1 9.7 9.7C10.1 9.3 10.1 8.7 9.7 8.3L6.4 5L9.7 1.7C10.1 1.3 10.1 0.7 9.7 0.3Z"
                            fill="#AAAAAA"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}