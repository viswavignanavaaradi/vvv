import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const aboutContent = {
    what_is_vvv: {
        title: "Who We Are",
        subtitle: "A youth-driven movement for dignity and justice.",
        bg: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        tag: "Our Identity",
        desc: "Viswa Vignana Vaaradi (VVV) is a non-profit organization registered under the Andhra Pradesh Societies Registration Act (Reg. No. 329/2023), established in 2023 in Visakhapatnam, Andhra Pradesh. Operating across Andhra Pradesh and Telangana, VVV is not merely an organization — it is a youth-driven social movement built on the belief that independence without equality is incomplete, and freedom without dignity is unfinished.",
        overview: {
            history: "Born from the collective vision of Advocate Vantaku Vinod, Malayala Pardhasaardhi, Dr. Rama Chandra Naidu, and fellow students of Andhra University Law College and Engineering College, VVV emerged from a deep moral awakening. The tragic incident of three children starving to death in the national capital became a turning point — a painful reminder that despite decades of independence, hunger, malnutrition, inequality, and socio-economic injustice still haunt millions of lives in India. That moment transformed concern into commitment.",
            conviction: "Viswa Vignana Vaaradhi stands on a simple yet powerful conviction: No human being deserves to sleep hungry. No child deserves to be denied quality education. No citizen deserves to remain unaware of their rights. The organization works to dismantle barriers created by poverty, ignorance, systemic inequality, and lack of accountability.",
            reach: "Currently in its initial implementation stage, the organization has mobilized more than 1,500 committed volunteers, with an ambitious goal of building a 1,00,000-strong volunteer movement by 2026. It primarily serves orphan children, government school students, rural youth, below-poverty-line families, and tribal communities."
        },
        motto: "“No nation is perfect; it needs to be made perfect. Let us contribute towards the perfection of our country.”",
        vision: {
            statement: "To build a just, compassionate, and empowered society where every individual lives with dignity, equality, and access to opportunity — irrespective of socio-economic status — and through this collective empowerment, contribute to the emergence of India as a globally respected and leading nation by 2047.",
            points: [
                { icon: "🥣", text: "No child sleeps hungry." },
                { icon: "🎓", text: "No student is denied quality education." },
                { icon: "⚖️", text: "No citizen remains unaware of their constitutional rights." },
                { icon: "🧠", text: "No life is lost to preventable poverty, injustice, or mental distress." },
                { icon: "🌱", text: "Technology, knowledge, and opportunity reach even the remotest rural and tribal communities." }
            ],
            belief: "We believe that when human dignity is protected and equality is practiced, national greatness becomes a natural outcome."
        },
        missions: {
            preamble: "Viswa Vignana Vaaradhi is committed to addressing the root causes of inequality and socio-economic injustice through structured, community-driven interventions in education, legal empowerment, health security, mental well-being, and technological inclusion.",
            pillars: [
                { title: "Mission Medha", desc: "Providing quality, competitive, and globally relevant education to underprivileged and government school students through Community Learning Centers and institutional development initiatives." },
                { title: "Mission Trupti", desc: "Eradicating hunger and malnutrition and ensure access to clean drinking water through sustainable community nutrition programs." },
                { title: "Nyaya Sadan", desc: "Empowering citizens with legal awareness, free legal consultation, and public interest advocacy to strengthen constitutional accountability." },
                { title: "Mission Manoswasthya", desc: "Promoting mental health awareness, suicide prevention, psychological support, and drug de-addiction programs to build a resilient and emotionally strong society." },
                { title: "Mission Jeevadhara", desc: "Encouraging technological innovation and practical solutions for rural and tribal livelihoods, ensuring development reaches the grassroots." }
            ],
            coreBeliefs: [
                "Education transforms generations.",
                "Empowered citizens strengthen democracy.",
                "Unity builds nations."
            ],
            finalWord: "By restoring dignity, ensuring justice, and expanding opportunity, Viswa Vignana Vaaradhi seeks to contribute meaningfully toward building a socially equitable and globally leading India."
        }
    },
    core_values: {
        title: "Our Core Values",
        subtitle: "Built on Human Dignity and Constitutional Justice.",
        bg: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        tag: "Principles",
        desc: "Our actions are guided by 'Manava Garima' (Human Dignity) and the Preamble of our Constitution. We believe that when human dignity is protected, national greatness becomes a natural outcome.",
        details: [
            {
                title: "Human Dignity (Manava Garima)",
                desc: "We believe that every human being carries inherent dignity. No occupation, economic status, caste, gender, or background can diminish it. Whether a manual worker or a corporate professional — every individual deserves equal respect.",
                hindi: "मानव गरिमा",
                quote: "Humanity is one family (Vasudhaiva Kutumbakam)."
            },
            {
                title: "Constitutional Justice & Equality",
                desc: "Guided by the Preamble of the Constitution of India, we strive for Social, Economic, and Political Justice. We work to make Liberty, Equality, and Fraternity a lived reality at the grassroots level.",
                highlights: ["Justice", "Liberty", "Equality", "Fraternity"]
            },
            {
                title: "Democratic Participation",
                desc: "VVV is a democratic organization where every member has a voice. Leadership is earned through service, accountability, and consensus. Internal democracy strengthens external democracy.",
                tagline: "Unity without Uniformity"
            },
            {
                title: "Education as Liberation",
                desc: "Education is the most powerful instrument for social transformation. It must build character, competence, and civic responsibility. Quality education is a right, not a privilege.",
                tagline: "Educate to Empower"
            },
            {
                title: "Compassion Rooted in Dharma",
                desc: "Service to humanity is the highest duty (Seva Parmo Dharma). Our compassion is structured, sustainable, and accountable — translating empathy into organized action.",
                hindi: "सेवा परमो धर्म:"
            },
            {
                title: "Equality Beyond Barriers",
                desc: "We stand against discrimination in all forms. Poverty must never suppress talent, and socio-economic status must never determine respect. We strive for a merit-driven, inclusive society.",
                focus: ["Caste", "Gender", "Economic Status"]
            },
            {
                title: "Accountability & Ethics",
                desc: "As a non-profit institution, we commit to transparency, integrity, and the responsible use of resources. Accountability is the backbone of public trust.",
                key: "Non-negotiable Integrity"
            },
            {
                title: "Unity for Nation-Building",
                desc: "National progress is a shared responsibility of citizens. Like-minded individuals united by purpose can transform society. When dignity is protected, India naturally rises.",
                goal: "India as a Global Leader"
            },
            {
                title: "Holistic Well-Being",
                desc: "Development includes physical health, mental strength, and social harmony. We promote mental resilience and physical nourishment to build a balanced, strong nation.",
                focus: ["Body", "Mind", "Society"]
            },
            {
                title: "Innovation with Inclusivity",
                desc: "Progress must reach the last person in the last village. Technology and innovation must serve rural and tribal communities, ensuring development is sustainable and practical.",
                tagline: "Youth-led Grassroots Innovation"
            }
        ]
    },
    people_behind_vvv: {
        title: "The Governing Body",
        subtitle: "Visionary leadership driving grassroots change.",
        bg: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        tag: "Leadership",
        desc: "Led by professionals and students from elite institutions, our governing body combines academic excellence with a deep commitment to social impact.",
        members: [
            {
                name: "Vantaku Vinod",
                role: "President",
                bio: "Mr. Vinod Vantaku, a law graduate and engineering professional, is an alumnus of Andhra University and holds a Diploma in Mechanical Engineering from Government Polytechnic College, along with a B.Tech in Mechanical Engineering from NSRIT Engineering College. He is a practicing advocate enrolled with the Delhi Bar Council, with professional practice spanning both Visakhapatnam and New Delhi.\n\nWith a multidisciplinary academic foundation and professional exposure across technical and legal domains, Mr. Vantaku specialises in strategic planning, social development, and institution building. His integrated understanding of governance, systems thinking, and institutional frameworks enables him to contribute effectively to sustainable development initiatives and organisational growth.\n\nOver the years, he has actively engaged in initiatives focused on structured planning, community-oriented development, and long-term institutional strengthening, combining professional expertise with a commitment to social impact."
            },
            { name: "Paruchuri Sujith", role: "Vice-President" },
            { name: "M. Paradhasaardhi", role: "General Secretary" },
            { name: "Dr. N. Rama Chandra Naidu", role: "Treasurer" },
            { name: "M. Devi Sree Vatsha", role: "Addl. General Secretary" },
            { name: "Uppara Suresh", role: "Executive Member" },
            { name: "D. Sunil Kumar", role: "Executive Member" },
            { name: "N. Teja", role: "Executive Member" },
            { name: "Karri Satish", role: "Executive Member" }
        ]
    },
    impact_timeline: {
        title: "Impact Roadmap",
        subtitle: "A journey of change across the grassroots.",
        bg: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        tag: "Our Journey",
        desc: "From Mission Medha to Project Sakeathpuram, our timeline reflects the relentless energy of 1,500+ volunteers committed to nation-building.",
        timeline: [
            { date: "July 4, 2023", title: "Mission Medha (First Phase)", detail: "The foundational launch of our educational initiative.", cat: "Education" },
            { date: "Sept 9, 2025", title: "Nyaya Sadan (The Launch)", detail: "Inauguration of our legal empowerment center.", cat: "Legal" },
            { date: "Oct 11, 2025", title: "Project R - A Start", detail: "Initialization of Reform & Restoration projects.", cat: "Reform" },
            { date: "Oct 18, 2025", title: "Diwali 2k25 @ Icha Foundation", detail: "Spreading light and joy with community partners.", cat: "Community" },
            { date: "Nov 14, 2025", title: "Children's Day @ Juvenile Jail", detail: "Special program including Sarita Ma’am’s inspirational speech.", cat: "Support" },
            { date: "Nov 15, 2025", title: "Project R - Kreeda", detail: "Physical transformation of grounds and sports spaces.", cat: "Reform" },
            { date: "Nov 16, 2025", title: "Project R - Siddhanth", detail: "Artistic restoration and creative painting workshops.", cat: "Reform" },
            { date: "Nov 17, 2025", title: "Project R - Siddhi", detail: "Empowerment through Teaching and Yoga sessions.", cat: "Health" },
            { date: "Nov 19, 2025", title: "Medical Camp", detail: "Providing essential health checkups at Project R.", cat: "Health" },
            { date: "Nov 22, 2025", title: "Comic Strip - Fundraising Tool", detail: "Launched creative fundraising for social impact.", cat: "Innovation" },
            { date: "Dec 1, 2025", title: "World Aid's Day @ Dewan Foundation", detail: "Awareness and support initiatives.", cat: "Health" },
            { date: "Dec 11, 2025", title: "Comic Strip at Cosmic Night", detail: "Representing VVV’s creativity at Cosmic Night.", cat: "Innovation" },
            { date: "Dec 19, 2025", title: "VVV × UI (MOU)", detail: "Official partnership for academic social responsibility.", cat: "Partnership" },
            { date: "Dec 24, 2025", title: "Project Sakeathpuram - A Start", detail: "Launching our core community development project.", cat: "Field" },
            { date: "Dec 25, 2025", title: "Christmas & New Year @ Icha", detail: "Celebrating the festive season with community.", cat: "Community" },
            { date: "Jan 29, 2026", title: "VVV at Blind School", detail: "Support and engagement for visually impaired children.", cat: "Support" },
            { date: "Jan 30, 2026", title: "VVV × NSRIET", detail: "Extending institutional partnerships.", cat: "Partnership" },
            { date: "Feb 1, 2026", title: "Sakeathpuram Football Match", detail: "Building community spirit through sports.", cat: "Community" },
            { date: "Feb 4, 2026", title: "Cancer Day @ Apna Ghar", detail: "Awareness and solidarity with patients.", cat: "Health" },
            { date: "Feb 5, 2026", title: "Comic Strip @ Timpany’s Farewell", detail: "Creative advocacy at Timpany’s farewell.", cat: "Innovation" },
            { date: "Feb 5, 2026", title: "Project Sakeathpuram - Survey", detail: "Conducting grassroots research for future action.", cat: "Field" }
        ]
    },
    partnered_colleges: {
        title: "Partnered Colleges",
        subtitle: "Empowering the next generation of changemakers.",
        bg: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        tag: "Institutions",
        desc: "We collaborate with leading institutions like Andhra University to provide internships and volunteering opportunities for dedicated students.",
        details: [
            { title: "Andhra University", content: "Primary student volunteer base." },
            { title: "Dr. B.R. Ambedkar Law College", content: "Legal aid clinic partners." },
            { title: "NSRIT Engineering College", content: "Technical resource support." }
        ]
    },
    corporate_partnership: {
        title: "Corporate Partnerships",
        subtitle: "CSR initiatives driving sustainable impact.",
        bg: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        tag: "Corporate",
        desc: "Partner with VVV to fulfill your CSR goals through structured projects in technology, health, and legal aid.",
        details: [
            { title: "Tech Corp", content: "Supporting digital literacy and equipment under Mission Medha." },
            { title: "Medi Care Ltd", content: "Sponsoring medical camps and supplies for Mission Trupti." }
        ]
    },
    partnered_influencers: {
        title: "Partnered Influencers",
        subtitle: "Voices amplifying our cause.",
        bg: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        tag: "Influencers",
        desc: "We are grateful to the volunteers and public figures who use their platform to raise awareness for Viswa Vignana Vaaradi.",
        details: [
            { title: "Social Voice 1", content: "Advocating for rural education." },
            { title: "Youth Icon 2", content: "Promoting volunteerism among students." }
        ]
    }
};

const About = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('what_is_vvv');

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    // Hero Section
    const HeroSection = () => (
        <section className="hero" style={{
            height: 'clamp(50vh, 70vh, 85vh)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            color: 'white'
        }}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${aboutContent[activeTab]?.bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: -1
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.6) 50%, rgba(17, 24, 39, 0.3) 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)' }} />
                </motion.div>
            </AnimatePresence>

            <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                        className="max-w-3xl pt-24 md:pt-0"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                backdropFilter: 'blur(8px)',
                                color: '#10b981',
                                padding: '6px 16px',
                                borderRadius: '100px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                fontSize: '10px',
                                letterSpacing: '3px',
                                display: 'inline-block',
                                marginBottom: '24px',
                                border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}
                        >
                            {aboutContent[activeTab]?.tag}
                        </motion.span>

                        <h1 style={{ fontFamily: 'Merriweather, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '24px', fontWeight: '900', lineHeight: 1.1, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            {aboutContent[activeTab]?.title.split(' ').map((word, idx) => (
                                <motion.span
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (idx * 0.1), duration: 0.6 }}
                                    style={{ display: 'inline-block', marginRight: '0.2em' }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: '500', maxWidth: '600px', lineHeight: 1.6, borderLeft: '3px solid #10b981', paddingLeft: '20px' }}
                        >
                            {aboutContent[activeTab]?.subtitle}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}
            >
                <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, transparent, #10b981, transparent)' }} />
            </motion.div>
        </section>
    );

    const DetailsSection = () => {
        const data = aboutContent[activeTab];
        if (!data) return null;

        const renderDetails = () => {
            if (activeTab === 'what_is_vvv') {
                return (
                    <div className="max-w-6xl mx-auto space-y-8 md:space-y-16">
                        {/* 1. Executive Summary & Motto */}
                        <section className="bg-slate-50 border border-slate-200 rounded-2xl md:rounded-3xl p-6 md:p-14">
                            <div className="grid lg:grid-cols-12 gap-12 items-start">
                                <div className="lg:col-span-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-6 h-1 bg-emerald-600 rounded-full" />
                                        <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.4em]">Organization Overview</h3>
                                    </div>
                                    <p className="text-lg text-slate-700 leading-relaxed font-merriweather mb-6">
                                        {data.desc}
                                    </p>
                                    <p className="text-base text-slate-600 leading-relaxed font-merriweather opacity-80">
                                        {data.overview.history}
                                    </p>
                                </div>
                                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Motto</h4>
                                    <p className="text-lg font-black text-slate-900 font-merriweather italic leading-relaxed">
                                        {data.motto}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. Foundational Principles (The Conviction & Reach) */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-5 h-1 bg-royal-blue-600 rounded-full" />
                                    <h3 className="text-[10px] font-black text-royal-blue-700 uppercase tracking-[0.3em]">The Conviction</h3>
                                </div>
                                <p className="text-base text-slate-600 leading-relaxed font-merriweather italic">
                                    "{data.overview.conviction}"
                                </p>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-5 h-1 bg-emerald-600 rounded-full" />
                                    <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em]">Current Movement Reach</h3>
                                </div>
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-4xl font-black text-slate-900 leading-none">1,500+</span>
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest pb-1">Volunteers</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed font-merriweather">
                                    {data.overview.reach}
                                </p>
                            </div>
                        </div>

                        {/* 3. Vision 2047 Framework */}
                        <section className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rotate-45 -mr-16 -mt-16" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-1 bg-slate-900 rounded-full" />
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Vision 2047 Statement</h3>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 font-merriweather mb-10 leading-snug">
                                    {data.vision.statement}
                                </h4>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                                    {data.vision.points.map((v, i) => (
                                        <div key={i} className="flex gap-4">
                                            <span className="text-2xl flex-shrink-0">{v.icon}</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 leading-snug">{v.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-8 border-t border-slate-50">
                                    <p className="text-base font-bold text-emerald-800 font-merriweather italic text-center">
                                        "{data.vision.belief}"
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Operational Pillars (The Mission) */}
                        <section className="space-y-10">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-6 h-1 bg-royal-blue-600 rounded-full" />
                                    <h3 className="text-[10px] font-black text-royal-blue-700 uppercase tracking-[0.4em]">Mission Framework</h3>
                                </div>
                                <p className="text-base text-slate-600 leading-relaxed font-merriweather">
                                    {data.missions.preamble}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {data.missions.pillars.map((m, i) => (
                                    <div key={i} className="group p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                                            {m.title}
                                            <span className="text-xs opacity-20">0{i + 1}</span>
                                        </h4>
                                        <p className="text-sm text-slate-500 leading-relaxed font-merriweather opacity-90 group-hover:opacity-100">{m.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border border-slate-200 rounded-3xl p-10 bg-white">
                                <div className="grid md:grid-cols-3 gap-8 text-center items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                    {data.missions.coreBeliefs.map((belief, i) => (
                                        <div key={i} className="p-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Core Belief</span>
                                            <p className="text-base font-black text-slate-800 font-merriweather italic">{belief}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                                    <p className="text-xl font-bold text-slate-900 font-merriweather italic opacity-85 max-w-3xl mx-auto leading-relaxed">
                                        {data.missions.finalWord}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            }

            if (activeTab === 'core_values') {
                return (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
                        {data.details.map((val, i) => {
                            const spanClass = i === 0 || i === 1 ? 'md:col-span-6 lg:col-span-8' : 'md:col-span-6 lg:col-span-4';
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className={`group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-emerald-100/30 hover:-translate-y-1 transition-all duration-500 overflow-hidden ${spanClass}`}
                                >
                                    <div className="absolute -right-4 -top-8 text-8xl font-black text-slate-50 group-hover:text-emerald-50 transition-colors pointer-events-none select-none font-merriweather opacity-50">
                                        {(i + 1).toString().padStart(2, '0')}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-1 bg-emerald-500 rounded-full" />
                                            {val.hindi && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-merriweather">{val.hindi}</span>}
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 mb-4 font-merriweather tracking-tight group-hover:text-emerald-600 transition-colors">
                                            {val.title}
                                        </h3>

                                        <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
                                            {val.desc}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {val.tagline && <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">{val.tagline}</span>}
                                            {val.highlights?.map((h, hi) => (
                                                <span key={hi} className="text-[9px] font-black text-primary-royal bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">{h}</span>
                                            ))}
                                        </div>

                                        {val.quote && (
                                            <div className="mt-6 pt-6 border-t border-slate-50 italic text-sm text-slate-400 font-merriweather">
                                                &ldquo;{val.quote}&rdquo;
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                </motion.div>
                            );
                        })}
                    </div>
                );
            }

            if (activeTab === 'people_behind_vvv') {
                const president = data.members[0];
                const officers = data.members.slice(1, 4);
                const body = data.members.slice(4);

                return (
                    <div className="space-y-32">
                        {/* Tier I: The President (Board Chair) */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/5 to-royal-blue-500/5 rounded-[2rem] md:rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[3rem] p-6 sm:p-10 md:p-20 shadow-2xl shadow-slate-200/50 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-slate-50 rounded-full -mr-32 -mt-32 md:-mr-48 md:-mt-48 mix-blend-multiply opacity-50" />
                                <div className="grid lg:grid-cols-12 gap-8 md:gap-16 items-center">
                                    <div className="lg:col-span-5">
                                        <div className="flex items-center gap-4 mb-4 md:mb-8">
                                            <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.4em]">Presidential Profile</span>
                                        </div>
                                        <h3 className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-900 font-merriweather mb-4 md:mb-8 leading-[1.1] tracking-tighter italic">
                                            {president.name}
                                        </h3>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 border-l-4 border-slate-100 pl-6">{president.role}</p>
                                        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl shadow-slate-900/20">
                                            ⚖️
                                        </div>
                                    </div>
                                    <div className="lg:col-span-7">
                                        <div className="space-y-6 md:space-y-8 relative">
                                            <div className="absolute -left-6 md:-left-10 top-0 text-6xl md:text-8xl font-black text-slate-50 font-merriweather select-none opacity-50 italic">"</div>
                                            {president.bio.split('\n\n').map((para, i) => (
                                                <p key={i} className={`text-slate-600 leading-relaxed font-merriweather text-base md:text-xl opacity-90 ${i === 0 ? 'text-slate-900 font-bold' : ''}`}>
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tier II: Core Officers (The Secretariat) */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {officers.map((person, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 text-center"
                                >
                                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                                        {i === 0 ? '🏛️' : i === 1 ? '📜' : '🏦'}
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 font-merriweather mb-3 tracking-tight">{person.name}</h4>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{person.role}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Tier III: Executive Body (The Council) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {body.map((person, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-6 p-8 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-50 group-hover:border-emerald-100 transition-colors">
                                        👤
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">{person.name}</h4>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{person.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );
            }

            if (activeTab === 'impact_timeline') {
                return (
                    <div className="max-w-4xl mx-auto py-4 md:py-10 px-0 md:px-6">
                        <div className="relative space-y-12 md:space-y-16 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-slate-200 before:to-slate-100">
                            {data.timeline.map((event, i) => {
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                                    >
                                        {/* Dot */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 text-emerald-600 shadow-md group-hover:scale-125 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                                            <div className="w-3 h-3 bg-current rounded-full" />
                                        </div>

                                        {/* Content Card */}
                                        <div className="w-[calc(100%-3rem)] ml-12 md:ml-0 md:w-[calc(50%-2.5rem)] p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500">
                                            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 mb-3 md:mb-4">
                                                <span className="text-[9px] md:text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 md:px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                                                    {event.date}
                                                </span>
                                                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${event.cat === 'Education' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                                                    event.cat === 'Legal' ? 'text-purple-600 bg-purple-50 border-purple-100' :
                                                        event.cat === 'Reform' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                                                            event.cat === 'Partnership' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
                                                                'text-slate-500 bg-slate-50 border-slate-100'
                                                    }`}>
                                                    {event.cat}
                                                </span>
                                            </div>
                                            <h4 className="text-lg md:text-xl font-black text-slate-900 font-merriweather mb-2 md:mb-3 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors">
                                                {event.title}
                                            </h4>
                                            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-merriweather opacity-90">
                                                {event.detail}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            if (activeTab === 'partnered_colleges' || activeTab === 'corporate_partnership' || activeTab === 'partnered_influencers') {
                return (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.details.map((item, i) => (
                            <div key={i} className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100 group hover:border-accent-emerald transition-all">
                                <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{activeTab === 'partnered_colleges' ? '🏛️' : activeTab === 'corporate_partnership' ? '🏢' : '👤'}</div>
                                <h3 className="font-black text-primary-royal mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500 font-medium">{item.content}</p>
                            </div>
                        ))}
                    </div>
                );
            }

            return null;
        };

        const isBento = activeTab === 'core_values' || activeTab === 'people_behind_vvv';

        return (
            <section id="details-section" className="py-16 md:py-40 bg-white overflow-hidden">
                <div className={`container mx-auto px-6 md:px-12 ${isBento ? 'max-w-7xl' : 'max-w-6xl'}`}>
                    <div className={`flex flex-col ${isBento ? 'items-start' : 'lg:flex-row gap-8 md:gap-20'}`}>
                        <div className={`${isBento ? 'max-w-4xl mb-12 md:mb-24' : 'lg:w-1/3 text-left mb-12 lg:mb-0'}`}>
                            <div className="w-12 md:w-16 h-1 md:h-2 bg-emerald-500 mb-6 md:submit-10 rounded-full shadow-lg shadow-emerald-500/20" />
                            <h2 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 md:mb-8 font-merriweather tracking-tight">
                                {data.title}
                            </h2>
                            <p className="text-slate-600 leading-relaxed font-medium text-base md:text-lg max-w-2xl opacity-90 border-l-3 border-emerald-500/20 pl-4 md:pl-6">
                                {data.desc}
                            </p>
                        </div>
                        <div className={`${isBento ? 'w-full' : 'lg:w-2/3'}`}>
                            {renderDetails()}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    return (
        <div>
            <HeroSection />

            {/* Tab Navigation - Premium Sticky Bar */}
            <section className="bg-white/80 backdrop-blur-xl border-y border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 overflow-x-auto scrollbar-hide">
                    <div className="flex justify-center min-w-max">
                        {Object.keys(aboutContent).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 md:px-10 py-5 md:py-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.3em] transition-all relative group ${activeTab === tab ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                <span className="relative z-10 whitespace-nowrap">{aboutContent[tab].title}</span>
                                {activeTab === tab ? (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_-4px_12px_rgba(16,185,129,0.3)]"
                                    />
                                ) : (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-slate-200 group-hover:w-full transition-all duration-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <DetailsSection />

            {/* Call to Action - Social Impact Movement */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl font-black text-primary-royal mb-6 font-merriweather">Be Part of the Social Movement</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
                            Join 1,500+ volunteers in building an India where equality is practiced and dignity is a right.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-primary-royal text-white font-black px-10 py-4 rounded-full shadow-xl hover:bg-black transition-all">Support Now</button>
                            <button className="bg-white text-primary-royal border-2 border-primary-royal font-black px-10 py-4 rounded-full hover:bg-primary-royal hover:text-white transition-all">Volunteer Registration</button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
