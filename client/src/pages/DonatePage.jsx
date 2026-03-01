import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const DonatePage = () => {
    const navigate = useNavigate();
    const [isMonthly, setIsMonthly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        amount: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('vvv_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTierSelect = (amt) => {
        setSelectedTier(amt);
        setFormData(prev => ({ ...prev, amount: amt }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleDonate = async (e) => {
        e.preventDefault();

        // Validation: Positive amount only
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert("Please enter a valid donation amount greater than zero.");
            return;
        }

        setLoading(true);

        try {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                alert("Razorpay SDK failed to load. Please check your internet connection.");
                setLoading(false);
                return;
            }

            const { data: { key } } = await axios.get("/api/get-key");

            let paymentResponse;
            if (isMonthly) {
                paymentResponse = await axios.post("/api/create-subscription", {
                    amount: formData.amount,
                    email: formData.email,
                    name: formData.name
                });
            } else {
                const { data } = await axios.post("/api/create-order", {
                    amount: formData.amount,
                });
                paymentResponse = { data };
            }

            const options = {
                key: key,
                name: "Viswa Vignana Vaaradi",
                description: isMonthly ? `Monthly Patronage - ₹${formData.amount}` : "Donation for a Cause",
                // Brand Logo Integration
                image: "https://viswavignanavaaradi.org/assets/logo.png",
                handler: async function (response) {
                    try {
                        const verifyUrl = isMonthly ? "/api/subscription-success" : "/api/payment-success";
                        const payload = isMonthly ? {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: formData.amount,
                            name: formData.name,
                            email: formData.email
                        } : {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: formData.amount,
                            donor_name: formData.name,
                            email: formData.email,
                            phone: formData.phone
                        };

                        const { data: result } = await axios.post(verifyUrl, payload);
                        if (result.status === 'success') {
                            window.location.href = `/success?id=${result.certificate_id}`;
                        } else {
                            navigate("/failure");
                        }
                    } catch (error) {
                        console.error(error);
                        navigate("/failure");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#059669",
                },
            };

            if (isMonthly) {
                options.subscription_id = paymentResponse.data.id;
            } else {
                options.amount = paymentResponse.data.amount;
                options.order_id = paymentResponse.data.id;
            }

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setLoading(false);

        } catch (error) {
            console.error(error);
            setLoading(false);
            const msg = error.response?.data?.error || error.message || "Unknown error";
            alert(`Something went wrong: ${msg}. Please try again.`);
        }
    };

    const monthlyTiers = ['99', '299', '499', '999', '1999', '4999'];

    return (
        <div className="bg-[#FDFCF6] min-h-screen pt-28 md:pt-40 pb-20 px-4">

            {/* Version Sentinel */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
                <div className="px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/20">
                    Secure Portal: v4.4.7
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-start">

                {/* Left: Narrative & Impact */}
                <div className="flex-1 space-y-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl md:text-7xl font-merriweather font-black text-slate-900 leading-tight mb-6 italic">Your generosity is the spark of our change.</h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                            Viswa Vignana Vaaradi is dedicated to hunger eradication, rural empowerment, and legal aid. Every rupee you contribute goes directly to the field.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                        {[
                            { title: "₹500", desc: "Provides nutrition for a family for a week.", icon: "🍚" },
                            { title: "₹1500", desc: "Supports a student's education kits.", icon: "📚" },
                            { title: "₹5000", desc: "Funds a rural medical camp session.", icon: "⚕️" },
                            { title: "Premium", desc: "Joins our Advisory Council patronage.", icon: "🏛️" }
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h4 className="font-black text-slate-900 text-lg">{item.title}</h4>
                                <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-10 border-t border-slate-100">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Donor" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Joined by 2,400+ Patrons</p>
                    </div>
                </div>

                {/* Right: Donation Form - Premium Glass Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full lg:w-[480px] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-10 sticky top-32"
                >
                    <div className="mb-10">
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1 border border-slate-100">
                            <button
                                type="button"
                                onClick={() => { setIsMonthly(false); setFormData(prev => ({ ...prev, amount: '' })); }}
                                className={`flex-1 py-3 rounded-xl border-none text-[10px] uppercase tracking-widest font-black transition-all ${!isMonthly ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
                            >One-time Contribution</button>
                            <button
                                type="button"
                                onClick={() => { setIsMonthly(true); setFormData(prev => ({ ...prev, amount: '' })); }}
                                className={`flex-1 py-3 rounded-xl border-none text-[10px] uppercase tracking-widest font-black transition-all ${isMonthly ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
                            >Monthly Patronage</button>
                        </div>
                    </div>

                    <form onSubmit={handleDonate} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                                <input name="name" required value={formData.name} onChange={handleChange} placeholder="Aravind Vantaku" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-base" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="aravind@example.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-base" />
                            </div>
                        </div>

                        {isMonthly ? (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Choose Patronage Level</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    {monthlyTiers.map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => handleTierSelect(amt)}
                                            className={`py-4 rounded-2xl font-black transition-all border-2 ${formData.amount === amt ? 'bg-white border-emerald-600 text-emerald-600 shadow-lg' : 'bg-white border-transparent text-slate-600 shadow-sm hover:border-slate-200'}`}
                                        >
                                            <div className="text-lg">₹{amt}</div>
                                            <div className="text-[8px] opacity-60 uppercase tracking-wider">/ month</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Donation Amount (₹)</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-900 group-focus-within:text-emerald-500 transition-colors">₹</span>
                                    <input
                                        name="amount"
                                        type="number"
                                        placeholder="1000"
                                        required
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-8 rounded-[32px] bg-slate-50 border-2 border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-4xl text-slate-900 placeholder:text-slate-200 shadow-inner"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !formData.amount}
                            className={`w-full py-6 rounded-[24px] text-white font-black text-lg uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-3 ${isMonthly ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-slate-900 shadow-slate-900/20'}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isMonthly ? 'Activate Patronage' : 'Complete Donation'}
                                    <span className="text-xl">→</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-4">
                            <span>🛡️ 256-Bit Secure</span>
                            <span>📜 80G Benefit</span>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default DonatePage;
