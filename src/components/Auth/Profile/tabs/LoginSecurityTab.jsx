import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginSecurityTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({
    name: "admin",
    email: "admin@gmail.com",
    phone: "+919952699123",
    password: "admin@123", // Actual password for simulation
  });
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState("");

  // Check for state from SignIn or ResetPassword after authentication
  useEffect(() => {
    if (location.state?.isAuthenticated && location.state?.editField && location.state?.editField !== "password") {
      setEditField(location.state.editField);
      setNewValue(userData[location.state.editField]);
      navigate("/profile#profile", { replace: true, state: {} });
    }
    // Update userData if password was changed in ResetPassword
    if (location.state?.newPassword) {
      setUserData((prev) => ({
        ...prev,
        password: location.state.newPassword,
      }));
      navigate("/profile#profile", { replace: true, state: {} });
    }
  }, [location.state, location.hash, navigate, userData]);

  const handleEdit = (field) => {
    // Navigate to SignIn for authentication
    navigate("/signin", {
      state: {
        identifier: userData.email,
        editField: field,
        userData,
      },
    });
  };

  const handleSave = () => {
    if (!newValue.trim()) {
      setError(`Please enter a valid ${editField}.`);
      return;
    }
    // Additional validation for specific fields
    if (editField === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newValue)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    if (editField === "phone") {
      const phoneRegex = /^\+91\d{10}$/;
      if (!phoneRegex.test(newValue)) {
        setError("Please enter a valid phone number (e.g., +91XXXXXXXXXX).");
        return;
      }
    }
    setUserData((prev) => ({
      ...prev,
      [editField]: newValue,
    }));
    setEditField(null);
    setNewValue("");
    setError("");
  };

  const handleCancel = () => {
    setEditField(null);
    setNewValue("");
    setError("");
  };

  const securityItems = [
    {
      field: "name",
      label: "Name",
      value: userData.name,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      field: "email",
      label: "Email Address",
      value: userData.email,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      field: "phone",
      label: "Phone Number",
      value: userData.phone,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      field: "password",
      label: "Password",
      value: "********",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div id="profile" className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black-900 mb-2">Login & Security</h2>
        <p className="text-black-300 text-sm">Manage your account credentials and security settings</p>
      </div>

      {/* Security Items Grid */}
      <div className="grid gap-4">
        {securityItems.map((item) => (
          <div
            key={item.field}
            className={`bg-white-50 border-2 border-white-500 rounded-lg p-6 ${
              editField === item.field ? "" : "hover:border-black-500"
            } transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 bg-white-400 rounded-lg flex items-center justify-center text-black-300 ${
                    editField === item.field ? "" : "group-hover:bg-black-900 group-hover:text-white-50"
                  } transition-all duration-300`}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold text-black-300 mb-1.5 uppercase tracking-wider">
                    {item.label}
                  </label>
                  {editField === item.field ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type={item.field === "email" ? "email" : "text"}
                        value={newValue}
                        onChange={(e) => {
                          setNewValue(e.target.value);
                          setError("");
                        }}
                        className="w-full h-[50px] px-4 py-3 border border-white-500 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none transition duration-200 text-black-900 placeholder-black-200"
                        placeholder={`Enter new ${item.label.toLowerCase()}`}
                      />
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-black-900 text-white-50 rounded-lg font-medium text-sm hover:bg-black-700 transition-all duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border-2 border-white-500 text-black-900 rounded-lg font-medium text-sm hover:border-black-900 hover:bg-black-900 hover:text-white-50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-base font-medium text-black-900 truncate">{item.value}</p>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {!editField && (
                <button
                  type="button"
                  onClick={() => handleEdit(item.field)}
                  className="ml-4 px-5 py-2 border-2 border-white-500 text-black-900 rounded-lg font-medium text-sm hover:border-black-900 hover:bg-black-900 hover:text-white-50 transition-all duration-300 group"
                >
                  Edit
                </button>
              )}
            </div>
            {editField === item.field && error && (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}