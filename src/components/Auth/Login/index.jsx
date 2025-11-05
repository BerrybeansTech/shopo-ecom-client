import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Partials/Layout";

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    let value = e.target.value.trim();

    // If input looks like an email, keep it as-is
    if (value.includes("@")) {
      setFormData({ identifier: value });
      setError("");
      return;
    }

    // Handle phone numbers
    // Add +91 only once
    if (/^\d/.test(value) && !value.startsWith("+91")) {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      value = digits.length > 0 ? `+91${digits}` : "";
    } else if (value.startsWith("+91")) {
      // Keep +91 and only allow 10 digits after it
      const digits = value.replace(/\D/g, "").slice(2, 12);
      value = `+91${digits}`;
    }

    setFormData({ identifier: value });
    setError("");
  };

  const isValidIdentifier = (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+91\d{10}$/;
    return emailRegex.test(identifier) || phoneRegex.test(identifier);
  };

  const isExistingAccount = (identifier) => {
    const existingAccounts = [
      { identifier: "admin@gmail.com", password: "admin@123" },
      { identifier: "+919952699123", password: "password123" },
    ];
    return existingAccounts.find((account) => account.identifier === identifier);
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.identifier) {
        setError("Please enter an email or mobile number.");
        return;
      }
      if (!isValidIdentifier(formData.identifier)) {
        setError("Invalid email or mobile number. Phone number must start with +91 and have 10 digits.");
        return;
      }

      const account = isExistingAccount(formData.identifier);
      if (account) {
        navigate("/signin", {
          state: {
            identifier: formData.identifier,
            userData: {
              email: formData.identifier.includes("@") ? formData.identifier : "",
              phone: formData.identifier.includes("+91") ? formData.identifier : "",
              password: account.password,
              name: "Shuvo Khan",
            },
          },
        });
      } else {
        navigate("/signup", { state: { identifier: formData.identifier } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-[32rem] max-w-lg sm:max-w-xl bg-white shadow-lg rounded-2xl p-8 sm:p-10 lg:p-12">

          {/* Header */}
          <div className="px-8 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black-900 to-black-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-9 h-9 text-white-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-black-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-center text-black-300 mt-2 text-sm font-medium">
              Sign in to continue to your account
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
                disabled={isLoading}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 
                          0 0 5.373 0 12h4zm2 5.291A7.962 
                          7.962 0 014 12H0c0 3.042 1.135 
                          5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-sm text-gray-500 bg-white px-2">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            aria-label="Sign in with Google"
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-60"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                       1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                       3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.31 
                       1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 
                       20.36 7.77 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                       8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 
                       1 12 1 7.77 1 4.01 3.64 2.18 7.07l3.66 
                       2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="ml-3 text-gray-700 font-medium text-sm sm:text-base">
              Sign in with Google
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-gray-900 font-semibold hover:underline hover:text-gray-700 transition"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
