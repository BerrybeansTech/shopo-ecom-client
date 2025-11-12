import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Auth/hooks/useAuth";

export default function LoginSecurityTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, updateProfile, loading, error, clearError } = useAuth();

  const [userData, setUserData] = useState({
    name: "", email: "", phone: "", password: "********",
  });
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone ? `+91${user.phone}` : "",
        password: "********",
      });
    }
  }, [user]);

  // Handle success message & edit field from navigation
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    if (location.state?.editField && location.state?.isAuthenticated && user) {
      setEditField(location.state.editField);
      const val = location.state.editField === 'phone' ? `+91${user.phone}` : user[location.state.editField] || "";
      setNewValue(val);
      navigate("/profile#profile", { replace: true, state: {} });
    }
  }, [location.state, navigate, user]);

  // Handle Edit Click
  const handleEdit = (field) => {
    if (!user) {
      setLocalError("Please log in to edit your information.");
      return;
    }

    setLocalError("");
    setSuccessMessage("");
    clearError();

    if (field === "password") {
      const phone = user.phone ? `+91${user.phone}` : userData.phone;
      navigate("/forgot-password", {
        state: { identifier: phone, isPhone: true }
      });
    } else {
      navigate("/signin", {
        state: {
          identifier: user.email,
          editField: field,
          isEmail: true,
          userData: user,
        },
      });
    }
  };

  // Save name/email/phone
  const handleSave = async () => {
    if (!user) {
      setLocalError("User not available. Please log in.");
      return;
    }

    if (!newValue.trim()) return setLocalError(`Enter valid ${editField}`);
    const validationError = validateField(editField, newValue);
    if (validationError) return setLocalError(validationError);

    setIsLoading(true);
    try {
      const updateData = {
        id: user.id,
        name: editField === 'name' ? newValue.trim() : userData.name,
        email: editField === 'email' ? newValue.trim() : userData.email,
        phone: editField === 'phone' ? newValue.replace('+91', '') : userData.phone.replace('+91', ''),
        password: user.password,
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "India",
        postalCode: user.postalCode || ""
      };

      const result = await updateProfile(updateData, accessToken);
      if (result.success) {
        setUserData(prev => ({ ...prev, [editField]: newValue }));
        setEditField(null);
        setNewValue("");
        setSuccessMessage(`${editField.charAt(0).toUpperCase() + editField.slice(1)} updated!`);
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setLocalError(result.error || "Update failed");
      }
    } catch {
      setLocalError("Update error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (field, value) => {
    if (field === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Invalid email";
    if (field === 'phone') return /^\+91\d{10}$/.test(value) ? null : "Use +91XXXXXXXXXX";
    if (field === 'name') return value.trim().length >= 2 ? null : "Name too short";
    return null;
  };

  const handleCancel = () => {
    setEditField(null);
    setNewValue("");
    setLocalError("");
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
      value: userData.password,
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

  // Show loading state when user data is being fetched
  if (loading) {
    return (
      <div id="profile" className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black-900 mx-auto mb-4"></div>
            <p className="text-black-300">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login message when user is not logged in
  if (!user && !loading) {
    return (
      <div id="profile" className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xl font-medium text-gray-600 mb-2">Login Required</p>
            <p className="text-gray-500 text-sm mb-6">Please log in to view your account information</p>
            <button
              onClick={() => navigate("/signin")}
              className="px-8 py-3 bg-black-900 text-white-50 rounded-lg font-medium text-sm hover:bg-black-700 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="profile" className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black-900 mb-2">Login & Security</h2>
        <p className="text-black-300 text-sm">Manage your account credentials and security settings</p>
      </div>

      {/* Error Message */}
      {(error || localError) && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-3 border border-red-200">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error || localError}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-3 border border-green-200">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

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
                          setLocalError("");
                          clearError();
                        }}
                        disabled={isLoading || loading}
                        className="w-full h-[50px] px-4 py-3 border border-white-500 rounded-lg focus:ring-2 focus:ring-black-900 focus:border-black-900 outline-none transition duration-200 text-black-900 placeholder-black-200 disabled:bg-gray-100"
                        placeholder={`Enter new ${item.label.toLowerCase()}`}
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        disabled={isLoading || loading}
                        className="px-4 py-2 bg-black-900 text-white-50 rounded-lg font-medium text-sm hover:bg-black-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                      >
                        {(isLoading || loading) ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isLoading || loading}
                        className="px-4 py-2 border-2 border-white-500 text-black-900 rounded-lg font-medium text-sm hover:border-black-900 hover:bg-black-900 hover:text-white-50 transition-all duration-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-base font-medium text-black-900 break-words">
                      {item.value || "Not set"}
                    </p>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {!editField && (
                <button
                  type="button"
                  onClick={() => handleEdit(item.field)}
                  disabled={isLoading || loading}
                  className="ml-4 px-5 py-2 border-2 border-white-500 text-black-900 rounded-lg font-medium text-sm hover:border-black-900 hover:bg-black-900 hover:text-white-50 transition-all duration-300 group disabled:opacity-50"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}