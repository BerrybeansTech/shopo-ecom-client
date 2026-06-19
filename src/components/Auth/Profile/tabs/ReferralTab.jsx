import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { NECTOR_API_KEY, NECTOR_PLATFORM } from "../../../NectorSDK/constants";

export default function ReferralTab() {
  const { user } = useSelector((state) => state.auth);
  const containerId = "nector-profile-referral-container";

  useEffect(() => {
    function initWidget() {
      if (window.nector_sdk && user?.nector_lead_id) {
        console.log("📡 [Nector] Initializing Referral Tab Widget for User:", user.nector_lead_id);
        window.nector_sdk.init_widget(
          'reward',
          {
            api_key: NECTOR_API_KEY,
            platform: NECTOR_PLATFORM,
            customer_id: user.nector_lead_id
          },
          containerId
        );
      }
    }

    if (user?.nector_lead_id) {
      if (window.nector_sdk) {
        initWidget();
      } else {
        window.addEventListener('nector_sdk_initialized', initWidget);
      }
    }

    return () => {
      window.removeEventListener('nector_sdk_initialized', initWidget);
    };
  }, [user?.nector_lead_id]);

  return (
    <div className="referral-tab w-full">
      <h1 className="text-[22px] font-bold text-qblack mb-5">Referrals & Rewards</h1>
      {user?.nector_lead_id ? (
        <div id={containerId} className="w-full bg-white rounded-lg border border-gray-100 p-4"></div>
      ) : (
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
          Please wait while your rewards details are synchronizing...
        </div>
      )}
    </div>
  );
}
