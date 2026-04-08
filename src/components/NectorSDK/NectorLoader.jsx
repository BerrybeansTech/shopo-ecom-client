import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

const NectorLoader = () => {
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const scriptId = 'nector-sdk-script';

        const initRewardsWidget = () => {
            if (window.nector_sdk && (user?.id || user?._id)) {
                window.nector_sdk.init_widget(
                    'widget',
                    {
                        api_key: NECTOR_API_KEY,
                        platform: NECTOR_PLATFORM,
                        customer_id: user?._id || user?.id || ''
                    },
                    document.body
                );
            }
        };

        const handleInitialized = () => {
            initRewardsWidget();
        };

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://cdn.nector.io/nector-static/no-cache/reward-widget/mainloader.min.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                initRewardsWidget();
            };
        } else if (window.nector_sdk) {
            initRewardsWidget();
        }

        window.addEventListener('nector_sdk_initialized', handleInitialized);

        return () => {
            window.removeEventListener('nector_sdk_initialized', handleInitialized);
        };
    }, [user]); // Re-run when user changes to ensure correct ID is passed

    return null;

    return null;
};

export default NectorLoader;
