import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { checkUserExists, loading, isAuthenticated, googleLogin } = useAuth();
  const navigate = useNavigate();

  //  Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  //  Handle input changes
  const handleInputChange = (e) => {
    let value = e.target.value.trim();

    // Email detection
    if (value.includes("@")) {
      setFormData({ identifier: value });
      setError("");
      return;
    }

    // Handle phone number normalization
    if (/^\d/.test(value) && !value.startsWith("+91")) {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      value = digits.length > 0 ? `+91${digits}` : "";
    } else if (value.startsWith("+91")) {
      const digits = value.replace(/\D/g, "").slice(2, 12);
      value = `+91${digits}`;
    }

    setFormData({ identifier: value });
    setError("");
  };

  //  Validation
  const isValidIdentifier = (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+91\d{10}$/;
    return emailRegex.test(identifier) || phoneRegex.test(identifier);
  };

  //  Continue button logic - UPDATED VERSION
  const handleContinue = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.identifier) {
        setError("Please enter an email or mobile number.");
        return;
      }

      if (!isValidIdentifier(formData.identifier)) {
        setError("Invalid email or mobile number. Phone number must start with +91 and have 10 digits.");
        return;
      }

      // Check if user exists
      const checkResult = await checkUserExists(formData.identifier);

      if (!checkResult.success) {
        setError("Unable to verify account. Please try again.");
        return;
      }

      const userExists = checkResult.exists;
      const isEmail = formData.identifier.includes("@");

      if (isEmail) {
        //  Email flow
        if (userExists) {
          // Existing email user → go to signin with password
          navigate("/signin", {
            state: {
              identifier: formData.identifier,
              isEmail: true,
            },
          });
        } else {
          // New email user → go to signup
          navigate("/signup", {
            state: {
              identifier: formData.identifier,
            },
          });
        }
      } else {
        //  Phone number flow - UPDATED
        if (userExists) {
          // Existing phone user → go to signin (user can choose password or OTP)
          navigate("/signin", {
            state: {
              identifier: formData.identifier,
              isEmail: false,
            },
          });
        } else {
          // New phone user → go to signup
          navigate("/signup", {
            state: {
              identifier: formData.identifier,
            },
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Google login failed");
      }
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleError = () => {
    setError("Google Sign-In was unsuccessful. Try again later.");
  };

  // UI
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-[32rem] max-w-lg sm:max-w-xl bg-white shadow-lg rounded-2xl p-8 sm:p-10 lg:p-12">
          {/* Header */}
          <div className="px-8 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black-900 to-black-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-9 h-9 text-white-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
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

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-md mb-5 border border-red-200">
              <svg
                className="w-5 h-5 shrink-0"
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
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number or Email
              </label>
              <input
                id="identifier"
                placeholder="Enter mobile number or email"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleInputChange}
                disabled={isLoading || loading}
                className={`block w-full px-4 py-3 rounded-lg border ${
                   error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                } focus:ring-1 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base`}
              />
              {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {(isLoading || loading) ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </button>
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
              text="continue_with"
              shape="rectangular"
            />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
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