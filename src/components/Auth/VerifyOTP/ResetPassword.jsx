import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../../Partials/Layout";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier, fromForgotPassword } = location.state || {};

  // Validate password (at least 8 characters)
  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  // Handle setting new password
  const handleSetPassword = (e) => {
    e.preventDefault();
    setError("");

    // Validate new password
    if (!isValidPassword(newPassword)) {
      setError("New password must be at least 8 characters.");
      return;
    }

    // Validate confirm password
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // Simulate password update (replace with API call in production)
    console.log("Password updated for:", identifier, "with new password:", newPassword);
    const redirectPath = fromForgotPassword ? "/" : "/profile#profile";
    navigate(redirectPath, {
      state: { newPassword },
    });
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    setError("");
  };

  // Toggle visibility for passwords
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (!identifier) {
      navigate("/login"); // Redirect to login if no identifier
    }
  }, [identifier, navigate]);

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-[90vh] items-center justify-center bg-white px-4 py-8">
        <div className="lg:w-[480px] w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-300">
          
          {/* Header Section with Avatar Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm">
              Set a new password for {identifier}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gray-50 text-gray-800 text-sm rounded-lg flex items-center gap-3 border border-gray-300">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                placeholder="Enter new password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500 pr-12"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                value={confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500 pr-12"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}