import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { geoData, wings, interests, colleges, wingDetails } from '../data/geoData';

const VolunteerEnrollment = () => {
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
        otherCollege: '',
        education: '',
        preferredWings: [],
        mainPriorityWing: '',
        areaOfInterest: [],
        otherInterest: '',
        willingToContribute: 'no',
        profilePhoto: '',
        documents: []
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [collegeSearch, setCollegeSearch] = useState('');
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);
    const navigate = useNavigate();

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const genders = ["Male", "Female", "Prefer not to say"];

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

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const storedUser = localStorage.getItem('vvv_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || '',
                profilePhoto: user.picture || ''
            }));
        }
    }, [step]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                preferredWings: formData.preferredWings.join(', '),
                interests: formData.areaOfInterest.includes('Others')
                    ? [...formData.areaOfInterest, formData.otherInterest].join(', ')
                    : formData.areaOfInterest.join(', ')
            };
            const res = await axios.post('/api/volunteer/enroll', payload);
            const { enrollmentId } = res.data;

            if (formData.willingToContribute === 'yes') {
                const isScriptLoaded = await loadRazorpayScript();
                if (!isScriptLoaded) {
                    alert("Razorpay SDK failed to load.");
                    setLoading(false);
                    return;
                }
                const { data: { key } } = await axios.get("/api/get-key");
                const { data: order } = await axios.post("/api/create-order", { amount: 50 });

                const options = {
                    key: key,
                    amount: order.amount,
                    currency: "INR",
                    name: "VVV Foundation",
                    description: "Volunteer Contribution",
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

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const StepIndicator = () => (
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
            <div className="absolute top-1/2 left-0 h-0.5 bg-[#1e3a8a] -translate-y-1/2 -z-10 transition-all duration-500" style={{ width: `${(step - 1) / 5 * 100}%` }}></div>
            {[1, 2, 3, 4, 5, 6].map((s) => (
                <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${step >= s ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-300 border-2 border-slate-100'}`}>
                    {step > s ? '✓' : s}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCF6] pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#F59E0B] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Step {step} of 6</motion.p>
                    <h1 className="text-4xl md:text-5xl font-merriweather font-black text-slate-900 leading-tight">
                        {step === 1 && "Choose Your Mission"}
                        {step === 2 && "Identity & Photo"}
                        {step === 3 && "Locality & Background"}
                        {step === 4 && "Area of Involvement"}
                        {step === 5 && "Documentation"}
                        {step === 6 && "Contribution & Pledge"}
                    </h1>
                </div>

                <StepIndicator />

                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[50px] shadow-[0_40px_80px_-20px_rgba(30,58,138,0.1)] p-8 md:p-16 border border-white/40 backdrop-blur-sm relative">

                    {/* Step 1: Mission Selection */}
                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(wingDetails).map(([key, details]) => (
                                    <div key={key} className="p-8 rounded-[35px] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all group cursor-default">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-3xl bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm">{details.icon}</span>
                                            <h3 className="text-lg font-black text-slate-800 leading-tight">{details.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">{details.objective}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {details.activities.map(a => <span key={a} className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{a}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center pt-8">
                                <button onClick={nextStep} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1e40af] transition-all shadow-xl shadow-blue-900/10">Continue to Identity</button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Identity & Photo */}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl bg-white shadow-inner flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200">
                                        {uploading ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="text-2xl">⏳</motion.div>
                                        ) : (
                                            formData.profilePhoto ? (
                                                <img src={formData.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                                            ) : (
                                                <span className="text-4xl">📸</span>
                                            )
                                        )}
                                    </div>
                                    <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">+</button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} />
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="font-black text-slate-800">Profile Photo</h3>
                                    <p className="text-xs text-slate-400 font-medium">A clear photo helps us identify you for the VVV Foundation ID card.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-8 py-5 rounded-[25px] bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700" placeholder="e.g. Ram Nandan" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                                    <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-8 py-5 rounded-[22px] bg-slate-50 border border-slate-100 focus:bg-white outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-8 py-5 rounded-[22px] bg-slate-50 border border-slate-100 focus:bg-white outline-none">
                                        <option value="">Select</option>
                                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                                    <input name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} className="w-full px-8 py-5 rounded-[22px] bg-slate-50 border border-slate-100 focus:bg-white outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-8 py-5 rounded-[22px] bg-slate-50 border border-slate-100 focus:bg-white outline-none">
                                        <option value="">Select Group</option>
                                        {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-between pt-12">
                                <button onClick={prevStep} className="text-slate-400 font-black uppercase tracking-widest text-[10px] px-8 hover:text-slate-600 transition-all">Back</button>
                                <button onClick={nextStep} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1e40af] transition-all">Next Step</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location & Education */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                                    <select name="state" value={formData.state} onChange={handleChange} className="w-full px-8 py-5 rounded-[22px] bg-slate-50 border border-slate-100 focus:bg-white outline-none">
                                        <option value="">Select State</option>
                                        {Object.keys(geoData).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District</label>
                                    <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.state} className="w-full px-8 py-5 rounded-[22px] bg-slate-50 border border-slate-100 focus:bg-white outline-none disabled:opacity-50">
                                        <option value="">Select District</option>
                                        {formData.state && geoData[formData.state].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2 col-span-2 relative">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name of College</label>
                                    <input placeholder="Search your college..." className="w-full px-8 py-5 rounded-[25px] bg-slate-50 border border-slate-100 focus:bg-white outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700" value={collegeSearch} onChange={(e) => { setCollegeSearch(e.target.value); setFormData(p => ({ ...p, collegeName: e.target.value })); }} />
                                    {collegeSearch && !colleges.includes(collegeSearch) && (
                                        <div className="absolute z-50 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-64 overflow-y-auto">
                                            {colleges.filter(c => c.toLowerCase().includes(collegeSearch.toLowerCase())).map(c => <div key={c} onClick={() => { setCollegeSearch(c); setFormData(p => ({ ...p, collegeName: c })); }} className="px-8 py-4 hover:bg-slate-50 cursor-pointer text-sm font-bold text-slate-600 transition-colors">{c}</div>)}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Education Qualification</label>
                                    <input name="education" value={formData.education} onChange={handleChange} className="w-full px-8 py-5 rounded-[22px] bg-slate-50 border border-slate-100 focus:bg-white outline-none" placeholder="e.g. B.Tech 3rd Year" />
                                </div>
                            </div>
                            <div className="flex justify-between pt-12">
                                <button onClick={prevStep} className="text-slate-400 font-black uppercase tracking-widest text-[10px] px-8 hover:text-slate-600 transition-all">Back</button>
                                <button onClick={nextStep} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1e40af] transition-all">Next Step</button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Engagement */}
                    {step === 4 && (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {wings.map(wing => (
                                    <div key={wing} onClick={() => handleCheckboxChange('preferredWings', wing)} className={`p-6 rounded-[25px] border-2 cursor-pointer transition-all ${formData.preferredWings.includes(wing) ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-50 hover:border-blue-100'}`}>
                                        <p className={`text-xs font-black uppercase tracking-tight ${formData.preferredWings.includes(wing) ? 'text-blue-600' : 'text-slate-400'}`}>{wing}</p>
                                    </div>
                                ))}
                            </div>
                            {formData.preferredWings.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-8 bg-blue-50/50 rounded-[35px] border border-blue-100/50">
                                    <label className="text-[10px] font-black uppercase text-blue-400 tracking-widest ml-1">Select your primary focus mission</label>
                                    <select name="mainPriorityWing" value={formData.mainPriorityWing} onChange={handleChange} className="w-full mt-4 bg-white border border-slate-200 rounded-[22px] px-8 py-5 font-bold text-sm outline-none focus:ring-4 focus:ring-blue-100 shadow-sm">
                                        <option value="">Choose Main Wing...</option>
                                        {formData.preferredWings.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </motion.div>
                            )}
                            <div className="flex justify-between pt-12">
                                <button onClick={prevStep} className="text-slate-400 font-black uppercase tracking-widest text-[10px] px-8 hover:text-slate-600 transition-all">Back</button>
                                <button onClick={nextStep} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1e40af] transition-all">Next Step</button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Documentation */}
                    {step === 5 && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="bg-orange-50/50 p-10 rounded-[40px] border border-orange-100 text-center">
                                <div className="text-4xl mb-4">📄</div>
                                <h3 className="font-merriweather font-black text-slate-800 text-xl mb-2">Verification Documents</h3>
                                <p className="text-xs text-slate-500 font-medium mb-8">Please upload necessary documents (ID Proof, Qualification Certificates) for verification.</p>

                                <div className="space-y-4">
                                    <button onClick={() => docInputRef.current?.click()} className="bg-white border-2 border-dashed border-orange-200 text-orange-600 px-8 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-50 transition-all w-full flex items-center justify-center gap-4">
                                        {uploading ? "Uploading..." : "+ Upload New Document"}
                                    </button>
                                    <input type="file" ref={docInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />

                                    <div className="space-y-2 pt-4">
                                        {formData.documents.map((doc, i) => (
                                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-600 truncate max-w-[200px]">{doc.name}</span>
                                                <span className="text-green-500 text-[10px] font-black uppercase">Uploaded ✓</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between pt-12">
                                <button onClick={prevStep} className="text-slate-400 font-black uppercase tracking-widest text-[10px] px-8 hover:text-slate-600 transition-all">Back</button>
                                <button onClick={nextStep} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1e40af] transition-all">Next Step</button>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Contribution */}
                    {step === 6 && (
                        <div className="max-w-2xl mx-auto space-y-12 text-center">
                            <div className="bg-blue-50/50 p-12 rounded-[50px] border border-blue-100">
                                <div className="w-20 h-20 bg-blue-600 text-white rounded-[30px] flex items-center justify-center text-3xl mx-auto mb-8">🛡️</div>
                                <h3 className="text-3xl font-merriweather font-black text-blue-900 mb-4">The Impact Pledge</h3>
                                <p className="text-blue-700/60 font-medium mb-8">A nominal contribution of <span className="text-blue-600 font-black">₹50</span> to support our outreach.</p>
                                <div className="flex justify-center gap-4">
                                    {['yes', 'no'].map(choice => (
                                        <button key={choice} onClick={() => setFormData(p => ({ ...p, willingToContribute: choice }))} className={`px-12 py-5 rounded-[25px] font-black uppercase tracking-widest text-[10px] transition-all ${formData.willingToContribute === choice ? 'bg-[#1e3a8a] text-white shadow-2xl' : 'bg-white text-slate-300 border border-slate-100'}`}>
                                            {choice === 'yes' ? 'Yes, I am willing' : 'No, maybe later'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between pt-12">
                                <button onClick={prevStep} className="text-slate-400 font-black uppercase tracking-widest text-[10px] px-8 hover:text-slate-600 transition-all">Back</button>
                                <button onClick={handleSubmit} disabled={loading} className="bg-[#1e3a8a] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1e40af] transition-all">
                                    {loading ? 'Processing...' : 'Complete Enrollment 🚀'}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default VolunteerEnrollment;
