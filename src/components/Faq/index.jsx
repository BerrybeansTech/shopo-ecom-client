import { useState } from "react";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";

export default function Faq() {
  const [openAccordion, setOpenAccordion] = useState(1);

  const faqData = [
    {
      id: 1,
      question: "How does information technology work?",
      answer: "Information technology involves using computers, storage, networking and other physical devices to create, process, store, secure and exchange electronic data. Our IT solutions help businesses streamline operations and improve efficiency through customized software and hardware implementations."
    },
    {
      id: 2,
      question: "How can I become an IT manager?",
      answer: "To become an IT manager, you typically need a bachelor's degree in computer science or related field, 5+ years of IT experience, strong leadership skills, and certifications like PMP or ITIL. Many IT managers start as developers or system administrators and progress into management roles."
    },
    {
      id: 3,
      question: "What are the latest trends in IT?",
      answer: "Current IT trends include Artificial Intelligence and Machine Learning, Cloud Computing, Cybersecurity advancements, Internet of Things (IoT), 5G technology, Edge Computing, Quantum Computing, and Sustainable IT solutions for reducing environmental impact."
    },
    {
      id: 4,
      question: "How long should a business plan be?",
      answer: "A comprehensive business plan typically ranges from 15-30 pages. However, the length depends on your audience and purpose. For internal use, 10-15 pages may suffice, while seeking investors might require 20-30 pages with detailed financial projections and market analysis."
    },
    {
      id: 5,
      question: "How does the support policy work?",
      answer: "Our support policy includes 24/7 technical assistance, guaranteed response within 2 hours for critical issues, regular system updates, and proactive monitoring. We offer different support tiers to match your business needs, from basic email support to dedicated account managers."
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and digital payment methods like Apple Pay and Google Pay. Enterprise clients can also arrange for monthly invoicing and payment terms."
    },
    {
      id: 7,
      question: "Do you offer custom solutions?",
      answer: "Yes, we specialize in custom IT solutions tailored to your specific business requirements. Our team works closely with you to understand your workflow and develop bespoke software, integration systems, or complete digital transformation strategies."
    },
    {
      id: 8,
      question: "What is your implementation timeline?",
      answer: "Implementation timelines vary based on project complexity. Standard implementations take 2-4 weeks, while enterprise solutions may require 3-6 months. We provide detailed project timelines during the consultation phase and maintain regular progress updates throughout the process."
    },
    {
      id: 9,
      question: "Do you provide training and documentation?",
      answer: "Yes, we provide comprehensive training sessions and detailed documentation for all our solutions. This includes user manuals, video tutorials, and live training sessions to ensure your team can effectively use our products."
    },
    {
      id: 10,
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee for all our services. If you're not satisfied with our solution within the first 30 days, we'll provide a full refund. Enterprise contracts may have different terms outlined in the service agreement."
    }
  ];

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const leftColumnFaqs = faqData.slice(0, 5);
  const rightColumnFaqs = faqData.slice(5, 10);

  return (
    <Layout childrenClasses="pt-0 pb-0">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="faq-page-wrapper w-full mb-20">
        <div className="page-title w-full">
          <PageTitle
            title="Frequently Asked Questions"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]}
          />
        </div>
      </div>

      <div className="faq-wrapper w-full mb-10">
        <div className="container-x mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Faq
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to the most common questions about our services and support
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Left Column */}
              <div className="space-y-4">
                {leftColumnFaqs.map((faq) => (
                  <div 
                    key={faq.id}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex justify-between items-center rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleAccordion(faq.id)}
                    >
                      <span className="text-base font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <span className="flex-shrink-0 ml-2">
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                            openAccordion === faq.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </button>
                    
                    <div
                      className={`px-6 overflow-hidden transition-all duration-300 ${
                        openAccordion === faq.id ? 'max-h-96 pb-5' : 'max-h-0'
                      }`}
                    >
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumnFaqs.map((faq) => (
                  <div 
                    key={faq.id}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex justify-between items-center rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleAccordion(faq.id)}
                    >
                      <span className="text-base font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <span className="flex-shrink-0 ml-2">
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                            openAccordion === faq.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </button>
                    
                    <div
                      className={`px-6 overflow-hidden transition-all duration-300 ${
                        openAccordion === faq.id ? 'max-h-96 pb-5' : 'max-h-0'
                      }`}
                    >
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Can't find the answer you're looking for? Please reach out to our friendly team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {/* Chat Bubble Icon for Contact Support */}
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Support
                </a>
                <a
                  href="mailto:support@example.com"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-white transition-colors duration-200"
                >
                  {/* Mail Icon for Email Us */}
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}