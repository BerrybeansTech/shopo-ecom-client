import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";
import { OTP_TYPES } from "../authApi";

export default function ForgotPassword() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prefilled = searchParams.get("identifier") || "";
  const { userData } = location.state || {};
  const { sendOTP, checkUserExists } = useAuth();

  useEffect(() => {
    // Only set mobile number if it's a valid phone number
    if (prefilled && prefilled.startsWith("+91")) {
      const phoneMatch = prefilled.match(/^\+91(\d{10})$/);
      if (phoneMatch) {
        setMobileNumber(phoneMatch[1]);
      }
    }
  }, [prefilled]);

  // Validate mobile number (exactly 10 digits)
  const isValidMobileNumber = (mobile) => {
    return /^\d{10}$/.test(mobile);
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");

    if (!mobileNumber) {
      setError("Please enter your mobile number.");
      return;
    }
    
    if (!isValidMobileNumber(mobileNumber)) {
      setError("Invalid mobile number. Please enter a valid 10-digit mobile number.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const identifier = `+91${mobileNumber}`;
      
      // First check if user exists
      const checkResult = await checkUserExists(identifier);
      
      if (!checkResult.exists) {
        setError("No account found with this mobile number. Please sign up first.");
        setIsLoading(false);
        return;
      }

      const result = await sendOTP(OTP_TYPES.PASSWORD_RESET, identifier);

      if (result.success) {
        navigate(`/verify-otp`, {
          state: {
            identifier,
            type: OTP_TYPES.PASSWORD_RESET,
            flow: "reset",
            receivedOtp: result.otp || result.data?.otp,
            userData
          },
          replace: true
        });
      } else {
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mobile number input with formatting
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    setError("");
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-[82vh] items-center justify-center bg-white px-4 py-8">
        <div className="lg:w-[480px] w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-300">
          
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
              Password Assistance
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your mobile number to receive OTP and reset your password
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-3 border border-red-200">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium">+91</span>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="text"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="Enter 10-digit mobile number"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500 disabled:bg-gray-50"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send a 6-digit OTP to this mobile number
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !mobileNumber || mobileNumber.length !== 10}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/signin"
                state={{ identifier: mobileNumber ? `+91${mobileNumber}` : "", userData }}
                className="text-black font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}