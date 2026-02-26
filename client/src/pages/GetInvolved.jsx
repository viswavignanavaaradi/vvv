import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const GetInvolved = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('volunteer');

    const partnerships = [
        {
            title: "Corporate Social Responsibility (CSR)",
            description: "Partner with us to drive impactful social change. We offer structured CSR programs that align with your company's values and community goals.",
            icon: "🏢"
        },
        {
            title: "Employer Engagement",
            description: "Engage your employees in meaningful volunteering opportunities. Build team spirit while making a tangible difference in society.",
            icon: "🤝"
        },
        {
            title: "Institutional Partnerships",
            description: "Collaborate with schools and colleges to foster social responsibility in students through internships, workshops, and field projects.",
            icon: "🎓"
        }
    ];

    const individualSupport = [
        {
            title: "Become a Patron",
            description: "Commit to long-term support for our initiatives. Your sustained contribution ensures the continuity of our critical programs.",
            icon: "🌟"
        },
        {
            title: "Material Support",
            description: "Donate essential items like books, medicines, clothes, or food. Direct material aid reaches those in need immediately.",
            icon: "📦"
        },
        {
            title: "Mentors & Advisory",
            description: "Share your expertise. We welcome professionals to mentor our student volunteers and advise on project strategy.",
            icon: "💡"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center bg-primary-royal overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
                ></div>
                <div className="relative z-20 text-center px-4 text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-merriweather font-bold mb-6"
                    >
                        Get Involved
                    </motion.h1>
                    <p className="text-xl md:text-2xl font-inter max-w-3xl mx-auto">
                        Join hands with Viswa Vignana Varadi to create lasting change.
                    </p>
                </div>
            </section>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-md sticky top-0 z-30">
                <div className="container mx-auto px-4 flex justify-center overflow-x-auto">
                    {['volunteer', 'partnerships', 'support'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 font-bold text-sm md:text-base uppercase tracking-wider border-b-4 transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'border-accent-emerald text-primary-royal'
                                : 'border-transparent text-gray-500 hover:text-primary-royal'
                                }`}
                        >
                            {tab === 'volunteer' ? 'Volunteer / Intern' : tab === 'partnerships' ? 'Partnerships' : 'Individual Support'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-4 py-16">

                {/* Volunteer Section */}
                {activeTab === 'volunteer' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-12"
                    >
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-merriweather font-bold text-primary-royal mb-6">Join as a Volunteer</h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    Whether you are a student looking for an internship or a professional wanting to give back, VVV offers a platform to serve.
                                    Engage in fieldwork, organize events, or support our digital campaigns.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={() => navigate('/volunteer-enrollment')} className="bg-accent-emerald hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                                        Register as Volunteer
                                    </button>
                                    <button onClick={() => navigate('/internship-enrollment')} className="bg-primary-royal hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                                        Register as Intern
                                    </button>
                                    <Link to="/volunteer-know-more" className="border-2 border-accent-emerald text-accent-emerald hover:bg-accent-emerald hover:text-white font-bold py-3 px-8 rounded-full transition-all text-center">
                                        Know More
                                    </Link>
                                </div>
                            </div>
                            <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-xl border-t-4 border-accent-emerald">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Volunteer Testimonials</h3>
                                <div className="space-y-6">
                                    <blockquote className="italic text-gray-600 border-l-4 border-gray-200 pl-4">
                                        "Interning with VVV changed my perspective on social work. The direct interaction with communities is invaluable."
                                        <footer className="text-sm font-bold text-primary-royal mt-2">- Student Volunteer</footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Partnerships Section */}
                {activeTab === 'partnerships' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-merriweather font-bold text-primary-royal">Corporate & Institutional Partnerships</h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Build a legacy of social responsibility with VVV.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {partnerships.map((partner, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-center">
                                    <div className="text-5xl mb-6">{partner.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{partner.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{partner.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Individual Support Section */}
                {activeTab === 'support' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-merriweather font-bold text-primary-royal">Support Us Individually</h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Every contribution, big or small, fuels our mission.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {individualSupport.map((support, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center group hover:bg-primary-royal hover:text-white transition-colors duration-300">
                                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{support.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-white mb-4">{support.title}</h3>
                                    <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed mb-6">{support.description}</p>
                                    {support.title === "Become a Patron" && (
                                        <Link to="/patron-know-more" className="text-accent-emerald font-bold group-hover:text-white underline underline-offset-4 decoration-2">
                                            Know More →
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Donate Call to Action */}
                        <div className="bg-accent-emerald/10 rounded-3xl p-12 text-center md:flex items-center justify-between gap-8">
                            <div className="text-left md:w-2/3">
                                <h3 className="text-2xl font-bold text-primary-royal mb-2">Make an Immediate Impact</h3>
                                <p className="text-gray-700">Your financial support provides resources for our medical camps, educational drives, and legal aid clinics.</p>
                            </div>
                            <div className="mt-6 md:mt-0">
                                <button
                                    onClick={() => {
                                        // Triggering global donate modal via Layout would be ideal, 
                                        // or just use window dispatch for simplicity in this demo.
                                        // For now, assume Layout handles it or user scrolls to footer.
                                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                    }}
                                    className="bg-accent-emerald text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:bg-emerald-600 transition-all text-lg"
                                >
                                    Donate Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GetInvolved;
