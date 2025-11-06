import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({ password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { identifier, editField, isEmail } = location.state || {};
  const { login, loading } = useAuth();

  const isPhoneNumber = (identifier) => /^\+91\d{10}$/.test(identifier);

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

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.password.trim()) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      // For email login
      if (isEmail) {
        const result = await login(identifier, formData.password);
        
        if (result.success) {
          if (editField) {
            if (editField === "password") {
              navigate("/reset-password", { state: { identifier } });
            } else {
              navigate("/profile#profile", {
                state: { editField },
              });
            }
          } else {
            navigate("/");
          }
        } else {
          setError(result.error || "Login failed. Please try again.");
        }
      } else {
        // For phone login - you can implement phone-based login here
        setError("Phone login not implemented yet");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderIcon = () => {
    if (editField) {
      return <FaShieldAlt className="w-7 h-7 text-white" />;
    }
    return (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    );
  };

  const getHeaderText = () => {
    if (editField) {
      return `Verify Identity to Edit ${editField.charAt(0).toUpperCase() + editField.slice(1)}`;
    }
    return "Welcome Back";
  };

  const getSubheaderText = () => {
    if (editField) {
      return "Confirm your password to continue with this sensitive action";
    }
    return `Enter your password to continue as ${identifier}`;
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-[89vh] items-center justify-center bg-gray-50 px-4 py-4">
        <div className="w-full max-w-[30rem] p-4 bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          
          {/* Header Section - Matching Login Component */}
          <div className="px-8 py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-black-900 to-black-700 rounded-2xl flex items-center justify-center shadow-lg">
                {getHeaderIcon()}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black-900 tracking-tight mb-2">
              {getHeaderText()}
            </h1>
            <p className="text-black-300 text-sm font-medium leading-relaxed">
              {getSubheaderText()}
            </p>
          </div>

          {/* Content Section */}
          <div className="px-8 pb-8">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 text-red-700 px-4 py-4 rounded-lg mb-6 border border-red-200">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-sm font-medium block">{error}</span>
                  {error.includes("Invalid password") && (
                    <span className="text-xs text-red-600 mt-1 block">
                      Make sure you're using the correct password
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading || loading}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none text-gray-800 placeholder-gray-400 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading || loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  to={`/forgot-password?identifier=${encodeURIComponent(identifier || "")}`}
                  className="text-sm text-gray-900 font-semibold hover:underline hover:text-gray-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading || loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {(isLoading || loading) ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editField ? "Verifying..." : "Signing In..."}
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="w-4 h-4" />
                    {editField ? "Verify & Continue" : "Sign In to Account"}
                  </>
                )}
              </button>
            </form>

            {/* OTP Section for Phone Numbers */}
            {identifier && isPhoneNumber(identifier) && (
              <>
                <div className="relative my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-3 text-sm text-gray-500 bg-white px-2">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <Link
                  to={`/verify-otp?identifier=${encodeURIComponent(identifier)}&type=signin`}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  aria-label="Sign in with OTP"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2ZM20 20H4V4H20V20ZM6 8H14C14.55 8 15 8.45 15 9C15 9.55 14.55 10 14 10H6C5.45 10 5 9.55 5 9C5 8.45 5.45 8 6 8ZM6 12H14C14.55 12 15 12.45 15 13C15 13.55 14.55 14 14 14H6C5.45 14 5 13.55 5 13C5 12.45 5.45 12 6 12ZM6 16H14C14.55 16 15 16.45 15 17C15 17.55 14.55 18 14 18H6C5.45 18 5 17.55 5 17C5 16.45 5.45 16 6 16Z" fill="currentColor" />
                  </svg>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    Get an OTP on your phone
                  </span>
                </Link>
              </>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Not {identifier || "you"}?{" "}
                <Link
                  to="/login"
                  className="text-gray-900 font-semibold hover:underline hover:text-gray-700 transition-colors"
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