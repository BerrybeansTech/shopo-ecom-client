import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../Partials/Layout";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prefilled = searchParams.get("identifier") || "";
  const { userData } = location.state || {};

  useEffect(() => {
    setIdentifier(prefilled);
  }, [prefilled]);

  // Validate identifier
  const isValidIdentifier = (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+91\d{10}$/;
    return emailRegex.test(identifier) || phoneRegex.test(identifier);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!identifier) {
      setError("Please enter an email or mobile number.");
      return;
    }
    if (!isValidIdentifier(identifier)) {
      setError("Invalid email or mobile number. Phone number must start with +91 and have 10 digits.");
      return;
    }
    // Simulate sending OTP
    console.log("Sending OTP to:", identifier);
    navigate(`/verify-otp?identifier=${encodeURIComponent(identifier)}&type=reset`, {
      state: { userData },
    });
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-7">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-center">
            <div className="lg:w-[480px] w-full bg-white p-12 rounded-xl shadow-lg border border-gray-100">
              <div className="title-area text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Password Assistance
                </h1>
                <p className="text-sm text-gray-500 mt-3 font-medium">
                  Enter your email or mobile number to reset your password
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2" aria-live="polite">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleContinue} className="space-y-6">
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email or Mobile Number
                  </label>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (/^\d/.test(value) || value.startsWith("+91")) {
                        value = value.replace(/\D/g, "");
                        if (value.length > 10) value = value.slice(0, 10);
                        value = `+91${value}`;
                      }
                      setIdentifier(value);
                      setError("");
                    }}
                    placeholder="Enter email or mobile number"
                    className="w-full h-[50px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-white h-[50px] rounded-lg font-semibold tracking-wide transition duration-200"
                >
                  Continue
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Remember your password?{" "}
                  <Link
                    to="/signin"
                    state={{ identifier, userData }}
                    className="text-[#FF9900] hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}