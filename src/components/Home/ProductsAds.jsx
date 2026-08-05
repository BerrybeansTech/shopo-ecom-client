import { useState, useEffect } from "react";
import { apiService } from "../../services/apiservice";

export default function ProductsAds({
  className,
  sectionHeight,
}) {
  const [promoBanner, setPromoBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPromoBanner = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");
        const response = await apiService.get("/promo-banner/get-active");
        let activeBanners = [];
        if (response && Array.isArray(response.data)) {
          activeBanners = response.data;
        } else if (response && Array.isArray(response.data?.data)) {
          activeBanners = response.data.data;
        } else if (response && Array.isArray(response)) {
          activeBanners = response;
        }

        // Place 1 matches position === 'place_1' (or first active banner)
        const place1Banner = activeBanners.find((b) => b.position === "place_1") || activeBanners[0];
        if (place1Banner) {
          setPromoBanner(place1Banner);
        } else {
          setPromoBanner(null);
          setErrorMsg("No active promotional banner uploaded");
        }
      } catch (err) {
        console.error("Error fetching promo banner (Place 1):", err);
        setPromoBanner(null);
        setErrorMsg("Failed to load promotional banner");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromoBanner();
  }, []);

  if (isLoading) {
    return (
      <div className={`w-full py-6 ${className || ""}`}>
        <div className="w-full h-[180px] sm:h-[260px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">Loading promo banner...</span>
        </div>
      </div>
    );
  }

  if (!promoBanner) {
    return (
      <div className={`w-full py-6 ${className || ""}`}>
        <div className="w-full h-[180px] sm:h-[260px] rounded-xl bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 border border-amber-200/70 flex flex-col items-center justify-center text-center p-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 tracking-wide">
            {errorMsg || "No Promo Banner Active"}
          </h3>
        </div>
      </div>
    );
  }

  const displayImage = isMobile && promoBanner.mobileImage
    ? promoBanner.mobileImage
    : promoBanner.image;

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="w-full">
        <div className={`${sectionHeight || "h-auto"} items-center w-full overflow-hidden`}>
          <div data-aos="fade-right" className="w-full h-auto">
            <img
              src={displayImage}
              alt={promoBanner.title || "Promotional Banner"}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}