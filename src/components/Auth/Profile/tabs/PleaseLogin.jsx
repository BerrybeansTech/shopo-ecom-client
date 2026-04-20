import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const PleaseLogin = ({ title = "My Profile", message = "You need to be logged in to view this content." }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="text-center py-12 bg-white-50 rounded-lg border border-white-500 shadow-sm">
        <div className="w-16 h-16 bg-white-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-black-600" />
        </div>
        <h3 className="text-lg font-semibold text-black-900 mb-2">Please Login</h3>
        <p className="text-sm text-black-600 mb-6 max-w-sm mx-auto">
          {message}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-black-900 text-white-50 px-8 py-2.5 rounded-lg hover:bg-black-800 transition-all duration-200 font-medium shadow-md active:scale-95 text-sm"
        >
          Login Now
        </button>
      </div>
    </div>
  );
};

export default PleaseLogin;
