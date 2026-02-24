import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const SearchView = ({ requestId, setRequestId, handleSearch, loading, error }) => (
    <div className="flex flex-col items-center justify-center gap-12 max-w-4xl mx-auto py-20 px-4">
        <div className="text-center space-y-4">
            <h1 className="text-5xl font-merriweather font-black text-slate-900">Track your Request.</h1>
            <p className="text-slate-500 font-medium">Enter your Application ID to view the latest status of your legal grievance.</p>
        </div>

        <div className="w-full max-w-xl bg-white/40 backdrop-blur-xl p-12 rounded-[50px] border border-white/20 shadow-2xl shadow-emerald-500/5">
            <form onSubmit={handleSearch} className="flex flex-col gap-6">
                <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application ID</label>
                    <input
                        required
                        type="text"
                        value={requestId}
                        onChange={e => setRequestId(e.target.value)}
                        placeholder="Example: VVVLR0001"
                        className="w-full bg-slate-50/50 px-8 py-5 rounded-2xl border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold tracking-widest uppercase text-center text-xl"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 text-white font-black px-12 py-5 rounded-[22px] shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all text-sm uppercase tracking-widest w-full"
                >
                    {loading ? 'Searching...' : 'Track Now'}
                </button>
                {error && <p className="text-rose-500 text-xs font-bold text-center mt-2">{error}</p>}
            </form>
        </div>

        <button onClick={() => window.location.href = '/legal-aid'} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Back</button>
    </div>
);

const TrackingView = ({ requestData, requestId, setView, statusSteps, getStatusIndex }) => {
    const currentIndex = getStatusIndex(requestData.status);
    const isRejected = requestData.status === 'Rejected';

    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/40 backdrop-blur-3xl rounded-[60px] p-12 md:p-16 border border-white/40 shadow-2xl relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-16">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-merriweather font-black text-slate-800">Track<br />your Request.</h1>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Application ID</p>
                                <h2 className="text-3xl font-merriweather font-black text-[#1e3a8a]">{requestData.requestId || requestId}</h2>
                            </div>
                        </div>
                        <div className={`w-16 h-16 ${isRejected ? 'bg-rose-500' : 'bg-orange-500'} rounded-3xl flex items-center justify-center text-3xl text-white shadow-xl shadow-orange-500/20`}>
                            {isRejected ? '🚫' : '✉️'}
                        </div>
                    </div>

                    {isRejected && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12 bg-rose-50 border border-rose-100 p-8 rounded-[40px] flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl text-rose-500">⚠️</span>
                                <h3 className="text-2xl font-merriweather font-black text-rose-900 text-center flex-1">Request Rejected</h3>
                            </div>
                            <p className="text-rose-700 font-medium text-center">Your request has been rejected after review. Please check the updates for the reason.</p>
                            {requestData.adminMessage && (
                                <div className="mt-4 p-6 bg-white/50 rounded-2xl border border-rose-100 italic text-slate-600 text-center font-medium">
                                    "{requestData.adminMessage}"
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Timeline */}
                    <div className={`relative space-y-12 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 pl-4 ml-3 ${isRejected ? 'opacity-50 grayscale' : ''}`}>
                        {statusSteps.map((step, i) => {
                            const isCompleted = i < currentIndex;
                            const isCurrent = i === currentIndex;

                            return (
                                <div key={i} className="relative pl-12">
                                    <div className={`absolute left-[-26px] top-2 w-6 h-6 rounded-full border-4 border-white z-10 transition-all duration-500 ${isCompleted ? 'bg-emerald-500 scale-100' : isCurrent ? 'bg-orange-500 scale-125 shadow-lg shadow-orange-500/30' : 'bg-slate-200'}`} />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-4">
                                            <h3 className={`text-xl font-bold transition-all ${isCurrent ? 'text-slate-900 text-2xl' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                                {step.label}
                                            </h3>
                                            {(isCurrent || isCompleted) && (
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {i === 0 ? new Date(requestData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + new Date(requestData.createdAt).toLocaleDateString() : 'Updated'}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed max-w-sm transition-all ${isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-20 flex justify-between items-center">
                        <button onClick={() => setView('search')} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Back</button>
                        <button onClick={() => setView('updates')} className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:text-emerald-700 transition-all underline underline-offset-8">View Updates</button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const UpdatesView = ({ requestData, setView }) => (
    <div className="max-w-4xl mx-auto py-20 px-4">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-3xl rounded-[60px] p-12 md:p-16 border border-white/40 shadow-2xl relative overflow-hidden min-h-[600px]"
        >
            <div className="flex justify-between items-start mb-16">
                <h1 className="text-5xl font-merriweather font-black text-slate-800">Updates</h1>
                <div className={`w-16 h-16 ${requestData.status === 'Rejected' ? 'bg-rose-500' : 'bg-orange-500'} rounded-3xl flex items-center justify-center text-3xl text-white shadow-xl shadow-orange-500/20`}>
                    {requestData.status === 'Rejected' ? '🚫' : '✉️'}
                </div>
            </div>

            <div className="space-y-6 flex flex-col items-center">
                <div className="w-full bg-slate-900/80 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 text-center">
                    <p className="text-white font-medium text-sm leading-relaxed">Your legal assistance request has been successfully submitted and is under review.</p>
                </div>

                {requestData.status === 'Rejected' && (
                    <div className="w-full bg-rose-900/80 backdrop-blur-xl p-6 rounded-[30px] border border-rose-300/20 text-center">
                        <p className="text-rose-100 font-black text-xs uppercase tracking-widest mb-2">Final Conclusion</p>
                        <p className="text-white font-bold text-lg leading-relaxed">REJECTED</p>
                    </div>
                )}

                {requestData.adminMessage ? (
                    <div className="w-full bg-slate-900/80 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 text-center">
                        <p className="text-white font-medium text-sm leading-relaxed">{requestData.adminMessage}</p>
                    </div>
                ) : (
                    <div className="w-full bg-slate-900/80 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 text-center">
                        <p className="text-white font-medium text-sm leading-relaxed">
                            {requestData.status === 'Rejected'
                                ? 'No specific reason provided by the administrator.'
                                : 'We have received your request and our legal advisory team is currently assessing it.'
                            }
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-16 right-16">
                <button onClick={() => setView('tracking')} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Back</button>
            </div>
        </motion.div>
    </div>
);

const LegalStatus = () => {
    const [requestId, setRequestId] = useState('');
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState('search'); // 'search', 'tracking', 'updates'

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        console.log('Searching for ID:', requestId.trim().toUpperCase());
        try {
            const res = await axios.get(`/api/legal/status/${requestId.trim().toUpperCase()}`);
            setRequestData(res.data);
            setView('tracking');
        } catch (err) {
            setError(err.response?.data?.error || 'Request ID not found. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        { label: 'Submitted', desc: 'Your request has been successfully received and recorded.' },
        { label: 'In Review', desc: 'Our team is currently reviewing the details of your request.' },
        { label: 'In Process', desc: 'The request is actively being worked on and necessary actions are underway.' },
        { label: 'Done', desc: 'The request has been completed successfully.' }
    ];

    const getStatusIndex = (currentStatus) => {
        const index = statusSteps.findIndex(s => s.label === currentStatus);
        if (currentStatus === 'Rejected') return -1;
        return index;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 pt-24 overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[150px] opacity-30 select-none pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[150px] opacity-20 select-none pointer-events-none" />

            <AnimatePresence mode="wait">
                {view === 'search' && (
                    <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SearchView
                            requestId={requestId}
                            setRequestId={setRequestId}
                            handleSearch={handleSearch}
                            loading={loading}
                            error={error}
                        />
                    </motion.div>
                )}
                {view === 'tracking' && (
                    <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <TrackingView
                            requestData={requestData}
                            requestId={requestId}
                            setView={setView}
                            statusSteps={statusSteps}
                            getStatusIndex={getStatusIndex}
                        />
                    </motion.div>
                )}
                {view === 'updates' && (
                    <motion.div key="updates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <UpdatesView
                            requestData={requestData}
                            setView={setView}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LegalStatus;
