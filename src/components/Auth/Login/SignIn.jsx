import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../../Partials/Layout";

export default function SignIn() {
  const [formData, setFormData] = useState({ password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get identifier from location.state
  const identifier = location.state?.identifier;

  // Check if identifier is a phone number
  const isPhoneNumber = (identifier) => {
    const phoneRegex = /^\+91 \d{10}$/;
    return phoneRegex.test(identifier);
  };

  // Redirect to /login if no identifier is provided
  useEffect(() => {
    if (!identifier) {
      navigate("/login", { replace: true });
    }
  }, [identifier, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }
    try {
      if (formData.password === "password123") {
        console.log("Logging in with:", { identifier, password: formData.password });
        navigate("/");
      } else {
        setError("Invalid password.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-7">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-center">
            <div className="lg:w-[480px] w-full bg-white p-12 rounded-xl shadow-lg border border-gray-100">
              {/* Title */}
              <div className="title-area text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 mt-3 font-medium">
                  Enter your password to access your account
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2" aria-live="polite">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    Signing in as{" "}
                    <span className="font-semibold">{identifier}</span> |{" "}
                    <Link to="/login" className="text-[#FF9900] hover:underline font-medium">
                      Change
                    </Link>
                  </p>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      placeholder="Enter your password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-[50px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-200 text-gray-900 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/forgot-password?identifier=${encodeURIComponent(identifier || "")}`}
                    className="text-sm text-[#FF9900] hover:underline font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-white h-[50px] rounded-lg font-semibold tracking-wide transition duration-200"
                >
                  Sign In
                </button>
              </form>

              {/* Divider */}
              {identifier && isPhoneNumber(identifier) && (
                <div className="my-8 flex items-center">
                  <hr className="flex-grow border-t border-gray-200" />
                  <span className="px-4 text-sm text-gray-500 font-medium">or</span>
                  <hr className="flex-grow border-t border-gray-200" />
                </div>
              )}

              {/* OTP Sign-In */}
              <div className="text-center">
                {identifier && isPhoneNumber(identifier) ? (
                  <Link
                    to={`/verify-otp?identifier=${encodeURIComponent(identifier)}&type=signin`}
                    className="w-full flex items-center justify-center space-x-3 h-[50px] border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
                    aria-label="Sign in with OTP"
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
                        fill="#4B5563"
                      />
                    </svg>
                    <span className="text-base text-gray-700 font-medium">
                      Get an OTP on your phone
                    </span>
                  </Link>
                ) : (
                  identifier && (
                    <p className="text-sm text-gray-600 font-medium">
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}