import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { NECTOR_API_KEY, NECTOR_PLATFORM } from './constants';
import Layout from '../Partials/Layout';
import { Gift, UserPlus, LogIn } from 'lucide-react';

const NectorRewardsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const containerId = 'rewards-page-container';

    // Log the user's Nector-related fields
    console.log({
        customer_uuid: user?.customer_uuid,
        nector_lead_id: user?.nector_lead_id
    });

    useEffect(() => {
        function initRewardsPage() {
            if (window.nector_sdk && user?.nector_lead_id) {
                console.log("📡 [Nector] Initializing Rewards Page for User:", user.nector_lead_id);
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
                initRewardsPage();
            } else {
                window.addEventListener('nector_sdk_initialized', initRewardsPage);
            }
        }

        return () => {
            window.removeEventListener('nector_sdk_initialized', initRewardsPage);
        };
    }, [user?.nector_lead_id]);

    return (
        <Layout>
            <div className="container-x mx-auto py-12 px-4 min-h-[600px] flex flex-col justify-center items-center">
                {user?.customer_uuid ? (
                    <div id={containerId} className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-6"></div>
                ) : (
                    <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 text-center transform hover:scale-[1.01] transition-all duration-300">
                        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md animate-bounce">
                            <Gift className="w-10 h-10 text-amber-800" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Rabbit & Finch Club
                        </h2>
                        <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                            Join our loyalty program to earn coins on every purchase, refer your friends, and unlock exclusive discounts. Sign in to view and claim your rewards.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                            <Link
                                to="/login"
                                state={{ returnUrl: '/rewards' }}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-md active:scale-95 duration-150"
                            >
                                <LogIn className="w-5 h-5" />
                                Login to Account
                            </Link>
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-100 hover:text-black transition-colors font-semibold shadow-sm active:scale-95 duration-150"
                            >
                                <UserPlus className="w-5 h-5" />
                                Join Rewards Program
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default NectorRewardsPage;
