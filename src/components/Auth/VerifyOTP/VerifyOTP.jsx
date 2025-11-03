import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../Partials/Layout";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const identifier = searchParams.get("identifier") || "";
  const type = searchParams.get("type") || "";
  const { userData } = location.state || {};

  // Validate OTP (exactly 6 digits)
  const isValidOTP = (otp) => {
    return /^\d{6}$/.test(otp);
  };

  // Simulate OTP verification
  const verifyOTP = async () => {
    if (!isValidOTP(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }
    if (otp === "123456") {
      console.log("OTP verified for:", identifier);
      if (type === "reset") {
        navigate(`/reset-password`, { state: { identifier, userData, fromForgotPassword: true } });
      } else if (type === "signin") {
        navigate("/");
      } else {
        navigate("/"); // New user verification
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    verifyOTP();
  };

  useEffect(() => {
    if (!identifier) {
      navigate("/login");
    }
  }, [identifier, navigate]);

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-[76vh] items-center justify-center bg-white px-4 py-8">
        <div className="lg:w-[450px] w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-300">
          
          {/* Header Section with Avatar Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Verify Your Account
            </h1>
            <p className="text-gray-600 text-sm">
              Enter the OTP sent to {identifier}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gray-50 text-gray-800 text-sm rounded-lg flex items-center gap-3 border border-gray-300">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                placeholder="Enter 6-digit OTP"
                name="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}