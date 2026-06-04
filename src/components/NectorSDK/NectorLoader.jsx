import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

// NectorLoader: loads the SDK script once and initializes the widget.
// NectorProvider should be preferred for most use cases — this is kept
// as a fallback for pages that don't use NectorProvider.
const NectorLoader = () => {
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const scriptId = 'nector-sdk-script';
        const customerId = user?.nector_lead_id ? user?.customer_uuid : '';

        function insertRewardsWidget() {
            window.nector_sdk.init_widget(
                'widget',
                {
                    api_key: NECTOR_API_KEY,
                    platform: NECTOR_PLATFORM,
                    customer_id: customerId,
                },
                document.body
            );
        }

        if (window.nector_sdk) {
            // SDK already loaded — init immediately
            insertRewardsWidget();
        } else {
            // Load the SDK script if not yet present
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://cdn.nector.io/nector-static/no-cache/reward-widget/mainloader.min.js';
                script.async = true;
                document.body.appendChild(script);
            }

            // Wait for the SDK initialized event
            window.addEventListener('nector_sdk_initialized', insertRewardsWidget);
        }

        return () => {
            window.removeEventListener('nector_sdk_initialized', insertRewardsWidget);
        };
    }, [user?.customer_uuid, user?.nector_lead_id]);

    return null;
};

export default NectorLoader;
