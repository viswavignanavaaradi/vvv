import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GetInvolved = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('volunteer');

    const options = {
        patron: {
            title: "⭐ Legacy of Support ⭐",
            subtitle: "Monthly Patronage",
            description: "Foundational Patrons are the pillars of VVV. Your monthly contribution provides the sustained financial stability needed for our long-term missions and rural transformation projects.",
            features: [
                "Sustainable monthly support",
                "Impact reporting & strategy",
                "Council recognition"
            ],
            cta: "⭐ Be a Patron ⭐",
            path: "/donate",
            color: "bg-emerald-600",
            icon: "🏛️"
        },
        volunteer: {
            title: "Join as a Volunteer",
            subtitle: "Impact Rural Communities",
            description: "Become the heartbeat of our foundation. As a volunteer, you'll work directly on the ground, participating in medical camps, literacy drives, and rural empowerment projects. This is more than service; it's a journey of empathy and growth.",
            features: [
                "Field presence in rural campaigns",
                "Community leadership training",
                "Work on diverse core missions"
            ],
            cta: "Enroll as Volunteer",
            path: "/volunteer-enrollment",
            color: "bg-blue-600",
            icon: "🤝"
        },
        internship: {
            title: "Shape the Future",
            subtitle: "Academic & Field Excellence",
            description: "Our internship program offers university students a structured path to social research and project management. Gain professional mentorship while contributing to policy analysis and impact assessment in real-world scenarios.",
            features: [
                "University credit certification",
                "Professional mentoring",
                "Data research & policy focus"
            ],
            cta: "Enroll in Internship",
            path: "/internship-enrollment",
            color: "bg-indigo-600",
            icon: "🎓"
        }
    };

    return (
        <div className="bg-[#FDFCF6] min-h-screen">

            {/* Version Sentinel - Updated for Fix */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
                <div className="px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/20 animate-bounce">
                    System Live: v4.5.6
                </div>
            </div>

            {/* Hero */}
            <section className="pt-28 md:pt-40 pb-16 md:pb-20 px-4 md:px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-merriweather font-black text-slate-900 mb-6 italic leading-tight">Join the movement for change.</h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">Choose your path to impact. Whether you're a student, professional, or a community leader, your presence matters.</p>
                    </motion.div>
                </div>
            </section>

            {/* Selection Area */}
            <section className="pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Tabs */}
                    <div className="flex justify-center flex-wrap gap-3 md:gap-4 mb-10 md:mb-16">
                        {Object.keys(options).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === key ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    {/* Content Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-[24px] md:rounded-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-visible md:overflow-hidden flex flex-col md:flex-row min-h-[350px] md:min-h-[500px]"
                        >
                            {/* Left Side: Dynamic Image/Graphic */}
                            <div className={`hidden md:flex md:w-1/2 p-8 md:p-12 items-center justify-center relative overflow-hidden ${options[activeTab].color}`}>
                                <div className="absolute inset-0 opacity-10 flex flex-wrap items-center justify-center text-5xl md:text-9xl">
                                    {[...Array(6)].map((_, i) => <span key={i} className="p-4">{options[activeTab].icon}</span>)}
                                </div>
                                <div className="relative z-10 text-center">
                                    <span className="text-5xl md:text-8xl mb-3 md:mb-6 block drop-shadow-2xl">{options[activeTab].icon}</span>
                                    <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white/20 text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-white shadow-2xl animate-pulse">
                                        PORTAL ACTIVE: V4.5.2
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Info */}
                            <div className="flex-1 p-6 sm:p-10 md:p-20 flex flex-col justify-center">
                                <h3 className="text-2xl md:text-4xl font-merriweather font-black text-slate-900 mb-3 md:mb-6 italic">{options[activeTab].title}</h3>
                                <p className="text-slate-500 text-sm md:text-lg leading-relaxed mb-4 md:mb-8 font-medium">{options[activeTab].description}</p>

                                <div className="space-y-3 md:space-y-4 mb-6 md:mb-10">
                                    {options[activeTab].features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 md:gap-4">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                            <span className="text-[13px] md:text-[15px] font-bold text-slate-700 leading-tight">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate(options[activeTab].path)}
                                    className={`w-full md:w-auto px-10 py-4 md:px-12 md:py-5 rounded-xl md:rounded-2xl text-white font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl active:scale-95 transition-all ${options[activeTab].color} hover:brightness-110`}
                                >
                                    {options[activeTab].cta}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Other Ways to Help */}
            <section className="bg-slate-900 py-20 md:py-32 px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-merriweather font-black text-white italic mb-4">More ways to contribute.</h2>
                        <p className="text-slate-400 text-base md:text-lg">Beyond enrollment, every gesture counts towards the Varadi.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { title: "CSR Partnerships", desc: "Corporate collaborations for institutional social change.", icon: "🏢" },
                            { title: "Material Support", desc: "Donate books, health kits, and essential materials.", icon: "📦" },
                            { title: "Mentorship", desc: "Share your professional expertise with our youth wings.", icon: "💡" }
                        ].map((item, i) => (
                            <div key={i} className="p-8 md:p-10 rounded-[24px] md:rounded-[40px] bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all group">
                                <div className="text-4xl md:text-5xl mb-4 md:mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h4 className="text-white font-black mb-2 md:mb-3 uppercase tracking-widest text-xs md:text-sm">{item.title}</h4>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default GetInvolved;
