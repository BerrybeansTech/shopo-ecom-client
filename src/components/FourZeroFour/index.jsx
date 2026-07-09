import { Link } from "react-router-dom";
import BreadcrumbCom from "../BreadcrumbCom";
import Layout from "../Partials/Layout";
import ErrorThumb from "./ErrorThumb";

export default function FourZeroFour() {
  return (
    <Layout>
      <div className="cart-page-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="pt-8">
            <BreadcrumbCom paths={[{ name: "home", path: "/" }]} />
          </div>
          <div className="empty-card-wrapper w-full">
            <div className="flex justify-center items-center w-full">
              <div>
                <div className="sm:mb-10 mb-0 transform sm:scale-75 scale-50 flex justify-center">
                  <ErrorThumb />
                </div>
                <div data-aos="fade-up" className="empty-content w-full -mt-10 sm:-mt-14">
                  <h1 className="sm:text-2xl text-base font-semibold text-center mb-5">
                    Sorry! We cant’t Find that page!
                  </h1>
                  <Link to="/">
                    <div className="flex justify-center w-full ">
                      <div className="w-[180px] h-[50px] ">
                        <span type="button" className="yellow-btn flex items-center justify-center w-full h-full">
                          Back to Home
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
