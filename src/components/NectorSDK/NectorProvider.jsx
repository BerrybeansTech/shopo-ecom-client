import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

const NectorProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const retryTimerRef = useRef(null);

    useEffect(() => {
        // Use nector_lead_id as confirmation the customer exists in Nector.
        // Once synced, we pass the raw customer_uuid to the SDK because the SDK 
        // automatically prepends the "custom-" platform prefix in the browser.
        const nectorId = user?.nector_lead_id ? user.customer_uuid : '';

        console.log('📡 [Nector] Provider init. nector_id:', nectorId || '(guest)');

        // Clear any pending retry timer on effect re-run
        if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
            retryTimerRef.current = null;
        }

        function insertRewardsWidget(id) {
            if (!window.nector_sdk) return;
            console.log('📡 [Nector] init_widget with customer_id:', id || '(guest)');
            window.nector_sdk.init_widget(
                'widget',
                {
                    api_key: NECTOR_API_KEY,
                    platform: NECTOR_PLATFORM,
                    customer_id: id,
                },
                'nector-widget-root'
            );
        }

        function loadAndInit() {
            if (window.nector_sdk) {
                insertRewardsWidget(nectorId);
            } else {
                // Load the SDK script if not yet in DOM
                const scriptId = 'nector-sdk-script';
                if (!document.getElementById(scriptId)) {
                    const script = document.createElement('script');
                    script.id = scriptId;
                    script.src = 'https://cdn.nector.io/nector-static/no-cache/reward-widget/mainloader.min.js';
                    script.async = true;
                    document.body.appendChild(script);
                }
                // The nector_sdk_initialized listener below will handle init
            }
        }

        function onSdkInitialized() {
            insertRewardsWidget(nectorId);
        }

        window.addEventListener('nector_sdk_initialized', onSdkInitialized);
        loadAndInit();

        return () => {
            window.removeEventListener('nector_sdk_initialized', onSdkInitialized);
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current);
            }
        };
    }, [user?.customer_uuid, user?.nector_lead_id]);

    return (
        <>
            {children}
            <div id="nector-widget-root"></div>
        </>
    );
};

export default NectorProvider;
