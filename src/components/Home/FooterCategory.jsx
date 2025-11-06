import { Link } from "react-router-dom"; // Assuming React Router is set up

export default function CategoryMenu() {
  const categories = {
    Topwear: [
      {
        name: "T-Shirts",
        sub: [
          "Plain / Basic T-Shirts",
          "Graphic / Printed T-Shirts",
          "Polo T-Shirts",
          "Oversized / Relaxed Fit T-Shirts",
          "Tank / Sleeveless Tops",
          "Long-Sleeve Tees",
        ],
      },
      {
        name: "Shirts",
        sub: [
          "Formal / Office Shirts",
          "Casual Shirts",
          "Designer / Premium Shirts",
          "Linen / Breathable Fabric Shirts",
          "Half-Sleeve Shirts",
          "Check / Printed / Patterned Shirts",
        ],
      },
      {
        name: "Sweatshirts / Hoodies / Pullovers",
        sub: [
          "Hooded Sweatshirts",
          "Crew-Neck Sweatshirts",
          "Zip & Half-Zip Sweatshirts",
        ],
      },
      {
        name: "Jackets & Outerwear",
        sub: [
          "Light Jackets (Bomber, Windbreaker, etc)",
          "Denim Jackets",
          "Leather / Faux-Leather Jackets",
          "Parkas / Winter Coats",
          "Blazers & Sport Coats (if applicable)",
        ],
      },
      {
        name: "Ethnic / Traditional Tops (if you carry)",
        sub: ["Kurta / Ethnic Shirts", "Nehru / Mandarins / Band-Collar Shirts"],
      },
    ],
    Bottomwear: [
      {
        name: "Jeans",
        sub: [
          "Slim Fit Jeans",
          "Straight Fit Jeans",
          "Relaxed / Loose Fit Jeans",
          "Distressed / Washed Jeans",
          "Ankle Fit / Tapered",
        ],
      },
      {
        name: "Trousers & Chinos",
        sub: [
          "Chino Pants",
          "Linen Trousers",
          "Corduroy Pants",
          "Formal Trousers",
          "Gurkha / Pleated styles",
        ],
      },
      {
        name: "Shorts",
        sub: [
          "Casual Shorts",
          "Cargo Shorts",
          "Linen Shorts",
          "Knee-length / above-knee",
        ],
      },
      {
        name: "Joggers / Sweatpants",
        sub: ["Regular Joggers", "Cargo Joggers", "Lounge / Athleisure Pants"],
      },
    ],
    "Underwear, Loungewear & Nightwear": [
      { name: "Underwear", sub: ["Briefs / Boxers / Boxer-Briefs", "Trunks"] },
      {
        name: "Loungewear / Homewear",
        sub: ["Lounge Pants", "Shorts", "Lounge Shirts / Tees"],
      },
      { name: "Nightwear", sub: ["Pyjamas", "Night Tees"] },
    ],
    "Activewear / Sportswear": [
      "Active T-Shirts / Tees",
      "Track Pants / Sweat Pants",
      "Gym Shorts",
      "Hoodie / Sweatshirt (sports)",
      "Jacket / Windbreaker (sports)",
    ],
  };

  return (
    <nav className="category-menu bg-white shadow-md">
      <div className="container-x block mx-auto pt-8 pb-8">
        <div className="space-y-3">
          {Object.entries(categories).map(([mainCat, items]) => (
            <div key={mainCat} className="leading-relaxed">
              <span className="text-base font-semibold text-gray-900">
                {mainCat} :
              </span>{" "}
              {Array.isArray(items[0]?.sub) ? (
                // Nested subcategories
                <span className="text-xs text-gray-700">
                  {items.map((item, itemIndex) => (
                    <span key={item.name}>
                      {item.sub.map((sub, subIndex) => (
                        <span key={sub}>
                          <Link
                            to={`/category/${mainCat
                              .toLowerCase()
                              .replace(/[^a-z0-9]/g, "-")}/${item.name
                              .toLowerCase()
                              .replace(/[^a-z0-9]/g, "-")}/${sub
                              .toLowerCase()
                              .replace(/[^a-z0-9]/g, "-")}`}
                            className="hover:text-gray-900 underline-offset-2 hover:underline transition-colors"
                          >
                            {sub}
                          </Link>
                          {!(
                            itemIndex === items.length - 1 &&
                            subIndex === item.sub.length - 1
                          ) && (
                            <span className="mx-1 text-gray-400">|</span>
                          )}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              ) : (
                // Flat list for Activewear
                <span className="text-xs text-gray-700">
                  {items.map((item, index) => (
                    <span key={item}>
                      <Link
                        to={`/category/activewear/${item
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")}`}
                        className="hover:text-gray-900 underline-offset-2 hover:underline transition-colors"
                      >
                        {item}
                      </Link>
                      {index < items.length - 1 && (
                        <span className="mx-1 text-gray-400">|</span>
                      )}
                    </span>
                  ))}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
