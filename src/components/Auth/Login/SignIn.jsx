import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";
import { OTP_TYPES } from "../authApi";

export default function SignIn() {
  const [formData, setFormData] = useState({ password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { identifier, editField, isEmail } = location.state || {};
  const { login, loginWithPhonePassword, sendOTP, loading } = useAuth();

  const isPhoneNumber = (identifier) => /^\+91\d{10}$/.test(identifier);

  // Redirect if identifier missing
  useEffect(() => {
    if (!identifier) {
      navigate("/login", { replace: true });
    }
  }, [identifier, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Handle password login
const handleSignIn = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  if (!formData.password.trim()) {
    setError("Please enter your password");
    setIsLoading(false);
    return;
  }

  try {
    let result;
    if (isEmail) {
      // Email login
      result = await login(identifier, formData.password);
    } else if (isPhoneNumber(identifier)) {
      // Phone password login
      result = await loginWithPhonePassword(identifier, formData.password);
    } else {
      setError("Invalid identifier");
      setIsLoading(false);
      return;
    }

    // In your SignIn component - Update the success navigation part
// In SignIn component - after successful login
if (result.success) {
  if (editField) {
    if (editField === "password") {
      navigate("/reset-password", { 
        state: { 
          identifier,
          userData: user 
        } 
      });
    } else {
      // Navigate back to profile with edit field
      navigate("/profile#profile", { 
        state: { 
          editField: editField,
          isAuthenticated: true,
          message: "Identity verified successfully. You can now update your information." 
        } 
      });
    }
  } else {
    navigate("/", { replace: true });
  }
} else {
      setError(result.error || "Login failed. Please check your credentials.");
    }
  } catch (err) {
    setError("Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  //  Handle OTP Login for phone users
  const handlePhoneOTPLogin = async () => {
    if (!isPhoneNumber(identifier)) {
      setError("Invalid phone number");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const result = await sendOTP(OTP_TYPES.CUSTOMER_LOGIN, identifier);

      if (result.success) {
        navigate("/verify-otp", {
          state: {
            type: OTP_TYPES.CUSTOMER_LOGIN,
            identifier,
            flow: "login",
            receivedOtp: result.otp || result.data?.otp,
            editField,
          },
        });
      } else {
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Header helpers
  const getHeaderIcon = () =>
    editField ? (
      <FaShieldAlt className="w-7 h-7 text-white" />
    ) : (
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    );

  const getHeaderText = () =>
    editField
      ? `Verify Identity to Edit ${editField.charAt(0).toUpperCase() + editField.slice(1)}`
      : "Welcome Back";

  const getSubheaderText = () => {
    if (editField) {
      return "Confirm your password to continue with this sensitive action";
    }
    if (isPhoneNumber(identifier)) {
      return `Choose your preferred login method for ${identifier}`;
    }
    return `Enter your password to continue as ${identifier}`;
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-[89vh] items-center justify-center bg-gray-50 px-4 py-4">
        <div className="w-full max-w-[30rem] p-4 bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                {getHeaderIcon()}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getHeaderText()}
            </h1>
            <p className="text-gray-500 text-sm font-medium">{getSubheaderText()}</p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {error && (
              <div className="flex items-start gap-3 bg-red-50 text-red-700 px-4 py-4 rounded-lg mb-6 border border-red-200">
                <svg
                  className="w-5 h-5 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <span className="text-sm font-medium block">{error}</span>
                </div>
              </div>
            )}

            {/* Password Login Section - Show for both email and phone */}
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading || loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-800 placeholder-gray-400 disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading || loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to={`/forgot-password?identifier=${encodeURIComponent(identifier || "")}`}
                  className="text-sm text-gray-900 font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading || loading || !formData.password.trim()}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 disabled:cursor-not-allowed"
              >
                {(isLoading || loading) ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    {editField ? "Verifying..." : "Signing In..."}
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="w-4 h-4" />
                    {editField ? "Verify & Continue" : "Sign In with Password"}
                  </>
                )}
              </button>
            </form>

            {/* OTP Login Section - Only show for phone users */}
            {identifier && isPhoneNumber(identifier) && (
              <>
                <div className="relative my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-3 text-sm text-gray-500 bg-white px-2">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  onClick={handlePhoneOTPLogin}
                  disabled={isLoading || loading}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2ZM20 20H4V4H20V20ZM6 8H14C14.55 8 15 8.45 15 9C15 9.55 14.55 10 14 10H6C5.45 10 5 9.55 5 9C5 8.45 5.45 8 6 8ZM6 12H14C14.55 12 15 12.45 15 13C15 13.55 14.55 14 14 14H6C5.45 14 5 13.55 5 13C5 12.45 5.45 12 6 12ZM6 16H14C14.55 16 15 16.45 15 17C15 17.55 14.55 18 14 18H6C5.45 18 5 17.55 5 17C5 16.45 5.45 16 6 16Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    Sign in with OTP
                  </span>
                </button>
              </>
            )}

            {/* Back link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Not {identifier || "you"}?{" "}
                <Link
                  to="/login"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  Use different account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}