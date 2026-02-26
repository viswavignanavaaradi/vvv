import { useState, useEffect } from 'react';
import axios, { API_BASE_URL } from '../api/axios';
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
    const [interns, setInterns] = useState([]);
    const [legalRequests, setLegalRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [adminMsg, setAdminMsg] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('');
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [internFilterStatus, setInternFilterStatus] = useState('All');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [patrons, setPatrons] = useState([]);
    const [selectedPatron, setSelectedPatron] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Invalid Date';
    };

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
            if (activeTab === 'interns' || activeTab === 'dashboard') {
                const res = await axios.get('/api/admin/interns');
                setInterns(res.data);
            }
            if (activeTab === 'patrons' || activeTab === 'dashboard') {
                const res = await axios.get('/api/admin/patrons');
                setPatrons(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInternStatus = async (id) => {
        try {
            await axios.put(`/api/admin/interns/${id}/status`, {
                status: statusUpdate,
                adminMessage: adminMsg
            });
            alert(`Intern application ${statusUpdate}`);
            setSelectedIntern(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to update intern status');
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
        window.open(`${API_BASE_URL}/api/user/download-certificate?certId=${certId}`, '_blank');
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
        { id: 'patrons', label: 'Patronage', icon: '🌟' },
        { id: 'volunteers', label: 'Volunteers Hub', icon: '👥' },
        { id: 'interns', label: 'Intern Applications', icon: '🎓' },
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
                            onClick={() => { setActiveTab(item.id); setSelectedRequest(null); setSelectedVolunteer(null); setSelectedDonation(null); setSelectedIntern(null); setSelectedPatron(null); }}
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

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 relative z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#1e3a8a] hover:bg-slate-100 transition-all border border-slate-100">
                            <span className="text-lg">←</span>
                        </button>
                        <h1 className="text-xl font-merriweather font-black text-slate-800">{menuItems.find(m => m.id === activeTab)?.label}</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                            <p className="text-sm font-bold text-slate-700">Root Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">🛡️</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard label="Total Capital" value={`₹${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}`} icon="💰" colorClass="bg-emerald-50 text-emerald-600" />
                                    <StatCard label="Volunteers" value={volunteers.length.toLocaleString()} icon="👥" colorClass="bg-blue-50 text-blue-600" />
                                    <StatCard label="Legal Cases" value={legalRequests.filter(r => r.status !== 'Done').length} icon="⚖️" colorClass="bg-orange-50 text-orange-600" />
                                    <StatCard label="Interns" value={interns.length.toLocaleString()} icon="🎓" colorClass="bg-indigo-50 text-indigo-600" />
                                    <StatCard label="Active Patrons" value={patrons.length.toLocaleString()} icon="🌟" colorClass="bg-yellow-50 text-yellow-600" />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'requests' && (
                            <motion.div key="requests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {!selectedRequest ? (
                                    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-200">
                                        <div className="p-8 border-b border-slate-100">
                                            <h2 className="text-xl font-merriweather font-black text-slate-800">Legal Assistance Tracking</h2>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left font-merriweather text-xs">
                                                <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">S.No</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Request ID</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {legalRequests.map((req, idx) => (
                                                        <tr key={req._id}>
                                                            <td className="px-10 py-8">{(idx + 1).toString().padStart(2, '0')}</td>
                                                            <td className="px-10 py-8 font-black text-[#1e3a8a]">{req.requestId}</td>
                                                            <td className="px-10 py-8"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black text-[9px] uppercase">{req.status}</span></td>
                                                            <td className="px-10 py-8 text-right">
                                                                <button onClick={() => { setSelectedRequest(req); setAdminMsg(req.adminMessage || ''); setStatusUpdate(req.status); }} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Review</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <button onClick={() => setSelectedRequest(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1e3a8a]">← Return</button>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-8">
                                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-10">
                                                    <h2 className="text-3xl font-black mb-6">{selectedRequest.requestId}</h2>
                                                    <div className="bg-slate-50 p-6 rounded-2xl mb-8 font-medium">"{selectedRequest.message}"</div>
                                                    <textarea value={adminMsg} onChange={(e) => setAdminMsg(e.target.value)} rows={4} className="w-full bg-slate-50 p-6 rounded-2xl border mb-6" placeholder="Admin message..." />
                                                    <div className="flex justify-between items-center">
                                                        <select value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)} className="bg-white border rounded-xl px-4 py-2 text-xs font-black">
                                                            <option value="Submitted">Submitted</option>
                                                            <option value="In Review">In Review</option>
                                                            <option value="In Process">In Process</option>
                                                            <option value="Done">Resolved</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                        <button onClick={() => handleUpdateStatus(selectedRequest._id)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-[#0F172A] rounded-[40px] p-10 text-white">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Requester</p>
                                                <p className="text-xl font-bold mb-2">{selectedRequest.fullName}</p>
                                                <p className="text-sm opacity-60 mb-6">{selectedRequest.email}</p>
                                                <p className="text-xs font-bold text-slate-400">{selectedRequest.phone}</p>
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
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left font-merriweather text-xs">
                                                <thead className="bg-[#f8fafc] text-slate-400 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Donor</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Amount</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">Date</th>
                                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {donations.map((d, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-10 py-8 font-black text-slate-800">{d.donor_name || 'Anonymous'}</td>
                                                            <td className="px-10 py-8 font-black text-emerald-600">₹{d.amount.toLocaleString()}</td>
                                                            <td className="px-10 py-8 font-bold text-slate-400">{formatDate(d.date)}</td>
                                                            <td className="px-10 py-8 text-right">
                                                                <button onClick={() => setSelectedDonation(d)} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Details</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <button onClick={() => setSelectedDonation(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600">← Return</button>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border">
                                                <h2 className="text-3xl font-black mb-2">{selectedDonation.donor_name || 'Anonymous'}</h2>
                                                <p className="text-emerald-600 font-bold mb-8">Contribution: ₹{selectedDonation.amount.toLocaleString()}</p>
                                                <div className="p-6 bg-slate-50 rounded-2xl mb-8">
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Payment ID</p>
                                                    <p className="text-sm font-black break-all">{selectedDonation.payment_id}</p>
                                                </div>
                                                <button onClick={() => handleDownloadCertificate(selectedDonation.certificate_id)} className="bg-emerald-500 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest">Verify & Audit</button>
                                            </div>
                                            <div className="bg-slate-900 rounded-[40px] p-10 text-white">
                                                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">Security Meta</p>
                                                <p className="text-xs opacity-60 leading-relaxed">This record is verified via Razorpay API and stored on MongoDB Atlas Nexus Cluster.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'volunteers' && (
                            <motion.div key="volunteers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {!selectedVolunteer ? (
                                    <div className="bg-white rounded-[32px] overflow-hidden border">
                                        <div className="p-8 border-b">
                                            <h2 className="text-xl font-black">Volunteers Hub</h2>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 border-b">
                                                    <tr>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest">Name</th>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest">Joined On</th>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest">Contact</th>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {volunteers.map((v, idx) => (
                                                        <tr key={idx} className="border-b last:border-0">
                                                            <td className="px-10 py-8 font-black">{v.fullName}</td>
                                                            <td className="px-10 py-8 font-bold text-slate-400">{formatDate(v.createdAt)}</td>
                                                            <td className="px-10 py-8 font-bold text-slate-500">{v.email}</td>
                                                            <td className="px-10 py-8 text-right">
                                                                <button onClick={() => setSelectedVolunteer(v)} className="text-emerald-600 font-black uppercase text-[10px] tracking-widest underline">View Profile</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <button onClick={() => setSelectedVolunteer(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">← Return</button>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border shadow-sm">
                                                <h2 className="text-3xl font-black mb-6">{selectedVolunteer.fullName}</h2>
                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="p-4 bg-slate-50 rounded-xl"><p className="text-[9px] font-black uppercase text-slate-400 mb-1">District</p><p className="font-bold">{selectedVolunteer.district}</p></div>
                                                    <div className="p-4 bg-slate-50 rounded-xl"><p className="text-[9px] font-black uppercase text-slate-400 mb-1">Interests</p><p className="font-bold">{selectedVolunteer.interests || 'N/A'}</p></div>
                                                </div>
                                                <div className="space-y-4">
                                                    {selectedVolunteer.documents?.map((doc, i) => (
                                                        <div key={i} className="flex justify-between items-center p-4 border rounded-xl">
                                                            <p className="text-xs font-black uppercase">{doc.name}</p>
                                                            <button onClick={() => window.open(doc.url, '_blank')} className="text-emerald-600 font-black text-[10px] uppercase">Verify</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-slate-900 rounded-[40px] p-10 text-white">
                                                <p className="text-[10px] font-black uppercase text-emerald-400 mb-6">Contact</p>
                                                <p className="text-lg font-bold mb-2">{selectedVolunteer.phone || 'N/A'}</p>
                                                <p className="text-sm opacity-60 mb-6">{selectedVolunteer.email}</p>
                                                <div className="h-px bg-slate-800 mb-6" />
                                                <p className="text-[9px] font-black uppercase text-slate-500 mb-2">Location Node</p>
                                                <p className="text-xs opacity-60">{selectedVolunteer.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'interns' && (
                            <motion.div key="interns" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {!selectedIntern ? (
                                    <div className="bg-white rounded-[32px] overflow-hidden border shadow-sm">
                                        <div className="p-8 border-b">
                                            <h2 className="text-xl font-black">Internship Applications</h2>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 border-b">
                                                    <tr>
                                                        <th className="px-10 py-6 uppercase font-black">Applicant</th>
                                                        <th className="px-10 py-6 uppercase font-black">Applied On</th>
                                                        <th className="px-10 py-6 uppercase font-black">Duration</th>
                                                        <th className="px-10 py-6 uppercase font-black text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {interns.map((i, idx) => (
                                                        <tr key={idx} className="border-b last:border-0 hover:bg-slate-50 transition-all">
                                                            <td className="px-10 py-8 font-black">{i.fullName}</td>
                                                            <td className="px-10 py-8 font-bold text-slate-400">{formatDate(i.date)}</td>
                                                            <td className="px-10 py-8 font-bold text-blue-600 uppercase">{i.duration}</td>
                                                            <td className="px-10 py-8 text-right">
                                                                <button onClick={() => { setSelectedIntern(i); setAdminMsg(i.adminMessage || ''); setStatusUpdate(i.status || 'Pending'); }} className="text-blue-600 font-black uppercase text-[10px] underline">Process</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <button onClick={() => setSelectedIntern(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">← Return</button>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border shadow-sm">
                                                <h2 className="text-3xl font-black mb-4">{selectedIntern.fullName}</h2>
                                                <p className="text-blue-600 font-black uppercase text-xs mb-8">{selectedIntern.college}</p>
                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <button onClick={() => window.open(selectedIntern.resume, '_blank')} className="p-4 border rounded-xl text-left font-black uppercase text-[10px] hover:border-blue-500">Resume Artifact</button>
                                                    {selectedIntern.achievements && <button onClick={() => window.open(selectedIntern.achievements, '_blank')} className="p-4 border rounded-xl text-left font-black uppercase text-[10px] hover:border-emerald-500">Merit Record</button>}
                                                </div>
                                                <textarea value={adminMsg} onChange={(e) => setAdminMsg(e.target.value)} rows={4} className="w-full bg-slate-50 p-6 rounded-2xl border mb-6" placeholder="Final decision message..." />
                                                <div className="flex gap-4">
                                                    <button onClick={() => { setStatusUpdate('Accepted'); handleUpdateInternStatus(selectedIntern._id); }} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Accept Intern</button>
                                                    <button onClick={() => { setStatusUpdate('Rejected'); handleUpdateInternStatus(selectedIntern._id); }} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Reject File</button>
                                                </div>
                                            </div>
                                            <div className="bg-slate-900 rounded-[40px] p-10 text-white">
                                                <p className="text-blue-400 text-[10px] font-black uppercase mb-6">Candidate Node</p>
                                                <p className="text-xl font-bold mb-2">{selectedIntern.university || 'N/A'}</p>
                                                <p className="text-sm opacity-60 mb-6">{selectedIntern.email}</p>
                                                <div className="h-px bg-slate-800 mb-6" />
                                                <p className="text-[9px] font-black text-slate-500 uppercase">Duration Relay</p>
                                                <p className="font-bold text-blue-400">{selectedIntern.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'patrons' && (
                            <motion.div key="patrons" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {!selectedPatron ? (
                                    <div className="bg-white rounded-[32px] overflow-hidden border shadow-sm">
                                        <div className="p-8 border-b flex justify-between items-center">
                                            <h2 className="text-xl font-black text-slate-800">Patronage Hub</h2>
                                            <span className="px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-wider">Recurring Support</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-[#f8fafc] text-slate-400 border-b">
                                                    <tr>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest text-[10px]">Patron Name</th>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest text-[10px]">Monthly</th>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest text-[10px]">Active Since</th>
                                                        <th className="px-10 py-6 uppercase font-black tracking-widest text-[10px] text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {patrons.map((p, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                                            <td className="px-10 py-8 font-black text-slate-800">{p.fullName}</td>
                                                            <td className="px-10 py-8 font-black text-yellow-600">₹{p.amount.toLocaleString()}</td>
                                                            <td className="px-10 py-8 font-bold text-slate-400">{formatDate(p.date)}</td>
                                                            <td className="px-10 py-8 text-right">
                                                                <button onClick={() => setSelectedPatron(p)} className="text-slate-900 border border-slate-200 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">View Details</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <button onClick={() => setSelectedPatron(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-yellow-600 transition-colors">← Back to Patrons</button>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 bg-white rounded-[40px] p-12 border shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full opacity-50 -mr-10 -mt-10" />
                                                <h2 className="text-4xl font-merriweather font-black text-slate-900 mb-2">{selectedPatron.fullName}</h2>
                                                <p className="text-yellow-600 font-bold mb-10 text-lg">Foundation Patron • Monthly ₹{selectedPatron.amount.toLocaleString()}</p>

                                                <div className="grid grid-cols-2 gap-6 mb-10">
                                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Subscription ID</p>
                                                        <p className="font-bold text-slate-700 font-mono text-sm">{selectedPatron.subscription_id}</p>
                                                    </div>
                                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Enrolled On</p>
                                                        <p className="font-bold text-slate-700">{formatDate(selectedPatron.date)}</p>
                                                    </div>
                                                </div>

                                                <div className="p-8 bg-yellow-50 rounded-[32px] border border-yellow-100/50">
                                                    <h4 className="text-xs font-black uppercase text-yellow-800 mb-4">Patronage Impact</h4>
                                                    <p className="text-sm text-yellow-900 leading-relaxed font-medium">This patron provides sustained leadership and financial stability to the foundation. Their recurring contribution supports long-term rural development initiatives and legal aid sustainability.</p>
                                                </div>
                                            </div>

                                            <div className="bg-[#0F172A] rounded-[40px] p-10 text-white flex flex-col justify-between overflow-hidden relative">
                                                <div className="relative z-10">
                                                    <p className="text-[10px] font-black uppercase text-yellow-400 mb-8 tracking-widest">Contact Information</p>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Email Address</p>
                                                            <p className="text-base font-bold text-slate-200">{selectedPatron.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Status</p>
                                                            <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase">Active</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-20 relative z-10">
                                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-white/10">🤝</div>
                                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Verified across Razorpay Subscription API and MongoDB Nexus Storage.</p>
                                                </div>
                                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-500/5 rounded-full" />
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
                                    <p className="text-slate-400 font-medium mb-12">Security Access Protocol</p>
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</p>
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-black">viswavignanavaaradhi</div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clearance</p>
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-black text-blue-600">ROOT_ADMIN</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-12 p-6 bg-orange-50 border border-orange-100 rounded-3xl">
                                        <p className="text-[9px] font-black uppercase text-orange-900 mb-1">Security Warning</p>
                                        <p className="text-[10px] text-orange-700 font-medium">This terminal session is encrypted and audit-logged.</p>
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