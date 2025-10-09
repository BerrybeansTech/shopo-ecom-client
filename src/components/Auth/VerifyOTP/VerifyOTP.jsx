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
  const type = searchParams.get("type") || ""; // 'reset' or 'signin'

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
        navigate(`/reset-password?identifier=${encodeURIComponent(identifier)}`); // Redirect to ResetPassword
      } else if (type === "signin") {
        console.log("Sign-in successful with OTP for:", identifier);
        navigate("/"); // Redirect to Home for OTP sign-in
      } else {
        navigate("/"); // Default for new user verification
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Allow only digits, max 6
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
      navigate("/login"); // Redirect to login if no identifier
    }
  }, [identifier, navigate]);

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-12 bg-gray-50 min-h-7">
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
                <div className="mb-6 p-3 bg-red-100 text-red-700 text-sm rounded-md">
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
                    className="w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-white h-[48px] rounded-md font-semibold transition duration-200"
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