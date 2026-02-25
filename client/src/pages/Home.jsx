import { useState } from 'react';
import { motion } from 'framer-motion';
import heroVideo from '../assets/video.mp4';

const Hero = ({ onDonate }) => (
    <section id="home" className="hero" style={{
        position: 'relative',
        width: '100%',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
        // marginTop removed, handled by Layout
    }}>
        <video
            autoPlay
            loop
            muted
            playsInline
            style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain'
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
    </section>
);

const Missions = () => (
    <section id="missions" className="section bg-subtle" style={{ padding: '7rem 0' }}>
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Our Core Initiatives</span>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', color: 'var(--primary-royal)', fontFamily: 'Merriweather, serif' }}>Driving Change Where It Matters</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {[
                    { icon: '🎓', title: 'Mission Medha', desc: 'Providing scholarships and digital learning tools to gifted students in rural government schools.' },
                    { icon: '⚕️', title: 'Mission Arogya', desc: 'Conducting specialized medical camps and funding critical surgeries for families below the poverty line.' },
                    { icon: '🍛', title: 'Mission Annapurna', desc: 'Daily nutritional support for the elderly and abandoned, ensuring no one sleeps hungry.' }
                ].map((mission, index) => (
                    <motion.div
                        key={index}
                        className="card"
                        whileHover={{ y: -8 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{ textAlign: 'left', padding: '3rem', borderRadius: '8px', borderTop: '4px solid var(--primary-royal)' }}
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
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', color: 'var(--text-main)', fontFamily: 'Merriweather, serif' }}>{mission.title}</h3>
                        <p style={{ color: 'var(--text-body)', marginBottom: '2rem', lineHeight: '1.7' }}>{mission.desc}</p>
                        <a href="#" style={{ color: 'var(--primary-royal)', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            View Project Details <span>→</span>
                        </a>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const Contact = () => (
    <section id="contact" className="section" style={{ background: 'white' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem' }}>
                <div>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Contact Us</span>
                    <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.5rem', color: 'var(--primary-royal)', fontFamily: 'Merriweather, serif' }}>Get Involved Today</h2>
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
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;
