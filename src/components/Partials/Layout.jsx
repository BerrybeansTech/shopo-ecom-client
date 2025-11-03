import { useState } from "react";
import FooterCategory from "../Home/FooterCategory";
import Drawer from "../Mobile/Drawer";
import Footer from "./Footers/Footer";
import Header from "./Headers/HeaderOne/index";

export default function Layout({ children, childrenClasses }) {
  const [drawer, setDrawer] = useState(false);
  return (
    <>
      <Drawer open={drawer} action={() => setDrawer(!drawer)} />
      <div className="w-full max-w-[1920px] mx-auto overflow-x-hidden">
        <Header drawerAction={() => setDrawer(!drawer)} />
        <div className={`w-full  ${childrenClasses || " pb-[60px]"}`}>
          {children && children}
        </div>
        <FooterCategory />
        <Footer />
      </div>
    </>
  );
}
