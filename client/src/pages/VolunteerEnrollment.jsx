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
        interests: [],
        willingToContribute: 'no',
        profilePhoto: '',
        documents: [],
        profession: 'Student', // Added: Student or Working Professional
        occupation: '',        // Added
        organization: '',      // Added
        experience: ''         // Added
    });

    const [loading, setLoading] = useState(false);
    const [showMockPayment, setShowMockPayment] = useState(false);
    const [mockPaymentOptions, setMockPaymentOptions] = useState(null);
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

        // Size validation
        const PDF_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
        const IMAGE_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB

        if (file.type === 'application/pdf') {
            if (file.size > PDF_SIZE_LIMIT) {
                alert("PDF file size exceeds 10MB limit. Please upload a smaller file.");
                return;
            }
        } else if (file.type.startsWith('image/')) {
            if (file.size > IMAGE_SIZE_LIMIT) {
                alert("Image file size exceeds 3MB limit. Please upload a smaller file.");
                return;
            }
        }

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
            if (!formData.state || !formData.district || !formData.profession || !formData.education) {
                alert("All address and education fields are mandatory.");
                return false;
            }
            if (formData.profession === 'Student' && !formData.collegeName) {
                alert("Please provide your College/Institution name.");
                return false;
            }
            if ((formData.profession === 'Working Professional' || formData.profession === 'Corporate') && (!formData.occupation || !formData.organization)) {
                alert("Please provide your current occupation and organization.");
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
                interests: formData.interests.join(', '),
                willingToContribute: 'yes'
            };
            const res = await axios.post('/api/volunteer/enroll', payload);
            const { enrollmentId } = res.data;

            const monthlyAmount = formData.profession === 'Student' ? 49 : formData.profession === 'Corporate' ? 999 : 89;
            const subResponse = await axios.post('/api/create-subscription', {
                amount: monthlyAmount,
                email: formData.email,
                name: formData.fullName
            });

            const { data: { key } } = await axios.get("/api/get-key");

            const options = {
                key: key,
                subscription_id: subResponse.data.id,
                name: "VVV Foundation",
                description: `Monthly Membership (${formData.profession}) - ₹${monthlyAmount}`,
                image: "https://res.cloudinary.com/dp9qhgckr/image/upload/v1740685000/vv_foundation/logo_circle.png",
                handler: async function (response) {
                    await axios.post("/api/volunteer/payment-success", {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_subscription_id: response.razorpay_subscription_id,
                        enrollmentId
                    });
                    alert("Enrollment & Membership Subscription Successful!");
                    navigate('/profile');
                },
                prefill: { name: formData.fullName, email: formData.email, contact: formData.contactNumber },
                theme: { color: "#1e3a8a" },
            };

            if (subResponse.data.id && subResponse.data.id.startsWith('sub_mock_')) {
                setMockPaymentOptions(options);
                setShowMockPayment(true);
            } else {
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    alert(`Payment Failed: ${response.error.description || 'Payment authorization failed or was cancelled.'}`);
                });
                rzp.open();
            }
        } catch (err) {
            console.error("Enrollment Error:", err);
            const errorMsg = err.response?.data?.error || err.message;
            alert(`Submission failed: ${errorMsg}`);
        } finally {
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
                    <p className="text-slate-500 mb-8">You are already registered as an active member. Your dedication to the mission is highly valued.</p>
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
                        Join Viswa Vignana Vaaradhi to contribute towards legal awareness, rural empowerment, and educational growth. Every member is a cornerstone of our foundation.
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
                                To become a member, please first create an account or sign in to your dashboard. This helps us maintain secure and accurate records.
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
                                <p className="text-[#F59E0B] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Member Step {step} of 6</p>
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
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profession *</label>
                                                <div className="flex flex-wrap sm:flex-nowrap gap-4">
                                                    {['Student', 'Working Professional', 'Corporate'].map(p => (
                                                        <button key={p} type="button" onClick={() => setFormData(prev => ({ ...prev, profession: p }))} className={`flex-1 py-4 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${formData.profession === p ? 'bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]' : 'bg-slate-50 border-slate-50 text-slate-400'}`}>
                                                            {p}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {formData.profession === 'Student' ? (
                                                <>
                                                    <div className="sm:col-span-2 space-y-2 relative">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College/Institution *</label>
                                                        <input value={collegeSearch} onChange={(e) => { setCollegeSearch(e.target.value); setFormData(p => ({ ...p, collegeName: e.target.value })); }} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" placeholder="Start typing institution name..." />
                                                        {collegeSearch && !colleges.includes(collegeSearch) && (
                                                            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-48 overflow-y-auto">
                                                                {colleges.filter(c => c.toLowerCase().includes(collegeSearch.toLowerCase())).map(c => <div key={c} onClick={() => { setCollegeSearch(c); setFormData(p => ({ ...p, collegeName: c })); }} className="px-6 py-3 hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 transition-colors">{c}</div>)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Occupation *</label>
                                                        <input name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organization/Company *</label>
                                                        <input name="organization" value={formData.organization} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                                    </div>
                                                    <div className="sm:col-span-2 space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Years of Experience (Optional)</label>
                                                        <input name="experience" value={formData.experience} onChange={handleChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white transition-all font-bold text-sm" />
                                                    </div>
                                                </>
                                            )}
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
                                        <div className="bg-[#1e3a8a] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🔄</div>
                                            <p className="text-[10px] font-black uppercase text-amber-400 mb-2 tracking-[0.2em]">Council Pledge (Secure Autopay)</p>
                                            <h4 className="text-2xl font-merriweather font-black mb-3">Monthly Membership Autopay</h4>
                                            <p className="text-blue-100 text-sm font-medium mb-8 opacity-90 leading-relaxed">
                                                As a <span className="font-black text-white">{formData.profession}</span> member, you commit to a recurring support of <span className="font-black text-white">₹{formData.profession === 'Student' ? 49 : formData.profession === 'Corporate' ? 999 : 89}/mo</span> to keep the foundation's missions active.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={prevStep} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Back</button>
                                            <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                                {loading ? 'Processing Protocol...' : 'Finalize Autopay & Enroll 🚀'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mock Razorpay Subscription Simulator Modal */}
            <AnimatePresence>
                {showMockPayment && mockPaymentOptions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
                        >
                            {/* Modal Header */}
                            <div className="bg-[#1e3a8a] text-white p-6 relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">💳</div>
                                    <div>
                                        <h3 className="font-bold text-sm tracking-wide">Razorpay Simulator</h3>
                                        <p className="text-[10px] text-blue-200 uppercase font-black tracking-wider">Local Sandbox Mode</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowMockPayment(false);
                                        alert("Payment Simulation Cancelled");
                                    }}
                                    className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 space-y-6">
                                <div className="text-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Subscription Cost</p>
                                    <p className="text-3xl font-black text-slate-800">
                                        {(() => {
                                            const amtMatch = mockPaymentOptions.description.match(/₹(\d+)/);
                                            return amtMatch ? `₹${amtMatch[1]}.00` : '₹89.00';
                                        })()}
                                        <span className="text-xs text-slate-400 font-medium">/month</span>
                                    </p>
                                    <p className="text-[11px] text-[#1e3a8a] font-bold mt-2">{mockPaymentOptions.description}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Subscriber</span>
                                        <span className="text-slate-700">{mockPaymentOptions.prefill.name}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Email</span>
                                        <span className="text-slate-700">{mockPaymentOptions.prefill.email}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400">Subscription ID</span>
                                        <span className="text-slate-700 font-mono tracking-tighter text-[11px]">{mockPaymentOptions.subscription_id}</span>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-xl flex gap-3 text-amber-800">
                                    <span className="text-lg">🛡️</span>
                                    <p className="text-[10px] font-medium leading-relaxed">
                                        Autopay mandate will be simulated. This simulates a successful verification callback from Razorpay API.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => {
                                        setShowMockPayment(false);
                                        alert("Payment Simulation Cancelled");
                                    }}
                                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMockPayment(false);
                                        alert("Payment Simulation Failed: Insufficient funds or authorization declined.");
                                    }}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100"
                                >
                                    Simulate Failure ✕
                                </button>
                                <button
                                    onClick={async () => {
                                        setLoading(true);
                                        setShowMockPayment(false);
                                        try {
                                            await mockPaymentOptions.handler({
                                                razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
                                                razorpay_subscription_id: mockPaymentOptions.subscription_id
                                            });
                                        } catch (err) {
                                            alert("Success Handler failed: " + err.message);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100"
                                >
                                    Simulate Success ✓
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default VolunteerEnrollment;
