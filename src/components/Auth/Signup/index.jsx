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

    // Validation
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
      <div className="login-page-wrapper w-full py-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center justify-center relative">
            <div className="lg:w-[572px] w-full bg-white p-12 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
              <div className="w-full max-w-md mx-auto">
                <div className="title-area flex flex-col justify-center items-center relative text-center mb-10">
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Create Account
                  </h1>
                  <div className="shape mt-2">
                    <svg
                      width="354"
                      height="30"
                      viewBox="0 0 354 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 28.8027C17.6508 20.3626 63.9476 8.17089 113.509 17.8802C166.729 28.3062 341.329 42.704 353 1"
                        stroke="#FF9900"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="input-area space-y-7">
                  <div className="w-full">
                    <label className="text-gray-800 text-sm font-bold block mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">+91</span>
                      <input
                        placeholder="Enter 10-digit mobile number"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-[52px] w-full pl-12 pr-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-300 text-gray-900 placeholder-gray-400 shadow-sm"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-2 font-semibold">{errors.phone}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="text-gray-800 text-sm font-bold block mb-2">
                      Name
                    </label>
                    <input
                      placeholder="First Name and Last Name"
                      name="fname"
                      type="text"
                      value={formData.fname}
                      onChange={handleInputChange}
                      className="h-[52px] w-full text-base px-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-300 text-gray-900 placeholder-gray-400 shadow-sm"
                    />
                    {errors.fname && (
                      <p className="text-red-600 text-sm mt-2 font-semibold">{errors.fname}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="text-gray-800 text-sm font-bold block mb-2">
                      Password*
                    </label>
                    <div className="relative w-full">
                      <input
                        placeholder="Your Password Here"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-[52px] w-full text-base px-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-[#FF9900] outline-none transition duration-300 text-gray-900 placeholder-gray-400 pr-12 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 flex items-center justify-center h-full transition duration-200"
                      >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-2 font-semibold">{errors.password}</p>
                    )}
                  </div>
                  <div className="signin-area mb-3">
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="bg-[#FF9900] hover:bg-[#e68a00] text-white h-[52px] w-full rounded-lg font-bold text-base tracking-wide transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={errors.phone || errors.password || errors.fname || !formData.fname.trim()}
                      >
                        <span>Verify mobile number</span>
                      </button>
                    </div>
                  </div>
                  <div className="signup-area flex justify-center">
                    <p className="text-base text-gray-600 font-semibold">
                      Already have an Account?
                      <Link to="/login" className="ml-2 text-[#FF9900] font-extrabold hover:underline hover:text-[#e68a00] transition duration-200">
                        Log In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}