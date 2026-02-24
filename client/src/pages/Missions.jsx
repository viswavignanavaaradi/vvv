import React from 'react';
import { motion } from 'framer-motion';

const Missions = () => {
    const sdgs = [
        {
            id: 4,
            title: "Quality Education",
            description: "Ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all.",
            target: "M.M (Mentor Mentee Program)",
            color: "#C5192D"
        },
        {
            id: 16,
            title: "Peace, Justice & Strong Institutions",
            description: "Promoting peaceful and inclusive societies for sustainable development, providing access to justice for all.",
            target: "N.Y.S (Nyaya Yatra Seva)",
            color: "#00689D"
        },
        {
            id: 2,
            title: "Zero Hunger",
            description: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture.",
            target: "M.T (Maha Prasadam)",
            color: "#DDA63A"
        },
        {
            id: 3,
            title: "Good Health & Well-being",
            description: "Ensuring healthy lives and promoting well-being for all at all ages.",
            target: "M.M.S (Mobile Medical Services)",
            color: "#4C9F38"
        },
        {
            id: 9,
            title: "Industry, Innovation & Infrastructure",
            description: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.",
            target: "Rural Livelihood M.J.D",
            color: "#FD6925"
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-primary-royal">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-emerald-900 opacity-90 z-10"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
                ></div>
                <div className="relative z-20 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-merriweather font-bold text-white mb-4"
                    >
                        Our Missions
                    </motion.h1>
                    <p className="text-xl text-white/90 font-inter max-w-2xl mx-auto">
                        Aligning our grassroots actions with Global Sustainable Development Goals.
                    </p>
                </div>
            </section>

            {/* Our Work - SDGs Mapping */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-accent-emerald font-bold tracking-wider uppercase">Our Work</span>
                        <h2 className="text-3xl md:text-4xl font-merriweather font-bold text-primary-royal mt-2">
                            Global Goals, Local Impact
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sdgs.map((sdg, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={sdg.id}
                                className="group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                            >
                                <div
                                    className="h-2"
                                    style={{ backgroundColor: sdg.color }}
                                ></div>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                                            style={{ backgroundColor: sdg.color }}
                                        >
                                            {sdg.id}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 md:min-h-[3.5rem] flex items-center">
                                            {sdg.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mb-6 font-inter text-sm leading-relaxed min-h-[60px]">
                                        {sdg.description}
                                    </p>
                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Our Initiative</p>
                                        <div className="flex items-center justify-between text-primary-royal font-bold group-hover:text-accent-emerald transition-colors">
                                            <span>{sdg.target}</span>
                                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Campaigns / Projects */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-accent-emerald font-bold tracking-wider uppercase">Impact</span>
                        <h2 className="text-3xl md:text-4xl font-merriweather font-bold text-primary-royal mt-2">
                            Our Campaigns & Projects
                        </h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Driving change through 20+ specialized projects across Andhra Pradesh.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['Education', 'Healthcare', 'Legal Aid', 'Rural Development'].map((category, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent-emerald">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{category} Projects</h3>
                                <p className="text-sm text-gray-600">Active campaigns empowering communities through focused {category.toLowerCase()} interventions.</p>
                                <button className="mt-4 text-primary-royal text-sm font-semibold hover:underline">View Projects</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Missions;
