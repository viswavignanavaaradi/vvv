import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [userType, setUserType] = useState('patron');
    const navigate = useNavigate();

    const handleSignupSuccess = (credentialResponse) => {
        console.log('Google Signup Success:', credentialResponse);
        // Decode JWT to get user info
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const user = JSON.parse(jsonPayload);
        localStorage.setItem('vvv_user', JSON.stringify({
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: userType // 'patron' or 'volunteer'
        }));

        if (userType === 'volunteer') {
            navigate('/volunteer-enrollment');
        } else if (userType === 'intern') {
            navigate('/internship-enrollment');
        } else {
            navigate('/profile');
        }
    };

    return (
        <div className="relative overflow-hidden h-[calc(100vh-100px)] bg-[#FDFCF6] flex items-center">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F59E0B]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#059669]/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">

                    {/* Left Column - Information Cards (Compact) */}
                    <div className="flex flex-col space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="p-8 xl:p-10 rounded-[40px] bg-gradient-to-br from-[#059669] to-[#047857] shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-1000 group-hover:scale-110"></div>
                            <h1 className="text-3xl xl:text-4xl font-merriweather font-black text-white leading-tight">
                                Join the <span className="text-[#F59E0B]">Legacy</span> <br />
                                of Impact.
                            </h1>
                            <p className="text-white/80 mt-4 text-sm font-medium leading-relaxed max-w-xs">
                                Choose your path and start making a difference today. Every action matters.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                            <motion.div
                                onClick={() => setUserType('patron')}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className={`p-6 xl:p-8 rounded-[35px] shadow-lg cursor-pointer border-2 transition-all duration-500 relative overflow-hidden ${userType === 'patron' ? 'bg-white border-[#059669] shadow-[#059669]/10' : 'bg-white/40 border-transparent opacity-60 backdrop-blur-sm'}`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] transition-colors ${userType === 'patron' ? 'bg-[#059669] border-[#059669] text-white' : 'border-slate-200'}`}>
                                    {userType === 'patron' && "✓"}
                                </div>
                                <h2 className={`text-xl font-merriweather font-black mb-1 ${userType === 'patron' ? 'text-[#059669]' : 'text-slate-400'}`}>Register as a Patron</h2>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Support us and help scale our vision.
                                </p>
                            </motion.div>

                            <motion.div
                                onClick={() => setUserType('volunteer')}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ delay: 0.1 }}
                                className={`p-6 xl:p-8 rounded-[35px] shadow-lg cursor-pointer border-2 transition-all duration-500 relative overflow-hidden ${userType === 'volunteer' ? 'bg-white border-[#059669] shadow-[#059669]/10' : 'bg-white/40 border-transparent opacity-60 backdrop-blur-sm'}`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] transition-colors ${userType === 'volunteer' ? 'bg-[#059669] border-[#059669] text-white' : 'border-slate-200'}`}>
                                    {userType === 'volunteer' && "✓"}
                                </div>
                                <h2 className={`text-xl font-merriweather font-black mb-1 ${userType === 'volunteer' ? 'text-[#059669]' : 'text-slate-400'}`}>Register as a Volunteer</h2>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Get on the ground and see impact firsthand.
                                </p>
                            </motion.div>

                            <motion.div
                                onClick={() => setUserType('intern')}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ delay: 0.2 }}
                                className={`p-6 xl:p-8 rounded-[35px] shadow-lg cursor-pointer border-2 transition-all duration-500 relative overflow-hidden ${userType === 'intern' ? 'bg-white border-[#059669] shadow-[#059669]/10' : 'bg-white/40 border-transparent opacity-60 backdrop-blur-sm'}`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] transition-colors ${userType === 'intern' ? 'bg-[#059669] border-[#059669] text-white' : 'border-slate-200'}`}>
                                    {userType === 'intern' && "✓"}
                                </div>
                                <h2 className={`text-xl font-merriweather font-black mb-1 ${userType === 'intern' ? 'text-[#059669]' : 'text-slate-400'}`}>Register as an Intern</h2>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Gain experience and contribute to our core missions.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column - Signup Form (Compact) */}
                    <div className="flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-2xl p-8 xl:p-12 rounded-[50px] shadow-[0_32px_64px_-16px_rgba(30,58,138,0.12)] w-full max-w-[440px] border border-white/40"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-merriweather font-black text-slate-900 mb-1">Sign Up!</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">I am joining as a <span className="text-[#F59E0B] italic">{userType}</span></p>
                            </div>

                            <form className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Pick a username"
                                        className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/5 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/5 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700 text-sm"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (userType === 'volunteer') {
                                            navigate('/volunteer-enrollment');
                                        } else if (userType === 'intern') {
                                            navigate('/internship-enrollment');
                                        } else {
                                            // Normal signup logic for patrons
                                            alert('Patron signup coming soon or use Google Login');
                                        }
                                    }}
                                    className="w-full bg-[#1e3a8a] text-white font-black py-4 rounded-[20px] shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:bg-[#1e40af] transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-2 text-sm"
                                >
                                    Create Account
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-6 bg-white text-slate-300 font-bold uppercase tracking-[0.3em] text-[10px]">fast registration</span>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={handleSignupSuccess}
                                    onError={() => console.error('Signup failed')}
                                    theme="outline"
                                    shape="circle"
                                    width="100%"
                                    text="signup_with"
                                />
                            </div>

                            <p className="mt-8 text-center text-slate-500 font-medium text-xs">
                                Already member? <Link to="/login" className="text-[#059669] font-black hover:underline underline-offset-4 decoration-2">Sign in</Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
