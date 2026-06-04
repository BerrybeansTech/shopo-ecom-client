import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

const NectorEarnPoints = ({ price }) => {
    const { user } = useSelector((state) => state.auth);
    const containerId = 'nector-custom-earn-coins-container';

    useEffect(() => {
        function initEarnWidget() {
            if (window.nector_sdk) {
                const config = {
                    api_key: NECTOR_API_KEY,
                    platform: NECTOR_PLATFORM,
                    price: price,
                    redirect_url: `${window.location.origin}/rewards`
                };

                if (user?.customer_uuid && user?.nector_lead_id) {
                    config.customer_id = user.customer_uuid;
                    config.customer_email = user.email || '';
                }

                console.log("📡 [Nector] Initializing PDP Earn Points Widget. User logged in & synced:", !!(user?.customer_uuid && user?.nector_lead_id));
                window.nector_sdk.init_widget(
                    'customerearn',
                    config,
                    containerId
                );
            }
        }

        if (window.nector_sdk) {
            initEarnWidget();
        } else {
            window.addEventListener('nector_sdk_initialized', initEarnWidget);
        }

        return () => {
            window.removeEventListener('nector_sdk_initialized', initEarnWidget);
        };
    }, [price, user?.customer_uuid, user?.nector_lead_id]);

    // Handle price updates
    useEffect(() => {
        if (window.nector_sdk?.earn_points_widget?.update_price) {
            window.nector_sdk.earn_points_widget.update_price(price);
        }
    }, [price]);

    return <div id={containerId} className="my-4"></div>;
};

export default NectorEarnPoints;
