import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';

const Gallery = () => {
    const [filter, setFilter] = useState('all');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get('/api/gallery');
                setImages(res.data);
            } catch (err) {
                console.error('Gallery fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

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
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-royal"></div>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                    >
                        <AnimatePresence>
                            {filteredImages.map((image) => (
                                <motion.div
                                    layout
                                    key={image.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
                                >
                                    <div className="relative overflow-hidden aspect-auto">
                                        <img
                                            src={image.src}
                                            alt={image.caption}
                                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                        <p className="text-white font-merriweather font-bold text-lg mb-1">{image.caption}</p>
                                        <div className="w-12 h-1 bg-primary-royal rounded-full" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
