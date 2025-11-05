import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="privacy-policy-page w-full bg-white pb-[30px]">
        <div className="w-full mb-[50px]">
          <PageTitle
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "Privacy Policy", path: "privacy-policy" },
            ]}
            title="Privacy Policy"
          />
        </div>

        <div className="w-full">
          <div className="container-x mx-auto">
            {/* Intro */}
            <div className="content-item w-full mb-5">
              <p className="text-[15px] text-gray-700 leading-7">
                This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from www.thebearhouse.com (the “Site”).
              </p>
            </div>

            {/* Personal Information */}
            <div className="content-item w-full mb-5">
              <h2 className="text-[18px] font-medium text-gray-900 mb-5">
                PERSONAL INFORMATION WE COLLECT
              </h2>

              <p className="text-[15px] text-gray-700 leading-7 mb-5">
                When you visit the Site, we automatically collect certain information about your device, including details about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information”.
              </p>

              <div>
                <p className="text-[15px] text-gray-700 leading-7 mb-5">
                  We collect Device Information using the following technologies:
                </p>

                <ul className="list-disc ml-11 space-y-2">
                  <li className="text-[15px] text-gray-700 leading-7">
                    <strong className="text-gray-900">Cookies</strong> are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit{" "}
                    <a
                      href="#"
                      className="text-gray-800 underline hover:text-black"
                    >
                      www.allaboutcookies.org
                    </a>.
                  </li>
                  <li className="text-[15px] text-gray-700 leading-7">
                    <strong className="text-gray-900">Log files</strong> track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.
                  </li>
                  <li className="text-[15px] text-gray-700 leading-7">
                    <strong className="text-gray-900">Web beacons, tags,</strong> and{" "}
                    <strong className="text-gray-900">pixels</strong> are electronic files used to record information about how you browse the Site.
                  </li>
                </ul>
              </div>
            </div>

            {/* Order Info */}
            <div className="content-item w-full mb-5">
              <p className="text-[15px] text-gray-700 leading-7">
                Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We do not store your credit card and other payment details with us. We refer to this information as “Order Information”.
              </p>
            </div>

            {/* Personal Info Definition */}
            <div className="content-item w-full">
              <p className="text-[15px] text-gray-700 leading-7">
                When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
