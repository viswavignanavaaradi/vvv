import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GetInvolved = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('volunteer');

    const options = {
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
        },
        patron: {
            title: "Legacy of Leadership",
            subtitle: "Advisory Council Patronage",
            description: "Foundational Patrons are the pillars of VVV. By joining our Advisory Council, you provide the sustained leadership and financial stability needed for long-term social disruption and rural transformation.",
            features: [
                "Advisory Council voting rights",
                "Impact reporting & strategy",
                "Sustainable monthly support"
            ],
            cta: "Become a Patron",
            path: "/patron-enrollment",
            color: "bg-emerald-600",
            icon: "🏛️"
        }
    };

    return (
        <div className="bg-[#FDFCF6] min-h-screen">

            {/* Version Sentinel - Will show in v4.1.6 */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
                <div className="px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/20 animate-bounce">
                    System Live: v4.1.6
                </div>
            </div>

            {/* Hero */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-merriweather font-black text-slate-900 mb-6 italic leading-tight">Join the movement for change.</h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">Choose your path to impact. Whether you're a student, professional, or a community leader, your presence matters.</p>
                    </motion.div>
                </div>
            </section>

            {/* Selection Area */}
            <section className="pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Tabs */}
                    <div className="flex justify-center flex-wrap gap-4 mb-16">
                        {Object.keys(options).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === key ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
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
                            className="bg-white rounded-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]"
                        >
                            {/* Left Side: Dynamic Image/Graphic */}
                            <div className={`md:w-1/2 p-12 flex items-center justify-center relative overflow-hidden ${options[activeTab].color}`}>
                                <div className="absolute inset-0 opacity-10 flex flex-wrap items-center justify-center text-9xl">
                                    {[...Array(6)].map((_, i) => <span key={i} className="p-4">{options[activeTab].icon}</span>)}
                                </div>
                                <div className="relative z-10 text-center">
                                    <span className="text-8xl mb-6 block drop-shadow-2xl">{options[activeTab].icon}</span>
                                    <h2 className="text-white text-3xl font-black uppercase tracking-[0.2em]">{options[activeTab].subtitle}</h2>
                                </div>
                            </div>

                            {/* Right Side: Info */}
                            <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
                                <h3 className="text-4xl font-merriweather font-black text-slate-900 mb-6 italic">{options[activeTab].title}</h3>
                                <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">{options[activeTab].description}</p>

                                <div className="space-y-4 mb-10">
                                    {options[activeTab].features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-sm font-bold text-slate-700">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate(options[activeTab].path)}
                                    className={`w-full md:w-auto px-12 py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all ${options[activeTab].color} hover:brightness-110`}
                                >
                                    {options[activeTab].cta}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Other Ways to Help */}
            <section className="bg-slate-900 py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-merriweather font-black text-white italic mb-4">More ways to contribute.</h2>
                        <p className="text-slate-400 text-lg">Beyond enrollment, every gesture counts towards the Varadi.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "CSR Partnerships", desc: "Corporate collaborations for institutional social change.", icon: "🏢" },
                            { title: "Material Support", desc: "Donate books, health kits, and essential materials.", icon: "📦" },
                            { title: "Mentorship", desc: "Share your professional expertise with our youth wings.", icon: "💡" }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[40px] bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all group">
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h4 className="text-white font-black mb-3 uppercase tracking-widest text-sm">{item.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
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
