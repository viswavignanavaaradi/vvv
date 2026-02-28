import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const [filter, setFilter] = useState('all');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                setImages(data);
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
                )}
            </div>
        </div>
    );
};

export default Gallery;
