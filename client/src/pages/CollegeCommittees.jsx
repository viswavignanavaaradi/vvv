import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import AU Committee Member Images
import presidentImg from '../assets/AUCommittee/president.png';
import vicePresidentImg from '../assets/AUCommittee/vice-president.png';
import generalSecretaryImg from '../assets/AUCommittee/General-Secretary.png';
import jointSecretaryImg from '../assets/AUCommittee/Joint-Secretary.png';
import treasurerImg from '../assets/AUCommittee/treasurer.png';
import exec1Img from '../assets/AUCommittee/Executive-member-1.png';
import exec2Img from '../assets/AUCommittee/Executive-member-2.png';
import exec3Img from '../assets/AUCommittee/Executive-member-3.png';
import exec4Img from '../assets/AUCommittee/Executive-member-4.png';
import exec5Img from '../assets/AUCommittee/Executive-member-5.png';

const committeeData = {
    andhra_university: {
        title: "Andhra University",
        subtitle: "VVV Student Chapter Committee",
        desc: "Established in 2026, the Andhra University VVV Student Chapter is our flagship youth-led unit, driving local community service, literacy cells, and legal awareness campaigns.",
        members: [
            { name: "Amara Naga Venkata Harshith", role: "President", image: presidentImg },
            { name: "Annepu Aditya Sai", role: "Vice President", image: vicePresidentImg },
            { name: "M.Vaarshika Vaahini Naidu", role: "General Secretary", image: generalSecretaryImg },
            { name: "Marampudi Joseph Roy", role: "Joint Secretary", image: jointSecretaryImg },
            { name: "Kanti Yelamanchili", role: "Treasurer", image: treasurerImg },
            { name: "R. Siri Hasini", role: "Executive Member", image: exec1Img },
            { name: "DSSLV. Sahasra Varma", role: "Executive Member", image: exec2Img },
            { name: "T.P. Ashraf Ali", role: "Executive Member", image: exec3Img },
            { name: "Usha Kaushali", role: "Executive Member", image: exec4Img },
            { name: "Tammana Sai Surya Raghava Sahil", role: "Executive Member", image: exec5Img }
        ]
    },
    dr_br_ambedkar_law_college: {
        title: "Dr. B.R. Ambedkar Law College",
        subtitle: "Legal Aid & Advocacy Chapter",
        desc: "Partnered for grassroots legal empowerment and legal aid clinics, this chapter works in association with VVV Nyaya Sadan to bring constitutional awareness to rural and tribal areas.",
        members: []
    },
    nsrit_engineering_college: {
        title: "NSRIT Engineering College",
        subtitle: "Technical & Livelihoods Chapter",
        desc: "Focusing on rural innovation, sustainable engineering, and technical resource support under Mission Jeevadhara to bring digital and infrastructural solutions to communities.",
        members: []
    }
};

const CollegeCommittees = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedCollege, setSelectedCollege] = useState('andhra_university');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const collegeParam = queryParams.get('college');
        if (collegeParam && committeeData[collegeParam]) {
            setSelectedCollege(collegeParam);
        }
    }, [location.search]);

    const handleCollegeChange = (key) => {
        setSelectedCollege(key);
        navigate(`/committees?college=${key}`, { replace: true });
    };

    const currentCollege = committeeData[selectedCollege];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            {/* Hero Header */}
            <div className="relative bg-[#111827] text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-royal-blue-900/30 opacity-60" />
                <div className="absolute inset-0 bg-radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15), transparent 50%)" />
                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-4">
                        Student Chapters
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black font-merriweather tracking-tight mb-4 leading-tight">
                        College Committees
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg font-medium">
                        Meet the student leaders driving the Viswa Vignana Vaaradhi movement at our partnered academic institutions.
                    </p>
                </div>
            </div>

            {/* Premium Sticky College Tab Selector */}
            <div className="bg-white border-b border-slate-200/80 sticky top-[80px] z-30 shadow-sm">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex justify-center gap-2 md:gap-8 overflow-x-auto py-4 no-scrollbar">
                        {Object.keys(committeeData).map((key) => (
                            <button
                                key={key}
                                onClick={() => handleCollegeChange(key)}
                                className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap border ${
                                    selectedCollege === key
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                                }`}
                            >
                                {committeeData[key].title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-6 max-w-7xl mt-12 md:mt-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCollege}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {/* College Intro Banner */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50 mix-blend-multiply" />
                            <div className="max-w-4xl relative z-10 text-left">
                                <span className="text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 block">
                                    {currentCollege.subtitle}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-merriweather mb-4 tracking-tight">
                                    {currentCollege.title}
                                </h2>
                                <p className="text-slate-600 leading-relaxed font-medium text-base">
                                    {currentCollege.desc}
                                </p>
                            </div>
                        </div>

                        {/* Members Grid / Empty State */}
                        {currentCollege.members.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {currentCollege.members.map((member, i) => {
                                    const isOfficeBearer = ["President", "Vice President", "General Secretary", "Joint Secretary", "Treasurer"].includes(member.role);
                                    
                                    // Initials for avatar placeholder
                                    const initials = member.name
                                        .split(' ')
                                        .filter(n => n && !n.includes('.'))
                                        .map(n => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase();

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`group bg-white rounded-3xl border transition-all duration-300 p-8 text-center flex flex-col items-center justify-between ${
                                                isOfficeBearer
                                                    ? 'border-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/30'
                                                    : 'border-slate-100 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/50'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center w-full">
                                                {/* Profile Photo Placeholder */}
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-royal-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 scale-105" />
                                                    {member.image ? (
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-md"
                                                        />
                                                    ) : (
                                                        <div className={`w-32 h-32 rounded-full border-4 border-slate-50 shadow-md flex items-center justify-center text-2xl font-black ${
                                                            isOfficeBearer 
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                        }`}>
                                                            {initials || "👤"}
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2 leading-snug group-hover:text-emerald-700 transition-colors">
                                                    {member.name}
                                                </h3>
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${
                                                    isOfficeBearer ? 'text-emerald-600' : 'text-slate-400'
                                                }`}>
                                                    {member.role}
                                                </p>
                                            </div>

                                            {/* Future Additions: Social profile links or short bios */}
                                            <div className="w-full border-t border-slate-50 mt-6 pt-6 flex justify-center gap-4">
                                                <span className="text-xs text-slate-400 font-bold italic opacity-60">
                                                    Chapter Representative
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-12 md:p-20 text-center max-w-xl mx-auto shadow-sm">
                                <span className="text-6xl block mb-6">📢</span>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 font-merriweather mb-3">
                                    Committee Forming
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">
                                    We are currently structuring the student chapter committee for this institution. Nominations and enrollments for executive roles are opening soon.
                                </p>
                                <button 
                                    onClick={() => navigate('/volunteer-enrollment')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-xl text-sm transition-all shadow-md"
                                >
                                    Join As Volunteer
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default CollegeCommittees;
