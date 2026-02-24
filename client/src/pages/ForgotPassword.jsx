import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(59);

    return (
        <div className="relative overflow-hidden h-[calc(100vh-100px)] bg-[#FDFCF6] flex items-center">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#059669]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F59E0B]/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">

                    {/* Left Column - Quote Card (Compact) */}
                    <div className="hidden lg:flex justify-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="w-full max-w-sm p-10 rounded-[40px] bg-gradient-to-br from-[#059669] to-[#047857] shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[350px] group"
                        >
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/5 rounded-full transition-transform duration-1000 group-hover:scale-110"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="relative z-10"
                            >
                                <span className="text-4xl text-white/20 font-serif leading-none absolute -top-4 -left-4">“</span>
                                <p className="text-2xl font-merriweather font-black text-white italic leading-relaxed">
                                    Not all of us can do great things. But we can do small things with great love.
                                </p>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="w-10 h-1 px-1 bg-[#F59E0B] rounded-full"></div>
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Mother Teresa</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column - Forgot Password Form (Compact) */}
                    <div className="flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/80 backdrop-blur-2xl p-8 xl:p-12 rounded-[50px] shadow-[0_32px_64_rgba(30,58,138,0.12)] w-full max-w-[440px] border border-white/40"
                        >
                            <div className="text-center mb-8">
                                <motion.div
                                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F59E0B] text-white text-xl mb-4 shadow-lg shadow-[#F59E0B]/20"
                                >
                                    🔑
                                </motion.div>
                                <h1 className="text-3xl font-merriweather font-black text-slate-900">No Worries</h1>
                                <p className="text-slate-400 mt-1 text-sm font-medium">Enter your email to reset your secret.</p>
                            </div>

                            <form className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
                                    <input
                                        type="email"
                                        placeholder="johndoe@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/5 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700 text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-black py-4 rounded-[20px] shadow-xl shadow-orange-900/10 transition-all transform hover:-translate-y-1 active:scale-[0.98] text-sm"
                                >
                                    Send OTP
                                </button>
                            </form>

                            <div className="mt-8 flex justify-between items-center px-4">
                                <button className="text-[10px] font-black text-slate-400 hover:text-[#D97706] transition-colors uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-[#D97706]">
                                    Send Again
                                </button>
                                <span className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">
                                    00:{timer < 10 ? `0${timer}` : timer} Sec
                                </span>
                            </div>

                            <div className="mt-10 text-center">
                                <Link to="/login" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#1e3a8a] transition-all hover:bg-slate-50 px-6 py-3 rounded-full">
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
