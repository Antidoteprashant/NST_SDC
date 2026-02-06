import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const navRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { getCartCount } = useCart();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(navRef.current, {
                y: -100,
                opacity: 0,
                duration: 1,
                ease: "power4.out",
                delay: 0.5
            });
        }, navRef);
        return () => ctx.revert();
    }, []);

    const handleNavigation = (id, path) => {
        if (location.pathname !== path) {
            navigate(path);
            // If navigating to home with an anchor, we might need a delay or effect to scroll
            // For now, simpler is generic navigation. 
            // If we need to scroll to section after nav, we'd use a useEffect in Home.
            if (id && path === '/') {
                setTimeout(() => {
                    const element = document.getElementById(id);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            if (id) {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const navLinks = [
        { name: 'Home', id: 'hero', path: '/' },
        { name: 'Brief', id: 'details', path: '/' },
        { name: 'Categories', id: null, path: '/categories' }, // No ID, just route
        { name: 'Track Order', id: null, path: '/track-order' },
    ];

    return (
        <nav ref={navRef} style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '600px',
            padding: '12px 30px',
            borderRadius: '50px',
            background: 'rgba(10, 10, 10, 0.6)', // Dark semi-transparent
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
            {/* Logo / Brand */}
            <div
                onClick={() => handleNavigation('hero', '/')}
                style={{
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#fff',
                    letterSpacing: '-0.5px'
                }}>
                bawk.
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '20px' }}>
                {navLinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => handleNavigation(link.id, link.path)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: location.pathname === link.path && (!link.id || (link.id === 'hero' && window.scrollY < 500)) ? '#fff' : 'var(--text-muted)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'color 0.3s ease, transform 0.2s',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = '#fff';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = location.pathname === link.path ? '#fff' : 'var(--text-muted)';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {link.name}
                    </button>
                ))}

                {/* Cart Badge */}
                <div
                    style={{ position: 'relative', marginLeft: '10px' }}
                    onClick={() => navigate('/cart')}
                >
                    <div style={{ color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ transition: 'transform 0.2s', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </div>
                    {getCartCount() > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'var(--accent-primary)',
                            color: '#000',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                        }}>
                            {getCartCount()}
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
