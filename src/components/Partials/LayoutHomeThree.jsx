import { useState } from "react";
import FooterCategory from "../Home/FooterCategory";
import Footer from "./Footers/Footer";
import Header from "./Headers/HeaderOne";
import DrawerThree from "../Mobile/DrawerThree";

export default function LayoutHomeThree({ children, childrenClasses,type }) {
    const [drawer, setDrawer] = useState(false);
    return (
        <>
            <DrawerThree open={drawer} action={() => setDrawer(!drawer)} />
            <div className="w-full overflow-x-hidden">
                <Header type={3} drawerAction={() => setDrawer(!drawer)} />
                <div className={`w-full  ${childrenClasses || "pt-[30px] pb-[60px]"}`}>
                    {children && children}
                </div>
                <FooterCategory type={3} />
                <Footer type={type} />
            </div>
        </>
    );
}