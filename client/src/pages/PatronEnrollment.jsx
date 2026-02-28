import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
        fullName: '',
        email: '',
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
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || '',
            }));
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
                image: "https://res.cloudinary.com/dp9qhgckr/image/upload/v1740502157/vvv_logo_eovqix.png", // Using the VVV logo
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
                    <button onClick={() => navigate('/profile')} className="px-10 py-4 bg-[#1e3a8a] text-white font-black rounded-2xl shadow-lg hover:bg-slate-800 transition-all">Go to Dashboard</button>
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
        <div className="min-h-screen bg-[#FDFCF6] flex flex-col md:flex-row">
            <Navbar />

            {/* Left Column: Info */}
            <div className="md:w-1/3 bg-[#0f172a] p-12 text-white flex flex-col justify-between sticky top-0 md:h-screen overflow-y-auto border-r-4 border-emerald-500/10 shadow-[20px_0_50px_rgba(0,0,0,0.2)]">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="mb-6 inline-block px-4 py-1 bg-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Foundation Patron</div>
                    <h2 className="text-4xl md:text-5xl font-merriweather font-black mb-8 leading-tight italic">Fueling the mission through legacy.</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-10 opacity-80 font-medium">
                        As a Patron, you join the Advisory Council. Your leadership and commitment provide the stability needed for long-term social transformation.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-3xl mt-1">🏛️</span>
                            <div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-1">Advisory Rights</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Share your professional expertise to guide our foundation's wings.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-3xl mt-1">🔄</span>
                            <div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-1">Sustainable Growth</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Recurring support allows us to plan and execute multi-year campaigns.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Deployment Sync Badge */}
                <div className="mt-12 pt-6 border-t border-white/10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">v4.1.5 Deployment Live</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Auth/Form */}
            <div className="flex-1 p-6 md:p-16 pt-32 bg-white flex items-center justify-center">
                <div className="max-w-xl w-full">
                    {!user ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-slate-50 p-12 rounded-[50px] border border-slate-100 shadow-2xl">
                            <div className="text-6xl mb-8">👑</div>
                            <h2 className="text-3xl font-merriweather font-black text-slate-800 mb-4">Patronage Portal</h2>
                            <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
                                Join the elite circle of VVV Patrons. Please sign in to manage your contributions and join our advisory council meetings.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/login" className="px-10 py-5 bg-[#0f172a] text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 transition-all uppercase tracking-widest text-[10px]">Sign In to Join</Link>
                                <Link to="/signup" className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-800 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Create Profile</Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-12">
                            <div className="text-center">
                                <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Protocol Step {step} of 3</p>
                                <h3 className="text-4xl font-merriweather font-black text-slate-900 leading-tight">
                                    {step === 1 && "Identity & Contact"}
                                    {step === 2 && "Leadership Context"}
                                    {step === 3 && "Impact Commitment"}
                                </h3>
                            </div>

                            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {step === 1 && (
                                    <div className="space-y-8 text-center sm:text-left">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                                <input name="fullName" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Linked)</label>
                                                <input readOnly value={formData.email} className="w-full px-6 py-4 rounded-xl bg-slate-100 border border-slate-100 outline-none font-bold text-sm text-slate-400" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Phone</label>
                                                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                            </div>
                                        </div>
                                        <button onClick={handleNext} className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Next: Leadership Context</button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profession</label>
                                                <input value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Impact Years</label>
                                                <input type="number" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Advisory Intent</label>
                                                <select value={formData.advisoryWing} onChange={e => setFormData({ ...formData, advisoryWing: e.target.value })} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm">
                                                    <option value="">Select a Mission Wing...</option>
                                                    {wings.map(w => <option key={w} value={w}>{w}</option>)}
                                                </select>
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LinkedIn (Advisory Review)</label>
                                                <input placeholder="https://linkedin.com/in/..." value={formData.linkedinProfile} onChange={e => setFormData({ ...formData, linkedinProfile: e.target.value })} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={handleBack} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                                            <button onClick={handleNext} className="flex-[2] py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Impact Commitment</button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-10 text-center">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[500, 1000, 2500, 5000].map(amt => (
                                                <button key={amt} onClick={() => handleAmountChange(amt)} className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${formData.amount === amt ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-50'}`}>
                                                    <span className={`text-sm font-black ${formData.amount === amt ? 'text-emerald-500' : 'text-slate-400'}`}>₹{amt}</span>
                                                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50">Monthly</span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-10 bg-[#0f172a] rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">👑</div>
                                            <p className="text-[10px] font-black uppercase text-emerald-400 mb-2 tracking-[0.2em]">Council Pledge</p>
                                            <p className="text-sm font-medium leading-relaxed mb-8 opacity-90">
                                                By contributing ₹{formData.amount}/mo, you ensure that our core systems remain resilient and our reach continues to expand into underserved regions.
                                            </p>
                                            <button onClick={handleSubscription} disabled={loading} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 active:scale-95">
                                                {loading ? 'Activating Protocol...' : 'Finalize Patronage'}
                                            </button>
                                        </div>

                                        <button onClick={handleBack} className="text-[10px] font-black uppercase text-slate-300 tracking-widest hover:text-emerald-500 transition-all">Review Background</button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PatronEnrollment;
