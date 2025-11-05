import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Layout from "../../Partials/Layout";

export default function Signup() {
  const [checked, setValue] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    fname: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    fname: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state?.identifier) {
      const phoneMatch = state.identifier.match(/^\+91(\d{10})$/);
      if (phoneMatch) {
        setFormData((prev) => ({ ...prev, phone: phoneMatch[1] }));
      }
    }
  }, [state]);

  const rememberMe = () => {
    setValue(!checked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({ ...formData, [name]: newValue });

    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;
      setErrors({
        ...errors,
        phone: phoneRegex.test(newValue) ? "" : "Mobile number must be 10 digits.",
      });
    }
    if (name === "password") {
      setErrors({
        ...errors,
        password: newValue.length < 6 ? "Password must be at least 6 characters" : "",
      });
    }
    if (name === "fname") {
      setErrors({
        ...errors,
        fname: newValue.trim() === "" ? "Name is required" : "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.phone && !errors.password && !errors.fname && formData.fname.trim()) {
      const identifier = `+91${formData.phone}`;
      const userData = {
        phone: identifier,
        name: formData.fname,
        password: formData.password,
        email: "",
      };
      console.log("Account created with:", userData);
      navigate(`/verify-otp?identifier=${encodeURIComponent(identifier)}`, { state: { userData } });
    } else {
      console.log("Form has errors");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-[33rem] mb-20 max-w-lg mt-18 sm:max-w-xl bg-white shadow-lg rounded-2xl p-8 sm:p-10 lg:p-12">

          {/* Header Section */}
          <div className="px-8 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black-900 to-black-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-9 h-9 text-white-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-black-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-center text-black-300 mt-2 text-sm font-medium">
              Join us and start your journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">
                  +91
                </span>
                <input
                  placeholder="Enter 10-digit mobile number"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-14 pr-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                placeholder="Enter your full name"
                name="fname"
                type="text"
                value={formData.fname}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              />
              {errors.fname && <p className="text-red-600 text-sm mt-2">{errors.fname}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  placeholder="Your Password Here"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={errors.phone || errors.password || errors.fname || !formData.fname.trim()}
            >
              Verify Mobile Number
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gray-900 font-semibold hover:underline hover:text-gray-700 transition"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
