import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const MissionSection = ({ id, title, subtitle, intro, rationale, objectives, programs, vision, philosophy, color, icon, integration }) => (
    <section id={id} className="py-24 border-b border-slate-100 scroll-mt-24">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-16">
                {/* Left: Sticky Identity */}
                <div className="w-full md:w-1/3">
                    <div className="md:sticky md:top-36">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-2xl relative"
                            style={{ backgroundColor: color + '15', color: color }}
                        >
                            <div className="absolute inset-0 rounded-3xl border-2 opacity-20" style={{ borderColor: color }}></div>
                            {icon}
                        </motion.div>
                        <h2 className="text-4xl lg:text-5xl font-merriweather font-black text-slate-900 mb-6 leading-tight">{title}</h2>
                        <p className="text-xl text-slate-500 font-medium italic mb-10 border-l-4 pl-6" style={{ borderColor: color }}>{subtitle}</p>

                        <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Core Mission Objectives</h4>
                            <ul className="space-y-4">
                                {objectives.map((obj, i) => (
                                    <li key={i} className="flex gap-4 text-sm text-slate-600 font-semibold leading-relaxed">
                                        <span className="shrink-0" style={{ color: color }}>◆</span>
                                        {obj}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right: Rich Content */}
                <div className="w-full md:w-2/3 space-y-20">
                    {/* Introduction */}
                    <div>
                        <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-6" style={{ backgroundColor: color }}>Introduction</div>
                        <p className="text-2xl text-slate-700 leading-relaxed font-medium font-merriweather">
                            {intro}
                        </p>
                    </div>

                    {/* Rationale Section */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 bottom-0 w-1 rounded-full opacity-10" style={{ backgroundColor: color }}></div>
                        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
                            The Rationale
                            <span className="h-px bg-slate-200 flex-grow"></span>
                        </h3>
                        <div className="bg-white rounded-[40px] p-10 lg:p-14 shadow-xl shadow-slate-200/50 border border-slate-50">
                            <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">{rationale.text}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {rationale.lists.map((list, li) => (
                                    <div key={li} className="space-y-4 p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                                        <h5 className="font-black text-[11px] uppercase tracking-widest text-[#1e3a8a] flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                                            {list.title}
                                        </h5>
                                        <ul className="grid grid-cols-1 gap-2">
                                            {list.items.map((item, ii) => (
                                                <li key={ii} className="text-sm text-slate-500 font-bold flex items-center gap-3">
                                                    <span className="text-xs text-slate-300">•</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Programs Grid */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black text-slate-800 shrink-0">Strategic Initiatives</h3>
                            <div className="h-px bg-slate-200 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {programs.map((prog, pi) => (
                                <motion.div
                                    key={pi}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[32px] p-10 shadow-lg shadow-slate-200/30 border border-slate-100 flex flex-col"
                                >
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6" style={{ backgroundColor: color + '10' }}>
                                        {icon}
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-4">{prog.name}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6 flex-grow">{prog.desc}</p>
                                    {prog.points && (
                                        <div className="pt-6 border-t border-slate-50 mt-auto">
                                            <div className="flex flex-wrap gap-2">
                                                {prog.points.map((pt, pti) => (
                                                    <span key={pti} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500">
                                                        {pt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Vision & Ethics Card */}
                    <div className="bg-[#1e3a8a] rounded-[50px] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl">
                        {/* Decor */}
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0, 50 0, 100 100" stroke="white" strokeWidth="0.1" fill="none" />
                                <path d="M0 0 C 50 100, 80 100, 100 0" stroke="white" strokeWidth="0.1" fill="none" />
                            </svg>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">🎯</div>
                                    <h3 className="text-3xl font-merriweather font-black">Long-Term Impact</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    {vision.map((v, vi) => (
                                        <div key={vi} className="flex gap-4 items-start bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
                                            <span className="text-blue-300 font-black">✔</span>
                                            <span className="text-sm font-bold text-white/90">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="p-10 rounded-[40px] bg-white/10 backdrop-blur-md border border-white/20 relative">
                                    <span className="absolute -top-6 left-10 text-6xl text-white/20 font-serif">“</span>
                                    <p className="text-xl font-medium italic text-white leading-relaxed mb-6">
                                        {philosophy.text}
                                    </p>
                                    <div className="h-0.5 w-12 bg-blue-400 mb-2"></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">The Moral Compass</p>
                                </div>

                                {integration && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {integration.map((int, ii) => (
                                            <div key={ii} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center">
                                                <span className="text-[10px] font-black tracking-widest uppercase text-white/60">{int}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Missions = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);

        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 500);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    const missions_content = [
        {
            id: "mission-medha",
            title: "Mission Medha",
            subtitle: "Bridging the structural gap in educational empowerment",
            icon: "📖",
            color: "#C5192D",
            intro: "Poverty must never suppress talent. Mission Medha is our flagship initiative aimed at dismantling educational inequality between corporate and government school students.",
            rationale: {
                text: "Significant disparities exist between private corporate schools and government institutions. Rural students often lack personalized mentoring and career counseling.",
                lists: [
                    { title: "Structural Gaps", items: ["Limited Career Guidance", "Academic Mentoring Deficit", "Competitive Awareness Gap", "Socio-economic Barriers"] },
                    { title: "Inclusion Focus", items: ["Scheduled Tribes (ST)", "Economically Weaker Sections", "First-gen Learners", "Rural Youth"] }
                ]
            },
            objectives: [
                "Reduce academic performance gap",
                "Provide structured academic mentoring",
                "Offer global career exposure",
                "Create district-level model schools",
                "Enable free residential excellence"
            ],
            programs: [
                { name: "CLC Model", desc: "Community Learning Centers in slums and villages for school syllabus support and personalized mentoring.", points: ["30 Students/Center", "Volunteer Supervision"] },
                { name: "Career Counseling", desc: "Helping rural students understand global opportunities and navigate competitive exam pathways.", points: ["Competitive Awareness"] },
                { name: "District Model Schools", desc: "Institutional residential schools with international standards and advanced infrastructure.", points: ["5000 Student Capacity", "50% ST Reservation"] },
                { name: "STEM Excellence", desc: "Fostering research-oriented learning through digital classrooms and modern labs.", points: ["International Standards"] }
            ],
            vision: ["First-generation graduates", "Break intergenerational poverty", "Build rural leadership", "National transformation"],
            philosophy: { text: "Education is the strongest defense of a nation." }
        },
        {
            id: "nyaya-sadan",
            title: "Nyaya Sadan",
            subtitle: "Legal Empowerment and Constitutional Accountability",
            icon: "⚖️",
            color: "#00689D",
            intro: "Democracy survives through informed citizens. Nyaya Sadan ensures legal justice is a right accessible to everyone, not just a privilege for the powerful.",
            rationale: {
                text: "Legal ignorance leads to exploitation. Many marginalized citizens are unaware of their rights or fear the complex and expensive legal systems.",
                lists: [
                    { title: "Justice Barriers", items: ["Rights Illiteracy", "Institutional Complexity", "Prohibitive Legal Costs", "Systemic Injustice"] },
                    { title: "Engagement Tools", items: ["RTI Training", "Advocacy Skills", "Public Grievance Mechanisms"] }
                ]
            },
            objectives: [
                "Promote constitutional literacy",
                "Provide free legal consultation",
                "Strengthen public accountability",
                "Encourage civic participation",
                "Build legally aware youth leadership"
            ],
            programs: [
                { name: "Constitutional Literacy", desc: "Structured initiatives to educate citizens about Fundamental Rights, Duties, and state functions.", points: ["Rights Education", "Civic Duty"] },
                { name: "Free Advocacy Panel", desc: "Qualified advocates providing dignified consultation on civil and criminal matters for the poor.", points: ["Ethical Consultation"] },
                { name: "PIL Advocacy", desc: "Corrective legal engagement through Public Interest Litigations to address governance failures.", points: ["Accountability"] },
                { name: "College Literacy Cells", desc: "Developing youth leadership in law and governance through university-based cells.", points: ["Campus Leadership"] }
            ],
            vision: ["Legally aware society", "Transparent governance", "Grassroots constitutional culture", "Empowered citizenry"],
            philosophy: { text: "Justice delayed weakens democracy. Justice denied destroys trust. Justice accessible strengthens the nation." }
        },
        {
            id: "mission-trupti",
            title: "Mission Trupti",
            subtitle: "Hunger Eradication, Nutrition & Community Health Initiative",
            icon: "🍛",
            color: "#DDA63A",
            intro: "Mission Trupti is the humanitarian nutrition and public health wing of VVV dedicated to building a hunger-free, malnutrition-free, and disease-resistant society.",
            rationale: {
                text: "Hunger and malnutrition remain silent crises affecting rural communities, tribal populations, and slum dwellers. Lack of clean drinking water further exposes these communities to severe health risks.",
                lists: [
                    { title: "Nutritional Crises", items: ["Kwashiorkor", "Marasmus", "Scurvy", "Rickets", "Night Blindness", "Anemia", "Goiter"] },
                    { title: "Water-borne Risks", items: ["Cholera", "Typhoid", "Hepatitis A & E", "Diarrhea", "Giardiasis", "Dysentery", "Leptospirosis"] }
                ]
            },
            objectives: [
                "Ensure no family sleeps hungry",
                "Reduce child and maternal malnutrition",
                "Improve immunity and physical health",
                "Promote clean drinking water access",
                "Prevent water-borne diseases"
            ],
            programs: [
                { name: "Hunger-Free Communities", desc: "Localized hunger-free zones through community food distribution drives and emergency assistance.", points: ["Sustained Security", "Risk Analysis"] },
                { name: "Maternal nutrition", desc: "Nutritional supplementation and monitoring for pregnant women and lactating mothers.", points: ["Child Growth", "Nation Building"] },
                { name: "Safe Water Access", desc: "Water purification awareness and low-cost filtration models in remote tribal settlements.", points: ["Preventive Healthcare"] },
                { name: "Public Awareness", desc: "Comprehensive campaigns on balanced diet principles, hygiene, and sanitation.", points: ["Behavioral Change"] }
            ],
            integration: ["Mission Medha", "Mission Manoswasthya", "Mission Jeevadhara", "Nyaya Sadan"],
            vision: ["Hunger-free districts", "Reduced malnutrition rates", "Stronger child immunity", "Decline in preventable diseases"],
            philosophy: { text: "Serving the hungry is serving humanity. Strengthening immunity strengthens the nation." }
        },
        {
            id: "mission-manoswasthya",
            title: "Mission Manoswasthya",
            subtitle: "Mental Health and Psychological Well-being Initiative",
            icon: "🧠",
            color: "#4C9F38",
            intro: "A strong nation requires emotionally balanced individuals. Mission Manoswasthya normalizes mental health to build a resilient, addiction-free society.",
            rationale: {
                text: "Mental health is a neglected public health dimension. Student suicides, academic burnout, and substance abuse are critical concerns.",
                lists: [
                    { title: "Crisis Triggers", items: ["Academic Pressure", "Relationship Distress", "Workplace Burnout", "Social Stigma"] },
                    { title: "Silent Sufferings", items: ["Depression/Anxiety", "Silent Loneliness", "Drug Dependency", "Fear of Judgment"] }
                ]
            },
            objectives: [
                "Prevent student suicides",
                "Provide psychological support",
                "Conduct workplace wellness",
                "Support drug de-addiction",
                "Reduce mental health stigma"
            ],
            programs: [
                { name: "Campus Resilience", desc: "Emotional resilience workshops and peer support systems in schools and colleges.", points: ["Suicide Prevention"] },
                { name: "Workplace Wellness", desc: "Burnout prevention and emotional intelligence training for professionals and employees.", points: ["Healthy Productivity"] },
                { name: "De-Addiction", desc: "Compassionate motivational counseling and social reintegration for restoration of dignity.", points: ["Skill-building"] },
                { name: "Stigma Reduction", desc: "Breaking myths surrounding mental illness and portraying 'seeking help' as a sign of courage.", points: ["Family Involvement"] }
            ],
            vision: ["Suicide-free campuses", "Addiction-free communities", "Stable family structures", "Emotionally strong youth"],
            philosophy: { text: "Mental health is not a luxury — it is a necessity. Seeking help is not weakness — it is courage." }
        },
        {
            id: "mission-jeevadhara",
            title: "Mission Jeevadhara",
            subtitle: "Rural/Tribal Innovation and Technological Empowerment",
            icon: "🔬",
            color: "#FD6925",
            intro: "Innovation must serve humanity. Mission Jeevadhara connects youth engineering talent with grassroots necessity in rural and tribal regions.",
            rationale: {
                text: "Basic infrastructure challenges persist in rural India because innovation rarely reaches low-profit markets. We bridge this technology gap.",
                lists: [
                    { title: "Infrastructure Gaps", items: ["Water Scarcity", "Energy Shortages", "Agri-Inefficiency", "Digital Divide"] },
                    { title: "Innovation Targets", items: ["Tribal Self-reliance", "Local Adaptability", "Grassroots Engineering"] }
                ]
            },
            objectives: [
                "Promote engineering innovation",
                "Support sustainable infrastructure",
                "Reduce technological disparities",
                "Strengthen tribal self-reliance",
                "Enhance rural livelihoods"
            ],
            programs: [
                { name: "Youth Tech Labs", desc: "Engaging engineering students to identify rural problems and develop low-cost practical prototypes.", points: ["Field Testing"] },
                { name: "Sustainable Energy", desc: "Low-cost solar and renewable micro-energy solutions for remote, off-grid villages.", points: ["Renewable Power"] },
                { name: "Digital Enablement", desc: "Digital literacy and affordable connectivity solutions to bridge the rural-urban divide.", points: ["Internet Access"] },
                { name: "Tribal Innovation", desc: "Context-sensitive innovations respecting local traditions and geographic isolation.", points: ["Participatory Dev"] }
            ],
            vision: ["Technologically empowered rural communities", "Reduced urban migration", "Self-reliant tribal regions", "Youth innovation ecosystems"],
            philosophy: { text: "Innovation must serve humanity. Development must reach the last person. Youth must become problem-solvers, not spectators." }
        }
    ];

    return (
        <div className="bg-[#FFFDF5] min-h-screen">
            {/* Context Explorer - Sticky Mini Nav */}
            <div className={`fixed top-20 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="container mx-auto px-4 py-3">
                    <div className="bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg p-2 flex justify-between items-center max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 pl-4">
                            <span className="text-sm font-black text-[#1e3a8a] uppercase tracking-widest hidden sm:block">Explore Missions</span>
                            <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsNavOpen(!isNavOpen)}
                                className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-blue-900/10"
                            >
                                Jump to Initiative <span>{isNavOpen ? '▲' : '▼'}</span>
                            </button>

                            <AnimatePresence>
                                {isNavOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden"
                                    >
                                        {missions_content.map(m => (
                                            <a
                                                key={m.id}
                                                href={`#${m.id}`}
                                                onClick={() => setIsNavOpen(false)}
                                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                                            >
                                                <span className="text-2xl">{m.icon}</span>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{m.title}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold truncate w-32">{m.subtitle}</span>
                                                </div>
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Hero */}
            <section className="relative py-32 lg:py-48 bg-[#1e3a8a] overflow-hidden">
                {/* Background Art */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#1e3a8a] to-emerald-900 opacity-95"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -mr-16 -mt-16 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -ml-16 -mb-16"></div>
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-blue-200 font-black uppercase tracking-[0.3em] text-[10px] mb-8 border border-white/10 backdrop-blur-sm">
                            The Strategic Wings of Change
                        </span>
                        <h1 className="text-6xl md:text-8xl font-merriweather font-black text-white mb-8 tracking-tight">
                            Our Missions
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 font-medium leading-relaxed max-w-2xl mx-auto">
                            Transforming the socio-legal, educational, and nutritional landscape of India through systematic intervention.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Components Integration */}
            <div className="relative">
                {missions_content.map((mission, index) => (
                    <MissionSection key={mission.id} {...mission} />
                ))}
            </div>

            {/* Strategic Partnerships Section */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-5xl mx-auto bg-white rounded-[64px] p-16 lg:p-24 shadow-2xl border border-slate-100 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-b-full"></div>

                        <h2 className="text-4xl md:text-6xl font-merriweather font-black text-slate-900 mb-10 leading-tight">
                            Build the Future <br />With Us
                        </h2>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                            Every professional skill is a tool for liberation. Join our volunteer network to power these missions with your expertise.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/volunteer-enrollment'}
                                className="bg-[#1e3a8a] text-white px-12 py-6 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-900/20 hover:bg-blue-800 transition-all"
                            >
                                Become a Volunteer
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/get-involved'}
                                className="bg-white text-[#1e3a8a] border-2 border-slate-200 px-12 py-6 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:border-[#1e3a8a] transition-all"
                            >
                                Partner with VVV
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @font-face {
                    font-family: 'Merriweather';
                    src: url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap');
                }
                .font-merriweather { font-family: 'Merriweather', serif; }
            `}</style>
        </div>
    );
};

export default Missions;
