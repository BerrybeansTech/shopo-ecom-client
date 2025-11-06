import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";
import { OTP_TYPES } from "../authApi";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { verifyOTP, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const identifier = searchParams.get("identifier") || "";
  const type = searchParams.get("type") || "";
  
  const { flow, receivedOtp: locationOtp } = location.state || {};

  useEffect(() => {
    if (!identifier) {
      navigate("/login");
      return;
    }

    // Set the OTP that was received from the API (for testing)
    if (locationOtp) {
      setReceivedOtp(locationOtp);
    }
  }, [identifier, navigate, locationOtp]);

  // Validate OTP (exactly 6 digits)
  const isValidOTP = (otp) => {
    return /^\d{6}$/.test(otp);
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!isValidOTP(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Determine OTP type based on flow
      const otpType = flow === "signup" ? OTP_TYPES.CUSTOMER_REGISTRATION : 
                     type === "reset" ? OTP_TYPES.PASSWORD_RESET : 
                     OTP_TYPES.CUSTOMER_REGISTRATION;

      const result = await verifyOTP(otpType, identifier.replace('+91', ''), otp);
      
      if (result.success) {
        // Handle different flows after successful OTP verification
        if (flow === "signup") {
          // Complete registration
          await handleRegistration(result.data.resetToken);
        } else if (type === "reset") {
          // Navigate to reset password
          navigate(`/reset-password`, { 
            state: { 
              identifier, 
              resetToken: result.data.resetToken,
              fromForgotPassword: true 
            } 
          });
        } else if (type === "signin") {
          // Handle phone login (you might need to implement this)
          navigate("/");
        } else {
          // Default navigation after verification
          navigate("/");
        }
      } else {
        setError(result.error || "OTP verification failed.");
      }
    } catch (error) {
      setError("An error occurred during OTP verification.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration after OTP verification
  const handleRegistration = async (resetToken) => {
    try {
      // Get user data from sessionStorage
      const pendingRegistration = sessionStorage.getItem('pendingRegistration');
      
      if (!pendingRegistration) {
        setError("Registration data not found. Please try signing up again.");
        return;
      }

      const userData = JSON.parse(pendingRegistration);
      
      // Prepare customer data for registration
      const customerData = {
        otpToken: resetToken,
        name: userData.name,
        email: userData.email,
        phone: userData.phone.replace('+91', ''),
        password: userData.password,
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        country: userData.country || "India",
        postalCode: userData.postalCode || ""
      };

      const result = await register(customerData);
      
      if (result.success) {
        // Clear pending registration data
        sessionStorage.removeItem('pendingRegistration');
        // Navigate to home page
        navigate("/");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
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
    handleVerifyOTP();
  };

  // Auto-fill OTP for testing (remove in production)
  const handleAutoFill = () => {
    if (receivedOtp) {
      setOtp(receivedOtp);
      setError("");
    }
  };

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
            
            {/* Development Mode - Show OTP for testing */}
            {receivedOtp && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  🚨 Development Mode: OTP not sent via SMS
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Use this OTP: <span className="font-bold">{receivedOtp}</span>
                </p>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="mt-2 text-sm text-yellow-800 underline hover:no-underline"
                >
                  Click to auto-fill OTP
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-3 border border-red-200">
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
                disabled={isLoading || loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || loading || otp.length !== 6}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {(isLoading || loading) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          {/* Resend OTP option */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive OTP?{" "}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-black font-semibold hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}