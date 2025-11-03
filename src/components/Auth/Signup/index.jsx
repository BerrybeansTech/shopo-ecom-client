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
      if (!phoneRegex.test(newValue)) {
        setErrors({ ...errors, phone: "Mobile number must be 10 digits." });
      } else {
        setErrors({ ...errors, phone: "" });
      }
    }
    if (name === "password") {
      if (newValue.length < 6) {
        setErrors({ ...errors, password: "Password must be at least 6 characters" });
      } else {
        setErrors({ ...errors, password: "" });
      }
    }
    if (name === "fname") {
      if (newValue.trim() === "") {
        setErrors({ ...errors, fname: "Name is required" });
      } else {
        setErrors({ ...errors, fname: "" });
      }
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
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
        <div className="w-full max-w-[35rem] bg-white shadow-2xl rounded-3xl p-10 border border-gray-300">
          
          {/* Header Section with Avatar Icon */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
            </div>
            <h1 className="text-3xl font-bold text-black mb-3">
              Create Account
            </h1>
            <div className="w-40 mx-auto mt-3">
              <svg viewBox="0 0 354 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 28.8027C17.6508 20.3626 63.9476 8.17089 113.509 17.8802C166.729 28.3062 341.329 42.704 353 1"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">+91</span>
                <input
                  placeholder="Enter 10-digit mobile number"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-14 pr-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500"
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-sm mt-3 font-medium">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Name
              </label>
              <input
                placeholder="First Name and Last Name"
                name="fname"
                type="text"
                value={formData.fname}
                onChange={handleInputChange}
                className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500"
              />
              {errors.fname && (
                <p className="text-red-600 text-sm mt-3 font-medium">{errors.fname}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  placeholder="Your Password Here"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 pr-12 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-3 font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={errors.phone || errors.password || errors.fname || !formData.fname.trim()}
            >
              Verify mobile number
            </button>

            <div className="text-center pt-4">
              <p className="text-base text-gray-600">
                Already have an Account?{" "}
                <Link to="/login" className="text-black font-bold hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}