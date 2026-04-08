import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';
import Layout from '../Partials/Layout';

const NectorRewardsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const containerId = 'rewards-page-container';

    useEffect(() => {
        function initRewardsPage() {
            if (window.nector_sdk && (user?.id || user?._id)) {
                window.nector_sdk.init_widget(
                    'reward',
                    {
                        api_key: NECTOR_API_KEY,
                        platform: NECTOR_PLATFORM,
                        customer_id: user?._id || user?.id || ''
                    },
                    containerId
                );
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
    }, [user]);

    return (
        <Layout>
            <div className="container-x mx-auto py-10 min-h-[600px]">
                <div id={containerId}></div>
            </div>
        </Layout>
    );
};

export default NectorRewardsPage;
