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
    } catch {
      alert("Failed to send. Try again.");
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      {/* === PAGE TITLE === */}
      <PageTitle
        title="Contact Us"
        breadcrumb={[
          { name: "home", path: "/" },
          { name: "contact", path: "/contact" },
        ]}
      />

      {/* === CONTACT SECTION === */}
      <div className="w-full bg-gray-50 mt-10 pt-10 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Choose your preferred method of contact to connect with our Client Services team or find out more information through our FAQ page.
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CALL US */}
            <div className="bg-white p-8 rounded-2xl shadow border border-gray-200 flex flex-col">
              <h3 className="text-lg font-bold text-black uppercase mb-4 tracking-wide">CALL US</h3>
              <p className="text-sm text-gray-600 mb-3">
                Our Client Advisors are here to help, providing information on your inquiries and advice on your purchases.
              </p>
              <p className="text-sm text-gray-600 mb-3">You may contact us by phone:</p>
              <ul className="text-sm text-gray-600 mb-8 space-y-1">
                <li>• Monday to Friday: 9am - 8pm CT</li>
                <li>• Saturday and Sunday: 10am - 7pm CT</li>
              </ul>

              <a
                href="tel:+18668848866"
                className="mt-auto inline-flex items-center justify-center w-full h-12 border-2 border-black rounded-full text-black font-medium hover:bg-black hover:text-white transition"
              >
                <Phone className="w-5 h-5 mr-2" />
                CALL US
              </a>
            </div>

            {/* CHAT */}
            <div className="bg-white p-8 rounded-2xl shadow border border-gray-200 flex flex-col">
              <h3 className="text-lg font-bold text-black uppercase mb-4 tracking-wide">CHAT WITH US</h3>
              <p className="text-sm text-gray-600 mb-3">
                Our live Chat Client Advisors are available to assist:
              </p>
              <ul className="text-sm text-gray-600 mb-3 space-y-1">
                <li>• Monday to Friday: 9am - 8pm CT</li>
                <li>• Saturday and Sunday: 10am - 7pm CT</li>
              </ul>
              <p className="text-sm text-gray-600 mb-8">
                Chat with us instantly via WhatsApp during business hours.
              </p>

              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center w-full h-12 border-2 border-black rounded-full text-black font-medium hover:bg-black hover:text-white transition"
              >
                <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..." />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* EMAIL FORM BUTTON */}
            <div className="bg-white p-8 rounded-2xl shadow border border-gray-200 flex flex-col">
              <h3 className="text-lg font-bold text-black uppercase mb-4 tracking-wide">LEGAL INQUIRIES</h3>
              <p className="text-sm text-gray-600 mb-8">
                Please complete this form to email us with any questions or requests regarding accessibility, data privacy, or any other legal matters.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-auto inline-flex items-center justify-center w-full h-12 border-2 border-black rounded-full text-black font-medium hover:bg-black hover:text-white transition"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send an Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
            <button
              onClick={() => {
                setIsModalOpen(false);
                reset();
                setSubmitSuccess(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="px-8 py-10">
              <h2 className="text-2xl font-semibold text-black text-center mb-6">
                Send Us a Message
              </h2>

              {submitSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-1">Message Sent!</h3>
                  <p className="text-sm text-gray-500">We’ll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register("name")}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

                  <input
                    type="email"
                    placeholder="Email Address"
                    {...register("email")}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    maxLength={10}
                    {...register("phone")}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}

                  <textarea
                    placeholder="Your Message"
                    {...register("message")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:outline-none resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === FADE ANIMATION === */}
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
