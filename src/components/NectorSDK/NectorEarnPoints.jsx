import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';

const NectorEarnPoints = ({ price }) => {
    const { user } = useSelector((state) => state.auth);
    const containerId = 'nector-custom-earn-coins-container';

    useEffect(() => {
        function initEarnWidget() {
            if (window.nector_sdk && (user?.id || user?._id)) {
                window.nector_sdk.init_widget(
                    'customerearn',
                    {
                        api_key: NECTOR_API_KEY,
                        platform: NECTOR_PLATFORM,
                        customer_id: user?._id || user?.id || '',
                        customer_email: user?.email || '',
                        price: price,
                        redirect_url: "http://localhost:5173/profile"
                    },
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
    }, [price]);

    // Handle price updates
    useEffect(() => {
        if (window.nector_sdk?.earn_points_widget?.update_price) {
            window.nector_sdk.earn_points_widget.update_price(price);
        }
    }, [price]);

    return <div id={containerId} className="my-4"></div>;
};

export default NectorEarnPoints;
