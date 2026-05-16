import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";
import { OTP_TYPES } from "../authApi";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [formData, setFormData] = useState({
    phone: "",
    fname: "",
    password: "",
    email: ""
  });
  const [errors, setErrors] = useState({
    phone: "",
    fname: "",
    password: "",
    email: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { sendOTP, loading, error, clearError, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state?.identifier) {
      const phoneMatch = state.identifier.match(/^\+91(\d{10})$/);
      if (phoneMatch) {
        setFormData((prev) => ({ ...prev, phone: phoneMatch[1] }));
      }
    }
    clearError();
  }, [state, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let fieldError = "";

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
      const phoneRegex = /^\d{10}$/;
      if (!newValue) {
        fieldError = "Mobile number is required.";
      } else if (!phoneRegex.test(newValue)) {
        fieldError = "Mobile number must be 10 digits.";
      }
    }

    if (name === "password") {
      if (!newValue) {
        fieldError = "Password is required.";
      } else if (newValue.length < 6) {
        fieldError = "Password must be at least 6 characters.";
      }
    }

    if (name === "fname") {
      // Only letters and spaces allowed
      newValue = value.replace(/[^a-zA-Z\s]/g, "");
      if (newValue.trim() === "") {
        fieldError = "Full name is required.";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!newValue) {
        fieldError = "Email address is required.";
      } else if (!emailRegex.test(newValue)) {
        fieldError = "Please enter a valid email address.";
      }
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: fieldError }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (errors.phone || errors.password || errors.fname || errors.email || 
        !formData.fname.trim() || !formData.email.trim()) {
      return;
    }

    try {
      // Send OTP for registration
      const result = await sendOTP(OTP_TYPES.CUSTOMER_REGISTRATION, formData.phone);
      
      if (result.success) {
        // Store user data temporarily for registration after OTP verification
        const userData = {
          phone: `+91${formData.phone}`,
          name: formData.fname,
          email: formData.email,
          password: formData.password
        };

        // Store in sessionStorage for use in VerifyOTP component
        sessionStorage.setItem('pendingRegistration', JSON.stringify(userData));
        
        navigate(`/verify-otp?identifier=${encodeURIComponent(`+91${formData.phone}`)}`, { 
          state: { 
            type: OTP_TYPES.CUSTOMER_REGISTRATION, 
            identifier: `+91${formData.phone}`,
            flow: "signup",
            // Pass the OTP received from API to display to user
            receivedOtp: result.data.otp
          } 
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const onGoogleError = () => {
    console.error("Google login error");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return !errors.phone && 
           !errors.password && 
           !errors.fname && 
           !errors.email && 
           formData.fname.trim() && 
           formData.email.trim() &&
           formData.phone.length === 10 &&
           formData.password.length >= 6;
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-[33rem] mb-20 max-w-lg mt-18 sm:max-w-xl bg-white shadow-lg rounded-2xl p-8 sm:p-10 lg:p-12">

          {/* Header Section */}
          <div className="px-8 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black-900 to-black-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-9 h-9 text-white-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-black-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-center text-black-300 mt-2 text-sm font-medium">
              Join us and start your journey today
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-md mb-5 border border-red-200">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${errors.phone ? "text-red-500" : "text-gray-700"}`}>
                  +91
                </span>
                <input
                  placeholder="Enter 10-digit mobile number"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-14 pr-4 py-3 rounded-lg border transition duration-200 text-sm sm:text-base ${
                    errors.phone 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900" 
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-gray-800"
                  } focus:ring-1 placeholder-gray-400`}
                />
              </div>
              {errors.phone && <p className="text-red-600 text-[11px] font-medium mt-1 ml-1">{errors.phone}</p>}
            </div>
 
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                placeholder="Enter your full name"
                name="fname"
                type="text"
                value={formData.fname}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition duration-200 text-sm sm:text-base ${
                  errors.fname 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900" 
                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-gray-800"
                } focus:ring-1 placeholder-gray-400`}
              />
              {errors.fname && <p className="text-red-600 text-[11px] font-medium mt-1 ml-1">{errors.fname}</p>}
            </div>
 
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                placeholder="Enter your email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition duration-200 text-sm sm:text-base ${
                  errors.email 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900" 
                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-gray-800"
                } focus:ring-1 placeholder-gray-400`}
              />
              {errors.email && <p className="text-red-600 text-[11px] font-medium mt-1 ml-1">{errors.email}</p>}
            </div>
 
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  placeholder="Your Password Here"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border transition duration-200 text-sm sm:text-base ${
                    errors.password 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900" 
                      : "border-gray-300 focus:border-gray-900 focus:ring-gray-900 text-gray-800"
                  } focus:ring-1 placeholder-gray-400`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-[11px] font-medium mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Optional Fields (can be collapsed or shown in profile later) */}
            {/* <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  placeholder="Enter your address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    placeholder="City"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    placeholder="State"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    placeholder="Country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    placeholder="Postal Code"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
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
                "Verify Mobile Number"
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gray-900 font-semibold hover:underline hover:text-gray-700 transition"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500 bg-white px-2">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign-in Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}