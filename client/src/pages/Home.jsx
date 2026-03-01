import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../assets/video.mp4';

const Hero = ({ onDonate }) => (
    <section id="home" className="hero" style={{
        position: 'relative',
        width: '100%',
        height: 'min(600px, 80vh)', // Responsive height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    }}>
        <video
            autoPlay
            loop
            muted
            playsInline
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover' // Changed from contain for better mobile fill
            }}
        >
            <source src={heroVideo} type="video/mp4" />
        </video>

        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1
        }}></div>

        <style>{`
            @media (max-width: 600px) {
                .hero { height: 50vh !important; }
            }
        `}</style>
    </section>
);

const Missions = () => (
    <section id="missions" className="section bg-subtle py-16 md:py-28">
        <div className="container">
            <div className="text-center mb-10 md:mb-12 px-4">
                <span className="text-emerald-600 font-bold tracking-[2px] uppercase text-[10px] md:text-xs">Our Core Initiatives</span>
                <h2 className="fluid-h2 mt-2 text-royal-blue-900 font-merriweather">Driving Change Where It Matters</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-4 md:px-0">
                {[
                    { icon: '📖', title: 'Mission Medha', id: 'mission-medha', desc: 'Providing scholarships and digital learning tools to gifted students in rural government schools.' },
                    { icon: '⚖️', title: 'Nyaya Sadan', id: 'nyaya-sadan', desc: 'Nyaya Sadan addresses this gap by transforming legal awareness into legal empowerment.' },
                    { icon: '🍛', title: 'Mission Trupti', id: 'mission-trupti', desc: 'Daily nutritional support for the elderly and abandoned, ensuring no one sleeps hungry.' },
                    { icon: '🧠', title: 'Mission Mano Swasthya', id: 'mission-manoswasthya', desc: 'A strong nation requires not only educated citizens, but emotionally balanced and mentally healthy individuals.' },
                    { icon: '🔬', title: 'Mission Jeeva Dhara', id: 'mission-jeevadhara', desc: 'Mission Jeevadhara is the rural innovation and technological empowerment wing dedicated to bringing sustainable solutions.' }
                ].map((mission, index) => (
                    <motion.div
                        key={index}
                        className="card p-8 md:p-10"
                        whileHover={{ y: -8 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{ textAlign: 'left', borderRadius: '24px', borderTop: '4px solid var(--primary-royal)', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#eff6ff',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            fontSize: '1.8rem'
                        }}>
                            {mission.icon}
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--text-main)', fontFamily: 'Merriweather, serif' }}>{mission.title}</h3>
                        <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem', flexGrow: 1 }}>{mission.desc}</p>
                        <a href={`/missions#${mission.id}`} style={{ color: 'var(--primary-royal)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            View Project Details <span>→</span>
                        </a>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const JoinMission = () => {
    const navigate = useNavigate();
    return (
        <section id="get-involved" className="section" style={{ background: '#f8fafc', padding: '7rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Join the Movement</span>
                    <h2 className="fluid-h2" style={{ marginTop: '0.5rem', color: 'var(--primary-royal)', fontFamily: 'Merriweather, serif' }}>Choose Your Path to Impact</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        { title: 'Volunteer', desc: 'Work on the ground and serve rural communities directly.', path: '/volunteer-enrollment', icon: '🤝' },
                        { title: 'Internship', desc: 'Gain field experience and academic research opportunities.', path: '/internship-enrollment', icon: '🎓' },
                        { title: 'Patron', desc: 'Join our Advisory Council and provide strategic leadership.', path: '/patron-enrollment', icon: '🏛️' }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="card"
                            style={{ background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                            <h3 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>{item.title}</h3>
                            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                            <button
                                onClick={() => navigate(item.path)}
                                style={{ width: '100%', background: 'var(--primary-royal)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                Enroll Now
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Contact = () => (
    <section id="contact" className="section" style={{ background: 'white' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem' }}>
                <div>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Reach Out</span>
                    <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.5rem', color: 'var(--primary-royal)', fontFamily: 'Merriweather, serif' }}>Contact Us</h2>
                    <p style={{ marginBottom: '2.5rem', color: 'var(--text-body)', fontSize: '1.1rem' }}>
                        Whether you want to volunteer your time, partner with us, or have a question, we are here to listen.
                    </p>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', fontSize: '1.2rem' }}>📍</div>
                            <div>
                                <h4 style={{ marginBottom: '0.4rem', fontFamily: 'Inter, sans-serif' }}>Headquarters</h4>
                                <p style={{ color: 'var(--text-body)' }}>14-15-171/17/SF-1/YEGUVAPETA VEEDI WARD NO-1, Bakkannapalem, VISAKHAPATNAM<br />AndhraPradesh, India - 531163</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', fontSize: '1.2rem' }}>✉️</div>
                            <div>
                                <h4 style={{ marginBottom: '0.4rem', fontFamily: 'Inter, sans-serif' }}>Email Support</h4>
                                <p style={{ color: 'var(--text-body)' }}>viswavignanavaaradhi@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form style={{ background: '#f8fafc', padding: '3rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>First Name</label>
                            <input type="text" placeholder="John" style={{ marginBottom: 0 }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Last Name</label>
                            <input type="text" placeholder="Doe" style={{ marginBottom: 0 }} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                        <input type="email" placeholder="john@example.com" style={{ marginBottom: 0 }} />
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Message</label>
                        <textarea rows="4" placeholder="How can we help you?" style={{ marginBottom: 0 }}></textarea>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>Send Message</button>
                </form>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer style={{ background: '#111827', color: '#9ca3af', padding: '6rem 0 3rem', fontSize: '0.95rem' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                <div>
                    <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontFamily: 'Merriweather, serif' }}>Viswa Vignana Vaaradi</h3>
                    <p style={{ lineHeight: '1.8' }}>
                        A registered non-profit organization dedicated to holistic rural development since 2023.
                    </p>
                </div>
                <div>
                    <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none' }}>
                        {['Home', 'About Us', 'Our Missions', 'Donate', 'Contact'].map(link => (
                            <li key={link} style={{ marginBottom: '1rem' }}>
                                <a href="#" style={{ color: '#9ca3af', transition: 'color 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = 'var(--accent-emerald)'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}>Stay Updated</h4>
                    <p style={{ marginBottom: '1.5rem' }}>Subscribe to our newsletter for impact reports.</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="email" placeholder="Email Address" style={{ padding: '0.8rem', border: 'none', borderRadius: '4px', background: '#1f2937', color: 'white', marginBottom: 0 }} />
                        <button className="btn" style={{ background: 'var(--accent-emerald)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '4px' }}>Join</button>
                    </div>
                </div>
            </div>
            <div style={{ borderTop: '1px solid #1f2937', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
                <div>© {new Date().getFullYear()} Viswa Vignana Vaaradi. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#" style={{ color: '#6b7280' }}>Privacy Policy</a>
                    <a href="#" style={{ color: '#6b7280' }}>Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

const Home = () => {
    return (
        <div>
            <Hero />
            <Missions />
            <JoinMission />
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;
