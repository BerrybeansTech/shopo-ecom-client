import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier, resetToken, fromForgotPassword } = location.state || {};
  const { resetPassword, updatePassword, user, accessToken } = useAuth();

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPassword(formData.newPassword)) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);

    try {
      let result;
      
      if (fromForgotPassword && resetToken) {
        console.log("Resetting password with:", { identifier, resetToken });
        result = await resetPassword(identifier, formData.newPassword, resetToken);
      } else {
        console.log("Updating password for user:", user?.id);
        result = await updatePassword(user, formData.newPassword, accessToken);
      }

      console.log("Password update result:", result);

      // In your ResetPassword component - Update the success navigation
if (result.success) {
  const redirectPath = fromForgotPassword ? "/login" : "/profile#profile";
  navigate(redirectPath, {
    state: { 
      message: "Password updated successfully",
      fromPasswordReset: true
    },
    replace: true
  });
} else {
        if (result.error?.includes("Internal server error")) {
          setError("Server error. Please try again later or contact support.");
        } else if (result.error?.includes("expired") || result.error?.includes("invalid")) {
          setError("Reset token has expired. Please request a new password reset.");
        } else {
          setError(result.error || "Password update failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Password update failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleRequestNewReset = () => {
    navigate("/forgot-password", {
      state: { identifier }
    });
  };

  useEffect(() => {
    if (!identifier && !user && fromForgotPassword) {
      navigate("/login");
    }
  }, [identifier, user, navigate, fromForgotPassword]);

  const getHeaderText = () => {
    return fromForgotPassword ? "Reset Password" : "Change Password";
  };

  const getSubheaderText = () => {
    return fromForgotPassword 
      ? `Set a new password for ${identifier}`
      : "Enter your new password";
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-[90vh] items-center justify-center bg-white px-4 py-8">
        <div className="lg:w-[480px] w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-300">
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              {getHeaderText()}
            </h1>
            <p className="text-gray-600 text-sm">
              {getSubheaderText()}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-3 border border-red-200">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <span className="block">{error}</span>
                {error.includes("expired") && fromForgotPassword && (
                  <button
                    onClick={handleRequestNewReset}
                    className="mt-2 text-sm text-red-700 underline hover:no-underline font-medium"
                  >
                    Request new password reset
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSetPassword} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                placeholder="Enter new password (min. 6 characters)"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handlePasswordChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500 pr-12 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                disabled={isLoading}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                placeholder="Confirm new password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500 pr-12 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {fromForgotPassword && (
              <button
                onClick={handleBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}