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
      <div className="login-page-wrapper w-full py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-7">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-center">
            <div className="lg:w-[450px] w-full bg-white p-10 rounded-lg shadow-lg border border-gray-100">
              <div className="title-area text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Verify Your Account
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Enter the OTP sent to {identifier}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full h-[50px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-white h-[50px] rounded-lg font-semibold transition duration-200"
                >
                  Verify OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}