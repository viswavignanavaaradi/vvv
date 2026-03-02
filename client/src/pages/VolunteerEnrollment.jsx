import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { geoData, wings, colleges, wingDetails } from '../data/geoData';

const VolunteerEnrollment = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('vvv_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        age: '',
        gender: '',
        contactNumber: '',
        bloodGroup: '',
        state: '',
        district: '',
        collegeName: '',
        education: '',
        preferredWings: [],
        mainPriorityWing: '',
        areaOfInterest: [],
        willingToContribute: 'no',
        profilePhoto: '',
        documents: []
    });

    const [loading, setLoading] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [collegeSearch, setCollegeSearch] = useState('');
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const genders = ["Male", "Female", "Prefer not to say"];

    useEffect(() => {
        if (user?.email) {
            checkRegistration();
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || '',
                profilePhoto: user.picture || ''
            }));
        }
    }, [user]);

    const checkRegistration = async () => {
        try {
            const res = await axios.get(`/api/user/status?email=${user.email}`);
            if (res.data.isVolunteer) {
                setAlreadyRegistered(true);
            }
        } catch (err) {
            console.error('Status check error:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'state') setFormData(prev => ({ ...prev, district: '' }));
    };

    const handleCheckboxChange = (name, value) => {
        setFormData(prev => {
            const current = prev[name];
            if (current.includes(value)) {
                return { ...prev, [name]: current.filter(i => i !== value) };
            } else {
                return { ...prev, [name]: [...current, value] };
            }
        });
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('email', formData.email);
        uploadData.append(type === 'photo' ? 'photo' : 'document', file);
        if (type === 'document') uploadData.append('docName', file.name);

        setUploading(true);
        try {
            const endpoint = type === 'photo' ? '/api/user/upload-photo' : '/api/user/upload-document';
            const res = await axios.post(endpoint, uploadData);
            if (type === 'photo') {
                setFormData(prev => ({ ...prev, profilePhoto: res.data.url }));
            } else {
                setFormData(prev => ({ ...prev, documents: [...prev.documents, { name: file.name, url: res.data.url }] }));
            }
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const validateStep = () => {
        if (step === 2) {
            if (!formData.fullName || !formData.age || !formData.gender || !formData.contactNumber || !formData.bloodGroup) {
                alert("All fields are mandatory.");
                return false;
            }
        }
        if (step === 3) {
            if (!formData.state || !formData.district || !formData.collegeName || !formData.education) {
                alert("All address and education fields are mandatory.");
                return false;
            }
        }
        if (step === 4) {
            if (formData.preferredWings.length === 0 || !formData.mainPriorityWing) {
                alert("Please select at least one wing and a primary focus.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                preferredWings: formData.preferredWings.join(', '),
                interests: formData.areaOfInterest.join(', ')
            };
            const res = await axios.post('/api/volunteer/enroll', payload);
            const { enrollmentId } = res.data;

            if (formData.willingToContribute === 'yes') {
                const { data: { key } } = await axios.get("/api/get-key");
                const { data: order } = await axios.post("/api/create-order", { amount: 50 });

                const options = {
                    key: key,
                    amount: order.amount,
                    currency: "INR",
                    name: "VVV Foundation",
                    description: "Volunteer Contribution",
                    image: "https://res.cloudinary.com/dp9qhgckr/image/upload/v1740685000/vv_foundation/logo_circle.png",
                    order_id: order.id,
                    handler: async function (response) {
                        await axios.post("/api/volunteer/payment-success", { ...response, enrollmentId });
                        alert("Enrollment & Contribution Successful!");
                        navigate('/profile');
                    },
                    prefill: { name: formData.fullName, email: formData.email, contact: formData.contactNumber },
                    theme: { color: "#1e3a8a" },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                setLoading(false);
            } else {
                alert("Enrollment Successful!");
                navigate('/profile');
            }
        } catch (err) {
            console.error("Enrollment Error:", err);
            const errorMsg = err.response?.data?.error || err.message;
            alert(`Submission failed: ${errorMsg}`);
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (validateStep()) setStep(s => s + 1);
    };
    const prevStep = () => setStep(s => s - 1);

    if (alreadyRegistered) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col pt-32 p-4 text-center items-center">
                <div className="max-w-md bg-white p-10 rounded-[40px] shadow-xl">
                    <div className="text-5xl mb-6 text-[#1e3a8a]">🛡️</div>
                    <h2 className="text-3xl font-merriweather font-black text-slate-800 mb-4">Commander, You're Active!</h2>
                    <p className="text-slate-500 mb-8">You are already registered as an active volunteer. Your dedication to the mission is highly valued.</p>
                    <button onClick={() => navigate('/profile')} className="px-10 py-4 bg-[#1e3a8a] text-white font-black rounded-2xl shadow-lg hover:bg-slate-800 transition-all">Go to My Hub</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF6] flex flex-col md:flex-row relative">

            {/* Left Column: Info */}
            <div className="hidden md:flex md:w-1/3 bg-[#1e3a8a] p-8 md:p-12 text-white flex-col justify-between relative md:sticky md:top-0 h-auto md:h-screen overflow-y-auto border-r-0 md:border-r-4 border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.1)]">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="mb-4 md:mb-6 inline-block px-4 py-1 bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg backdrop-blur-md">Mission 2047</div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-merriweather font-black mb-6 md:mb-8 leading-tight italic">Be the bridge to transformation.</h2>
                    <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-8 md:mb-10 opacity-80 font-medium">
                        Join Viswa Vignana Vaaradhi to contribute towards legal awareness, rural empowerment, and educational growth. Every volunteer is a cornerstone of our foundation.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-2xl mt-1">🛡️</span>
                            <div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-1">Impact Driven</h4>
                                <p className="text-xs text-blue-200 leading-relaxed font-medium">Work on projects that create tangible social value in rural communities.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-2xl mt-1">🤝</span>
                            <div>
                                <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-1">Global Network</h4>
                                <p className="text-xs text-blue-200 leading-relaxed font-medium">Connect with professionals and fellow change-makers across India.</p>
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
            <div className="flex-1 p-4 sm:p-8 md:p-16 pt-12 md:pt-32 bg-white flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    {!user ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-slate-50 p-8 sm:p-12 rounded-[32px] md:rounded-[50px] border border-slate-100 shadow-2xl">
                            <div className="text-5xl md:text-6xl mb-6 md:mb-8">🔐</div>
                            <h2 className="text-2xl md:text-3xl font-merriweather font-black text-slate-800 mb-4">Start Your Journey</h2>
                            <p className="text-slate-500 mb-8 md:mb-10 text-base md:text-lg font-medium leading-relaxed">
                                To enroll as a volunteer, please first create an account or sign in to your dashboard. This helps us maintain secure and accurate records.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/login" className="px-10 py-5 bg-[#1e3a8a] text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">Login to Continue</Link>
                                <Link to="/signup" className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-800 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Create Account</Link>
                            </div>
                            <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">Already have an account? <Link to="/login" className="text-blue-600 underline">Sign In Here</Link></p>
                        </motion.div>
                    ) : (
                        <div className="space-y-12">
                            <div className="text-center">
                                <p className="text-[#F59E0B] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Volunteer Step {step} of 6</p>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-merriweather font-black text-slate-900 leading-tight">
                                    {step === 1 && "The Mission Awaits"}
                                    {step === 2 && "Identification Details"}
                                    {step === 3 && "Locality & Institution"}
                                    {step === 4 && "Choose Your Wing"}
                                    {step === 5 && "Documentation"}
                                    {step === 6 && "Pledge of Impact"}
                                </h3>
                            </div>

                            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {/* Form Content based on step - reusing previous logic but with stricter validation */}
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.entries(wingDetails).map(([key, details]) => (
                                                <div key={key} className="p-6 rounded-[30px] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <span className="text-2xl">{details.icon}</span>
                                                        <h4 className="text-sm font-black text-slate-800 leading-tight">{details.title}</h4>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{details.objective}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={nextStep} className="w-full bg-[#1e3a8a] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Begin Identity Protocol</button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age *</label>
                                                <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender *</label>
                                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm">
                                                    <option value="">Select</option>
                                                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                                                <input name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group *</label>
                                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm">
                                                    <option value="">Select</option>
                                                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={prevStep} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                                            <button onClick={nextStep} className="flex-[2] py-5 bg-[#1e3a8a] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Location Access</button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State *</label>
                                                <select name="state" value={formData.state} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm">
                                                    <option value="">Select State</option>
                                                    {Object.keys(geoData).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District *</label>
                                                <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.state} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm disabled:opacity-50">
                                                    <option value="">Select District</option>
                                                    {formData.state && geoData[formData.state].map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div className="sm:col-span-2 space-y-2 relative">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College/Institution *</label>
                                                <input value={collegeSearch} onChange={(e) => { setCollegeSearch(e.target.value); setFormData(p => ({ ...p, collegeName: e.target.value })); }} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" placeholder="Start typing institution name..." />
                                                {collegeSearch && !colleges.includes(collegeSearch) && (
                                                    <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-48 overflow-y-auto">
                                                        {colleges.filter(c => c.toLowerCase().includes(collegeSearch.toLowerCase())).map(c => <div key={c} onClick={() => { setCollegeSearch(c); setFormData(p => ({ ...p, collegeName: c })); }} className="px-6 py-3 hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 transition-colors">{c}</div>)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Education/Degree *</label>
                                                <input name="education" value={formData.education} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={prevStep} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                                            <button onClick={nextStep} className="flex-[2] py-5 bg-[#1e3a8a] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Wing Selection</button>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {wings.map(wing => (
                                                <div key={wing} onClick={() => handleCheckboxChange('preferredWings', wing)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${formData.preferredWings.includes(wing) ? 'bg-blue-50 border-blue-600' : 'bg-slate-50 border-slate-50'}`}>
                                                    <p className={`text-[9px] font-black uppercase tracking-tight ${formData.preferredWings.includes(wing) ? 'text-blue-600' : 'text-slate-400'}`}>{wing}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {formData.preferredWings.length > 0 && (
                                            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                                                <label className="text-[10px] font-black uppercase text-blue-400 tracking-widest ml-1">Primary Focus Wing *</label>
                                                <select name="mainPriorityWing" value={formData.mainPriorityWing} onChange={handleChange} className="w-full mt-3 bg-white border border-slate-200 rounded-xl px-6 py-4 font-bold text-sm outline-none">
                                                    <option value="">Select Main Wing...</option>
                                                    {formData.preferredWings.map(w => <option key={w} value={w}>{w}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            <button onClick={prevStep} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                                            <button onClick={nextStep} className="flex-[2] py-5 bg-[#1e3a8a] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Documentation</button>
                                        </div>
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="space-y-8">
                                        <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 text-center">
                                            <h4 className="font-merriweather font-black text-slate-800 text-xl mb-4 text-center">Upload Proof</h4>
                                            <p className="text-[11px] text-slate-500 font-medium mb-8">Please provide your ID Proof / Student ID (Optional but recommended for speedier approval).</p>
                                            <button onClick={() => docInputRef.current?.click()} className="bg-white border-2 border-dashed border-slate-200 text-slate-400 px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/50 transition-all w-full">
                                                {uploading ? "Uploading..." : "+ Click to Upload Document"}
                                            </button>
                                            <input type="file" ref={docInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />
                                            {formData.documents.length > 0 && <div className="mt-4 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{formData.documents.length} Doc(s) Prepared ✓</div>}
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={prevStep} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                                            <button onClick={nextStep} className="flex-[2] py-5 bg-[#1e3a8a] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Impact Pledge</button>
                                        </div>
                                    </div>
                                )}

                                {step === 6 && (
                                    <div className="space-y-10 text-center">
                                        <div className="bg-[#1e3a8a] p-10 rounded-[40px] text-white shadow-2xl">
                                            <div className="text-4xl mb-4">🛡️</div>
                                            <h4 className="text-2xl font-merriweather font-black mb-3">Sustainable Contribution</h4>
                                            <p className="text-blue-100 text-sm font-medium mb-8 opacity-80 leading-relaxed">A one-time pledge of <span className="font-black text-white">₹50</span> to fuel our grassroot operations. You can choose to skip if unable.</p>
                                            <div className="flex gap-3 justify-center">
                                                {['yes', 'no'].map(choice => (
                                                    <button key={choice} onClick={() => setFormData(p => ({ ...p, willingToContribute: choice }))} className={`px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${formData.willingToContribute === choice ? 'bg-white text-[#1e3a8a]' : 'bg-white/10 text-white/50 border border-white/10'}`}>
                                                        {choice === 'yes' ? 'Pledge ₹50' : 'Skip Now'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={prevStep} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                                            <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                                {loading ? 'Processing Protocol...' : 'Finalize Enrollment 🚀'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default VolunteerEnrollment;
