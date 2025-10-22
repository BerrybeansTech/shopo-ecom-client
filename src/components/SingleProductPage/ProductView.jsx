import { useState, useRef, useEffect } from "react";

export default function ProductView({ className, reportHandler }) {
  // Updated productsImg to include videos in the images array with type field
  const productsImg = [
    {
      id: 1,
      src: "shirt1.webp",
      color: "#FFBC63",
      colorName: "Yellow",
      images: [
        { src: "shirt1.webp", type: "image" },
        { src: "shirt12.webp", type: "image" },
        { src: "shirt13.webp", type: "image" },
        { src: "ani.mp4", type: "video" },
      ],
    },
    {
      id: 2,
      src: "shirt2.webp",
      color: "#649EFF",
      colorName: "Blue",
      images: [
        { src: "shirt2.webp", type: "image" },
        { src: "shirt22.webp", type: "image" },
        { src: "shirt23.webp", type: "image" },
        { src: "shirt24.webp", type: "image" },
        { src: "ani.mp4", type: "video" },
      ],
    },
    {
      id: 3,
      src: "shirt3.webp",
      color: "#FFFFFF",
      colorName: "White",
      images: [
        { src: "shirt3.webp", type: "image" },
        { src: "shirt32.webp", type: "image" },
        { src: "shirt33.webp", type: "image" },
        { src: "ani.mp4", type: "video" },
      ],
    },
    {
      id: 4,
      src: "shirt4.webp",
      color: "#FF7173",
      colorName: "Red",
      images: [
        { src: "shirt4.webp", type: "image" },
        { src: "shirt42.webp", type: "image" },
        { src: "shirt43.webp", type: "image" },
        { src: "shirt44.webp", type: "image" },
        { src: "ani.mp4", type: "video" },
      ],
    },
    {
      id: 5,
      src: "shirt5.webp",
      color: "#ffffff",
      colorName: "White",
      images: [
        { src: "shirt5.webp", type: "image" },
        { src: "shirt51.webp", type: "image" },
        { src: "shirt52.webp", type: "image" },
        { src: "ani.mp4", type: "video" },
      ],
    },
  ];

  // Define size options
  const sizeOptions = [
    { label: "S", chest: '36-38"', value: "S" },
    { label: "M", chest: '38-40"', value: "M" },
    { label: "L", chest: '40-42"', value: "L" },
    { label: "XL", chest: '42-44"', value: "XL" },
    { label: "XXL", chest: '44-46"', value: "XXL" },
    { label: "3XL", chest: '46-48"', value: "3XL" },
    { label: "4XL", chest: '48-50"', value: "4XL" },
  ];

  // Mapping of product IDs to available sizes
  const sizeAvailability = {
    1: ["S", "M"],
    2: ["M", "L"],
    3: ["L", "XL", "XXL"],
    4: ["S", "M", "L", "XL"],
    5: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
  };

  // Define reviews data
  const reviews = [
    {
      id: 1,
      name: "Sahil Gupta",
      avatarColor: "bg-qh2-green",
      initials: "SG",
      rating: "★★★★☆",
      date: "Aug, 2022",
      location: "Sonipat",
      text: "The shirt is really made up of very good quality. The colour is also very good as it looks good. The fitting is also good. Overall a nice shirt that looks premium.",
    },
    {
      id: 2,
      name: "Amit Kumar",
      avatarColor: "bg-blue-500",
      initials: "AK",
      rating: "★★★★★",
      date: "Sep, 2022",
      location: "Delhi",
      text: "Excellent fabric quality and perfect fitting. The color matches exactly as shown in the pictures. Great value for money! Will definitely purchase again.",
    },
    {
      id: 3,
      name: "Rahul Sharma",
      avatarColor: "bg-purple-500",
      initials: "RS",
      rating: "★★★☆☆",
      date: "Jul, 2022",
      location: "Mumbai",
      text: "Good shirt for the price but the sizing runs a bit small. Had to exchange for a larger size. Fabric quality is decent but could be better.",
    },
  ];

  // State to track the main content, selected color, thumbnails, reviews, and other UI states
  const [mainContent, setMainContent] = useState({ src: productsImg[0].src, type: "image" });
  const [selectedColorId, setSelectedColorId] = useState(productsImg[0].id);
  const [thumbnails, setThumbnails] = useState(productsImg[0].images);
  const [quantity, setQuantity] = useState(1);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [availableSizes, setAvailableSizes] = useState(sizeAvailability[1]);
  const [visibleReviews, setVisibleReviews] = useState(2); // Initially show 2 reviews

  // Ref for thumbnail container scrolling
  const thumbnailRef = useRef(null);

  // Update available sizes and selected size when color changes
  useEffect(() => {
    const sizes = sizeAvailability[selectedColorId] || sizeOptions.map((s) => s.value);
    setAvailableSizes(sizes);

    // If the current selectedSize is not available in the new sizes, reset to the first available size
    if (!sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0] || "");
    }
  }, [selectedColorId]);

  // Reset visible reviews when showReviews toggles
  useEffect(() => {
    if (!showReviews) {
      setVisibleReviews(2); // Reset to 2 reviews when reviews section is hidden
    }
  }, [showReviews]);

  // Handlers
  const changeColorHandler = (colorId) => {
    const selectedProduct = productsImg.find((img) => img.id === colorId);
    if (selectedProduct) {
      setMainContent({ src: selectedProduct.src, type: "image" });
      setThumbnails(selectedProduct.images);
      setSelectedColorId(colorId);
      setShowZoom(false);
      setZoomStyle({});
    }
  };

  const changeContentHandler = (content) => {
    setMainContent(content);
    setShowZoom(false);
    setZoomStyle({});
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => (quantity > 1 ? setQuantity((prev) => prev - 1) : null);

  const handleSizeSelect = (size) => {
    if (availableSizes.includes(size.value)) {
      setSelectedSize(size.value);
    }
  };

  const toggleSizeChart = () => setShowSizeChart(!showSizeChart);

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setPincode(value);

    const currentDate = new Date("2025-10-14T11:22:00Z");
    if (value === "604407") {
      currentDate.setDate(currentDate.getDate() + 3);
      setDeliveryDate(
        currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      );
      setStockStatus("Available");
    } else if (value === "604404") {
      setDeliveryDate("Out of Stock");
      setStockStatus("Currently out of stock");
    } else {
      setDeliveryDate("Check delivery date");
      setStockStatus("Availability to be confirmed");
    }
  };

  const handleLoadMoreReviews = () => {
    setVisibleReviews((prev) => Math.min(prev + 1, reviews.length));
  };

  const isOutOfStock = stockStatus === "Currently out of stock" || deliveryDate === "Out of Stock";

  const handleMouseMove = (e) => {
    if (mainContent.type === "image") {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: "scale(2)",
      });
      setShowZoom(true);
    }
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setZoomStyle({});
  };

  // Scroll handlers for thumbnails
  const scrollUp = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ top: -120, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className={`product-view w-full lg:flex flex-col lg:flex-row justify-between ${
          className || ""
        }`}
      >
        <div
          data-aos="fade-right"
          className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px] flex flex-row"
        >
          <div className="w-[120px] flex flex-col gap-2 mr-4">
            {/* Scrollable Thumbnail Container */}
            <div
              ref={thumbnailRef}
              className="w-[120px] h-[480px] overflow-y-hidden"
              style={{ scrollBehavior: "smooth" }}
            >
              {thumbnails.map((item, index) => (
                <div
                  key={index}
                  onClick={() => changeContentHandler(item)}
                  onMouseEnter={() => changeContentHandler(item)}
                  className="w-[120px] h-[120px] p-[10px] cursor-pointer relative mx-auto"
                >
                  {item.type === "image" ? (
                    <img
                      src={`/assets/images/${item.src}`}
                      alt={`Men's shirt view ${index + 1}`}
                      className={`w-full h-full object-contain ${
                        mainContent.src !== item.src ? "opacity-50" : ""
                      }`}
                    />
                  ) : (
                    <video
                      src={`/assets/videos/${item.src}`}
                      className={`w-full h-full object-contain ${
                        mainContent.src !== item.src ? "opacity-50" : ""
                      }`}
                      muted
                      loop
                      playsInline
                    />
                  )}
                  {item.type === "video" && (
                    <div className="absolute top-2 right-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 3L19 12L5 21V3Z"
                          fill="#ffffff"
                          stroke="#000000"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Up and Down Arrow Buttons */}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={scrollUp}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-800 hover:bg-slate-950 hover:text-white active:border-2 active:border-blue-700 shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Scroll thumbnails up"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5L18 11L6 11L12 5Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              <button
                onClick={scrollDown}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-800 hover:bg-slate-950 hover:text-white active:border-2 active:border-blue-700 shadow-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Scroll thumbnails down"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 19L18 13L6 13L12 19Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div
              className={`w-full h-[550px] flex justify-center items-center overflow-hidden relative ${
                mainContent.type === "image" ? "cursor-zoom-in" : "cursor-default"
              }`}
              onMouseMove={mainContent.type === "image" ? handleMouseMove : null}
              onMouseLeave={mainContent.type === "image" ? handleMouseLeave : null}
            >
              {mainContent.type === "image" ? (
                <img
                  src={`/assets/images/${mainContent.src}`}
                  alt="Main men's shirt image"
                  className={`w-full h-full object-contain transition-transform duration-150 ease-out ${
                    showZoom ? "scale-150" : "scale-100"
                  }`}
                  style={zoomStyle}
                />
              ) : (
                <video
                  src={`/assets/videos/${mainContent.src}`}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="product-details w-full mt-10 lg:mt-0">
            <span
              data-aos="fade-up"
              className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block"
            >
              Men's Fashion
            </span>
            <p
              data-aos="fade-up"
              className="text-xl font-medium text-qblack mb-4"
            >
              Classic Men's Button-Down Shirt - 5 Colors
            </p>
            <div
              data-aos="fade-up"
              className="flex space-x-[10px] items-center mb-6"
            >
              <span className="bg-qgreen text-xs font-bold py-1 px-2 rounded">
                3.9 ★
              </span>
              <span className="text-qblack text-sm">
                2,02,923 ratings and 8,063 reviews
              </span>
            </div>

            <div data-aos="fade-up" className="mb-7">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium text-qgreen bg-qgreen-light px-2 py-1 rounded mr-2">
                  Special price
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold text-qblack">₹279.00</span>
                <span className="text-lg font-medium text-qgray line-through ml-3">
                  ₹1999.00
                </span>
                <span className="text-sm font-semibold text-qred ml-3 bg-qred-light px-2 py-1 rounded">
                  86% off
                </span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => setShowPriceDetails(!showPriceDetails)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7.5"
                      fill="#666"
                      stroke="#FFF"
                      strokeWidth="1"
                    />
                    <text
                      x="8"
                      y="10"
                      fontSize="6"
                      textAnchor="middle"
                      fill="#FFF"
                      fontWeight="bold"
                    >
                      i
                    </text>
                  </svg>
                </span>
              </div>
              {showPriceDetails && (
                <div className="mt-2 p-3 bg-gray-100 rounded border border-gray-300">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Maximum Retail Price (incl. of all taxes)</span>
                    <span>₹1999.00</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Selling Price</span>
                    <span>₹369.00</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 text-sm mb-1">
                    <span>Special Price</span>
                    <span>₹279.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-300 pt-1 mt-1">
                    <span>Overall you save</span>
                    <span>₹1720 (86%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div data-aos="fade-up" className="colors mb-[30px]">
              <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">
                COLOR
              </span>
              <div className="flex space-x-4 items-center">
                {productsImg.map((img) => (
                  <div key={img.id}>
                    {img.color && img.color !== "" && (
                      <button
                        onClick={() => changeColorHandler(img.id)}
                        type="button"
                        className={`w-[50px] h-[50px] overflow-hidden rounded cursor-pointer ${
                          selectedColorId === img.id
                            ? "border-2 border-qblack"
                            : ""
                        }`}
                      >
                        <img
                          src={`/assets/images/${img.src}`}
                          alt={`Color ${img.colorName}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div data-aos="fade-up" className="product-size mb-[30px]">
              <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">
                SIZE
              </span>
              <div className="flex items-center justify-between w-full space-x-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleSizeSelect(size)}
                    type="button"
                    disabled={!availableSizes.includes(size.value)}
                    className={`
                      relative px-3 py-2 text-sm font-medium text-center border rounded-[4px] transition-all duration-200
                      whitespace-nowrap min-w-[40px] h-[40px] flex items-center justify-center
                      ${
                        selectedSize === size.value && availableSizes.includes(size.value)
                          ? "bg-qblack text-white"
                          : availableSizes.includes(size.value)
                          ? "bg-white text-qblack border-qgray-border hover:bg-qgray-light"
                          : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                      }
                      focus:outline-none focus:ring-2 focus:ring-qblack focus:ring-offset-2
                    `}
                  >
                    <span className="text-[14px] font-medium leading-[18px]">
                      {size.label}
                    </span>
                    {selectedSize === size.value && availableSizes.includes(size.value) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-qgreen rounded-full flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <circle cx="4" cy="4" r="3" fill="white" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
                <button
                  onClick={toggleSizeChart}
                  type="button"
                  className="flex items-center space-x-1 text-sm text-qblue font-medium hover:text-qblack hover:underline transition-colors duration-200"
                >
                  <span>Size Chart</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      d="M6 9L2 5L2.91 4.09L6 7.17L9.09 4.09L10 5L6 9Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Size Chart Modal */}
            {showSizeChart && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-qblack">
                        Size Chart
                      </h3>
                      <button
                        onClick={toggleSizeChart}
                        className="text-qgray hover:text-qblack"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-qblack">
                        <thead className="bg-qgray-light">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium">
                              Size
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Chest (inches)
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Length (inches)
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Shoulder (inches)
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Availability
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeOptions.map((size) => (
                            <tr
                              key={size.value}
                              className={`${
                                selectedSize === size.value && availableSizes.includes(size.value)
                                  ? "bg-qgreen-light"
                                  : ""
                              } border-b border-qgray-border`}
                            >
                              <td className="px-4 py-3 font-medium">
                                {size.label}
                              </td>
                              <td className="px-4 py-3">{size.chest}</td>
                              <td className="px-4 py-3">
                                {38 +
                                  sizeOptions.findIndex(
                                    (s) => s.value === size.value
                                  ) *
                                    2}
                                "
                              </td>
                              <td className="px-4 py-3">
                                {17 +
                                  sizeOptions.findIndex(
                                    (s) => s.value === size.value
                                  )}
                                "
                              </td>
                              <td className="px-4 py-3">
                                {availableSizes.includes(size.value) ? (
                                  <span className="text-green-600">Available</span>
                                ) : (
                                  <span className="text-red-500">Not Available</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-3 bg-qgray-light rounded text-xs text-qgray">
                      <p>
                        <strong>Note:</strong> Measurements may vary slightly.
                        Please refer to our size guide for the best fit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Section */}
            <div className="delivery-section mb-6 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                      fill="#2874f0"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Deliver to
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Services
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-500">
                      Cash on Delivery available
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={pincode}
                  onChange={handlePincodeChange}
                  maxLength="6"
                  placeholder="Enter Pincode"
                  className="p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{deliveryDate}</span>
                <span className={`text-sm ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
                  {stockStatus}
                </span>
              </div>
            </div>

            {/* Flipkart-like Specification Section */}
            <div className="specification-section mb-6 p-3 bg-white">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-normal uppercase text-qgray inline-block">
                  Specification
                </span>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Fit: Regular | Size: {selectedSize}
                </span>
              </div>
            </div>

            {/* Quantity and Add to Cart with Buy Now */}
            <div
              data-aos="fade-up"
              className="quantity-card-wrapper w-full flex items-center h-[50px] space-x-[10px] mb-[30px]"
            >
              <div className="w-[120px] h-full px-[26px] flex items-center border border-qgray-border">
                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={decrement}
                    type="button"
                    className="text-base text-qgray"
                    aria-label="Decrease quantity"
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span className="text-qblack">{quantity}</span>
                  <button
                    onClick={increment}
                    type="button"
                    className="text-base text-qgray"
                    aria-label="Increase quantity"
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="w-[60px] h-full flex justify-center items-center border border-qgray-border">
                <button 
                  type="button" 
                  aria-label="Add to wishlist"
                  disabled={isOutOfStock}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 1C14.9 1 13.1 2.1 12 3.7C10.9 2.1 9.1 1 7 1C3.7 1 1 3.7 1 7C1 13 12 22 12 22C12 22 23 13 23 7C23 3.7 20.3 1 17 1Z"
                      stroke={isOutOfStock ? "#D5D5D5" : "#D5D5D5"}
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-full flex space-x-2">
                <button
                  type="button"
                  className={`text-sm font-semibold w-full h-full ${
                    isOutOfStock || !selectedSize
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "black-btn hover:bg-green-700"
                  }`}
                  disabled={isOutOfStock || !selectedSize}
                >
                  {!selectedSize ? "Select Size First" : "Add To Cart"}
                </button>
                <button
                  type="button"
                  className={`text-sm font-semibold w-full h-full ${
                    isOutOfStock || !selectedSize
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "black-btn hover:bg-green-700"
                  }`}
                  disabled={isOutOfStock || !selectedSize}
                >
                  {!selectedSize ? "Select Size First" : "Buy Now"}
                </button>
              </div>
            </div>

            {/* Product Details Section with Read More */}
            <div
              data-aos="fade-up"
              className="product-details-section mb-[20px] p-4 bg-white border border-qgray-border"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowProductDetails(!showProductDetails)}
              >
                <h3 className="text-lg font-semibold text-qblack">
                  Product Details
                </h3>
                <span className="text-2xl font-bold">
                  {showProductDetails ? "−" : "+"}
                </span>
              </div>
              {showProductDetails && (
                <div className="mt-2">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Brand:</span>
                      <span className="text-qblack font-medium">METRONAUT</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Size:</span>
                      <span className="text-qblack font-medium">{selectedSize}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Pack of:</span>
                      <span className="text-qblack font-medium">1</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Style Code:</span>
                      <span className="text-qblack font-medium">
                        FORMAL SHIRT
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Closure:</span>
                      <span className="text-qblack font-medium">Button</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Fit:</span>
                      <span className="text-qblack font-medium">Regular</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Fabric:</span>
                      <span className="text-qblack font-medium">
                        Cotton Blend
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-qgray w-1/3">Sleeve:</span>
                      <span className="text-qblack font-medium">
                        Full Sleeve
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-2 text-qblue text-sm font-medium hover:text-qblack hover:underline transition-colors duration-200"
                    onClick={() => setShowReadMore(!showReadMore)}
                  >
                    {showReadMore ? "Read Less" : "Read More"}
                  </button>
                  {showReadMore && (
                    <div className="mt-2 text-sm text-qblack">
                      <div className="grid mb-2 grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center">
                          <span className="text-qgray w-1/3">Brand:</span>
                          <span className="text-qblack font-medium">
                            METRONAUT
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-qgray w-1/3">Size:</span>
                          <span className="text-qblack font-medium">{selectedSize}</span>
                        </div>
                      </div>
                      <p>
                        Additional Information: This formal shirt is designed
                        for comfort and style, featuring a classic collar and a
                        tailored fit suitable for office wear or special
                        occasions. Made with a high-quality cotton blend, it
                        offers breathability and durability. Care Instructions:
                        Machine wash cold, tumble dry low, or iron on medium
                        heat. Available in multiple colors to suit your
                        preference.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div data-aos="fade-up" className="ratings-reviews-section w-full mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-qblack">
              Ratings & Reviews
            </h3>
            <div className="rating-summary mt-4 p-4 bg-white border border-qgray-border rounded-lg max-w-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-qblack">3.9</div>
                    <div className="text-qgreen text-sm font-medium">
                      ★ ★ ★ ★ ☆
                    </div>
                    <div className="text-xs text-qgray mt-1">
                      2,02,923 ratings
                    </div>
                    <div className="text-xs text-qgray">8,063 reviews</div>
                  </div>
                </div>
                <div className="flex-1 ml-6">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center space-x-2">
                        <span className="text-sm text-qgray w-4">{star}</span>
                        <span className="text-yellow-500">★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                star === 5
                                  ? "65%"
                                  : star === 4
                                  ? "20%"
                                  : star === 3
                                  ? "10%"
                                  : star === 2
                                  ? "3%"
                                  : "2%"
                              }`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-qgray w-8">
                          {star === 5
                            ? "65%"
                            : star === 4
                            ? "20%"
                            : star === 3
                            ? "10%"
                            : star === 2
                            ? "3%"
                            : "2%"
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-6">
            <button
              onClick={() => setShowReviews(true)}
              className="px-6 py-3 bg-qblack text-white font-medium rounded-lg hover:bg-qgray transition-colors duration-200"
            >
              Write a Review
            </button>
          </div>
        </div>

        {showReviews && (
          <div className="reviews-list space-y-6 mt-6">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="review-item p-4 border border-qgray-border rounded-lg bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 ${review.avatarColor} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-semibold">{review.initials}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-qblack">{review.name}</h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-qgreen text-sm">{review.rating}</span>
                        <span className="text-xs text-qgray">Certified Buyer</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-qgray">{review.date}</span>
                </div>
                <p className="text-sm text-qblack leading-relaxed">{review.text}</p>
                <div className="mt-3 flex items-center space-x-4 text-xs text-qgray">
                  <span>{review.location}</span>
                </div>
              </div>
            ))}
            {visibleReviews < reviews.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMoreReviews}
                  className="px-8 py-3 border border-qblack text-qblack font-medium rounded-lg hover:bg-qblack hover:text-white transition-colors duration-200"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="#22c55e"
              />
            </svg>
            <span className="text-sm font-medium text-green-800">
              93% of customers recommend this product
            </span>
          </div>
        </div>
      </div>
    </>
  );
}