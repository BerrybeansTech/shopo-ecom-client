import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { Phone, Mail, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema
const emailSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Min 2 characters"),
  email: yup.string().required("Email is required").email("Invalid email"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^\d{10}$/, "Exactly 10 digits required"),
  message: yup.string().required("Message is required").min(10, "Min 10 characters"),
});

export default function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(emailSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Email form:", data);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        reset();
      }, 2000);
    } catch (error) {
      alert("Failed to send. Try again.");
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      {/* === PAGE TITLE === */}
      <div className="page-title">
        <PageTitle
          title="Contact Us"
          breadcrumb={[
            { name: "home", path: "/" },
            { name: "contact", path: "/contact" },
          ]}
        />
      </div>

      {/* === CONTACT SECTION === */}
      <div className="contact-wrapper w-full pt-9 pb-14 bg-qgraylight">
        <div className="container-x mx-auto">
          <div className="mb-12 max-w-4xl">
            <h1 className="text-[36px] font-bold text-qblack mb-4">Contact Us</h1>
            <p className="text-[15px] leading-[28px] text-qgraytwo font-light">
              Choose your preferred method of contact to connect with our Client Services team or find out more information through our FAQ page.
            </p>
          </div>

          {/* 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CALL US */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-qgray-border flex flex-col h-full">
              <h3 className="text-[18px] font-bold text-qblack uppercase tracking-[0.1em] mb-5">CALL US</h3>
              <p className="text-[14px] text-qgraytwo leading-[24px] mb-4">
                Our Client Advisors are here to help, providing information on your inquiries and advice on your purchases.
              </p>
              <p className="text-[14px] text-qgraytwo mb-4">You may contact us by phone:</p>
              <ul className="text-[14px] text-qgraytwo space-y-1 mb-8">
                <li>• Monday to Friday: 9am - 8pm CT</li>
                <li>• Saturday and Sunday: 10am - 7pm CT</li>
              </ul>

              <a
                href="tel:+18668848866"
                className="mt-auto inline-flex items-center justify-center w-full h-[56px] bg-white border-2 border-qblack rounded-full text-qblack text-[16px] font-medium hover:bg-qblack hover:text-white transition-all duration-300 group"
              >
                <Phone className="w-5 h-5 mr-3 group-hover:stroke-white transition-colors" />
                CALL US
              </a>
            </div>

            {/* CHAT WITH US */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-qgray-border flex flex-col h-full">
              <h3 className="text-[18px] font-bold text-qblack uppercase tracking-[0.1em] mb-5">CHAT WITH US</h3>
              <p className="text-[14px] text-qgraytwo leading-[24px] mb-4">
                Our live Chat Client Advisors are available to assist:
              </p>
              <ul className="text-[14px] text-qgraytwo space-y-1 mb-4">
                <li>• Monday to Friday: 9am - 8pm CT</li>
                <li>• Saturday and Sunday: 10am - 7pm CT</li>
              </ul>
              <p className="text-[14px] text-qgraytwo leading-[24px] mb-8">
                Chat with us instantly via WhatsApp during business hours.
              </p>

              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center w-full h-[56px] bg-white border-2 border-qblack rounded-full text-qblack text-[16px] font-medium hover:bg-qblack hover:text-white transition-all duration-300 group"
              >
                <svg className="w-6 h-6 mr-3 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.488" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* LEGAL INQUIRIES → EMAIL FORM */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-qgray-border flex flex-col h-full">
              <h3 className="text-[18px] font-bold text-qblack uppercase tracking-[0.1em] mb-5">LEGAL INQUIRIES</h3>
              <p className="text-[14px] text-qgraytwo leading-[24px] mb-6">
                Please complete this form to email us with any questions or requests regarding accessibility, data privacy, or any other legal matters.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-auto inline-flex items-center justify-center w-full h-[56px] bg-white border-2 border-qblack rounded-full text-qblack text-[16px] font-medium hover:bg-qblack hover:text-white transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 mr-3 group-hover:stroke-white transition-colors" />
                Send an Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            <button
              onClick={() => {
                setIsModalOpen(false);
                reset();
                setSubmitSuccess(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-qblack transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="px-8 py-10">
              <h2 className="text-2xl font-semibold text-qblack text-center mb-6">
                Send Us a Message
              </h2>

              {submitSuccess ? (
                <div className="text-center py-6 animate-fadeIn">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-qblack mb-1">Message Sent!</h3>
                  <p className="text-sm text-gray-500">We’ll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...register("name")}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-qblack focus:outline-none transition"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...register("email")}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-qblack focus:outline-none transition"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      maxLength={10}
                      {...register("phone")}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-qblack focus:outline-none transition"
                      onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <textarea
                      placeholder="Your Message"
                      {...register("message")}
                      rows={4}
                      className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:border-qblack focus:outline-none transition"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-qblack text-white rounded-lg font-medium hover:bg-qblackhover transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Layout>
  );
}
