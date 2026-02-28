import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { API_BASE_URL } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('vvv_user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('vvv_user'));
        setUser(storedUser);
        try {
            const res = await axios.get(`/api/user/profile?email=${storedUser.email}`);
            setProfileData(res.data);

            // Sync user state and localStorage with latest backend data
            if (res.data.user) {
                const updatedUser = {
                    ...storedUser,
                    picture: res.data.user.picture || storedUser.picture,
                    role: res.data.user.role || storedUser.role,
                    name: res.data.user.name || storedUser.name
                };
                localStorage.setItem('vvv_user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }

            if (res.data.volunteer) {
                setEditForm({
                    fullName: res.data.volunteer.fullName,
                    phone: res.data.volunteer.phone,
                    education: res.data.volunteer.education,
                    interests: res.data.volunteer.interests,
                    age: res.data.volunteer.age,
                    gender: res.data.volunteer.gender,
                    bloodGroup: res.data.volunteer.bloodGroup,
                    state: res.data.volunteer.state,
                    district: res.data.volunteer.district,
                    college: res.data.volunteer.college,
                    wings: res.data.volunteer.wings,
                    priorityWing: res.data.volunteer.priorityWing
                });
            } else if (res.data.intern) {
                setEditForm({
                    fullName: res.data.intern.fullName,
                    phone: res.data.intern.phone,
                    education: res.data.intern.education,
                    college: res.data.intern.collegeName,
                    district: res.data.intern.district,
                    state: res.data.intern.state,
                    priorityWing: res.data.intern.priorityWing
                });
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('email', user.email);
        formData.append('photo', file);

        setUploading(true);
        try {
            const res = await axios.post('/api/user/upload-photo', formData);
            const updatedUser = { ...user, picture: res.data.url };
            localStorage.setItem('vvv_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert("Profile photo updated!");
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await axios.post('/api/user/update-profile', {
                email: user.email,
                updates: editForm,
                type: 'volunteer'
            });
            setIsEditing(false);
            fetchProfile();
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };

    const handleDownloadID = async () => {
        window.open(`${API_BASE_URL}/api/user/download-id-card?email=${user.email}`, '_blank');
    };

    const handleDownloadCertificate = async (certId) => {
        const url = certId ? `/api/user/download-certificate?email=${user.email}&certId=${certId}` : `/api/user/download-certificate?email=${user.email}`;
        window.open(`${API_BASE_URL}${url}`, '_blank');
    };

    const handleLogout = () => {
        localStorage.removeItem('vvv_user');
        navigate('/login');
    };

    const sidebarItems = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'account', label: 'Account Information', icon: '👥' },
        { id: 'personal', label: 'Personal Information', icon: '📜' },
        { id: 'donations', label: 'Donation Information', icon: '₹' },
    ];

    if (loading && !profileData) return (
        <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-4xl">🕊️</motion.div>
        </div>
    );

    const isVolunteer = profileData?.volunteer;
    const isIntern = profileData?.intern;

    return (
        <div className="bg-[#FFFDF5] min-h-screen pt-20 pb-20">
            <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">

                {/* Sidebar / Navigation Tabs */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full lg:w-80 flex-shrink-0"
                >
                    <div className="bg-white rounded-[32px] lg:rounded-[40px] shadow-xl overflow-hidden p-4 lg:p-8 sticky top-24">
                        <div className="mb-6 lg:mb-10 text-center lg:text-left hidden lg:block px-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Welcome back,</p>
                            <h2 className="text-2xl font-merriweather font-black text-[#1e3a8a]">Hi {user?.name.split(' ')[0]}!</h2>
                        </div>

                        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex-shrink-0 lg:w-full flex items-center gap-3 lg:gap-4 px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-[#f0f9ff] text-[#1e3a8a] shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="text-lg lg:text-xl">{item.icon}</span>
                                    <span className="text-xs lg:text-sm whitespace-nowrap">{item.label}</span>
                                </button>
                            ))}
                            <div className="hidden lg:flex flex-col gap-2 mt-4 pt-4 border-t border-slate-50">
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 hover:text-[#1e3a8a] transition-all"
                                >
                                    <span className="text-xl">🏠</span>
                                    <span className="text-sm">Back to Home</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    <span className="text-xl">🚪</span>
                                    <span className="text-sm">Log out</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-grow space-y-8"
                >
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile_tab"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-8"
                            >
                                {/* Mission Enrollment Status */}
                                {!isVolunteer && !isIntern && (
                                    <div className="bg-white rounded-[32px] lg:rounded-[40px] shadow-xl p-6 lg:p-8 border-l-8 border-[#F59E0B] relative overflow-hidden group">
                                        <div className="hidden lg:block absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                                            <span className="text-8xl">🚀</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6 relative z-10">
                                            <div className="bg-orange-50 w-16 lg:w-20 h-16 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center text-2xl lg:text-3xl shadow-inner shrink-0">🎯</div>
                                            <div className="flex-grow text-center md:text-left">
                                                <h2 className="text-xl lg:text-2xl font-merriweather font-black text-slate-800">Your Mission Awaits!</h2>
                                                <p className="text-slate-500 font-medium text-xs lg:text-sm mt-1">Join as a volunteer to make an impact.</p>
                                            </div>
                                            <button
                                                onClick={() => navigate('/volunteer-enrollment')}
                                                className="w-full md:w-auto bg-[#1e3a8a] text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black uppercase tracking-widest text-[9px] lg:text-[10px] hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-900/10"
                                            >
                                                Complete Enrollment
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isIntern && (
                                    <div className={`rounded-[40px] shadow-xl p-8 border-l-8 relative overflow-hidden group ${profileData.intern.status === 'accepted' ? 'bg-emerald-50 border-emerald-500' : profileData.intern.status === 'rejected' ? 'bg-rose-50 border-rose-500' : 'bg-orange-50 border-orange-500'}`}>
                                        <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
                                            <span className="text-8xl">🎓</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
                                                {profileData.intern.status === 'accepted' ? '✅' : profileData.intern.status === 'rejected' ? '🚫' : '⏳'}
                                            </div>
                                            <div className="flex-grow text-center md:text-left">
                                                <h2 className="text-2xl font-merriweather font-black text-slate-800">Internship Application: <span className="uppercase">{profileData.intern.status}</span></h2>
                                                <p className="text-slate-500 font-medium text-sm mt-1">{profileData.intern.adminMessage || (profileData.intern.status === 'pending' ? 'Your application is currently under review by our team.' : 'Please check your email for further instructions.')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Header Card */}
                                <div className="bg-white rounded-[50px] shadow-xl p-10 relative overflow-hidden border border-white">
                                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                        <div className="relative">
                                            <div className="w-40 h-40 rounded-[35px] overflow-hidden border-4 border-[#FFFDF5] shadow-lg bg-gray-100 flex items-center justify-center">
                                                {uploading ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="text-2xl text-blue-600">⏳</motion.div>
                                                ) : (
                                                    <img
                                                        src={isVolunteer ? (profileData.volunteer.picture || user?.picture) : (user?.picture || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")}
                                                        alt={user?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute -bottom-2 -right-2 bg-white w-10 h-10 rounded-2xl shadow-md flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                📷
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                            />
                                        </div>

                                        <div className="flex-grow text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="w-full">
                                                    {isEditing ? (
                                                        <input
                                                            value={editForm.fullName}
                                                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                                            className="text-2xl lg:text-4xl font-merriweather font-black text-slate-800 bg-slate-50 rounded-xl px-4 py-2 w-full outline-none focus:ring-4 focus:ring-blue-100"
                                                        />
                                                    ) : (
                                                        <h1 className="text-2xl lg:text-4xl font-merriweather font-black text-slate-800 leading-tight">
                                                            {isVolunteer ? profileData.volunteer.fullName : isIntern ? profileData.intern.fullName : user?.name}
                                                        </h1>
                                                    )}
                                                    <p className="text-blue-600 font-black tracking-[0.3em] text-[9px] lg:text-[10px] uppercase mt-1">
                                                        {isVolunteer ? `VVV-V-${String(profileData.volunteer._id).slice(-4).toUpperCase()}` : isIntern ? `VVV-I-${String(profileData.intern._id).slice(-4).toUpperCase()}` : 'PATRON'}
                                                    </p>
                                                    {isVolunteer && (
                                                        <button
                                                            onClick={handleDownloadID}
                                                            className="mt-3 lg:mt-2 text-[8px] lg:text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1 hover:underline group mx-auto md:mx-0"
                                                        >
                                                            <span>🆔</span> Download Digital ID Card
                                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-center md:items-end gap-2 text-right">
                                                    <button
                                                        onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                                                        className={`px-6 py-2 rounded-full border font-black text-[10px] uppercase tracking-[0.2em] transition-all min-w-[140px] ${isEditing ? 'bg-[#059669] border-[#059669] text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-600'}`}
                                                    >
                                                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                                                    </button>
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => setIsEditing(false)}
                                                            className="text-[9px] font-black uppercase text-gray-400 hover:text-red-500 tracking-widest"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 text-xs border-t border-slate-50 pt-6">
                                                <div>
                                                    <p className="uppercase tracking-widest text-[10px] text-gray-300 font-black mb-1">Email</p>
                                                    <p className="font-bold text-slate-600 truncate">{user?.email}</p>
                                                </div>
                                                <div>
                                                    <p className="uppercase tracking-widest text-[10px] text-gray-300 font-black mb-1">Joined</p>
                                                    <p className="font-bold text-slate-600">
                                                        {isVolunteer ? new Date(profileData.volunteer.date).toLocaleDateString() : isIntern ? new Date(profileData.intern.date).toLocaleDateString() : 'Active Member'}
                                                    </p>
                                                </div>
                                                {(isVolunteer || isIntern) && (
                                                    <div>
                                                        <p className="uppercase tracking-widest text-[10px] text-gray-300 font-black mb-1">Main Mission</p>
                                                        <p className="font-black text-blue-600">
                                                            {(isVolunteer ? profileData.volunteer.priorityWing : profileData.intern.priorityWing)?.includes('(')
                                                                ? (isVolunteer ? profileData.volunteer.priorityWing : profileData.intern.priorityWing).split('(')[1]?.replace(')', '')
                                                                : (isVolunteer ? profileData.volunteer.priorityWing : profileData.intern.priorityWing) || 'Social Service'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats & Bio Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Donation Card */}
                                    <div className="bg-white rounded-[40px] shadow-lg p-10 flex flex-col justify-between border border-white">
                                        <div>
                                            <h3 className="text-lg font-merriweather font-black mb-2 text-slate-800">Your Contributions</h3>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Real-time impact summary</p>
                                        </div>
                                        <div className="text-center py-6">
                                            <p className="text-6xl font-black text-[#059669] mb-4">₹{profileData?.donations?.total || 0}</p>
                                            <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest leading-none mb-1">{profileData?.donations?.count || 0} Successful Donations</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('donations')}
                                            className="w-full bg-[#1e3a8a] text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1e40af] transition-all shadow-xl shadow-blue-100/50 mb-3"
                                        >
                                            View History
                                        </button>
                                        <button
                                            onClick={() => handleDownloadCertificate()}
                                            className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                                        >
                                            📜 Download Latest Certificate
                                        </button>
                                    </div>

                                    {/* Bio Card */}
                                    <div className="bg-white rounded-[40px] shadow-lg p-10 border border-white">
                                        <h3 className="text-lg font-merriweather font-black text-slate-800 mb-6">Expertise & Interests</h3>
                                        <div className="flex flex-wrap gap-2 mb-8 min-h-[60px]">
                                            {isEditing ? (
                                                <textarea
                                                    value={editForm.interests || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-100"
                                                    placeholder="List your skills (comma separated)..."
                                                />
                                            ) : (
                                                isVolunteer && profileData.volunteer ? (
                                                    <>
                                                        {(profileData.volunteer.wings?.split(',') || []).map(tag => tag.trim()).filter(tag => tag).map(tag => (
                                                            <span key={tag} className="bg-emerald-50/50 px-4 py-2 rounded-full border border-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-widest">{tag}</span>
                                                        ))}
                                                        {(profileData.volunteer.interests?.split(',') || []).map(tag => tag.trim()).filter(tag => tag).map(tag => (
                                                            <span key={tag} className="bg-blue-50/50 px-4 py-2 rounded-full border border-blue-50 text-[9px] font-black text-blue-600 uppercase tracking-widest">{tag}</span>
                                                        ))}
                                                    </>
                                                ) : isIntern && profileData.intern ? (
                                                    <>
                                                        <span className="bg-orange-50/50 px-4 py-2 rounded-full border border-orange-50 text-[9px] font-black text-orange-600 uppercase tracking-widest">INTERNSHIP APPLICANT</span>
                                                        <span className="bg-blue-50/50 px-4 py-2 rounded-full border border-blue-50 text-[9px] font-black text-blue-600 uppercase tracking-widest">{profileData.intern.duration}</span>
                                                    </>
                                                ) : <p className="text-slate-300 text-[10px] italic">Join as a volunteer to showcase your skills.</p>
                                            )}
                                        </div>
                                        <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-50 relative">
                                            <span className="absolute -top-3 left-6 text-4xl text-slate-100 font-serif">"</span>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed italic relative z-10 pt-2">
                                                {isVolunteer ? `Dedicated member of ${profileData.volunteer.priorityWing?.split('(')[0] || 'VVV Foundation'}. Committed to social transformation.` : isIntern ? `Aspiring intern for ${profileData.intern.priorityWing?.split('(')[0] || 'VVV Foundation'}. Currently studying at ${profileData.intern.collegeName || 'University'}.` : "Supporter of VVV Foundation's vision."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'account' && (
                            <motion.div
                                key="account_tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[40px] shadow-xl p-12 border border-white space-y-12"
                            >
                                <div className="text-center md:text-left">
                                    <h3 className="text-3xl font-merriweather font-black text-slate-800">Account Information</h3>
                                    <p className="text-slate-400 font-medium">Manage your security and access details</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Primary Email</p>
                                            <p className="font-bold text-slate-700">{user?.email}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Member Type</p>
                                            <p className="font-bold text-[#1e3a8a]">{isVolunteer ? 'Official Volunteer Member' : isIntern ? 'Internship Applicant' : 'Patron Member'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Account ID</p>
                                            <p className="font-bold text-slate-700">#{isVolunteer ? profileData.volunteer._id : isIntern ? profileData.intern._id : 'P-' + user?.email.split('@')[0]}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <p className="font-bold text-emerald-600 uppercase text-[10px] tracking-widest">Active & Verified</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'personal' && (
                            <motion.div
                                key="personal_tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[40px] shadow-xl p-12 border border-white"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
                                    <div>
                                        <h3 className="text-3xl font-merriweather font-black text-slate-800">Personal Information</h3>
                                        <p className="text-slate-400 font-medium">Your identity and contact verification</p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-[#1e3a8a] text-[10px] font-black uppercase tracking-widest hover:underline"
                                    >
                                        {isEditing ? 'Cancel Edit' : 'Modify Information'}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { label: 'Full Name', field: 'fullName' },
                                            { label: 'Age', field: 'age' },
                                            { label: 'Gender', field: 'gender' },
                                            { label: 'Blood Group', field: 'bloodGroup' },
                                            { label: 'Phone Number', field: 'phone' },
                                            { label: 'Education', field: 'education' },
                                            { label: 'College', field: 'college' },
                                            { label: 'District', field: 'district' },
                                            { label: 'State', field: 'state' },
                                            { label: 'Preferred Wings', field: 'wings' },
                                            { label: 'Priority Wing', field: 'priorityWing' }
                                        ].map(item => (
                                            <div key={item.field} className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">{item.label}</label>
                                                <input
                                                    value={editForm[item.field] || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, [item.field]: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100"
                                                />
                                            </div>
                                        ))}
                                        <div className="md:col-span-2 pt-8">
                                            <button
                                                onClick={handleUpdateProfile}
                                                className="w-full bg-[#059669] text-white py-5 rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-emerald-100"
                                            >
                                                Apply Changes & Update Database
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Full Name</p>
                                                <p className="font-bold text-slate-800">{isVolunteer ? profileData.volunteer.fullName : isIntern ? profileData.intern.fullName : user?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Age / Gender</p>
                                                <p className="font-bold text-slate-800">{isVolunteer ? `${profileData.volunteer.age} / ${profileData.volunteer.gender}` : '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Blood Group</p>
                                                <p className="font-bold text-red-500">{isVolunteer ? profileData.volunteer.bloodGroup : '--'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Contact Phone</p>
                                                <p className="font-bold text-slate-800">{isVolunteer ? profileData.volunteer.phone : isIntern ? profileData.intern.phone : '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">District</p>
                                                <p className="font-bold text-slate-800">{isVolunteer ? profileData.volunteer.district : isIntern ? profileData.intern.district : '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">State</p>
                                                <p className="font-bold text-slate-800">{isVolunteer ? profileData.volunteer.state : isIntern ? profileData.intern.state : '--'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Education</p>
                                                <p className="font-bold text-slate-800">{isVolunteer ? profileData.volunteer.education : isIntern ? profileData.intern.education : '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">College/Work</p>
                                                <p className="font-bold text-slate-800">{isVolunteer ? profileData.volunteer.college : isIntern ? profileData.intern.collegeName : '--'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Main Mission (Wing)</p>
                                                <p className="font-bold text-blue-600">{isVolunteer ? (profileData.volunteer.priorityWing || 'General') : isIntern ? (profileData.intern.priorityWing || 'General') : '--'}</p>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Active Wings / Details</p>
                                            <p className="font-bold text-slate-600">{isVolunteer ? profileData.volunteer.wings : isIntern ? profileData.intern.duration + ' Internship' : '--'}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'donations' && (
                            <motion.div
                                key="donations_tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[40px] shadow-xl p-12 border border-white"
                            >
                                <div className="mb-12">
                                    <h3 className="text-3xl font-merriweather font-black text-slate-800">Donation History</h3>
                                    <p className="text-slate-400 font-medium tracking-tight">Your generous support tracked in the vvv_ngo ledger</p>
                                </div>

                                {profileData.donations.history.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-slate-50">
                                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-300 tracking-widest">Date</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-300 tracking-widest">Amount</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-300 tracking-widest">Receipt ID</th>
                                                    <th className="pb-6 text-[10px] font-black uppercase text-slate-300 tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {profileData.donations.history.map((donation, idx) => (
                                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-6 text-sm font-bold text-slate-600">{new Date(donation.date).toLocaleDateString()}</td>
                                                        <td className="py-6 text-sm font-black text-emerald-600">₹{donation.amount}</td>
                                                        <td className="py-6 text-xs text-slate-400 font-mono tracking-tighter">{donation.payment_id || 'LOCAL-MIGRATE'}</td>
                                                        <td className="py-6 text-right">
                                                            <button
                                                                onClick={() => handleDownloadCertificate(donation.certificate_id)}
                                                                className="text-[9px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                                                            >
                                                                Download Certificate
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                                        <p className="text-4xl mb-4">💳</p>
                                        <h4 className="text-xl font-merriweather font-black text-slate-400 uppercase tracking-widest">No Transactions Found</h4>
                                        <p className="text-slate-300 text-sm mt-2">Your contribution history will appear here once you donate.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default Profile;
