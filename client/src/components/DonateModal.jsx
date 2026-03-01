import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const DonateModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        amount: ''
    });
    const [isMonthly, setIsMonthly] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);

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
    }, [isOpen]);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            const sanitizedValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, amount: sanitizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTierSelect = (amt) => {
        setSelectedTier(amt);
        setFormData(prev => ({ ...prev, amount: amt }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleDonate = async (e) => {
        e.preventDefault();
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
                // Subscription Mode
                paymentResponse = await axios.post("/api/create-subscription", {
                    amount: formData.amount,
                    email: formData.email,
                    name: formData.name
                });
            } else {
                // One-time Mode
                const { data } = await axios.post("/api/create-order", {
                    amount: formData.amount,
                });
                paymentResponse = { data };
            }

            const options = {
                key: key,
                name: "Viswa Vignana Vaaradi",
                description: isMonthly ? `Monthly Patronage - ₹${formData.amount}` : "Donation for a Cause",
                image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Love_Heart_SVG.svg",
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
                            alert("Payment Verification Failed");
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

    const monthlyTiers = ['99', '199', '299', '499', '999', '1499', '1999', '2499', '2999', '4999'];

    return (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[9999] backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-10 rounded-[24px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto relative shadow-2xl border border-slate-100"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-slate-50 border-none w-8 h-8 rounded-lg flex items-center justify-center text-xl cursor-pointer text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                >&times;</button>

                <div className="text-center mb-8">
                    <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        Support Our Mission
                    </div>
                    <h2 className="font-merriweather text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Join the Movement</h2>
                    <p className="text-slate-500 text-sm sm:text-base mt-2">Your contribution drives direct social change.</p>

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-100 p-1.5 rounded-[16px] mt-6 gap-1 border border-slate-200">
                        <button
                            type="button"
                            onClick={() => { setIsMonthly(false); setSelectedTier(null); setFormData(prev => ({ ...prev, amount: '' })); }}
                            className={`flex-1 py-2.5 rounded-[12px] border-none text-xs font-black transition-all ${!isMonthly ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
                        >One-time</button>
                        <button
                            type="button"
                            onClick={() => { setIsMonthly(true); setFormData(prev => ({ ...prev, amount: '' })); }}
                            className={`flex-1 py-2.5 rounded-[12px] border-none text-xs font-black transition-all ${isMonthly ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
                        >Monthly (Autopay)</button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-8">
                        <div className="border-[4px] border-slate-100 border-t-emerald-600 rounded-full w-12 h-12 animate-spin mb-4"></div>
                        <p className="text-slate-800 font-black text-sm uppercase tracking-widest">Securing Gateway...</p>
                    </div>
                ) : (
                    <form onSubmit={handleDonate} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Full Name</label>
                                <input name="name" required value={formData.name} onChange={handleChange} placeholder="Aravind Vantaku" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm" />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Email Address</label>
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="aravind@example.com" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm" />
                            </div>
                        </div>

                        {isMonthly ? (
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>Choose Contribution Level</label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))',
                                    gap: '10px',
                                    maxHeight: '220px',
                                    overflowY: 'auto',
                                    padding: '4px',
                                    background: '#f8fafc',
                                    borderRadius: '16px',
                                    border: '1px solid #f1f5f9'
                                }}>
                                    {monthlyTiers.map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => handleTierSelect(amt)}
                                            style={{
                                                padding: '12px 4px',
                                                borderRadius: '12px',
                                                border: `2px solid ${selectedTier === amt ? '#059669' : 'transparent'}`,
                                                background: selectedTier === amt ? '#fff' : '#fff',
                                                color: selectedTier === amt ? '#059669' : '#475569',
                                                boxShadow: selectedTier === amt ? '0 4px 6px -1px rgba(5, 150, 105, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.1rem' }}>₹{amt}</span>
                                            <span style={{ fontSize: '0.6rem', fontWeight: '600', opacity: 0.6, marginTop: '2px' }}>/ month</span>
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" required value={formData.amount} />
                                {!formData.amount && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center', fontWeight: '600' }}>Please select a patronage plan to continue</p>}
                            </div>
                        ) : (
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Donation Amount (₹)</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '900', color: '#1e293b', fontSize: '1.25rem' }}>₹</span>
                                    <input
                                        name="amount"
                                        type="number"
                                        min="1"
                                        placeholder="500"
                                        required
                                        value={formData.amount}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                                        }}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', outline: 'none', transition: 'all 0.2s' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.1)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !formData.amount}
                            className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-4"
                        >
                            {isMonthly ? 'Activate Patronage' : 'Complete Donation'}
                        </button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            marginTop: '0.5rem',
                            color: '#94a3b8',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>�</span> 256-bit SSL
                            </div>
                            <span>•</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>💳</span> Secure Razorpay
                            </div>
                            <span>•</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>📜</span> 80G Tax Benefit
                            </div>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default DonateModal;
