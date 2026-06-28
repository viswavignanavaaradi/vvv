import { useState, useEffect } from 'react';
import axios, { API_BASE_URL } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, icon, trend, colorClass, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
        className={`relative overflow-hidden p-8 rounded-[32px] border border-white/20 bg-white shadow-sm transition-all group`}
    >
        <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${gradient}`} />
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-black/5 ${colorClass}`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wider mb-1">
                            {trend}
                        </span>
                        <div className="w-12 h-1 bg-emerald-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-emerald-500" />
                        </div>
                    </div>
                )}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-merriweather font-black text-slate-900 tracking-tight">{value}</h4>
                <span className="text-[10px] font-bold text-slate-300">Live</span>
            </div>
        </div>
    </motion.div>
);

const ActivityItem = ({ icon, title, subtitle, time, color }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color} shadow-sm group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div className="flex-1">
            <h5 className="text-sm font-bold text-slate-800">{title}</h5>
            <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
        </div>
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
    </div>
);

const Admin = () => {
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = useState(() => {
        const stored = localStorage.getItem('admin_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('admin_token'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [totpToken, setTotpToken] = useState('');
    const [requires2FA, setRequires2FA] = useState(false);
    const [setupRequired, setSetupRequired] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [authError, setAuthError] = useState('');
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
    const [showPurgeModal, setShowPurgeModal] = useState(false);
    const [purgeConfirmEmail, setPurgeConfirmEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [purgeTarget, setPurgeTarget] = useState(null);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPerms, setNewAdminPerms] = useState([]);
    const [createAdminMsg, setCreateAdminMsg] = useState('');
    const [createAdminLoading, setCreateAdminLoading] = useState(false);
    const [adminsList, setAdminsList] = useState([]);

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

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            const res = await axios.post('/api/admin/login', { email, password });
            if (res.data.requiresSetup) {
                setSetupRequired(true);
                setQrCodeUrl(res.data.qrCodeUrl);
            } else if (res.data.requires2FA) {
                setRequires2FA(true);
            } else if (res.data.mock) {
                const mockUser = { role: 'superadmin', email: res.data.mockEmail || 'mock@vvv.com', permissions: ['manage_admins', 'view_payments', 'manage_interns', 'manage_volunteers_patrons', 'delete_users'] };
                localStorage.setItem('admin_token', res.data.token);
                localStorage.setItem('admin_user', JSON.stringify(mockUser));
                setAdminUser(mockUser);
                setLoggedIn(true);
            }
        } catch (err) {
            setAuthError(err.response?.data?.error || 'Authentication Failed');
        }
    };

    const handleVerify2FA = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            const res = await axios.post('/api/admin/verify-2fa', { email, password, token: totpToken });
            if (res.data.success) {
                localStorage.setItem('admin_token', res.data.token);
                if (res.data.user) {
                    localStorage.setItem('admin_user', JSON.stringify(res.data.user));
                    setAdminUser(res.data.user);
                }
                setLoggedIn(true);
                setSetupRequired(false);
                setRequires2FA(false);
            }
        } catch (err) {
            setAuthError(err.response?.data?.error || 'Invalid Authenticator Code');
        }
    };

    useEffect(() => {
        if (loggedIn && (!adminUser || !adminUser.role)) {
            handleLogout();
        }
    }, [loggedIn, adminUser]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdminUser(null);
        setLoggedIn(false);
        setPassword('');
        setEmail('');
        setTotpToken('');
        setRequires2FA(false);
        setSetupRequired(false);
        setActiveTab('dashboard');
    };

    const fetchData = async () => {
        setLoading(true);
        const hasPerm = (perm) => adminUser?.role === 'superadmin' || adminUser?.permissions?.includes(perm);

        const fetchEndpoint = async (condition, endpoint, setter) => {
            if (condition) {
                try {
                    const res = await axios.get(endpoint);
                    setter(res.data);
                } catch (err) {
                    console.error(`Error fetching ${endpoint}:`, err);
                }
            }
        };

        await Promise.all([
            fetchEndpoint((activeTab === 'donations' || activeTab === 'dashboard') && hasPerm('view_payments'), '/api/admin/donations', setDonations),
            fetchEndpoint((activeTab === 'requests' || activeTab === 'dashboard') && hasPerm('manage_volunteers_patrons'), '/api/admin/legal-requests', setLegalRequests),
            fetchEndpoint((activeTab === 'volunteers' || activeTab === 'dashboard') && hasPerm('manage_volunteers_patrons'), '/api/admin/volunteers', setVolunteers),
            fetchEndpoint((activeTab === 'interns' || activeTab === 'dashboard') && hasPerm('manage_interns'), '/api/admin/interns', setInterns),
            fetchEndpoint((activeTab === 'patrons' || activeTab === 'dashboard') && hasPerm('manage_volunteers_patrons'), '/api/admin/patrons', setPatrons),
            fetchEndpoint((activeTab === 'users' || activeTab === 'dashboard') && hasPerm('manage_volunteers_patrons'), '/api/admin/users', setUsers),
            fetchEndpoint((activeTab === 'team' || activeTab === 'dashboard') && hasPerm('manage_admins'), '/api/admin/admins', setAdminsList)
        ]);

        setLoading(false);
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

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setCreateAdminLoading(true);
        setCreateAdminMsg('');
        try {
            const res = await axios.post('/api/admin/create-admin', { email: newAdminEmail, permissions: newAdminPerms });
            if (res.data.success) {
                setCreateAdminMsg(`Successfully created admin. ${res.data.emailSent ? 'Welcome email sent.' : `Email failed to send. Temporary password is: ${res.data.tempPassword}`}`);
                setNewAdminEmail('');
                setNewAdminPerms([]);
            }
        } catch (err) {
            setCreateAdminMsg(err.response?.data?.error || 'Failed to create admin');
        } finally {
            setCreateAdminLoading(false);
        }
    };

    const handleDownloadDocument = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Download failed:', err);
            window.open(url, '_blank');
        }
    };

    const handleDeleteMember = (email, name) => {
        setPurgeConfirmEmail('');
        setPurgeTarget({ email, name });
        setShowPurgeModal(true);
    };

    const handleDeleteAdmin = async (id, email) => {
        if (!window.confirm(`Are you sure you want to delete admin account ${email}?`)) return;
        try {
            await axios.delete(`/api/admin/admins/${id}`);
            alert(`Admin ${email} deleted successfully.`);
            fetchData();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to delete admin');
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
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 text-center overflow-y-auto max-h-[90vh]">
                    <div className="w-20 h-20 bg-[#1e3a8a] rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-lg shadow-blue-100">🛡️</div>
                    <h2 className="text-4xl font-merriweather font-black text-slate-900 mb-2">Admin Portal</h2>
                    <p className="text-slate-400 mb-10 font-medium tracking-tight">Enterprise Access • NGO Management</p>
                    
                    {authError && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                            {authError}
                        </div>
                    )}

                    {!setupRequired && !requires2FA ? (
                        <form onSubmit={handleLogin} className="space-y-6 text-left">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#1e3a8a] outline-none transition-all font-bold text-lg" placeholder="admin@vvv.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Authentication Key</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#1e3a8a] outline-none transition-all font-bold text-lg" placeholder="••••••••" required />
                            </div>
                            <button type="submit" className="w-full bg-[#1e3a8a] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#1e40af] transition-all transform hover:-translate-y-1 active:scale-95">Next Step</button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify2FA} className="space-y-6 text-left">
                            {setupRequired && (
                                <div className="mb-8 text-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Initial Setup Required</p>
                                    <p className="text-xs font-bold text-slate-800 mb-6 leading-relaxed">Scan this secure QR code using Google Authenticator, Authy, or Microsoft Authenticator.</p>
                                    <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto rounded-2xl border-4 border-white shadow-sm w-48 h-48" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Authenticator Token</label>
                                <input type="text" value={totpToken} onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ''))} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#1e3a8a] outline-none transition-all font-black text-2xl text-center tracking-[0.5em] text-[#1e3a8a]" placeholder="000000" maxLength="6" required />
                            </div>
                            <button type="submit" className="w-full bg-[#1e3a8a] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#1e40af] transition-all transform hover:-translate-y-1 active:scale-95">Verify Identity</button>
                            <button type="button" onClick={() => { setSetupRequired(false); setRequires2FA(false); setTotpToken(''); setPassword(''); }} className="w-full bg-slate-50 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest">Cancel</button>
                        </form>
                    )}
                </motion.div>
            </div>
        );
    }

    const allMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', alwaysShow: true },
        { id: 'requests', label: 'Legal Aid Requests', icon: '⚖️', permission: 'manage_volunteers_patrons' },
        { id: 'donations', label: 'Donations Ledger', icon: '🤝', permission: 'view_payments' },
        { id: 'patrons', label: 'Patronage', icon: '🌟', permission: 'manage_volunteers_patrons' },
        { id: 'volunteers', label: 'Members Hub', icon: '👥', permission: 'manage_volunteers_patrons' },
        { id: 'interns', label: 'Intern Applications', icon: '🎓', permission: 'manage_interns' },
        { id: 'users', label: 'User Accounts', icon: '👤', permission: 'manage_volunteers_patrons' },
        { id: 'team', label: 'Manage Team', icon: '🛡️', permission: 'manage_admins' },
        { id: 'account', label: 'Admin Settings', icon: '⚙️', alwaysShow: true },
    ];

    const menuItems = allMenuItems.filter(item => {
        if (item.alwaysShow) return true;
        if (adminUser?.role === 'superadmin') return true;
        return adminUser?.permissions?.includes(item.permission);
    });

    return (
        <>
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
                    <div className="flex items-center gap-6 flex-1">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#1e3a8a] hover:bg-slate-100 transition-all border border-slate-100">
                            <span className="text-lg">←</span>
                        </button>
                        <h1 className="hidden lg:block text-xl font-merriweather font-black text-slate-800 whitespace-nowrap">{menuItems.find(m => m.id === activeTab)?.label}</h1>

                        {/* Global Search Bar */}
                        <div className="max-w-md w-full relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                            <input
                                type="text"
                                placeholder={`Search ${menuItems.find(m => m.id === activeTab)?.label.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 ml-6">
                        <div className="hidden sm:block text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                            <p className="text-sm font-bold text-slate-700">{adminUser?.email || 'Admin'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">🛡️</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                {/* Hero Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                    <StatCard label="Total Capital" value={`₹${(donations || []).reduce((sum, d) => sum + (d?.amount || 0), 0).toLocaleString()}`} icon="💰" trend="+12%" colorClass="bg-emerald-50 text-emerald-600" gradient="from-emerald-500 to-teal-500" />
                                    <StatCard label="Members" value={(volunteers || []).length.toLocaleString()} icon="👥" trend="Active" colorClass="bg-blue-50 text-blue-600" gradient="from-blue-500 to-indigo-500" />
                                    <StatCard label="Legal Cases" value={(legalRequests || []).filter(r => r?.status !== 'Done').length} icon="⚖️" trend="Critical" colorClass="bg-orange-50 text-orange-600" gradient="from-orange-500 to-rose-500" />
                                    <StatCard label="Interns" value={(interns || []).length.toLocaleString()} icon="🎓" trend="Pending" colorClass="bg-indigo-50 text-indigo-600" gradient="from-indigo-500 to-purple-500" />
                                    <StatCard label="Active Patrons" value={(patrons || []).length.toLocaleString()} icon="🌟" trend="Premium" colorClass="bg-yellow-50 text-yellow-600" gradient="from-yellow-400 to-amber-600" />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    {/* Recent Activity Feed */}
                                    <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-slate-200">
                                        <div className="flex justify-between items-center mb-10">
                                            <div>
                                                <h3 className="text-xl font-merriweather font-black text-slate-800">Organizational Pulse</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Live Unified Feed</p>
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('donations')}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                Donations Ledger →
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {/* Combined Recent Activities */}
                                            {[
                                                ...(donations || []).slice(0, 3).map(d => ({ type: 'donation', data: d })),
                                                ...(volunteers || []).slice(0, 3).map(v => ({ type: 'volunteer', data: v })),
                                                ...(legalRequests || []).slice(0, 3).map(r => ({ type: 'legal', data: r }))
                                            ].sort((a, b) => {
                                                const dateA = new Date(a.data?.date || a.data?.createdAt || 0);
                                                const dateB = new Date(b.data?.date || b.data?.createdAt || 0);
                                                return dateB - dateA;
                                            })
                                                .slice(0, 6)
                                                .map((item, idx) => (
                                                    <ActivityItem
                                                        key={idx}
                                                        icon={item.type === 'donation' ? '💰' : item.type === 'volunteer' ? '👥' : '⚖️'}
                                                        color={item.type === 'donation' ? 'bg-emerald-50 text-emerald-600' : item.type === 'volunteer' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}
                                                        title={item.type === 'donation' ? `Donation from ${item.data?.donor_name || 'Anonymous'}` : item.type === 'volunteer' ? `New Member: ${item.data?.fullName || 'N/A'}` : `Legal Aid: ${item.data?.requestId || 'N/A'}`}
                                                        subtitle={item.type === 'donation' ? `Amount: ₹${(item.data?.amount || 0).toLocaleString()}` : item.type === 'volunteer' ? `From ${item.data?.district || 'Unknown'}` : `Status: ${item.data?.status || 'Pending'}`}
                                                        time={formatDate(item.data?.date || item.data?.createdAt)}
                                                    />
                                                ))}
                                        </div>
                                    </div>

                                    {/* Performance Distribution */}
                                    <div className="space-y-8">
                                        <div className="bg-[#0F172A] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full" />
                                            <h3 className="text-lg font-merriweather font-black mb-6">Sector Efficiency</h3>
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                        <span>Legal Clearance</span>
                                                        <span className="text-emerald-400">{(legalRequests.filter(r => r.status === 'Done').length / (legalRequests.length || 1) * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(legalRequests.filter(r => r.status === 'Done').length / (legalRequests.length || 1) * 100)}%` }} className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                        <span>Intern Validation</span>
                                                        <span className="text-blue-400">{(interns.filter(i => i.status === 'Accepted').length / (interns.length || 1) * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(interns.filter(i => i.status === 'Accepted').length / (interns.length || 1) * 100)}%` }} className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-10 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                                <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                                                    "Our metrics reflect institutional growth and social impact stability."
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[40px] p-10 border border-slate-200">
                                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 leading-none">Resource Nexus</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 rounded-2xl">
                                                    <p className="text-2xl font-black text-slate-800">{patrons.length}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Patrons</p>
                                                </div>
                                                <div className="p-4 bg-indigo-50/50 rounded-2xl">
                                                    <p className="text-2xl font-black text-indigo-600">{interns.length}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Scholars</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                    {(legalRequests || []).filter(req =>
                                                        (req?.requestId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (req?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (req?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                    ).map((req, idx) => (
                                                        <tr key={req._id}>
                                                            <td className="px-10 py-8">{(idx + 1).toString().padStart(2, '0')}</td>
                                                            <td className="px-10 py-8">
                                                                <div className="font-black text-[#1e3a8a]">{req.requestId}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold">{req.fullName}</div>
                                                            </td>
                                                            <td className="px-10 py-8">
                                                                <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase ${req.status === 'Done' ? 'bg-emerald-50 text-emerald-600' :
                                                                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                                                    }`}>{req.status}</span>
                                                            </td>
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
                                                    {donations.filter(d =>
                                                        (d.donor_name || 'Anonymous').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (d.payment_id || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                    ).map((d, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-10 py-8">
                                                                <div className="font-black text-slate-800">{d.donor_name || 'Anonymous'}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold">{d.email}</div>
                                                            </td>
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
                                            <h2 className="text-xl font-black">Members Hub</h2>
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
                                                    {(volunteers || []).filter(v =>
                                                        (v?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (v?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (v?.district || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                    ).map((v, idx) => (
                                                        <tr key={idx} className="border-b last:border-0">
                                                            <td className="px-10 py-8 font-black">{v.fullName}</td>
                                                            <td className="px-10 py-8 font-bold text-slate-400">{formatDate(v.createdAt)}</td>
                                                            <td className="px-10 py-8">
                                                                <div className="font-bold text-slate-500">{v.email}</div>
                                                                <div className="text-[10px] text-emerald-600 font-bold">{v.phone}</div>
                                                            </td>
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
                                                <p className="text-xs opacity-60 mb-6">{selectedVolunteer.address || 'N/A'}</p>
                                                <div className="h-px bg-slate-800 mb-6" />
                                                <p className="text-[9px] font-black uppercase text-rose-400 mb-3">Destructive Actions</p>
                                                <button
                                                    onClick={() => handleDeleteMember(selectedVolunteer.email, selectedVolunteer.fullName)}
                                                    className="w-full py-4 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-lg active:scale-95"
                                                >
                                                    Purge Member Permanently ⚠️
                                                </button>
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
                                                    {(interns || []).filter(i =>
                                                        (i?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (i?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (i?.collegeName || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                    ).map((i, idx) => (
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
                                                <h2 className="text-3xl font-black mb-4">{selectedIntern?.fullName || 'N/A'}</h2>
                                                <p className="text-blue-600 font-black uppercase text-xs mb-8">{selectedIntern?.collegeName || selectedIntern?.college || 'Institution N/A'}</p>
                                                {selectedIntern.documents && selectedIntern.documents.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                                        {selectedIntern.documents.map((doc, i) => (
                                                            <button key={i} onClick={() => window.open(doc.url || doc, '_blank')} className="p-4 border rounded-xl flex items-center justify-between text-left font-black uppercase text-[10px] hover:border-blue-500 group transition-all">
                                                                <span className="truncate pr-4 group-hover:text-blue-600 transition-colors">{doc.name || `Document ${i + 1}`}</span>
                                                                <span className="text-slate-400 group-hover:text-blue-500">↗</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="mb-8 p-4 border border-dashed rounded-xl text-center">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Documents Uploaded</span>
                                                    </div>
                                                )}
                                                <textarea value={adminMsg} onChange={(e) => setAdminMsg(e.target.value)} rows={4} className="w-full bg-slate-50 p-6 rounded-2xl border mb-6" placeholder="Final decision message..." />
                                                <div className="flex gap-4">
                                                    <button onClick={() => { setStatusUpdate('Accepted'); handleUpdateInternStatus(selectedIntern._id); }} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Accept Intern</button>
                                                    <button onClick={() => { setStatusUpdate('Rejected'); handleUpdateInternStatus(selectedIntern._id); }} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Reject File</button>
                                                </div>
                                            </div>
                                            <div className="bg-slate-900 rounded-[40px] p-10 text-white">
                                                <p className="text-blue-400 text-[10px] font-black uppercase mb-6">Candidate Node</p>
                                                <p className="text-xl font-bold mb-2">{selectedIntern.branch || 'General'}</p>
                                                <p className="text-sm opacity-60 mb-6">{selectedIntern.yearOfStudy || 'N/A'}</p>
                                                <div className="h-px bg-slate-800 mb-6" />
                                                <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Duration Relay</p>
                                                <p className="font-bold text-blue-400 mb-6">{selectedIntern.duration}</p>
                                                {selectedIntern.linkedinProfile && (
                                                    <button onClick={() => window.open(selectedIntern.linkedinProfile, '_blank')} className="w-full py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">View LinkedIn</button>
                                                )}
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
                                                    {(patrons || []).filter(p =>
                                                        (p?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (p?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        (p?.subscription_id || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                    ).map((p, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                                            <td className="px-10 py-8 font-black text-slate-800">{p.fullName}</td>
                                                            <td className="px-10 py-8">
                                                                <div className="font-black text-yellow-600">₹{p.amount.toLocaleString()}</div>
                                                                <div className="text-[9px] text-slate-400 font-bold">{p.email}</div>
                                                            </td>
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
                                                    <p className="text-[10px] font-black uppercase text-yellow-400 mb-8 tracking-widest">Patron Profile</p>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Profession</p>
                                                            <p className="text-base font-bold text-slate-200">{selectedPatron.profession || 'Leader'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Experience</p>
                                                            <p className="text-sm font-bold text-slate-400">{selectedPatron.experience} Years</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Advisory Wing</p>
                                                            <p className="text-sm font-bold text-emerald-400">{selectedPatron.advisoryWing}</p>
                                                        </div>
                                                        {selectedPatron.linkedinProfile && (
                                                            <button onClick={() => window.open(selectedPatron.linkedinProfile, '_blank')} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-[#0F172A] transition-all">LinkedIn Profile</button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-12 relative z-10">
                                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-4">Contact Nexus</p>
                                                    <p className="text-xs font-bold text-slate-300 mb-1">{selectedPatron.email}</p>
                                                    <p className="text-xs text-slate-500">{selectedPatron.phone}</p>
                                                </div>
                                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-500/5 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'users' && (
                            <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="bg-white rounded-[32px] overflow-hidden border">
                                    <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-800">User Accounts Hub</h2>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Global Registrations</p>
                                        </div>
                                        <div className="px-6 py-3 bg-[#0F172A] text-emerald-400 rounded-2xl border border-slate-800 font-black text-xs">
                                            Total Accounts: {(users || []).length}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-50 border-b">
                                                <tr>
                                                    <th className="px-10 py-6 uppercase font-black tracking-widest">User Info</th>
                                                    <th className="px-10 py-6 uppercase font-black tracking-widest">Role</th>
                                                    <th className="px-10 py-6 uppercase font-black tracking-widest">Membership</th>
                                                    <th className="px-10 py-6 uppercase font-black tracking-widest">Payment Info</th>
                                                    <th className="px-10 py-6 uppercase font-black tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(users || []).filter(u =>
                                                    (u?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (u?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (u?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (u?.role || '').toLowerCase().includes(searchTerm.toLowerCase())
                                                ).map((u, idx) => (
                                                    <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-10 py-6">
                                                            <div className="font-black text-slate-800">{u.name || u.username || 'N/A'}</div>
                                                            <div className="text-[10px] font-mono font-medium text-slate-500 mt-0.5">{u.email}</div>
                                                        </td>
                                                        <td className="px-10 py-6 font-bold">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-black ${
                                                                u.role === 'admin' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                                u.role === 'volunteer' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                                u.role === 'intern' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                                                'bg-slate-50 text-slate-500 border border-slate-100'
                                                            }`}>
                                                                {u.role || 'patron'}
                                                            </span>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            {u.membershipType ? (
                                                                <span className="text-[9px] uppercase tracking-wider font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                                                    {u.membershipType}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-300 font-bold">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            {u.amountPaid ? (
                                                                <div>
                                                                    <div className="font-black text-emerald-600">₹{u.amountPaid.toLocaleString()}</div>
                                                                    <div className="text-[9px] font-bold text-slate-400 mt-0.5">{formatDate(u.paymentDate)}</div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-300 font-bold">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-10 py-6 text-right">
                                                            {u.role === 'admin' ? (
                                                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest cursor-not-allowed">Root Protection</span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleDeleteMember(u.email, u.name || u.username || 'User')}
                                                                    className="text-rose-600 hover:text-rose-800 font-black uppercase text-[10px] tracking-widest underline transition-colors"
                                                                >
                                                                    Purge Account
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'team' && (
                            <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl">
                                <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-12">
                                    <h1 className="text-4xl font-merriweather font-black text-slate-900 mb-2">Team Management</h1>
                                    <p className="text-slate-400 font-medium mb-10">Add and configure administrators</p>
                                    
                                    <div className="bg-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden mb-12">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-bl-full" />
                                        <h3 className="text-xl font-black mb-6 relative z-10">Provision New Administrator</h3>
                                        
                                        <form onSubmit={handleCreateAdmin} className="relative z-10 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
                                                <input 
                                                    type="email" 
                                                    value={newAdminEmail} 
                                                    onChange={e => setNewAdminEmail(e.target.value)} 
                                                    placeholder="admin@vvv.com" 
                                                    required
                                                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-blue-500 outline-none transition-all text-white font-medium" 
                                                />
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Clearances</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {[
                                                        { id: 'view_payments', label: 'View Payments & Donations' },
                                                        { id: 'manage_interns', label: 'Manage Interns' },
                                                        { id: 'manage_volunteers_patrons', label: 'Manage Members & Patrons' },
                                                        { id: 'delete_users', label: 'Delete Users (Danger Zone)' },
                                                        { id: 'manage_admins', label: 'Manage Admins (Superadmin)' }
                                                    ].map(perm => (
                                                        <label key={perm.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={newAdminPerms.includes(perm.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setNewAdminPerms([...newAdminPerms, perm.id]);
                                                                    else setNewAdminPerms(newAdminPerms.filter(p => p !== perm.id));
                                                                }}
                                                                className="w-5 h-5 rounded border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-[#0F172A]"
                                                            />
                                                            <span className="text-sm font-medium text-slate-200">{perm.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4 flex items-center justify-between">
                                                <button 
                                                    type="submit" 
                                                    disabled={createAdminLoading}
                                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-95"
                                                >
                                                    {createAdminLoading ? 'Provisioning...' : 'Provision Account'}
                                                </button>
                                                {createAdminMsg && (
                                                    <span className={`text-sm font-bold ${createAdminMsg.includes('Failed') ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                        {createAdminMsg}
                                                    </span>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                        <h3 className="text-xl font-black text-slate-800 mb-6">Active Administrators</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                                                        <th className="pb-4">Email Address</th>
                                                        <th className="pb-4">Role</th>
                                                        <th className="pb-4">Permissions</th>
                                                        <th className="pb-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {adminsList.map(admin => (
                                                        <tr key={admin._id} className="text-sm">
                                                            <td className="py-4 font-bold text-slate-700">{admin.email}</td>
                                                            <td className="py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {admin.role.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-slate-500 font-medium">
                                                                {admin.role === 'superadmin' ? 'ALL ACCESS' : (admin.permissions?.length ? admin.permissions.join(', ') : 'None')}
                                                            </td>
                                                            <td className="py-4 text-right">
                                                                {admin.role !== 'superadmin' && admin.email !== adminUser?.email && (
                                                                    <button 
                                                                        onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                                                                        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"
                                                                    >
                                                                        Revoke
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {adminsList.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="py-8 text-center text-slate-400 font-medium">No administrators found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
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
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-black">{adminUser?.email || 'Unknown'}</div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clearance</p>
                                                <div className="px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 font-black text-blue-600">{adminUser?.role === 'superadmin' ? 'ROOT_ADMIN' : 'ADMIN_TIER_2'}</div>
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

        {/* Custom Premium Purge Confirmation Modal */}
        <AnimatePresence>
            {showPurgeModal && purgeTarget && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
                    >
                        {/* Modal Header */}
                        <div className="bg-rose-600 text-white p-6 relative">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">⚠️</div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide">Danger Zone: Permanent Purge</h3>
                                    <p className="text-[10px] text-rose-200 uppercase font-black tracking-wider">Irreversible Action</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPurgeModal(false);
                                    setPurgeConfirmEmail('');
                                    setPurgeTarget(null);
                                }}
                                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                Are you absolutely sure you want to permanently delete <span className="font-black text-slate-800">{purgeTarget.name}</span> (<span className="font-mono text-rose-600 font-bold">{purgeTarget.email}</span>) from the platform?
                                <br /><br />
                                This will permanently delete their user account, login credentials, and all related registration history (volunteer, intern, or patron records). <strong>This action is irreversible.</strong>
                            </p>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                                    Type the email to confirm:
                                </label>
                                <input
                                    type="text"
                                    id="purge-confirm-email-input"
                                    value={purgeConfirmEmail}
                                    onChange={(e) => setPurgeConfirmEmail(e.target.value)}
                                    placeholder={purgeTarget.email}
                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-rose-500 font-medium text-xs font-mono transition-all text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPurgeModal(false);
                                    setPurgeConfirmEmail('');
                                    setPurgeTarget(null);
                                }}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (purgeConfirmEmail !== purgeTarget.email) {
                                        alert("Confirmation email does not match.");
                                        return;
                                    }
                                    setShowPurgeModal(false);
                                    setPurgeConfirmEmail('');
                                    const emailToPurge = purgeTarget.email;
                                    setPurgeTarget(null);
                                    try {
                                        setLoading(true);
                                        await axios.delete(`/api/admin/users/${emailToPurge}`);
                                        alert(`Account ${emailToPurge} has been permanently deleted.`);
                                        setSelectedVolunteer(null);
                                        setSelectedIntern(null);
                                        setSelectedPatron(null);
                                        fetchData();
                                    } catch (err) {
                                        console.error(err);
                                        const errorMsg = err.response?.data?.error || err.message;
                                        alert(`Purge failed: ${errorMsg}`);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                id="purge-confirm-btn"
                                disabled={purgeConfirmEmail !== purgeTarget.email}
                                className="flex-[2] py-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 transition-all active:scale-95"
                            >
                                Purge Record ✓
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

export default Admin;