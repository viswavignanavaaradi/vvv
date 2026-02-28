import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const MissionSection = ({ id, title, subtitle, icon, color, rationale, objectives, programs, vision, philosophy }) => (
    <section id={id} className="py-24 border-b border-slate-100 scroll-mt-24">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Left: Sticky Info */}
                <div className="w-full md:w-1/3">
                    <div className="md:sticky md:top-32">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl" style={{ backgroundColor: color + '15', color: color }}>
                            {icon}
                        </div>
                        <h2 className="text-4xl font-merriweather font-black text-slate-900 mb-4">{title}</h2>
                        <p className="text-lg text-slate-500 font-medium italic mb-8 border-l-4 pl-4" style={{ borderColor: color }}>{subtitle}</p>

                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Core Objectives</h4>
                            <ul className="space-y-3">
                                {objectives.map((obj, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                                        <span style={{ color: color }}>•</span> {obj}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right: Detailed Content */}
                <div className="w-full md:w-2/3 space-y-12">
                    {/* Rationale */}
                    <div>
                        <h3 className="text-2xl font-merriweather font-black text-slate-800 mb-6 flex items-center gap-3">
                            <span className="w-8 h-[2px] rounded-full" style={{ backgroundColor: color }}></span>
                            The Rationale
                        </h3>
                        <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-slate-50">
                            <p className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">{rationale.text}</p>
                            {rationale.grids && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                    {rationale.grids.map((grid, gi) => (
                                        <div key={gi} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                            <h5 className="font-black text-xs uppercase tracking-widest text-[#1e3a8a] mb-3">{grid.title}</h5>
                                            <ul className="space-y-2">
                                                {grid.items.map((item, ii) => (
                                                    <li key={ii} className="text-sm text-slate-600 font-bold">• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Programs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {programs.map((prog, pi) => (
                            <div key={pi} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <h4 className="text-xl font-merriweather font-black text-slate-800 mb-4">{prog.name}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{prog.desc}</p>
                                {prog.points && (
                                    <ul className="mt-4 space-y-2">
                                        {prog.points.map((pt, pti) => (
                                            <li key={pti} className="text-xs text-slate-400 font-bold flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                                                {pt}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Vision & Philosophy */}
                    <div className="bg-[#1e3a8a] rounded-[42px] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl">🔭</span>
                                <h3 className="text-2xl font-merriweather font-black">Long-Term Vision</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <ul className="space-y-4">
                                    {vision.map((v, vi) => (
                                        <li key={vi} className="flex gap-3 text-sm font-bold text-white/80">
                                            <span>✔</span> {v}
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                                    <p className="text-sm font-bold italic text-white/90 leading-relaxed mb-4">" {philosophy.text} "</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">— Philosophical Foundation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Missions = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    const missions_data = [
        {
            id: "mission-trupti",
            title: "Mission Trupti",
            subtitle: "Hunger Eradication, Nutrition & Community Health Initiative",
            icon: "🍛",
            color: "#DDA63A",
            rationale: {
                text: "Mission Trupti is inspired by the painful reality that families continue to sleep hungry and children suffer from preventable malnutrition. Food is not charity — it is a fundamental human necessity.",
                grids: [
                    { title: "Target Groups", items: ["Rural communities", "Tribal populations", "Slum dwellers", "Orphan children"] },
                    { title: "Health Focus", items: ["Malnutrition ( Kwashiorkor, Anemia)", "Water-borne Diseases (Cholera, Typhoid)"] }
                ]
            },
            objectives: [
                "Ensure no family sleeps hungry",
                "Reduce child and maternal malnutrition",
                "Promote clean drinking water access",
                "Prevent water-borne diseases"
            ],
            programs: [
                { name: "Hunger-Free Zones", desc: "Community food distribution drives and emergency food assistance for high-risk households." },
                { name: "Child & Maternal Support", desc: "Nutritional supplementation and immunity-building food programs for malnourished children and lactating mothers." },
                { name: "Clean Drinking Water", desc: "Promoting water purification awareness and safe water access in tribal and slum regions." }
            ],
            vision: [
                "Hunger-free districts",
                "Reduced malnutrition rates",
                "Improved rural public health awareness",
                "Decline in preventable diseases"
            ],
            philosophy: { text: "Serving the hungry is serving humanity. Strengthening immunity strengthens the nation." }
        },
        {
            id: "mission-medha",
            title: "Mission Medha",
            subtitle: "Bridging the structural gap in educational empowerment",
            icon: "📖",
            color: "#C5192D",
            rationale: {
                text: "Poverty must never suppress talent. Mission Medha seeks to dismantle the disparities between private corporate schools and economically disadvantaged students.",
                grids: [
                    { title: "Challenges", items: ["Lack of career guidance", "Personalized academic mentoring", "Personalized mentoring gap"] }
                ]
            },
            objectives: [
                "Reduce academic performance gap",
                "Provide structured academic mentoring",
                "Offer career counseling and exposure",
                "Create district-level model institutions"
            ],
            programs: [
                { name: "CLC Model", desc: "Community Learning Centers in slums and rural villages with volunteer supervision.", points: ["30 students per center", "Personalized mentoring"] },
                { name: "District Model Schools", desc: "5,000 students capacity with international academic standards.", points: ["50% ST Reservations", "Free Residential Model"] }
            ],
            vision: [
                "Create first-generation graduates",
                "Break intergenerational poverty cycles",
                "Build rural leadership",
                "Reduce dropout rates"
            ],
            philosophy: { text: "Education is the strongest defense of a nation." }
        },
        {
            id: "nyaya-sadan",
            title: "Nyaya Sadan",
            subtitle: "Legal Empowerment and Constitutional Accountability",
            icon: "⚖️",
            color: "#00689D",
            rationale: {
                text: "Legal ignorance often leads to exploitation. Nyaya Sadan transforms legal awareness into legal empowerment, ensuring justice is accessible to the marginalized.",
                grids: [
                    { title: "Focus Areas", items: ["Fundamental Rights Literacy", "Accountability Mechanisms", "Legal Literacy Cells"] }
                ]
            },
            objectives: [
                "Promote constitutional literacy",
                "Provide free legal consultation",
                "Strengthen public accountability",
                "Build legally aware youth generation"
            ],
            programs: [
                { name: "Free Legal Aid", desc: "A panel of advocates providing consultation on civil, criminal, and constitutional matters with dignity." },
                { name: "PIL Advocacy", desc: "Corrective engagement through Public Interest Litigations to challenge administrative negligence." },
                { name: "College Literacy Cells", desc: "Developing youth leadership in law and governance across universities." }
            ],
            vision: [
                "Legally aware society",
                "Increased citizen participation",
                "Transparency in governance",
                "Grassroots constitutional culture"
            ],
            philosophy: { text: "Justice delayed weakens democracy. Justice denied destroys trust." }
        },
        {
            id: "mission-manoswasthya",
            title: "Mission Manoswasthya",
            subtitle: "Mental Health and Psychological Well-being Initiative",
            icon: "🧠",
            color: "#4C9F38",
            rationale: {
                text: "Mental health is often a silent neglect. Mission Manoswasthya normalizes mental health conversations to build an emotionally resilient society.",
                grids: [
                    { title: "Crisis Response", items: ["Student Suicide Prevention", "Substance Abuse Stigma", "Social Stigma Reduction"] }
                ]
            },
            objectives: [
                "Prevent student suicides",
                "Provide access to psychological support",
                "Conduct workplace wellness programs",
                "Support drug de-addiction"
            ],
            programs: [
                { name: "Campus Resilience", desc: "Workshops and peer support systems in schools and colleges to manage academic pressure." },
                { name: "Workplace Wellness", desc: "Burnout prevention and emotional intelligence training for corporate employees." },
                { name: "De-Addiction", desc: "Motivational counseling and social reintegration for restoration of dignity." }
            ],
            vision: [
                "Suicide-free campuses",
                "Addiction-free communities",
                "Mentally aware workplaces",
                "Stable family structures"
            ],
            philosophy: { text: "Mental health is not a luxury — it is a necessity. Seeking help is courage." }
        },
        {
            id: "mission-jeevadhara",
            title: "Mission Jeevadhara",
            subtitle: "Rural/Tribal Innovation and Technological Empowerment",
            icon: "🔬",
            color: "#FD6925",
            rationale: {
                text: "Innovation rarely reaches where market profitability is low. Jeevadhara bridges the gap by connecting youth innovation with grassroots necessity.",
                grids: [
                    { title: "Infrastructure", items: ["Poor Drinking Water", "Energy Shortages", "Agricultural Inefficiency"] }
                ]
            },
            objectives: [
                "Engineering-based solutions",
                "Promote grassroots sustainable innovation",
                "Reduce technological disparities",
                "Strengthen tribal self-reliance"
            ],
            programs: [
                { name: "Youth Innovation", desc: "Engaging engineering students to develop low-cost prototypes for rural challenges." },
                { name: "Tribal-Centric Dev", desc: "Sustainable interventions respecting local traditions and geographic isolation." },
                { name: "Digital Access", desc: "Affordable connectivity and digital literacy for remote settlements." }
            ],
            vision: [
                "Technologically empowered rural communities",
                "Self-reliant tribal regions",
                "Inclusive technological growth",
                "Youth-driven innovation ecosystems"
            ],
            philosophy: { text: "Innovation must serve humanity. Development must reach the last person." }
        }
    ];

    return (
        <div className="bg-[#FFFDF5] min-h-screen pt-20">
            {/* Mission Navigator Dropdown */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all py-3">
                <div className="container mx-auto px-4 flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[#1e3a8a]">Missions Explorer</span>
                        <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
                        <span className="text-xs font-black text-slate-400 lg:block hidden uppercase tracking-widest">Our Strategic Wings</span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-900/10"
                        >
                            Jump to Mission <span className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 overflow-hidden"
                                >
                                    <div className="flex flex-col gap-1">
                                        {missions_data.map((m) => (
                                            <a
                                                key={m.id}
                                                href={`#${m.id}`}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group/item"
                                            >
                                                <span className="text-2xl grayscale group-hover/item:grayscale-0 transition-all">{m.icon}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{m.title}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium truncate w-40">{m.subtitle}</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative py-24 bg-[#1e3a8a] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#1e3a8a] to-emerald-900 opacity-95"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-blue-200 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block"
                    >
                        Foundation of Impact
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-merriweather font-black text-white mb-6"
                    >
                        Our Missions
                    </motion.h1>
                    <p className="text-xl text-white/70 font-medium max-w-3xl mx-auto leading-relaxed">
                        Transforming the marginalized landscape of India through systematic legal, educational, nutritional, and technological intervention.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/50 rounded-full"></div>
                </div>
            </section>

            {/* Mission Components */}
            <div>
                {missions_data.map((mission, index) => (
                    <MissionSection key={mission.id} {...mission} />
                ))}
            </div>

            {/* Integration Call to Action */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto bg-emerald-50 rounded-[48px] p-12 lg:p-20 relative overflow-hidden border border-emerald-100">
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-merriweather font-black text-slate-900 mb-8">Ready to join the Movement?</h2>
                            <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">Your professional skills can power these missions. Whether it's legal advice, medical support, or engineering innovation — there's a space for you.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button onClick={() => window.location.href = '/volunteer-enrollment'} className="bg-[#1e3a8a] text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-[#1e40af] transition-all shadow-xl shadow-blue-900/10">Become a Volunteer</button>
                                <button onClick={() => window.location.href = '/get-involved'} className="bg-white text-[#1e3a8a] border-2 border-slate-200 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:border-[#1e3a8a] transition-all">Explore Partnerships</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Missions;
