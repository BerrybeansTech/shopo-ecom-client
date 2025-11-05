import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function ShippingPolicy() {
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="shipping-policy-page w-full bg-white pb-[30px]">
        <div className="w-full mb-[50px]">
          <PageTitle
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "Shipping Policy", path: "/shipping-policy" },
            ]}
            title="Shipping Policy"
          />
        </div>

        <div className="w-full">
          <div className="container-x mx-auto">
            {/* RETURNS */}
            <div className="content-item w-full mb-5">
              <h2 className="text-[18px] font-medium text-gray-900 mb-5">
                RETURNS
              </h2>
              <p className="text-[15px] text-gray-700 leading-7">
                We offer a 7 day return policy for all unused and unworn items. Please note that this policy does not apply to sunglasses, boxers, trunks, all accessories and flat store items. The Bear House reserves the right to inspect returned items before processing refunds. If you purchased a Bear House product from a source other than our website or app, the return policies of your source of purchase shall apply. Any shipping charges (if paid) at the time of placing the order are non-refundable in case of returns.
              </p>
              <p className="text-[15px] text-gray-700 mt-4 leading-7">
                In case of missing items in return orders, i.e., where the customer claims to have returned multiple products but actual pickup doesn't include all said items, the company has a right to deduct the paid amount of the missing product from the refund amount.
              </p>
            </div>

            {/* REFUND POLICY */}
            <div className="content-item w-full mb-5">
              <h2 className="text-[18px] font-medium text-gray-900 mb-5">
                REFUND POLICY
              </h2>
              <p className="text-[15px] text-gray-700 leading-7">
                If you request a return for any of your products, the refund will be processed once we receive the returned item at our warehouse.
              </p>
            </div>

            {/* EXCHANGE */}
            <div className="content-item w-full mb-5">
              <h2 className="text-[18px] font-medium text-gray-900 mb-5">
                EXCHANGE
              </h2>
              <p className="text-[15px] text-gray-700 leading-7">
                You can also request an exchange of your order based on your preferences, with the same conditions as those for returns. The exchange will be shipped only after we have picked up the initial return.
              </p>
            </div>

            {/* RETURN PROCESS */}
            <div className="content-item w-full">
              <h2 className="text-[18px] font-medium text-gray-900 mb-5">
                RETURN PROCESS
              </h2>
              <p className="text-[15px] text-gray-700 leading-7">
                You can initiate a return request from our app only. Alternatively, you can reach out to our Customer Support team, and they’ll guide you through the process. After booking the return, please ensure you are available for the reverse pick-up and respond to calls from the delivery partner. If you are not available or do not answer
                the calls, the delivery partner may cancel the reverse pick-up at their discretion. In all such cases, the process will have to be re-initiated again, and the overall timeline will increase.
              </p>
              <p className="text-[15px] text-gray-700 mt-4 leading-7">
                Further, please note that while most pin codes are serviceable for both delivery and returns, there are rare instances where some pin codes are only serviceable for delivery and not for returns. In such cases, we may ask you to return the product using an alternative courier service, such as India Post.
              </p>
              <p className="text-[15px] text-gray-700 mt-4 leading-7">
                In case you receive a damaged / defective product, please notify us within 24 hours of delivery. Additionally, kindly email us a photograph of the damaged or defective product to{" "}
                <a
                  href="mailto:support@thebearhouse.com"
                  className="text-gray-800 underline hover:text-black"
                >
                  support@thebearhouse.com
                </a>
                .
              </p>
              <p className="text-[15px] text-gray-700 mt-4 leading-7">
                In the unlikely event that you receive a wrong product, empty parcel or a missing product, we would request you to reach out to our customer support team for assistance within 48 hours of the package being delivered. We will be requiring an unpacking video of the parcel for us to process the request further. Please note that insufficient evidence or visible signs of tampering with the packet may result in your claim not being honored. In all such cases, the brand reserves the right to take the final decision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
