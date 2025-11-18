// components/Cart/MiniCart.js (Renamed for clarity, as this seems to be a mini-cart component)
import { Link } from "react-router-dom";
import { useCart } from "../CartPage/useCart"; // Adjusted path

export default function MiniCart({ className, type }) {
  const {
    items,
    formatINR,
    isAuthenticated,
    handleLoginRedirect
  } = useCart();

  const subtotal = items.reduce((total, item) => {
    const price = item.product?.sellingPrice || item.discountedPriceValue || 0;
    return total + (price * item.quantity);
  }, 0);

  if (!isAuthenticated) {
    return (
      <div className={`w-[300px] bg-white border-t-[3px] ${className || ""}`}>
        <div className="p-4 text-center">
          <p className="text-sm text-gray-600">Please login to view cart</p>
          <button 
            onClick={handleLoginRedirect}
            className="mt-2 text-blue-600 text-sm hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ boxShadow: " 0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }}
        className={`w-[300px] bg-white border-t-[3px] ${
          type === 3 ? "border-qh3-blue" : "cart-wrappwer"
        }  ${className || ""}`}
      >
        <div className="w-full h-full">
          <div className="product-items h-[310px] overflow-y-scroll">
            <ul>
              {items.slice(0, 6).map((item, index) => (
                <li key={item.id || index} className="w-full h-full flex">
                  <div className="flex space-x-[6px] justify-center items-center px-4 my-[20px]">
                    <div className="w-[65px] h-full">
                      <img
                        src={item.product?.thumbnailImage || `${import.meta.env.VITE_PUBLIC_URL}/assets/images/product-img-1.jpg`}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-center">
                      <p className="title mb-2 text-[13px] font-600 text-qblack leading-4 line-clamp-2 hover:text-blue-600">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="price">
                        <span className="offer-price text-qred font-600 text-[15px] ml-2">
                          {formatINR((item.product?.sellingPrice || item.discountedPriceValue || 0) * item.quantity)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="mt-[20px] mr-[15px] inline-flex cursor-pointer">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      className="inline fill-current text-[#AAAAAA] hover:text-qred"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.76 0.24C7.44 -0.08 6.96 -0.08 6.64 0.24L4 2.88L1.36 0.24C1.04 -0.08 0.56 -0.08 0.24 0.24C-0.08 0.56 -0.08 1.04 0.24 1.36L2.88 4L0.24 6.64C-0.08 6.96 -0.08 7.44 0.24 7.76C0.56 8.08 1.04 8.08 1.36 7.76L4 5.12L6.64 7.76C6.96 8.08 7.44 8.08 7.76 7.76C8.08 7.44 8.08 6.96 7.76 6.64L5.12 4L7.76 1.36C8.08 1.04 8.08 0.56 7.76 0.24Z" />
                    </svg>
                  </span>
                </li>
              ))}
              {items.length === 0 && (
                <li className="w-full text-center py-4 text-gray-500">
                  Your cart is empty
                </li>
              )}
            </ul>
          </div>
          <div className="w-full px-4 mt-[20px] mb-[12px]">
            <div className="h-[1px] bg-[#F0F1F3]"></div>
          </div>
          <div className="product-actions px-4 mb-[30px]">
            <div className="total-equation flex justify-between items-center mb-[28px]">
              <span className="text-[15px] font-500 text-qblack">Subtotal</span>
              <span className="text-[15px] font-500 text-qred">{formatINR(subtotal)}</span>
            </div>
            <div className="product-action-btn">
              <Link to="/cart">
                <div className="gray-btn w-full h-[50px] mb-[10px]">
                  <span>View Cart</span>
                </div>
              </Link>
              <Link to="/checkout">
                <div className="w-full h-[50px]">
                  <div className={type === 3 ? "blue-btn" : "yellow-btn"}>
                    <span className="text-sm">Checkout Now</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full px-4 mt-[20px]">
            <div className="h-[1px] bg-[#F0F1F3]"></div>
          </div>
          <div className="flex justify-center py-[15px]">
            <p className="text-[13px] font-500 text-qgray">
              Get Return within <span className="text-qblack">30 days</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}