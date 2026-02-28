import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const [filter, setFilter] = useState('all');

    const images = [
        { id: 1, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2000&auto=format&fit=crop", category: "education", caption: "Vision 2047: Empowering Rural Classrooms" },
        { id: 2, src: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=2000&auto=format&fit=crop", category: "health", caption: "Medical Outreach & Diagnostic Camps" },
        { id: 3, src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2000&auto=format&fit=crop", category: "events", caption: "Institutional Leadership Summits" },
        { id: 4, src: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?q=80&w=2000&auto=format&fit=crop", category: "health", caption: "Community Health Awareness Drives" },
        { id: 5, src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2000&auto=format&fit=crop", category: "education", caption: "Educational Kit Distribution" },
        { id: 6, src: "https://images.unsplash.com/photo-1454165833221-d7d028d07543?q=80&w=2000&auto=format&fit=crop", category: "events", caption: "Rural Transformation Workshops" },
        { id: 7, src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2000&auto=format&fit=crop", category: "events", caption: "Solidarity for Social Change" },
        { id: 8, src: "https://images.unsplash.com/photo-1529390003868-6c01e7b1e566?q=80&w=2000&auto=format&fit=crop", category: "team", caption: "VVV Core Leadership & Volunteers" },
    ];

    const categories = ['all', 'education', 'health', 'events', 'team'];

    const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-merriweather font-bold text-primary-royal mb-4">Our Moments</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-inter">Capturing the journey of change, one frame at a time.</p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all capitalize ${filter === cat
                                ? 'bg-primary-royal text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredImages.map((image) => (
                            <motion.div
                                layout
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="relative group overflow-hidden rounded-xl shadow-md bg-white break-inside-avoid"
                            >
                                <img
                                    src={image.src}
                                    alt={image.caption}
                                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white font-semibold font-merriweather">{image.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Gallery;
