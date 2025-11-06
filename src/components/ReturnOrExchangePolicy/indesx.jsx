import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function ReturnOrExchangePolicy() {
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="return-policy-page w-full bg-white pb-[30px]">
        <div className="w-full mb-[50px]">
          <PageTitle
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "Return Or Exchange Policy", path: "/return-policy" },
            ]}
            title="Return / Exchange Policy"
          />
        </div>

        <div className="w-full">
          <div className="container-x mx-auto">
            <div className="content-item w-full">
              <p className="text-[15px] text-gray-700 leading-7">
                You can easily initiate a return or exchange request through our mobile app. Open The Bear House app, go to the{" "}
                <span className="text-gray-900 font-medium">"My Account"</span> section, and log in with your registered contact details. Then, click on{" "}
                <span className="text-gray-900 font-medium">"Return & Exchange Request"</span> to proceed. Ensure that the product is packed in its original packaging with tags intact, and hand it over to the courier when they arrive. Once the item is returned to our warehouse, we will verify it and either issue a refund or process the exchange as per your request.
              </p>
               <p className="text-[15px] text-gray-700 mt-4 leading-7">
                Please note that returns and exchanges can only be requested through the mobile app.
              </p>
              <p className="text-[15px] text-gray-700 mt-4 leading-7">
                📲 To place a Return/Exchange request, download{" "}
                <span className="text-gray-900 font-medium">
                  The Bear House Mobile App
                </span>{" "}
                on iOS & Android.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
