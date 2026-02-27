import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PatronEnrollment = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        profession: '',
        experience: '',
        advisoryWing: '',
        linkedinProfile: '',
        amount: 1000,
    });

    useEffect(() => {
        if (user?.email) {
            checkRegistration();
        }
    }, [user]);

    const checkRegistration = async () => {
        try {
            const res = await axios.get(`/api/user/status?email=${user.email}`);
            if (res.data.isPatron) {
                setAlreadyRegistered(true);
            }
        } catch (err) {
            console.error('Status check error:', err);
        }
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleAmountChange = (amt) => setFormData({ ...formData, amount: amt });

    const handleSubscription = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/create-subscription', {
                amount: formData.amount,
                email: formData.email,
                name: formData.fullName
            });

            const options = {
                key: (await axios.get('/api/get-key')).data.key,
                subscription_id: res.data.id,
                name: "VVV Foundation",
                description: `Monthly Patronage - ₹${formData.amount}`,
                handler: async (response) => {
                    await finalizeEnrollment(response.razorpay_subscription_id);
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#1e3a8a" }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            alert('Subscription Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const finalizeEnrollment = async (subscriptionId) => {
        try {
            await axios.post('/api/patron/enroll', {
                ...formData,
                subscriptionId
            });
            navigate('/profile', { state: { message: 'Welcome to the Patronage Council!' } });
        } catch (err) {
            alert('Finalization error');
        }
    };

    if (alreadyRegistered) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-32 p-4 text-center items-center">
                <Navbar />
                <div className="max-w-md bg-white p-10 rounded-[40px] shadow-xl">
                    <div className="text-5xl mb-6 text-emerald-500">🌟</div>
                    <h2 className="text-3xl font-merriweather font-black text-slate-800 mb-4">A Heartfelt Thank You!</h2>
                    <p className="text-slate-500 mb-8">You are already registered as a Foundation Patron. Your sustained support is driving real change.</p>
                    <button onClick={() => navigate('/profile')} className="px-10 py-4 bg-[#1e3a8a] text-white font-black rounded-2xl shadow-lg hover:bg-slate-800 transition-all">Go to My Dashboard</button>
                </div>
            </div>
        );
    }

    const wings = [
        "Rural Empowerment Wing",
        "Higher Education Support",
        "Legal Aid & Human Rights",
        "Environmental Sustainability",
        "Child Welfare & Health"
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-40 pb-20 px-6">
                <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px]">
                    {/* Sidebar */}
                    <div className="w-full md:w-80 bg-slate-900 p-10 text-white">
                        <div className="mb-10 inline-block px-3 py-1 bg-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Foundation Patron</div>
                        <h1 className="text-4xl font-merriweather font-black mb-6 leading-tight">Elevate Social Change</h1>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">Join the Advisory Council of VVV. Your professional leadership ensures our scalability and integrity.</p>

                        <div className="space-y-4">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`flex items-center gap-3 ${step === s ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step === s ? 'bg-emerald-500 text-white' : 'border border-white'}`}>{s}</div>
                                    <p className="text-[11px] font-black uppercase tracking-widest">{s === 1 ? 'Identity' : s === 2 ? 'Leadership' : 'Commitment'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="flex-1 p-10 md:p-16">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-slate-800">Who shall we call Patron?</h2>
                                        <p className="text-slate-400 text-xs font-medium">Standard identification for the Advisory Council records.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                            <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-[#1e3a8a] text-sm font-bold" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Nexus</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input type="email" readOnly className="w-full px-6 py-4 rounded-2xl bg-slate-100 border border-slate-100 text-slate-400 text-sm font-bold" value={formData.email} />
                                                <input type="text" placeholder="Phone Number" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-[#1e3a8a] text-sm font-bold" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={handleNext} className="w-full md:w-auto px-10 py-5 bg-[#1e3a8a] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all">Proceed to Background</button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-slate-800">Professional Leadership</h2>
                                        <p className="text-slate-400 text-xs font-medium">Help us understand where your advice can make the most impact.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profession</label>
                                                <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-[#1e3a8a] text-sm font-bold" value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exp (Years)</label>
                                                <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-[#1e3a8a] text-sm font-bold" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Advisory Wing</label>
                                            <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-[#1e3a8a] text-sm font-bold" value={formData.advisoryWing} onChange={e => setFormData({ ...formData, advisoryWing: e.target.value })}>
                                                <option value="">Select a Wing</option>
                                                {wings.map(w => <option key={w} value={w}>{w}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LinkedIn Profile (Optional)</label>
                                            <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-[#1e3a8a] text-sm font-bold" value={formData.linkedinProfile} onChange={e => setFormData({ ...formData, linkedinProfile: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={handleBack} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">Back</button>
                                        <button onClick={handleNext} className="flex-[2] py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-50 active:scale-95 transition-all">Select Subscription</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-slate-800">Mission Commitment</h2>
                                        <p className="text-slate-400 text-xs font-medium">Patronage involves a recurring monthly contribution to ensure stable roots for the foundation.</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[500, 1000, 2500, 5000].map(amt => (
                                            <button key={amt} onClick={() => handleAmountChange(amt)} className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${formData.amount === amt ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-50'}`}>
                                                <span className={`text-xs font-black ${formData.amount === amt ? 'text-emerald-500' : 'text-slate-400'}`}>₹{amt}</span>
                                                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">Monthly</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-8 bg-[#1e3a8a] rounded-[32px] text-white">
                                        <p className="text-[10px] font-black uppercase text-blue-300 mb-2">Council Confirmation</p>
                                        <p className="text-sm font-medium leading-relaxed mb-6">By becoming a patron with ₹{formData.amount}/mo, you are providing sustained legal aid and education to those who need it most.</p>
                                        <button onClick={handleSubscription} disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl disabled:opacity-50">
                                            {loading ? 'Processing Protocol...' : 'Confirm Patronage'}
                                        </button>
                                    </div>

                                    <button onClick={handleBack} className="text-[10px] font-black uppercase text-slate-300 tracking-widest hover:text-[#1e3a8a]">Return to Background</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PatronEnrollment;
