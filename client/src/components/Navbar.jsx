import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = ({ onDonateClick, mobileMenuOpen, setMobileMenuOpen }) => {
    const [scrolled, setScrolled] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [involvedDropdownOpen, setInvolvedDropdownOpen] = useState(false);
    const [missionsDropdownOpen, setMissionsDropdownOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [mobileInvolvedOpen, setMobileInvolvedOpen] = useState(false);
    const [mobileMissionsOpen, setMobileMissionsOpen] = useState(false);
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

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

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
        } else if (item === 'Legal Aid') {
            navigate('/legal-aid');
        } else {
            if (location.pathname !== '/') {
                navigate('/', { state: { target: item.toLowerCase() } });
            }
        }
        setMobileMenuOpen(false); // Close mobile menu after navigation
    };

    const handleAboutClick = (tab) => {
        navigate('/about', { state: { tab } });
        setAboutDropdownOpen(false);
        setMobileMenuOpen(false);
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
            height: '80px' // Reduced from 100px for a slimmer profile
        }}>
            <div
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px sm:15px' }}
                className="logo-container"
            >
                <img src={logo} alt="Viswa Vignana Logo" className="logo-img" style={{
                    height: '60px',
                    width: '60px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} />
                <div className="logo-text-wrapper">
                    <h1 className="logo-text" style={{
                        color: 'var(--text-main)',
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        letterSpacing: '0.2px',
                        fontFamily: 'Merriweather, serif',
                        margin: 0,
                        lineHeight: 1.1,
                        textTransform: 'uppercase'
                    }}>
                          VISWA VIGNANA VAARADHI
                    </h1>
                </div>
            </div>

            {/* DESKTOP MENU */}
            <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>

                {/* Navigation Links */}
                {[
                    { label: 'Home', type: 'link' },
                    { label: 'About Us', type: 'dropdown' },
                    {
                        label: 'Missions',
                        type: 'dropdown',
                        path: '/missions',
                        subItems: [
                            { label: 'Mission Medha', path: '/missions#mission-medha' },
                            { label: 'Nyaya Sadan', path: '/missions#nyaya-sadan' },
                            { label: 'Mission Trupti', path: '/missions#mission-trupti' },
                            { label: 'Mission Manoswasthya', path: '/missions#mission-manoswasthya' },
                            { label: 'Mission Jeevadhara', path: '/missions#mission-jeevadhara' }
                        ]
                    },
                    {
                        label: 'Get Involved', type: 'dropdown', subItems: [
                            { label: 'Volunteer Enrollment', path: '/volunteer-enrollment' },
                            { label: 'Internship Enrollment', path: '/internship-enrollment' },
                            { label: 'Patron Enrollment', path: '/patron-enrollment' },
                            { label: 'Learn More', path: '/get-involved' }
                        ]
                    },
                    { label: 'Gallery', type: 'link', path: '/gallery' },
                    { label: 'Legal Aid', type: 'link', path: '/legal-aid' },
                    { label: 'Contact', type: 'link' }
                ].map((item) => {
                    if (item.type === 'dropdown') {
                        return (
                            <div
                                key={item.label}
                                style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={() => {
                                    if (item.label === 'About Us') setAboutDropdownOpen(true);
                                    else if (item.label === 'Get Involved') setInvolvedDropdownOpen(true);
                                    else if (item.label === 'Missions') setMissionsDropdownOpen(true);
                                }}
                                onMouseLeave={() => {
                                    if (item.label === 'About Us') setAboutDropdownOpen(false);
                                    else if (item.label === 'Get Involved') setInvolvedDropdownOpen(false);
                                    else if (item.label === 'Missions') setMissionsDropdownOpen(false);
                                }}
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
                                    onClick={() => {
                                        if (item.path) navigate(item.path);
                                        else if (item.label === 'About Us') navigate('/about');
                                        else if (item.label === 'Get Involved') navigate('/get-involved');
                                    }}
                                    className="nav-link"
                                >
                                    {item.label} <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▼</span>
                                </div>

                                <AnimatePresence>
                                    {((item.label === 'About Us' && aboutDropdownOpen) ||
                                        (item.label === 'Get Involved' && involvedDropdownOpen) ||
                                        (item.label === 'Missions' && missionsDropdownOpen)) && (
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
                                                    minWidth: item.label === 'About Us' ? '500px' : '240px',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                                    marginTop: '0px',
                                                    border: '1px solid #f1f5f9',
                                                    overflow: 'hidden',
                                                    padding: '1rem'
                                                }}
                                            >
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: item.label === 'About Us' ? '1fr 1fr' : '1fr',
                                                    gap: '8px'
                                                }}>
                                                    {(item.label === 'About Us' ?
                                                        ['What is VVV', 'Core Values', 'People behind VVV', 'Impact Timeline', 'Partnered Colleges', 'Corporate Partnership', 'Partnered Influencers'] :
                                                        item.subItems.map(si => si.label)
                                                    ).map((subItemLabel) => (
                                                        <div
                                                            key={subItemLabel}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (item.label === 'About Us') {
                                                                    handleAboutClick(subItemLabel.toLowerCase().replace(/ /g, '_'));
                                                                } else {
                                                                    const subItem = item.subItems.find(si => si.label === subItemLabel);
                                                                    navigate(subItem.path);
                                                                    setInvolvedDropdownOpen(false);
                                                                    setMissionsDropdownOpen(false);
                                                                    setMobileMenuOpen(false);
                                                                }
                                                            }}
                                                            className="dropdown-item"
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
                                                        >
                                                            {subItemLabel}
                                                        </div>
                                                    ))}
                                                </div>
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
                        onClick={() => navigate('/donate')}
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

            {/* MOBILE TOGGLE BAR */}
            <div className="mobile-toggle" onClick={() => setMobileMenuOpen(true)} style={{ display: 'none', cursor: 'pointer', padding: '10px' }}>
                <div style={{ width: '22px', height: '2px', background: '#111', marginBottom: '5px' }}></div>
                <div style={{ width: '18px', height: '2px', background: '#111', marginBottom: '5px' }}></div>
                <div style={{ width: '22px', height: '2px', background: '#111' }}></div>
            </div>

            {/* MOBILE SIDE DRAWER */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100vh',
                                background: 'rgba(0,0,0,0.5)',
                                zIndex: 1100
                            }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                width: '85%',
                                maxWidth: '320px',
                                height: '100vh',
                                background: 'white',
                                zIndex: 1200,
                                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                                padding: '1.5rem 1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <span style={{ fontWeight: '900', color: 'var(--primary-royal)', fontSize: '1.1rem' }}>MENU</span>
                                <div onClick={() => setMobileMenuOpen(false)} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#666' }}>×</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {['Home', 'Gallery', 'Legal Aid', 'Contact'].map(item => (
                                    <div
                                        key={item}
                                        onClick={() => handleNavClick(item)}
                                        style={{
                                            padding: '0.75rem 0',
                                            fontWeight: '600',
                                            color: 'var(--text-main)',
                                            fontSize: '1.1rem',
                                            borderBottom: '1px solid #f1f5f9'
                                        }}
                                    >
                                        {item}
                                    </div>
                                ))}

                                {/* Collapsible Mobile Section: Missions */}
                                <div style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <div
                                        onClick={() => setMobileMissionsOpen(!mobileMissionsOpen)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem 0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>Missions</span>
                                        <span style={{ transform: mobileMissionsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                                    </div>
                                    <AnimatePresence>
                                        {mobileMissionsOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingBottom: '1rem', paddingLeft: '1rem' }}
                                            >
                                                {[
                                                    { label: 'Mission Medha', path: '/missions#mission-medha' },
                                                    { label: 'Nyaya Sadan', path: '/missions#nyaya-sadan' },
                                                    { label: 'Mission Trupti', path: '/missions#mission-trupti' },
                                                    { label: 'Mission Manoswasthya', path: '/missions#mission-manoswasthya' },
                                                    { label: 'Mission Jeevadhara', path: '/missions#mission-jeevadhara' },
                                                    { label: 'Overview', path: '/missions' }
                                                ].map((subItem) => (
                                                    <div
                                                        key={subItem.label}
                                                        onClick={() => { navigate(subItem.path); setMobileMenuOpen(false); }}
                                                        style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}
                                                    >
                                                        {subItem.label}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Collapsible Mobile Section: Get Involved */}
                                <div style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <div
                                        onClick={() => setMobileInvolvedOpen(!mobileInvolvedOpen)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem 0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>Get Involved</span>
                                        <span style={{ transform: mobileInvolvedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                                    </div>
                                    <AnimatePresence>
                                        {mobileInvolvedOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingBottom: '1rem', paddingLeft: '1rem' }}
                                            >
                                                {[
                                                    { label: 'Volunteer Enrollment', path: '/volunteer-enrollment' },
                                                    { label: 'Internship Enrollment', path: '/internship-enrollment' },
                                                    { label: 'Patron Enrollment', path: '/patron-enrollment' },
                                                    { label: 'Overview', path: '/get-involved' }
                                                ].map((subItem) => (
                                                    <div
                                                        key={subItem.label}
                                                        onClick={() => { navigate(subItem.path); setMobileMenuOpen(false); }}
                                                        style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}
                                                    >
                                                        {subItem.label}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Collapsible Mobile Section: About VVV */}
                                <div style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <div
                                        onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem 0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.1rem' }}>About VVV</span>
                                        <span style={{ transform: mobileAboutOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                                    </div>
                                    <AnimatePresence>
                                        {mobileAboutOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingBottom: '1rem', paddingLeft: '1rem' }}
                                            >
                                                {['What is VVV', 'People behind VVV', 'Partnered Colleges', 'Corporate Partnership'].map((subItem) => (
                                                    <div
                                                        key={subItem}
                                                        onClick={() => handleAboutClick(subItem.toLowerCase().replace(/ /g, '_'))}
                                                        style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}
                                                    >
                                                        {subItem}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div style={{
                                marginTop: 'auto',
                                paddingTop: '2rem',
                                paddingBottom: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}>
                                {!user ? (
                                    <button
                                        onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                                        className="btn btn-outline"
                                        style={{ width: '100%', borderColor: 'var(--primary-royal)' }}
                                    >
                                        Join Us
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <img src={user.picture || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="user" />
                                            <span style={{ fontWeight: '700', color: 'var(--primary-royal)' }}>{user.name.split(' ')[0]}'s Profile</span>
                                        </div>
                                        <button
                                            onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                            className="btn"
                                            style={{
                                                width: '100%',
                                                background: '#fee2e2',
                                                color: '#ef4444',
                                                fontWeight: '700',
                                                border: '1px solid #fecaca',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span>🚪</span> Log out
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => { navigate('/donate'); setMobileMenuOpen(false); }}
                                    className="btn btn-primary"
                                    style={{ width: '100%', background: 'var(--accent-emerald)', shadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}
                                >
                                    Donate Now
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
                .nav-link { transition: color 0.2s; position: relative; }
                .nav-link:hover { color: var(--primary-royal) !important; }
                .dropdown-item:hover { background: #f1f5f9 !important; color: var(--primary-royal) !important; }
                
                @media (max-width: 1100px) {
                    .desktop-menu { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    nav { padding: 0.5rem 1rem !important; height: 70px !important; }
                }

                @media (max-width: 600px) {
                    .logo-text { font-size: 0.95rem !important; line-height: 1.2 !important; }
                    .logo-img { height: 45px !important; width: 45px !important; }
                    .logo-container { gap: 10px !important; }
                    nav { height: 65px !important; }
                    .logo-text-wrapper { max-width: 180px; }
                }

                @media (max-width: 400px) {
                    .logo-text { font-size: 0.85rem !important; }
                    .logo-text-wrapper { max-width: 140px; }
                    nav { padding: 0.5rem 0.75rem !important; }
                }
            `}</style>
        </nav>
    );
};


export default Navbar;
