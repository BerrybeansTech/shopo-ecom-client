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

  const { identifier, editField, userData } = location.state || {};

  const isPhoneNumber = (identifier) => {
    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(identifier);
  };

  useEffect(() => {
    if (!identifier || !userData) {
      navigate("/login", { replace: true });
    }
  }, [identifier, userData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }
    try {
      if (formData.password === userData.password) {
        if (editField) {
          if (editField === "password") {
            navigate("/reset-password", {
              state: { identifier, userData },
            });
          } else {
            navigate("/profile#profile", {
              state: { isAuthenticated: true, editField, userData },
            });
          }
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid password.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 border border-gray-300">
          
          {/* Header Section with Avatar Icon */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl">
                <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black mb-3">
              {editField ? `Authenticate to Edit ${editField}` : "Sign In"}
            </h1>
            <p className="text-gray-600 text-base">
              Enter your password to {editField ? "edit your profile" : "access your account"}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-gray-50 text-gray-800 text-base rounded-xl flex items-center gap-3 border border-gray-300">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-8">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-900 mb-3"
              >
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
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Link
                to={`/forgot-password?identifier=${encodeURIComponent(identifier || "")}`}
                state={{ userData }}
                className="text-base text-black font-bold hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-base transition"
            >
              {editField ? "Authenticate" : "Sign In"}
            </button>
          </form>

          {identifier && isPhoneNumber(identifier) && (
            <div className="my-10 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-6 text-sm text-gray-500 font-bold">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          )}

          <div className="text-center">
            {identifier && isPhoneNumber(identifier) ? (
              <Link
                to={`/verify-otp?identifier=${encodeURIComponent(identifier)}&type=signin`}
                state={{ userData }}
                className="w-full flex items-center justify-center gap-4 py-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition"
                aria-label="Sign in with OTP"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2ZM20 20H4V4H20V20ZM6 8H14C14.55 8 15 8.45 15 9C15 9.55 14.55 10 14 10H6C5.45 10 5 9.55 5 9C5 8.45 5.45 8 6 8ZM6 12H14C14.55 12 15 12.45 15 13C15 13.55 14.55 14 14 14H6C5.45 14 5 13.55 5 13C5 12.45 5.45 12 6 12ZM6 16H14C14.55 16 15 16.45 15 17C15 17.55 14.55 18 14 18H6C5.45 18 5 17.55 5 17C5 16.45 5.45 16 6 16Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-gray-700 font-bold text-base">
                  Get an OTP on your phone
                </span>
              </Link>
            ) : (
              identifier && (
                <p className="text-base text-gray-600"></p>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}