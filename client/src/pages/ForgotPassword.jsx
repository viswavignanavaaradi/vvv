import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
    const [timer, setTimer] = useState(59);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setStep(2);
            setTimer(59);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/verify-otp', { email, otp });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/reset-password', { email, otp, password: newPassword });
            alert('Password reset successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden h-[calc(100vh-100px)] bg-[#FDFCF6] flex items-center">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#059669]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F59E0B]/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">
                    <div className="hidden lg:flex justify-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-sm p-10 rounded-[40px] bg-gradient-to-br from-[#059669] to-[#047857] shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[350px]"
                        >
                            <p className="text-2xl font-merriweather font-black text-white italic leading-relaxed">
                                "Not all of us can do great things. But we can do small things with great love."
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="w-10 h-1 px-1 bg-[#F59E0B] rounded-full"></div>
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Mother Teresa</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/80 backdrop-blur-2xl p-8 xl:p-12 rounded-[50px] shadow-[0_32px_64px_rgba(30,58,138,0.12)] w-full max-w-[440px] border border-white/40"
                        >
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F59E0B] text-white text-xl mb-4">🔑</div>
                                            <h1 className="text-3xl font-merriweather font-black text-slate-900">No Worries</h1>
                                            <p className="text-slate-400 mt-1 text-sm font-medium">Enter your email to reset your secret.</p>
                                        </div>
                                        <form onSubmit={handleSendOTP} className="space-y-6">
                                            <input
                                                type="email"
                                                required
                                                placeholder="johndoe@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none"
                                            />
                                            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
                                            <button type="submit" disabled={loading} className="w-full bg-[#D97706] text-white font-black py-4 rounded-[20px] transition-all">
                                                {loading ? 'Sending...' : 'Send OTP'}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#059669] text-white text-xl mb-4">🛡️</div>
                                            <h1 className="text-3xl font-merriweather font-black text-slate-900">Verify OTP</h1>
                                            <p className="text-slate-400 mt-1 text-sm font-medium">Check your inbox for the code.</p>
                                        </div>
                                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                                            <input
                                                type="text"
                                                required
                                                maxLength="6"
                                                placeholder="Enter 6-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 text-center text-xl tracking-widest outline-none"
                                            />
                                            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
                                            <button type="submit" disabled={loading} className="w-full bg-[#D97706] text-white font-black py-4 rounded-[20px]">
                                                {loading ? 'Verifying...' : 'Verify OTP'}
                                            </button>
                                        </form>
                                        <div className="mt-8 flex justify-between items-center px-4">
                                            <button onClick={handleSendOTP} disabled={timer > 0} className={`text-[10px] font-black uppercase tracking-widest ${timer > 0 ? 'text-slate-300' : 'text-[#D97706]'}`}>
                                                Send Again
                                            </button>
                                            <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">00:{timer < 10 ? `0${timer}` : timer} Sec</span>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e3a8a] text-white text-xl mb-4">✨</div>
                                            <h1 className="text-3xl font-merriweather font-black text-slate-900">New Start</h1>
                                            <p className="text-slate-400 mt-1 text-sm font-medium">Set your new password below.</p>
                                        </div>
                                        <form onSubmit={handleResetPassword} className="space-y-6">
                                            <input
                                                type="password"
                                                required
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none"
                                            />
                                            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
                                            <button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] text-white font-black py-4 rounded-[20px]">
                                                {loading ? 'Updating...' : 'Reset Password'}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-10 text-center">
                                <Link to="/login" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#1e3a8a]">
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
