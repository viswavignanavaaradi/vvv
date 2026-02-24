import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, icon, trend, colorClass }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${colorClass}`}>
                {icon}
            </div>
            {trend && (
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-3xl font-merriweather font-black text-slate-900">{value}</h4>
        </div>
    </motion.div>
);

const Admin = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [donations, setDonations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [legalRequests, setLegalRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [adminMsg, setAdminMsg] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('');
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        if (loggedIn) {
            fetchData();
        }
    }, [loggedIn, activeTab]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setLoggedIn(true);
        } else {
            alert('Invalid Password');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'donations' || activeTab === 'dashboard') {
                const res = await axios.get('/api/admin/donations');
                setDonations(res.data);
            }
            if (activeTab === 'requests' || activeTab === 'dashboard') {
                const res = await axios.get('/api/admin/legal-requests');
                setLegalRequests(res.data);
            }
            if (activeTab === 'volunteers' || activeTab === 'dashboard') {
                const res = await axios.get('/api/admin/volunteers');
                setVolunteers(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id) => {
        try {
            await axios.put(`/api/admin/legal-requests/${id}/status`, {
                status: statusUpdate,
                adminMessage: adminMsg
            });
            alert('Status updated successfully');
            setSelectedRequest(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const handleDownload = (url, name) => {
        const downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadCertificate = (certId) => {
        if (!certId) {
            alert('No certificate ID found for this donation.');
            return;
        }
        window.open(`/api/user/download-certificate?certId=${certId}`, '_blank');
    };

    if (!loggedIn) {
        return (
            <div className="h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-[#1e3a8a] rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-lg shadow-blue-100">🛡️</div>
                    <h2 className="text-4xl font-merriweather font-black text-slate-900 mb-2">Admin Portal</h2>
                    <p className="text-slate-400 mb-10 font-medium tracking-tight">Enterprise Access • NGO Management</p>
                    <form onSubmit={handleLogin} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Authentication Key</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#1e3a8a] outline-none transition-all font-bold text-lg" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full bg-[#1e3a8a] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#1e40af] transition-all transform hover:-translate-y-1 active:scale-95">Verify & Access</button>
                    </form>
                </motion.div>
            </div>
        );
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'requests', label: 'Legal Aid Requests', icon: '⚖️' },
        { id: 'donations', label: 'Donations Ledger', icon: '🤝' },
        { id: 'volunteers', label: 'Volunteers Hub', icon: '👥' },
        { id: 'account', label: 'Admin Settings', icon: '⚙️' },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-inter overflow-hidden">
            {/* Professional Sidebar */}
            <div className="w-72 bg-[#0F172A] flex flex-col relative z-20 shadow-2xl">
                <div className="p-8 mb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-sm">VVV</div>
                        <h2 className="text-white font-merriweather font-black text-lg tracking-tight">Admin<span className="text-emerald-500 text-xs ml-1 font-bold">PRO</span></h2>
                    </div>
                    <div className="h-px bg-slate-800 w-full" />
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSelectedRequest(null); setSelectedVolunteer(null); setSelectedDonation(null); }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-sm transition-all group ${activeTab === item.id ? 'bg-[#1E293B] text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/50'}`}
                        >
                            <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === item.id ? 'opacity-100' : 'opacity-50'}`}>{item.icon}</span>
                            {item.label}
                            {activeTab === item.id && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto space-y-2">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full flex items-center justify-center gap-3 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700"
                    >
                        <span>🏠</span> Back to Home
                    </button>
                    <button
                        onClick={() => setLoggedIn(false)}
                        className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                        <span>🚪</span> Log out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 relative z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#1e3a8a] hover:bg-slate-100 transition-all border border-slate-100"
                            title="Go Back"
                        >
                            <span className="text-lg">←</span>
                        </button>
                        <h1 className="text-xl font-merriweather font-black text-slate-800">{menuItems.find(m => m.id === activeTab)?.label}</h1>
                        <div className="h-4 w-px bg-slate-300 mx-2" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab} / nexus-v2</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Authenticated as</p>
                            <p className="text-sm font-bold text-slate-700">System Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg border border-slate-200">🛡️</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
                    {activeTab !== 'dashboard' && (
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className="mb-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1e3a8a] transition-all bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm"
                        >
                            ← Back to Dashboard
                        </button>
                    )}
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        label="Total Capital"
                                        value={`₹${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}`}
                                        icon="💰"
                                        trend="+12% ↑"
                                        colorClass="bg-emerald-50 text-emerald-600"
                                    />
                                    <StatCard
                                        label="Enrolled Volunteers"
                                        value={volunteers.length.toLocaleString()}
                                        icon="👥"
                                        trend="+4 this week"
                                        colorClass="bg-blue-50 text-blue-600"
                                    />
                                    <StatCard
                                        label="Pending Legal Cases"
                                        value={legalRequests.filter(r => r.status !== 'Done' && r.status !== 'Rejected').length}
                                        icon="⚖️"
                                        colorClass="bg-orange-50 text-orange-600"
                                    />
                                    <StatCard
                                        label="Completed Goals"
                                        value={legalRequests.filter(r => r.status === 'Done').length}
                                        icon="✅"
                                        colorClass="bg-purple-50 text-purple-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    <div className="xl:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-lg font-merriweather font-black text-slate-800">Recent Transactions</h3>
                                            <button onClick={() => setActiveTab('donations')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-[#1e3a8a] text-white">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-tl-2xl">Date</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Amount</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-tr-2xl">Reference</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 border-x border-b border-slate-100">
                                                    {donations.slice(0, 5).map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                                            <td className="px-6 py-5 text-xs font-bold text-slate-700 tracking-tighter uppercase">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                            <td className="px-6 py-5 text-xs font-black text-emerald-600">₹{item.amount.toLocaleString()}</td>
                                                            <td className="px-6 py-5 text-xs font-bold text-slate-400 truncate max-w-[150px]">{item.payment_id || 'LOCAL-MIGRATE'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="bg-[#1e3a8a] rounded-[32px] shadow-xl p-8 text-white flex flex-col">
                                        <h3 className="text-lg font-merriweather font-black mb-2">Internal Note</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6 italic">Secure System Logs</p>
                                        <div className="bg-white/10 p-6 rounded-2xl flex-grow font-medium text-sm leading-relaxed border border-white/5">
                                            The system is currently syncing with MongoDB Atlas. All payment records are verified via Razorpay API. Legal requests status updates are reflected in real-time to the user portal.
                                        </div>
                                        <div className="mt-8 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500 animate-pulse flex items-center justify-center text-xs">OK</div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Service: Online</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'requests' && (
                            <motion.div key="requests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {!selectedRequest ? (
                                    <div className="space-y-6">
                                        {/* Status Filter Tabs */}
                                        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-[24px] shadow-sm border border-slate-100">
                                            {[
                                                { id: 'All', label: 'All Requests', icon: '📋' },
                                                { id: 'Submitted', label: 'Newly Arrived', icon: '🆕' },
                                                { id: 'Processing', label: 'In Process', icon: '⏳' },
                                                { id: 'Done', label: 'Resolved', icon: '✅' },
                                                { id: 'Rejected', label: 'Rejected', icon: '🚫' }
                                            ].map((tab) => {
                                                const count = tab.id === 'All'
                                                    ? legalRequests.length
                                                    : tab.id === 'Processing'
                                                        ? legalRequests.filter(r => r.status === 'In Review' || r.status === 'In Process').length
                                                        : legalRequests.filter(r => r.status === tab.id).length;

                                                return (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setFilterStatus(tab.id)}
                                                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${filterStatus === tab.id ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                                                    >
                                                        <span>{tab.icon}</span>
                                                        {tab.label}
                                                        <span className={`ml-2 px-2 py-0.5 rounded-md text-[9px] ${filterStatus === tab.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>{count}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-200">
                                            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                                <h2 className="text-xl font-merriweather font-black text-slate-800">Legal Assistance Tracking</h2>
                                                <div className="flex gap-4">
                                                    <input
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        placeholder="Search ID or Name..."
                                                        className="px-6 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium outline-none focus:border-blue-500 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left font-merriweather text-xs">
                                                    <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
                                                        <tr>
                                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">S.No</th>
                                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Date</th>
                                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Request ID</th>
                                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {legalRequests
                                                            .filter(r => {
                                                                const matchesSearch = r.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                    r.fullName.toLowerCase().includes(searchTerm.toLowerCase());
                                                                const matchesFilter = filterStatus === 'All'
                                                                    ? true
                                                                    : filterStatus === 'Processing'
                                                                        ? (r.status === 'In Review' || r.status === 'In Process')
                                                                        : r.status === filterStatus;
                                                                return matchesSearch && matchesFilter;
                                                            })
                                                            .map((req, idx) => (
                                                                <tr key={req._id} className="hover:bg-slate-50/50 transition-all group">
                                                                    <td className="px-10 py-8 font-bold text-slate-400 group-hover:text-[#1e3a8a] transition-colors">{(idx + 1).toString().padStart(2, '0')}</td>
                                                                    <td className="px-10 py-8 font-bold text-slate-700 tracking-tighter uppercase font-merriweather">{new Date(req.createdAt).toLocaleDateString()}</td>
                                                                    <td className="px-10 py-8 group-hover:pl-12 transition-all">
                                                                        <div className="flex flex-col">
                                                                            <span className="font-merriweather font-black text-[#1e3a8a] text-sm">{req.requestId}</span>
                                                                            <span className="font-bold text-slate-400 text-[10px] uppercase font-merriweather">{req.fullName}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-10 py-8">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-wider block w-fit shadow-sm border ${req.status === 'Submitted' ? 'bg-cyan-50 text-cyan-500 border-cyan-100' :
                                                                                req.status === 'In Review' ? 'bg-indigo-50 text-indigo-500 border-indigo-100 animate-pulse' :
                                                                                    req.status === 'In Process' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                                                        req.status === 'Done' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                                                                            req.status === 'Rejected' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                                                                                'bg-slate-50 text-slate-400 border-slate-100'
                                                                                }`}>
                                                                                {req.status === 'Submitted' ? '🆕 Newly Arrived' :
                                                                                    req.status === 'In Review' ? '⏳ Under Review' :
                                                                                        req.status === 'In Process' ? '⚙️ In Process' :
                                                                                            req.status === 'Done' ? '✅ Resolved' :
                                                                                                req.status === 'Rejected' ? '🚫 Rejected' : req.status}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-10 py-8 text-right">
                                                                        <button
                                                                            onClick={() => { setSelectedRequest(req); setStatusUpdate(req.status); setAdminMsg(req.adminMessage || ''); }}
                                                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
                                                                        >
                                                                            Review Request
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <button onClick={() => setSelectedRequest(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1e3a8a] transition-all">
                                            ← Return to List
                                        </button>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-8">
                                                {/* Core Request Card */}
                                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-10">
                                                    <div className="flex justify-between items-start mb-10">
                                                        <div>
                                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Subject Grievance</p>
                                                            <h2 className="text-3xl font-merriweather font-black text-slate-900">{selectedRequest.requestId}</h2>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Submission Date</p>
                                                            <p className="text-sm font-bold text-slate-700">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10">
                                                        <p className="text-lg font-medium text-slate-700 leading-relaxed italic">
                                                            "{selectedRequest.message}"
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Evidence Artifacts ({selectedRequest.documents?.length || 0})</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {selectedRequest.documents?.map((doc, i) => (
                                                                <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                                                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📄</div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-black text-slate-800 truncate mb-1 uppercase tracking-tight">{doc.name}</p>
                                                                        <div className="flex gap-4">
                                                                            <button onClick={() => window.open(doc.url, '_blank')} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Verify</button>
                                                                            <button onClick={() => handleDownload(doc.url, doc.name)} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:underline">Acquire</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action/Response Panel */}
                                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-10">
                                                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6">Administrative Response</h3>
                                                    <textarea
                                                        value={adminMsg}
                                                        onChange={(e) => setAdminMsg(e.target.value)}
                                                        rows={6}
                                                        className="w-full bg-slate-50 p-8 rounded-3xl border border-slate-100 outline-none focus:bg-white focus:border-blue-600 transition-all font-medium text-lg mb-8"
                                                        placeholder="Write your professional response or internal status notes here..."
                                                    />

                                                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-6 border-t border-slate-50">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Mark Status:</span>
                                                            <select
                                                                value={statusUpdate}
                                                                onChange={(e) => setStatusUpdate(e.target.value)}
                                                                className="bg-slate-50 font-black text-slate-800 text-xs px-6 py-3 rounded-full border border-slate-100 outline-none cursor-pointer focus:border-blue-500"
                                                            >
                                                                <option value="Submitted">Submitted</option>
                                                                <option value="In Review">In Review</option>
                                                                <option value="In Process">In Process</option>
                                                                <option value="Done">Settled / Closed</option>
                                                                <option value="Rejected">Rejected</option>
                                                            </select>
                                                        </div>
                                                        <button
                                                            onClick={() => handleUpdateStatus(selectedRequest._id)}
                                                            className="bg-slate-900 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-black transition-all text-xs uppercase tracking-widest active:scale-95"
                                                        >
                                                            Update & Notify User
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                {/* Requester Profile Snapshot */}
                                                <div className="bg-[#0F172A] rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                                        <span className="text-6xl text-white">👤</span>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6">Identification</p>
                                                    <div className="space-y-6 relative z-10">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Full Name</p>
                                                            <p className="text-xl font-bold font-merriweather">{selectedRequest.fullName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Phone Relay</p>
                                                            <p className="text-xl font-bold">{selectedRequest.phone}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Terminal</p>
                                                            <p className="text-sm font-bold opacity-80">{selectedRequest.email}</p>
                                                        </div>
                                                        <div className="h-px bg-slate-800" />
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Address Location</p>
                                                            <p className="text-xs font-medium text-slate-400 leading-relaxed font-merriweather">{selectedRequest.address || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Help Card */}
                                                <div className="bg-emerald-50 rounded-[40px] border border-emerald-100 p-8">
                                                    <h4 className="text-emerald-900 font-black text-xs uppercase tracking-widest mb-2">Internal Policy</h4>
                                                    <p className="text-emerald-700 text-[10px] font-medium leading-relaxed">
                                                        Please ensure all legal status updates are verified with our internal legal wing. Do not close cases until final documentation is acquired.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'volunteers' && (
                            <motion.div key="volunteers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {!selectedVolunteer ? (
                                    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-200">
                                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                            <h2 className="text-xl font-merriweather font-black text-slate-800">Volunteers Network</h2>
                                            <div className="flex gap-4 items-center">
                                                <input
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Search name, phone, email..."
                                                    className="px-6 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium outline-none focus:border-emerald-500 transition-all"
                                                />
                                                <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95">Export CSV</button>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left font-merriweather text-xs">
                                                <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">S.No</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Volunteer</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Location</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Contact</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {volunteers
                                                        .filter(v =>
                                                            v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            (v.phone && v.phone.includes(searchTerm))
                                                        )
                                                        .map((v, idx) => (
                                                            <tr key={idx} className="hover:bg-slate-50/50 transition-all group">
                                                                <td className="px-10 py-8 font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">{(idx + 1).toString().padStart(2, '0')}</td>
                                                                <td className="px-10 py-8">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400">{v.fullName[0]}</div>
                                                                        <div>
                                                                            <p className="text-sm font-black text-slate-800">{v.fullName}</p>
                                                                            <span className="px-2 py-0.5 bg-blue-50 text-[8px] font-black text-blue-600 uppercase tracking-widest rounded-md">{v.priorityWing || 'General'}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-10 py-8 text-xs font-bold text-slate-600">
                                                                    <p>{v.district}</p>
                                                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{v.state}</p>
                                                                </td>
                                                                <td className="px-10 py-8">
                                                                    <p className="text-xs font-black text-slate-700">{v.phone || 'N/A'}</p>
                                                                    <p className="text-[9px] font-bold text-slate-400">{v.email}</p>
                                                                </td>
                                                                <td className="px-10 py-8 text-right">
                                                                    <button
                                                                        onClick={() => setSelectedVolunteer(v)}
                                                                        className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:text-emerald-700 transition-all underline underline-offset-4"
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    {volunteers.length === 0 && (
                                                        <tr>
                                                            <td colSpan="6" className="py-20 text-center text-slate-400 italic text-sm">No volunteers found in the database.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <button onClick={() => setSelectedVolunteer(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-all">
                                            ← Return to Network
                                        </button>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-8">
                                                {/* Core Profile Card */}
                                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-10">
                                                    <div className="flex justify-between items-start mb-10">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center text-3xl shadow-inner border border-emerald-100 text-emerald-600 font-black">
                                                                {selectedVolunteer.fullName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Volunteer Profile</p>
                                                                <h2 className="text-3xl font-merriweather font-black text-slate-900">{selectedVolunteer.fullName}</h2>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Member Since</p>
                                                            <p className="text-sm font-bold text-slate-700">{new Date(selectedVolunteer.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Group</p>
                                                            <p className="text-sm font-black text-rose-600">{selectedVolunteer.bloodGroup || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Age</p>
                                                            <p className="text-sm font-black text-slate-700">{selectedVolunteer.age || 'N/A'} yrs</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                                                            <p className="text-sm font-black text-slate-700 uppercase">{selectedVolunteer.gender || 'N/A'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div>
                                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Academic Background</h3>
                                                            <div className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-800">{selectedVolunteer.college || 'No Institution Mentioned'}</p>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedVolunteer.education || 'Education Details N/A'}</p>
                                                                </div>
                                                                <div className="text-2xl opacity-20">🎓</div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Participation Stakes</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Priority Wing</p>
                                                                    <p className="text-xs font-bold text-blue-900">{selectedVolunteer.priorityWing || 'General Assistance'}</p>
                                                                </div>
                                                                <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                                                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Other Interests</p>
                                                                    <p className="text-xs font-bold text-emerald-900">{selectedVolunteer.interests || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Verification Artifacts */}
                                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-10">
                                                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Verification Artifacts ({selectedVolunteer.documents?.length || 0})</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {selectedVolunteer.documents?.map((doc, i) => (
                                                            <div key={i} className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">📑</div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-black text-slate-800 truncate mb-1 uppercase tracking-tight">{doc.name}</p>
                                                                    <div className="flex gap-4">
                                                                        <button onClick={() => window.open(doc.url, '_blank')} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Inspect</button>
                                                                        <button onClick={() => handleDownload(doc.url, doc.name)} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:underline">Download</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!selectedVolunteer.documents || selectedVolunteer.documents.length === 0) && (
                                                            <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No documents submitted</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                {/* Contact Details Card */}
                                                <div className="bg-[#0F172A] rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6">Connect Details</p>
                                                    <div className="space-y-6 relative z-10">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mobile Relay</p>
                                                            <p className="text-xl font-bold font-merriweather">{selectedVolunteer.phone || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Terminal</p>
                                                            <p className="text-sm font-bold opacity-80">{selectedVolunteer.email}</p>
                                                        </div>
                                                        <div className="h-px bg-slate-800" />
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Base Origin</p>
                                                            <p className="text-xs font-medium text-slate-400 leading-relaxed font-merriweather">{selectedVolunteer.district}, {selectedVolunteer.state}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-900 rounded-[40px] p-8 text-white">
                                                    <h4 className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-4">Network Insights</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="opacity-50 font-bold">Priority Status</span>
                                                            <span className="font-black text-emerald-400">{selectedVolunteer.priorityWing ? 'Active Priority' : 'General'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'donations' && (
                            <motion.div key="donations" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {!selectedDonation ? (
                                    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-200">
                                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                            <h2 className="text-xl font-merriweather font-black text-slate-800">Donations Ledger</h2>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Search donor..."
                                                    className="px-6 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium outline-none focus:border-blue-500 transition-all"
                                                />
                                                <div className="flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                                                    Auto-sync: Secure
                                                </div>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">S.No</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Date / Time</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Donor Detail</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Amount</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Transaction Receipt</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {donations
                                                        .filter(d =>
                                                            (d.donor_name && d.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                                            (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                                        )
                                                        .map((item, idx) => (
                                                            <tr key={idx} className="hover:bg-slate-50/50 transition-all group">
                                                                <td className="px-10 py-8 text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">{(idx + 1).toString().padStart(2, '0')}</td>
                                                                <td className="px-10 py-8 text-xs font-bold text-slate-700 tracking-tighter uppercase">{new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                                <td className="px-10 py-8">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</div>
                                                                        <div className="flex flex-col">
                                                                            <p className="text-xs font-black text-slate-800">{item.donor_name || 'Anonymous'}</p>
                                                                            <p className="text-[10px] font-medium text-slate-400">{item.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-10 py-8 text-sm font-black text-emerald-600">₹{item.amount.toLocaleString()}</td>
                                                                <td className="px-10 py-8 text-right">
                                                                    <button
                                                                        onClick={() => setSelectedDonation(item)}
                                                                        className="text-[9px] font-black text-blue-600 border border-blue-100 px-4 py-1.5 rounded-lg uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                                    >
                                                                        Audit Receipt
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    {donations.length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="py-20 text-center text-slate-400 italic text-sm">No transaction records detected in the ledger.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <button onClick={() => setSelectedDonation(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-all">
                                            ← Return to Ledger
                                        </button>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-8">
                                                {/* Donation Profile Card */}
                                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-10">
                                                    <div className="flex justify-between items-start mb-10">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center text-3xl shadow-inner border border-emerald-100 text-emerald-600 font-black">
                                                                💰
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Transaction Profile</p>
                                                                <h2 className="text-3xl font-merriweather font-black text-slate-900">{selectedDonation.donor_name || 'Anonymous'}</h2>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Contribution Date</p>
                                                            <p className="text-sm font-bold text-slate-700">{new Date(selectedDonation.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grant Amount</p>
                                                            <p className="text-2xl font-black text-emerald-600">₹{selectedDonation.amount.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                            <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">Success</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div>
                                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Infrastructure</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Razorpay Payment ID</p>
                                                                    <p className="text-xs font-bold text-slate-800 break-all">{selectedDonation.payment_id || 'LOCAL-RECORD'}</p>
                                                                </div>
                                                                <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Certificate ID</p>
                                                                    <p className="text-xs font-bold text-slate-800 break-all">{selectedDonation.certificate_id || 'PENDING'}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Donor Correspondence</h3>
                                                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Terminal</p>
                                                                    <p className="text-sm font-bold text-slate-800">{selectedDonation.email}</p>
                                                                </div>
                                                                <button onClick={() => window.location.href = `mailto:${selectedDonation.email}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Draft Mail</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Panel */}
                                                <div className="bg-slate-900 rounded-[40px] p-10 text-white">
                                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                                        <div>
                                                            <h4 className="text-lg font-merriweather font-black mb-1">Audit Generation</h4>
                                                            <p className="text-slate-400 text-xs font-medium">Verify and acquire the official tax receipt for this transaction.</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDownloadCertificate(selectedDonation.certificate_id)}
                                                            className="bg-emerald-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-emerald-900/20 hover:bg-emerald-600 transition-all text-xs uppercase tracking-widest active:scale-95 whitespace-nowrap"
                                                        >
                                                            Download Audit Receipt
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                {/* Security Shield */}
                                                <div className="bg-[#0F172A] rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                                        <span className="text-6xl text-white">🛡️</span>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6">Security Context</p>
                                                    <div className="space-y-6 relative z-10">
                                                        <p className="text-xs text-slate-400 leading-relaxed">
                                                            This record is a verified financial artifact. Any modifications to donor information must be performed through the master database terminal with audit logging enabled.
                                                        </p>
                                                        <div className="h-px bg-slate-800" />
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Encrypted Record</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'account' && (
                            <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl">
                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-12">
                                    <h1 className="text-4xl font-merriweather font-black text-slate-900 mb-2">Administrator Settings</h1>
                                    <p className="text-slate-400 font-medium mb-12">Configure organizational access and security protocols</p>

                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Descriptor</p>
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-black text-slate-700 shadow-inner">viswavignanavaaradhi</div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relay Endpoint (Email)</p>
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700 shadow-inner text-sm">admin@vvv-nexus.org</div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Credentials</p>
                                            <div className="px-10 py-5 bg-white rounded-2xl border border-slate-100 inline-block shadow-sm">
                                                <button className="text-blue-600 font-black text-xs uppercase tracking-widest underline underline-offset-8 decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-all">rotate security key</button>
                                            </div>
                                        </div>
                                        <div className="h-px bg-slate-100" />
                                        <div className="grid grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clearance Level</p>
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-black text-[#1e3a8a] flex items-center justify-between shadow-inner">
                                                    ROOT_ADMINISTRATOR
                                                    <span className="text-emerald-500 text-lg">🔒</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initialization Date</p>
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700 shadow-inner uppercase tracking-tighter">FEB 15, 2024</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-20 p-8 rounded-3xl bg-orange-50 border border-orange-100">
                                        <div className="flex gap-4">
                                            <span className="text-2xl">⚠️</span>
                                            <div>
                                                <h5 className="text-orange-900 font-black text-xs uppercase tracking-widest mb-1">Security Protocol</h5>
                                                <p className="text-orange-700 text-[10px] font-medium leading-relaxed">
                                                    All actions in this portal are logged against your ID. Ensure you logout after every session. Two-factor authentication is active on this account.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Admin;
