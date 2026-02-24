import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Failure = () => {
    return (
        <div className="flex items-center justify-center text-center p-8 bg-[#fef2f2] min-h-[calc(100vh-100px)]">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white p-12 md:p-16 rounded-3xl shadow-2xl max-w-xl w-full border border-red-50"
            >
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600 text-5xl">
                    ⚠
                </div>

                <h1 className="text-red-700 text-4xl md:text-5xl font-merriweather font-bold mb-4">Transaction Failed</h1>

                <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                    We encountered an issue processing your donation. Please verify your payment details or try again later.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link to="/" className="inline-block border border-gray-200 text-gray-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                        Return Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Failure;
