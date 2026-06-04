import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

const NectorProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const customerId = user?.customer_uuid || '';

        console.log('📡 [Nector] Provider init. customer_id:', customerId || '(guest)');

        function insertRewardsWidget() {
            window.nector_sdk.init_widget(
                'widget',
                {
                    api_key: NECTOR_API_KEY,
                    platform: NECTOR_PLATFORM,
                    customer_id: customerId,
                },
                'nector-widget-root'
            );
        }

        if (window.nector_sdk) {
            // SDK already loaded (e.g. user logged in after page load)
            insertRewardsWidget();
        } else {
            // SDK not yet loaded — wait for the initialized event
            window.addEventListener('nector_sdk_initialized', insertRewardsWidget);
        }

        return () => {
            window.removeEventListener('nector_sdk_initialized', insertRewardsWidget);
        };
    }, [user?.customer_uuid]); // Re-run whenever user logs in / logs out

    return (
        <>
            {children}
            <div id="nector-widget-root"></div>
        </>
    );
};

export default NectorProvider;
