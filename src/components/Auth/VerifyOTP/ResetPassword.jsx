import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../../Partials/Layout";

export default function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier, userData, fromForgotPassword } = location.state || {};

  // Validate password (at least 8 characters)
  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  // Handle setting new password
  const handleSetPassword = (e) => {
    e.preventDefault();
    setError("");

    // Validate current password if not from forgot password flow
    if (!fromForgotPassword && currentPassword !== userData.password) {
      setError("Current password is incorrect.");
      return;
    }

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
    if (name === "currentPassword") setCurrentPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    setError("");
  };

  // Toggle visibility for passwords
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (!identifier || (!fromForgotPassword && !userData)) {
      navigate("/login"); // Redirect to login if no identifier or userData (when required)
    }
  }, [identifier, userData, fromForgotPassword, navigate]);

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-7">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-center">
            <div className="lg:w-[480px] w-full bg-white p-12 rounded-xl shadow-lg border border-gray-100">
              <div className="title-area text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500 mt-3 font-medium">
                  Set a new password for {identifier}
                </p>
              </div>

              {error && (
                <div
                  className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"
                  aria-live="polite"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {!fromForgotPassword && (
                  <div className="relative">
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      placeholder="Enter current password"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full h-[50px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-200 text-gray-900 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={toggleCurrentPasswordVisibility}
                      className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    >
                      {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                )}
                <div className="relative">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full h-[50px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-200 text-gray-900 placeholder-gray-400"
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
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full h-[50px] px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-200 text-gray-900 placeholder-gray-400"
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
                  className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-white h-[50px] rounded-lg font-semibold tracking-wide transition duration-200"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}