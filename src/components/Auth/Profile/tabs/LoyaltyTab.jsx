import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NECTOR_API_KEY, NECTOR_PLATFORM } from "../../../NectorSDK/constants";

export default function LoyaltyTab() {
  const { user } = useSelector((state) => state.auth);
  const containerId = 'nector-loyalty-tab-container';

  // Pass the nector_lead_id (which already has the custom- prefix)
  // so that with custom_website platform, the SDK queries custom_website-custom-customer_uuid.
  const nectorId = user?.nector_lead_id || '';
  const [sdkReady, setSdkReady] = useState(!!window.nector_sdk && !!nectorId);

  useEffect(() => {
    const currentNectorId = user?.nector_lead_id || '';

    function initRewardsPage() {
      if (window.nector_sdk && currentNectorId) {
        window.nector_sdk.init_widget(
          'reward',
          {
            api_key: NECTOR_API_KEY,
            platform: NECTOR_PLATFORM,
            customer_id: currentNectorId
          },
          containerId
        );
        setSdkReady(true);
      }
    }

    if (window.nector_sdk) {
      initRewardsPage();
    } else {
      window.addEventListener('nector_sdk_initialized', initRewardsPage);
    }

    return () => {
      window.removeEventListener('nector_sdk_initialized', initRewardsPage);
    };
  }, [user?.nector_lead_id]);

  return (
    <div className="loyalty-tab w-full">
      <h1 className="text-[22px] font-bold text-qblack mb-5">Loyalty Program</h1>
      <div className="loyalty-content">
        <div id={containerId} className="min-h-[600px] bg-white rounded-lg border border-gray-100 p-4">
          {!sdkReady && (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
