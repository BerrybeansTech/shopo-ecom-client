import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Partials/Layout";

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    let value = e.target.value;

    // If user types a number and input doesn't start with +91, add +91
    if (/^\d/.test(value) && !value.startsWith("+91 ")) {
      value = "+91 " + value;
    }

    // Ensure it always starts with "+91 " if user deletes
    if (value.startsWith("+91")) {
      // Remove any non-digit after +91 and space
      let digits = value.slice(4).replace(/\D/g, "");
      if (digits.length > 10) digits = digits.slice(0, 10);
      value = "+91 " + digits;
    }

    setFormData({ identifier: value });
    setError("");
  };

  const isValidIdentifier = (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+91 \d{10}$/;
    return emailRegex.test(identifier) || phoneRegex.test(identifier);
  };

  const isExistingAccount = (identifier) => {
    const existingIdentifiers = ["+91 9952699123", "admin@gmail.com"];
    return existingIdentifiers.includes(identifier);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!formData.identifier) {
      setError("Please enter an email or mobile number.");
      return;
    }
    if (!isValidIdentifier(formData.identifier)) {
      setError("Invalid email or mobile number. Phone number must start with +91 and have 10 digits.");
      return;
    }
    if (isExistingAccount(formData.identifier)) {
      navigate("/signin", { state: { identifier: formData.identifier } });
    } else {
      navigate("/signup", { state: { identifier: formData.identifier } });
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-8">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-center">
            <div className="lg:w-[480px] w-full bg-white p-12 rounded-xl shadow-lg border border-gray-100">
              <div className="title-area text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Sign in or create account
                </h1>
                <p className="text-sm text-gray-500 mt-3 font-medium">
                  Enter your email or mobile number to continue
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
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number or Email
                  </label>
                  <input
                    id="identifier"
                    placeholder="Enter mobile number or email"
                    name="identifier"
                    type="text"
                    value={formData.identifier}
                    onChange={handleInputChange}
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

              <div className="my-8 flex items-center">
                <hr className="flex-grow border-t border-gray-200" />
                <span className="px-4 text-sm text-gray-500 font-medium">or</span>
                <hr className="flex-grow border-t border-gray-200" />
              </div>

              <div className="text-center">
                <a href="#" aria-label="Sign in with Google" className="w-full flex items-center justify-center space-x-3 h-[50px] border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.31 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.36 7.77 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.64 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-base text-gray-700 font-medium">Sign in with Google</span>
                </a>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="text-[#FF9900] hover:underline font-medium">
                    Sign up free
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