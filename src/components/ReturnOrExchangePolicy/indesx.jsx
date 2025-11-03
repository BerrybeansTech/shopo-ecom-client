import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function ReturnOrExchangePolicy() {
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="return-policy-page w-full bg-white pb-[50px]">
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
                    <p className="text-[15px] text-qgraytwo leading-7">
                      You can easily initiate a return or exchange request through our mobile app. Open The Bear House app, go to the "My Account" section, and log in with your registered contact details. Then, click on "Return & Exchange Request" to proceed. Ensure that the product is packed in its original packaging with tags intact, and hand it over to the courier when they arrive. Once the item is returned to our warehouse, we will verify it and either issue a refund or process the exchange as per your request
                      <br />
                      <br />
                      Please note that returns and exchanges can only be requested through the mobile app.
                      <br />
                      <br />
                      📲 To place a Return/Exchange request, download The Bear House Mobile App on iOS & Android
                    </p>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
