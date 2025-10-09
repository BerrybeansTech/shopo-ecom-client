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
  const searchParams = new URLSearchParams(location.search);
  const identifier = searchParams.get("identifier") || "";

  // Validate password (at least 6 characters)
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  // Handle setting new password
  const handleSetPassword = (e) => {
    e.preventDefault();
    if (!isValidPassword(newPassword)) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    console.log("Password reset for:", identifier, "with new password:", newPassword);
    navigate("/"); // Redirect to Home after password reset
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    setError("");
  };

  // Toggle visibility for new password
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  // Toggle visibility for confirm password
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
      <div className="login-page-wrapper w-full py-12 bg-gray-50 min-h-7">
        <div className="container-x mx-auto">
          <div className="flex items-center justify-center">
            <div className="lg:w-[450px] w-full bg-white p-10 rounded-lg shadow-lg border border-gray-100">
              <div className="title-area text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Set New Password
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Set a new password for {identifier}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-100 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSetPassword} className="space-y-6">
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
                    className="w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-white h-[48px] rounded-md font-semibold transition duration-200"
                >
                  Save New Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}