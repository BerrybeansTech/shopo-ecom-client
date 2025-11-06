import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../Partials/Layout";
import { useAuth } from "../hooks/useAuth";
import { OTP_TYPES } from "../authApi";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  
  const otpInputRefs = useRef([]);
  const { verifyOTP, register, loginWithPhoneOTP, loading, sendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { type, identifier, flow, receivedOtp: locationOtp, editField, userData } = location.state || {};

  useEffect(() => {
    if (!identifier) {
      navigate("/login");
      return;
    }

    // Set the OTP that was received from the API (for testing)
    if (locationOtp) {
      setReceivedOtp(locationOtp);
    }
  }, [identifier, navigate, locationOtp]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
    setError("");

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // Validate OTP (exactly 6 digits)
  const isValidOTP = (otpValue) => {
    return /^\d{6}$/.test(otpValue);
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    
    const otpValue = otp.join("");
    
    if (!isValidOTP(otpValue)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let result;

      console.log("Verifying OTP:", { type, flow, identifier, otp });

      if (type === OTP_TYPES.CUSTOMER_LOGIN) {
        // Phone OTP login
        result = await loginWithPhoneOTP(identifier, otpValue);
      } else {
        // Other OTP types (registration, password reset)
        const otpType = flow === "signup" ? OTP_TYPES.CUSTOMER_REGISTRATION : 
                       type === "reset" || type === OTP_TYPES.PASSWORD_RESET ? OTP_TYPES.PASSWORD_RESET : 
                       OTP_TYPES.CUSTOMER_REGISTRATION;

        console.log("Using OTP type:", otpType);
        result = await verifyOTP(otpType, identifier, otpValue);
      }
      
      console.log("OTP verification result:", result);
      
      if (result.success) {
        // Handle different flows after successful verification
        if (flow === "signup") {
          // Complete registration
          await handleRegistration(result.data?.resetToken || result.resetToken);
        } else if (type === "reset" || type === OTP_TYPES.PASSWORD_RESET) {
          // Navigate to reset password
          navigate(`/reset-password`, { 
            state: { 
              identifier, 
              resetToken: result.data?.resetToken || result.resetToken,
              fromForgotPassword: true 
            } 
          });
        } else if (type === OTP_TYPES.CUSTOMER_LOGIN) {
          // Phone OTP login successful
          if (editField) {
            navigate("/profile#profile", { state: { editField } });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          // Default navigation after verification
          navigate("/", { replace: true });
        }
      } else {
        // Handle specific error messages
        if (result.error?.includes("expired") || result.error?.includes("not found")) {
          setError("OTP has expired or is invalid. Please request a new OTP.");
        } else {
          setError(result.error || "OTP verification failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("An error occurred during OTP verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration after OTP verification
  const handleRegistration = async (resetToken) => {
    try {
      // Get user data from sessionStorage or location state
      const pendingRegistration = sessionStorage.getItem('pendingRegistration');
      
      let userData;
      if (pendingRegistration) {
        userData = JSON.parse(pendingRegistration);
      } else if (location.state?.userData) {
        userData = location.state.userData;
      } else {
        setError("Registration data not found. Please try signing up again.");
        return;
      }

      // Prepare customer data for registration
      const customerData = {
        otpToken: resetToken,
        name: userData.name,
        email: userData.email,
        phone: userData.phone.replace('+91', ''),
        password: userData.password,
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        country: userData.country || "India",
        postalCode: userData.postalCode || ""
      };

      console.log("Registering customer:", customerData);
      const result = await register(customerData);
      
      if (result.success) {
        // Clear pending registration data
        sessionStorage.removeItem('pendingRegistration');
        // Navigate to home page
        navigate("/", { replace: true });
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    }
  };

  // Resend OTP with cooldown
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const otpType = type || (flow === "signup" ? OTP_TYPES.CUSTOMER_REGISTRATION : OTP_TYPES.PASSWORD_RESET);
      console.log("Resending OTP:", { otpType, identifier });
      
      const result = await sendOTP(otpType, identifier);
      
      if (result.success) {
        setReceivedOtp(result.otp || result.data?.otp);
        setError("");
        setResendCount(prev => prev + 1);
        
        // Set cooldown for resend
        setCanResend(false);
        setTimer(30); // 30 seconds cooldown
        
        // Show success message
        setError("OTP has been resent successfully!");
      } else {
        setError(result.error || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill OTP for testing (remove in production)
  const handleAutoFill = () => {
    if (receivedOtp) {
      const otpArray = receivedOtp.split("").slice(0, 6);
      const newOtp = [...otpArray];
      while (newOtp.length < 6) newOtp.push("");
      setOtp(newOtp);
      setError("");
    }
  };

  const getHeaderText = () => {
    if (type === OTP_TYPES.CUSTOMER_LOGIN) return "Verify Login";
    if (type === OTP_TYPES.PASSWORD_RESET || type === "reset") return "Reset Password";
    if (flow === "signup") return "Verify Your Account";
    return "Verify OTP";
  };

  const getSubheaderText = () => {
    if (type === OTP_TYPES.CUSTOMER_LOGIN) return `Enter OTP sent to ${identifier} to login`;
    if (type === OTP_TYPES.PASSWORD_RESET || type === "reset") return `Enter OTP sent to ${identifier} to reset your password`;
    if (flow === "signup") return `Enter OTP sent to ${identifier} to complete registration`;
    return `Enter OTP sent to ${identifier}`;
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex min-h-[76vh] items-center justify-center bg-white px-4 py-8">
        <div className="lg:w-[450px] w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-300">
          
          {/* Header Section with Avatar Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              {getHeaderText()}
            </h1>
            <p className="text-gray-600 text-sm">
              {getSubheaderText()}
            </p>
            
            {/* Development Mode - Show OTP for testing */}
            {receivedOtp && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  🚨 Development Mode: OTP not sent via SMS
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Use this OTP: <span className="font-bold">{receivedOtp}</span>
                </p>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="mt-2 text-sm text-yellow-800 underline hover:no-underline"
                >
                  Click to auto-fill OTP
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className={`mb-6 p-4 text-sm rounded-lg flex items-center gap-3 border ${
              error.includes("successfully") 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {error.includes("successfully") ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4 text-center">
                Enter 6-digit OTP
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    disabled={isLoading || loading}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-gray-900 placeholder-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || loading || otp.join("").length !== 6}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {(isLoading || loading) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          {/* Resend OTP option */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive OTP?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading || loading || !canResend}
                className="text-black font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canResend ? "Resend OTP" : `Resend in ${timer}s`}
              </button>
            </p>
            {resendCount > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Resent {resendCount} time{resendCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}



// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Layout from "../../Partials/Layout";
// import { useAuth } from "../hooks/useAuth";
// import { OTP_TYPES } from "../authApi";

// export default function VerifyOTP() {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [receivedOtp, setReceivedOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const [canResend, setCanResend] = useState(false);
  
//   const otpInputRefs = useRef([]);
//   const { verifyOTP, register, sendOTP, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const searchParams = new URLSearchParams(location.search);
//   const identifier = searchParams.get("identifier") || "";
//   const type = searchParams.get("type") || "";
//   const { flow, receivedOtp: locationOtp, phone } = location.state || {};

//   useEffect(() => {
//     if (!identifier) {
//       navigate("/login");
//       return;
//     }

//     // Set the OTP that was received from the API (for testing)
//     if (locationOtp) {
//       setReceivedOtp(locationOtp);
//     }

//     // Start timer for OTP resend
//     const countdown = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           setCanResend(true);
//           clearInterval(countdown);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(countdown);
//   }, [identifier, navigate, locationOtp]);

//   // Handle OTP input change
//   const handleOtpChange = (element, index) => {
//     if (isNaN(element.value)) return false;

//     const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
//     setOtp(newOtp);
//     setError("");

//     // Focus next input
//     if (element.nextSibling && element.value !== "") {
//       element.nextSibling.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
//       e.target.previousSibling.focus();
//     }
//   };

//   // Validate OTP (exactly 6 digits)
//   const isValidOTP = (otpValue) => {
//     return /^\d{6}$/.test(otpValue);
//   };

//   // Handle OTP verification
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
    
//     const otpValue = otp.join("");
    
//     if (!isValidOTP(otpValue)) {
//       setError("Please enter the 6-digit OTP.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       // Determine OTP type based on flow
//       const otpType = flow === "signup" ? OTP_TYPES.CUSTOMER_REGISTRATION : 
//                      type === "reset" ? OTP_TYPES.PASSWORD_RESET : 
//                      OTP_TYPES.CUSTOMER_REGISTRATION;

//       const result = await verifyOTP(otpType, identifier.replace('+91', ''), otpValue);
      
//       if (result.success) {
//         // Handle different flows after successful OTP verification
//         if (flow === "signup") {
//           // Complete registration
//           await handleRegistration(result.data.resetToken);
//         } else if (type === "reset") {
//           // Navigate to reset password
//           navigate(`/reset-password`, { 
//             state: { 
//               identifier, 
//               resetToken: result.data.resetToken,
//               fromForgotPassword: true 
//             } 
//           });
//         } else if (type === "signin") {
//           // Handle phone login (you might need to implement this)
//           navigate("/");
//         } else {
//           // Default navigation after verification
//           navigate("/");
//         }
//       } else {
//         setError(result.error || "OTP verification failed.");
//       }
//     } catch (error) {
//       setError("An error occurred during OTP verification.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle user registration after OTP verification
//   const handleRegistration = async (resetToken) => {
//     try {
//       // Get user data from sessionStorage
//       const pendingRegistration = sessionStorage.getItem('pendingRegistration');
      
//       if (!pendingRegistration) {
//         setError("Registration data not found. Please try signing up again.");
//         return;
//       }

//       const userData = JSON.parse(pendingRegistration);
      
//       // Prepare customer data for registration
//       const customerData = {
//         otpToken: resetToken,
//         name: userData.name,
//         email: userData.email,
//         phone: userData.phone.replace('+91', ''),
//         password: userData.password,
//         address: userData.address || "",
//         city: userData.city || "",
//         state: userData.state || "",
//         country: userData.country || "India",
//         postalCode: userData.postalCode || ""
//       };

//       const result = await register(customerData);
      
//       if (result.success) {
//         // Clear pending registration data
//         sessionStorage.removeItem('pendingRegistration');
//         // Navigate to home page
//         navigate("/");
//       } else {
//         setError(result.error || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       setError("Registration failed. Please try again.");
//     }
//   };

//   // Handle resend OTP
//   const handleResendOTP = async () => {
//     if (!canResend) return;

//     setError("");
//     setCanResend(false);
//     setTimer(60);
//     setOtp(["", "", "", "", "", ""]);
    
//     // Determine OTP type based on flow
//     const otpType = flow === "signup" ? OTP_TYPES.CUSTOMER_REGISTRATION : 
//                    type === "reset" ? OTP_TYPES.PASSWORD_RESET : 
//                    OTP_TYPES.CUSTOMER_REGISTRATION;

//     const result = await sendOTP(otpType, identifier.replace('+91', ''));
    
//     if (!result.success) {
//       setError(result.error || "Failed to resend OTP");
//       setCanResend(true);
//     }
//   };

//   // Auto-fill OTP for testing (remove in production)
//   const handleAutoFill = () => {
//     if (receivedOtp) {
//       const otpArray = receivedOtp.split("").slice(0, 6);
//       setOtp(otpArray);
//       setError("");
//     }
//   };

//   return (
//     <Layout childrenClasses="pt-0 pb-0">
//       <div className="flex min-h-screen items-center justify-center bg-white px-4">
//         <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          
//           {/* Header Section with Icon */}
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-black">Verify OTP</h1>
//             <p className="text-gray-600 mt-2">
//               Enter the 6-digit code sent to {identifier}
//             </p>
            
//             {/* Development Mode - Show OTP for testing */}
//             {receivedOtp && (
//               <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded-lg">
//                 <p className="text-sm text-gray-800 font-medium">
//                   Development Mode: OTP not sent via SMS
//                 </p>
//                 <p className="text-sm text-gray-700 mt-1">
//                   Use this OTP: <span className="font-bold">{receivedOtp}</span>
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleAutoFill}
//                   className="mt-2 text-sm text-gray-800 underline hover:no-underline"
//                 >
//                   Click to auto-fill OTP
//                 </button>
//               </div>
//             )}
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 border border-red-200">
//               <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleVerifyOTP} className="space-y-6">
//             <div className="flex justify-center space-x-2">
//               {otp.map((data, index) => (
//                 <input
//                   key={index}
//                   ref={(el) => (otpInputRefs.current[index] = el)}
//                   type="text"
//                   maxLength="1"
//                   value={data}
//                   onChange={(e) => handleOtpChange(e.target, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   onFocus={(e) => e.target.select()}
//                   disabled={isLoading || loading}
//                   className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed text-black"
//                 />
//               ))}
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading || loading || otp.join("").length !== 6}
//               className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {(isLoading || loading) ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10"
//                             stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Verifying...
//                 </>
//               ) : (
//                 "Verify OTP"
//               )}
//             </button>
//           </form>

//           {/* Resend OTP option */}
//           <div className="text-center mt-6">
//             <p className="text-gray-600">
//               Didn't receive the code?{" "}
//               <button
//                 onClick={handleResendOTP}
//                 disabled={!canResend}
//                 className={`font-semibold ${
//                   canResend ? "text-black hover:text-gray-800" : "text-gray-400"
//                 }`}
//               >
//                 {canResend ? "Resend OTP" : `Resend in ${timer}s`}
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }