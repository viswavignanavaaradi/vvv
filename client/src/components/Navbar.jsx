import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = ({ onDonateClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('vvv_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (item) => {
        if (item === 'Home') {
            if (location.pathname !== '/') {
                navigate('/');
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else if (item === 'Missions') {
            navigate('/missions');
        } else if (item === 'Get Involved') {
            navigate('/get-involved');
        } else if (item === 'Gallery') {
            navigate('/gallery');
        } else {
            if (location.pathname !== '/') {
                navigate('/', { state: { target: item.toLowerCase() } });
            }
        }
    };

    const handleAboutClick = (tab) => {
        navigate('/about', { state: { tab } });
        setAboutDropdownOpen(false);
    };

    useEffect(() => {
        if (location.pathname === '/' && location.state?.target) {
            const targetElement = document.getElementById(location.state.target);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            background: 'rgba(255,255,255,0.98)',
            padding: '0.4rem 2rem',
            transition: 'all 0.3s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : '1px solid transparent',
            backdropFilter: 'blur(8px)',
            height: '100px' // Added fixed height for predictability
        }}>
            <div
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}
            >
                <img src={logo} alt="Viswa Vignana Logo" className="logo-img" style={{
                    height: '75px',
                    width: '75px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} />
                <div>
                    <h1 className="logo-text" style={{
                        color: 'var(--text-main)',
                        fontSize: '1.35rem',
                        fontWeight: '900',
                        letterSpacing: '0.5px',
                        fontFamily: 'Merriweather, serif',
                        margin: 0,
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap'
                    }}>
                        VISWA VIGNANA VARADI
                    </h1>
                </div>
            </div>

            <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>

                {/* Navigation Links */}
                {[
                    { label: 'Home', type: 'link' },
                    { label: 'About Us', type: 'dropdown' },
                    { label: 'Missions', type: 'link', path: '/missions' },
                    { label: 'Get Involved', type: 'link', path: '/get-involved' },
                    { label: 'Gallery', type: 'link', path: '/gallery' },
                    { label: 'Legal Aid', type: 'link', path: '/legal-aid' },
                    { label: 'Contact', type: 'link' }
                ].map((item) => {
                    if (item.type === 'dropdown') {
                        return (
                            <div
                                key={item.label}
                                style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={() => setAboutDropdownOpen(true)}
                                onMouseLeave={() => setAboutDropdownOpen(false)}
                            >
                                <div
                                    style={{
                                        color: 'var(--text-body)',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '10px 0'
                                    }}
                                    onClick={() => navigate('/about')}
                                    className="nav-link"
                                >
                                    {item.label} <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▼</span>
                                </div>

                                <AnimatePresence>
                                    {aboutDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: '50%',
                                                x: '-50%',
                                                background: 'white',
                                                minWidth: '240px',
                                                borderRadius: '6px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                marginTop: '0px',
                                                border: '1px solid #e5e7eb',
                                                overflow: 'hidden',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            {['What is VVV', 'Core Values', 'People behind VVV', 'Impact Timeline', 'Partnered Colleges', 'Corporate Partnership', 'Partnered Influencers'].map((subItem) => (
                                                <div
                                                    key={subItem}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAboutClick(subItem.toLowerCase().replace(/ /g, '_'));
                                                    }}
                                                    style={{
                                                        padding: '0.6rem 1rem',
                                                        color: 'var(--text-body)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        borderRadius: '4px',
                                                        display: 'block',
                                                        textAlign: 'left',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = '#f1f5f9';
                                                        e.target.style.color = 'var(--primary-royal)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'white';
                                                        e.target.style.color = 'var(--text-body)';
                                                    }}
                                                >
                                                    {subItem}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }

                    // For specific pages, always navigate
                    if (item.path) {
                        return (
                            <RouterLink
                                key={item.label}
                                to={item.path}
                                style={{
                                    color: 'var(--text-body)',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '0.9rem'
                                }}
                                className="nav-link"
                            >
                                {item.label}
                            </RouterLink>
                        );
                    }

                    // For Home and Contact (Sections on Home)
                    return location.pathname === '/' ? (
                        <ScrollLink
                            key={item.label}
                            to={item.label.toLowerCase()}
                            smooth={true}
                            duration={800}
                            style={{ color: 'var(--text-body)', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}
                            className="nav-link"
                        >
                            {item.label}
                        </ScrollLink>
                    ) : (
                        <RouterLink
                            key={item.label}
                            to="/"
                            state={{ target: item.label.toLowerCase() }}
                            style={{
                                color: 'var(--text-body)',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}
                            className="nav-link"
                        >
                            {item.label}
                        </RouterLink>
                    );
                })}

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div
                                onClick={() => navigate('/profile')}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '12px',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                            >
                                <img
                                    src={user.picture || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                                    alt="User"
                                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                    {user.name.split(' ')[0]}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('vvv_user');
                                    setUser(null);
                                    navigate('/login');
                                }}
                                className="btn btn-outline"
                                style={{
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    fontWeight: '600'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-outline"
                            style={{
                                padding: '0.5rem 1.2rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                border: '1px solid var(--primary-royal)',
                                color: 'var(--primary-royal)',
                                fontWeight: '600'
                            }}
                        >
                            Join Us
                        </button>
                    )}

                    <button
                        onClick={onDonateClick}
                        className="btn btn-primary"
                        style={{
                            padding: '0.5rem 1.2rem',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            backgroundImage: 'linear-gradient(to right, var(--accent-emerald), #047857)',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600'
                        }}
                    >
                        Donate Now
                    </button>
                </div>
            </div>

            {/* Mobile Toggle */}
            <div className="mobile-toggle" onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)} style={{ display: 'none', cursor: 'pointer' }}>
                <div style={{ width: '25px', height: '2px', background: '#333', marginBottom: '5px' }}></div>
                <div style={{ width: '25px', height: '2px', background: '#333', marginBottom: '5px' }}></div>
                <div style={{ width: '25px', height: '2px', background: '#333' }}></div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {aboutDropdownOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            background: 'white',
                            borderTop: '1px solid #eee',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            display: 'none'
                        }}
                    >
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Home', 'Missions', 'Get Involved', 'Gallery', 'Legal Aid', 'Contact'].map(item => (
                                <span key={item} onClick={() => { handleNavClick(item); setAboutDropdownOpen(false); }} style={{ padding: '0.5rem', fontWeight: '500', color: 'var(--text-body)' }}>{item}</span>
                            ))}

                            <div style={{ padding: '0.5rem', fontWeight: '500', color: 'var(--primary-royal)' }}>About Us</div>
                            <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {['What is VVV', 'People behind VVV', 'Partnered Colleges', 'Corporate Partnership', 'Partnered Influencers'].map((subItem) => (
                                    <span key={subItem} onClick={() => { handleAboutClick(subItem.toLowerCase().replace(/ /g, '_')); setAboutDropdownOpen(false); }} style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {subItem}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => { navigate('/login'); setAboutDropdownOpen(false); }}
                                style={{
                                    padding: '0.8rem',
                                    marginTop: '1rem',
                                    borderRadius: '4px',
                                    background: 'var(--primary-royal)',
                                    color: 'white',
                                    border: 'none',
                                    width: '100%',
                                    fontWeight: '600'
                                }}
                            >
                                Login / Join Us
                            </button>

                            <button
                                onClick={() => { onDonateClick(); setAboutDropdownOpen(false); }}
                                style={{
                                    padding: '0.8rem',
                                    marginTop: '0.5rem',
                                    borderRadius: '4px',
                                    background: 'var(--accent-emerald)',
                                    color: 'white',
                                    border: 'none',
                                    width: '100%',
                                    fontWeight: '600'
                                }}
                            >
                                Donate Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: var(--primary-royal) !important; }
        
        @media (max-width: 1024px) {
            .desktop-menu { display: none !important; }
            .mobile-toggle { display: block !important; }
            .mobile-menu { display: block !important; }
            nav { padding: 1rem 1.5rem !important; height: 80px !important; }
        }

        @media (max-width: 500px) {
            .logo-text { fontSize: 0.9rem !important; }
            .logo-img { height: 45px !important; width: 45px !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
