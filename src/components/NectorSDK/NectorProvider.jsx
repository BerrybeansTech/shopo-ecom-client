import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

const NectorProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const initializedRef = useRef(false);

    useEffect(() => {
        const scriptId = 'nector-sdk-script';
        const customerId = user?.customer_uuid || '';

        console.log('📡 [Nector] NectorProvider effect. customer_uuid:', customerId || 'Guest');

        const initWidget = () => {
            if (!window.nector_sdk) return false;

            console.log('📡 [Nector] Calling init_widget with customer_id:', customerId || '(guest)');
            window.nector_sdk.init_widget(
                'widget',
                {
                    api_key: NECTOR_API_KEY,
                    platform: NECTOR_PLATFORM,
                    customer_id: customerId,
                },
                'nector-widget-root'
            );
            initializedRef.current = true;
            return true;
        };

        // If SDK already loaded, re-init immediately (handles user login/logout changes)
        if (window.nector_sdk) {
            initWidget();
            return;
        }

        // Load SDK script once
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdn.nector.io/nector-static/no-cache/reward-widget/mainloader.min.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                // Poll until nector_sdk is ready (it may initialize asynchronously after script load)
                const poll = setInterval(() => {
                    if (initWidget()) {
                        clearInterval(poll);
                    }
                }, 200);
                // Give up after 10 seconds
                setTimeout(() => clearInterval(poll), 10000);
            };
        }

        // Also listen for the SDK initialized event
        const handleInitialized = () => {
            initWidget();
        };
        window.addEventListener('nector_sdk_initialized', handleInitialized);

        return () => {
            window.removeEventListener('nector_sdk_initialized', handleInitialized);
        };
    }, [user?.customer_uuid]);

    return (
        <>
            {children}
            <div id="nector-widget-root"></div>
        </>
    );
};

export default NectorProvider;
