import { useState } from 'react';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const LandingView = ({ setView }) => (
    <div className="flex flex-col items-center justify-center gap-12 max-w-6xl mx-auto py-20">
        <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-merriweather font-black text-slate-900">Legal Assistance</h1>
            <p className="text-slate-500 text-lg font-medium">Accessible legal guidance to protect rights and support those in need.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full px-4">
            <motion.div
                whileHover={{ y: -10 }}
                className="bg-emerald-500/10 backdrop-blur-xl p-12 rounded-[50px] border border-emerald-500/20 flex flex-col items-center text-center gap-6 shadow-2xl shadow-emerald-500/5"
            >
                <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-4xl text-white shadow-xl shadow-emerald-500/20">⚖️</div>
                <div>
                    <h2 className="text-3xl font-merriweather font-black text-slate-900 mb-3">Get Legal Assistance!</h2>
                    <p className="text-slate-600 font-medium px-4">Fill out our request form to get guidance from our expert legal wing.</p>
                </div>
                <button
                    onClick={() => setView('form')}
                    className="bg-orange-500 text-white font-black px-12 py-5 rounded-[22px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all text-sm uppercase tracking-widest mt-4"
                >
                    Fill the Form
                </button>
            </motion.div>

            <motion.div
                whileHover={{ y: -10 }}
                className="bg-[#1e3a8a]/5 backdrop-blur-xl p-12 rounded-[50px] border border-[#1e3a8a]/10 flex flex-col items-center text-center gap-6 shadow-2xl shadow-blue-900/5"
            >
                <div className="w-20 h-20 bg-[#1e40af] rounded-3xl flex items-center justify-center text-4xl text-white shadow-xl shadow-blue-900/20">🔍</div>
                <div>
                    <h2 className="text-3xl font-merriweather font-black text-slate-900 mb-3">Track your Request</h2>
                    <p className="text-slate-600 font-medium px-4">View the current status and progress of your submitted request in real-time.</p>
                </div>
                <div className="w-full max-w-xs mt-4">
                    <button
                        onClick={() => window.location.href = '/legal-status'}
                        className="w-full bg-orange-500 text-white font-black px-12 py-5 rounded-[22px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all text-sm uppercase tracking-widest"
                    >
                        Track Now
                    </button>
                </div>
            </motion.div>
        </div>

        <button onClick={() => window.location.href = '/'} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all mt-8">Back</button>
    </div>
);

const FormView = ({ formData, setFormData, files, setFiles, submitting, error, handleSubmit, setView }) => (
    <div className="max-w-4xl mx-auto py-20 px-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-2xl p-12 md:p-16 rounded-[60px] shadow-2xl border border-white/40 overflow-hidden relative"
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />

            <div className="mb-12">
                <h1 className="text-4xl font-merriweather font-black text-slate-900 mb-2">Request Form</h1>
                <p className="text-slate-500 font-medium">The form is to understand and respond accordingly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8 flex-1">
                        <h3 className="text-lg font-merriweather font-black text-[#1e3a8a] mb-4">General Information</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name *</label>
                                <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-slate-50/50 px-8 py-5 rounded-2xl border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number *</label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50/50 px-8 py-5 rounded-2xl border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID *</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50/50 px-8 py-5 rounded-2xl border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold" placeholder="name@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address *</label>
                                <input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50/50 px-8 py-5 rounded-2xl border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold" placeholder="House No, Street, City, State" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-lg font-merriweather font-black text-[#1e3a8a] mb-4">Upload Files</h3>
                        <div className="relative group">
                            <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="w-32 h-32 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white hover:border-emerald-300 transition-all">
                                <span className="text-4xl text-slate-300">+</span>
                            </label>
                            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                                {files.map((f, i) => <span key={i} className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{f.name}</span>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-merriweather font-black text-[#1e3a8a]">Describe your Problem</h3>
                    <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={8} className="w-full bg-slate-50/50 p-10 rounded-[40px] border border-slate-100 outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium text-lg" placeholder="Describe your legal concern in detail..." />
                </div>

                {error && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-4 rounded-xl border border-rose-100 text-center">{error}</p>}

                <div className="flex justify-between items-center pt-8">
                    <button type="button" onClick={() => setView('landing')} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Back</button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-orange-500 text-white font-black px-16 py-5 rounded-[22px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 transform hover:-translate-y-1 transition-all text-sm uppercase tracking-widest"
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </motion.div>
    </div>
);

const SuccessView = ({ requestId, setView }) => (
    <div className="max-w-4xl mx-auto py-20 px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 shadow-2xl shadow-indigo-50/50 rounded-[60px] p-16 md:p-24 text-center border border-white/10"
        >
            <div className="mb-12">
                <h2 className="text-4xl font-merriweather font-black text-white mb-6 tracking-tight">Your Request is Submitted!</h2>
                <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 inline-block">
                    <p className="text-white text-xl font-bold font-merriweather">
                        Your Request ID : <span className="text-orange-500">{requestId}</span>
                    </p>
                </div>
            </div>

            <p className="text-slate-400 text-lg mb-12 max-w-sm mx-auto font-medium">Please save your Request ID for future reference. You can track your progress in real-time.</p>

            <div className="flex flex-col gap-6 items-center">
                <button
                    onClick={() => window.location.href = '/legal-status'}
                    className="bg-orange-500 text-white font-black px-16 py-6 rounded-[22px] shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all uppercase tracking-widest"
                >
                    Track Status
                </button>
                <button onClick={() => setView('landing')} className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-300 transition-all">Back</button>
            </div>
        </motion.div>
    </div>
);

const LegalAid = () => {
    const [view, setView] = useState('landing'); // 'landing', 'form', 'success'
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        message: ''
    });
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [requestId, setRequestId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('address', formData.address);
        data.append('message', formData.message);
        files.forEach(file => data.append('files', file));

        try {
            const res = await axios.post('/api/legal/submit', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.status === 'success') {
                setRequestId(res.data.requestId);
                setView('success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF6] pt-24 overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[150px] opacity-50 select-none pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1e40af]/10 rounded-full blur-[150px] opacity-30 select-none pointer-events-none" />

            <AnimatePresence mode="wait">
                {view === 'landing' && (
                    <motion.div key="landing" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                        <LandingView setView={setView} />
                    </motion.div>
                )}
                {view === 'form' && (
                    <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
                        <FormView
                            formData={formData}
                            setFormData={setFormData}
                            files={files}
                            setFiles={setFiles}
                            submitting={submitting}
                            error={error}
                            handleSubmit={handleSubmit}
                            setView={setView}
                        />
                    </motion.div>
                )}
                {view === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
                        <SuccessView requestId={requestId} setView={setView} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LegalAid;
