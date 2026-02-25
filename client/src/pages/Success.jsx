import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../api/axios';

const Success = () => {
    const [searchParams] = useSearchParams();
    const certificateId = searchParams.get('id');

    return (
        <div className="flex items-center justify-center text-center p-8 bg-[#f0fdf4] min-h-[calc(100vh-100px)]">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white p-12 md:p-16 rounded-3xl shadow-2xl max-w-2xl w-full border border-emerald-50"
            >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 text-5xl">
                    ✔
                </div>

                <h1 className="text-primary-royal text-4xl md:text-5xl font-merriweather font-bold mb-4">Transaction Successful</h1>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                    Thank you for your generosity. A tax-deductible receipt has been generated for your records.
                </p>

                {certificateId && (
                    <a
                        href={`${API_BASE_URL}/api/user/download-certificate?certId=${certificateId}`}
                        className="inline-block bg-primary-royal text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-blue-900 transition-all mb-6"
                    >
                        Download Certificate
                    </a>
                )}

                <div className="pt-8 border-t border-gray-100 mt-4">
                    <Link to="/" className="text-primary-royal font-bold hover:underline">
                        Return to Home Page
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Success;
