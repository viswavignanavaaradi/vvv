import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from '../api/axios';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSuccess = async (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        // Decode JWT to get user info (Simple way for demo)
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const user = JSON.parse(jsonPayload);

        // Initial set with Google data
        const userData = {
            name: user.name,
            email: user.email,
            picture: user.picture,
            role: 'patron'
        };

        // Fetch latest from DB to override role/picture if exists
        try {
            const res = await axios.get(`/api/user/profile?email=${user.email}`);
            if (res.data.user) {
                userData.role = res.data.user.role || userData.role;
                userData.picture = res.data.user.picture || userData.picture;
                userData.name = res.data.user.name || userData.name;
            }
        } catch (err) {
            console.log("New user or fetch error, using default data");
        }

        localStorage.setItem('vvv_user', JSON.stringify(userData));
        navigate('/profile');
    };

    const handleLoginError = () => {
        console.error('Google Login Failed');
        setError('Google Login failed. Please try again.');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username === 'admin' && formData.password === 'password') {
            localStorage.setItem('vvv_user', JSON.stringify({
                name: 'Administrator',
                email: 'admin@vvv.org',
                role: 'admin'
            }));
            navigate('/admin');
        } else {
            setError('Wrong username or password');
        }
    };

    return (
        <div className="relative overflow-hidden h-[calc(100vh-100px)] bg-[#FDFCF6] flex items-center">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#059669]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F59E0B]/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">

                    {/* Left side: branding/visuals - Slightly more compact */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="hidden lg:flex flex-col space-y-8"
                    >
                        <div className="space-y-3">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="inline-block px-4 py-1.5 rounded-full bg-[#059669]/10 text-[#059669] text-xs font-black uppercase tracking-widest"
                            >
                                Empowering Lives
                            </motion.span>
                            <h1 className="text-5xl xl:text-6xl font-merriweather font-black text-slate-900 leading-[1.1]">
                                Empowering <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#34d399]">Change,</span> <br />
                                Step by Step.
                            </h1>
                            <p className="text-base text-slate-500 max-w-sm font-medium leading-relaxed">
                                Experience a new level of connection. Your journey to impact starts here.
                            </p>
                        </div>

                        <div className="relative group max-w-sm">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white/50 backdrop-blur-sm"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Community Impact"
                                    className="w-full h-[320px] xl:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <p className="font-merriweather text-xl font-black mb-1 italic">"Small acts, giant ripples."</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">- VVV Foundation</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right side: login card - More compact vertical spacing */}
                    <div className="flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-[440px] bg-white/80 backdrop-blur-2xl rounded-[50px] shadow-[0_32px_64px_-16px_rgba(30,58,138,0.12)] p-10 md:p-12 border border-white/40"
                        >
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#059669] text-white text-2xl mb-4 shadow-lg shadow-[#059669]/20"
                                >
                                    👋
                                </motion.div>
                                <h1 className="text-3xl font-merriweather font-black text-slate-900">Hi There!</h1>
                                <p className="text-slate-400 mt-1 text-sm font-medium">Please enter your details to sign in.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="e.g. johndoe"
                                        className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/5 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                        <Link to="/forgot-password" size="sm" className="text-[10px] text-[#059669] font-black hover:underline underline-offset-4">Forgot?</Link>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#059669] focus:ring-4 focus:ring-[#059669]/5 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700 text-sm"
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="px-4 py-3 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-[#1e3a8a] text-white font-black py-4 rounded-[20px] shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:bg-[#1e40af] transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-4 text-sm"
                                >
                                    Sign In
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-6 bg-white text-slate-300 font-bold uppercase tracking-[0.3em] text-[10px]">secured login</span>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={handleLoginError}
                                    theme="outline"
                                    shape="circle"
                                    width="100%"
                                />
                            </div>

                            <p className="mt-8 text-center text-slate-500 font-medium text-xs">
                                Not a member? <Link to="/signup" className="text-[#059669] font-black hover:underline underline-offset-4 decoration-2">Create Account</Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
