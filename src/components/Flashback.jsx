import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Flashback = () => {
    const { categories } = useShop();
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const stripRef = useRef(null);
    const row1Ref = useRef(null);

    useLayoutEffect(() => {
        if (!categories || categories.length === 0) return;

        const ctx = gsap.context(() => {

            // Header Reveal
            const headerLine = sectionRef.current.querySelector('.header-reveal .text-reveal-line');
            if (headerLine) {
                gsap.to(headerLine, {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out"
                });
            }

            // Continuous Marquee Animation
            // Duplicate content is needed for seamless loop. 
            // We calculate width dynamically or just rely on enough content.
            gsap.to(row1Ref.current, {
                xPercent: -50,
                ease: "none",
                duration: 40,
                repeat: -1
            });

            // Reveal items inside the marquee as the section comes into view
            const cards = row1Ref.current.querySelectorAll('.flash-item');
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%"
                },
                y: 100,
                opacity: 0,
                rotateX: -20,
                stagger: 0.1,
                duration: 1.2,
                ease: "power3.out"
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [categories]);

    // If no categories yet, maybe show nothing or loading?
    // User wants "existing section", so better to show structure even if empty or loading?
    // But data is essential for the marquee. 
    // Let's assume data will load.

    // Duplicate categories for marquee effect
    const marqueeItems = [...categories, ...categories, ...categories]; // Triple to ensure enough width

    if (!categories || categories.length === 0) return null;

    return (
        <section id="categories" ref={sectionRef} style={{
            minHeight: '60vh',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '100px 0',
            background: 'var(--bg-color)' // Ensure background matches
        }}>

            <div style={{ paddingLeft: '5vw', marginBottom: '3rem' }}>
                <h2 className="glow-text header-reveal text-reveal-mask" style={{ fontSize: '3rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                    <span className="text-reveal-line">Categories</span>
                </h2>
            </div>

            {/* Moving Strip Wrapper */}
            <div ref={stripRef} style={{ width: '100%', overflow: 'hidden' }}>
                <div ref={row1Ref} style={{
                    display: 'flex',
                    gap: '30px',
                    width: 'max-content',
                    paddingLeft: '20px'
                }}>
                    {marqueeItems.map((cat, i) => (
                        <div key={`${cat.id}-${i}`} className="flash-item glass-panel" style={{
                            width: '300px',
                            height: '400px', // Taller for cover image
                            flexShrink: 0,
                            position: 'relative',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid var(--glass-border)',
                            transition: 'transform 0.3s ease, border-color 0.3s ease'
                        }}
                            onClick={() => navigate(`/categories/${cat.slug || cat.id}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(0.98)';
                                e.currentTarget.style.borderColor = cat.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                            }}
                        >
                            {/* Cover Image */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${cat.cover_image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                filter: 'brightness(0.7)',
                                transition: 'filter 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(0.7)'}
                            />

                            {/* Overlay Gradient */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '50%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                zIndex: 1,
                                pointerEvents: 'none'
                            }} />

                            {/* Text Content */}
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '20px',
                                zIndex: 2,
                                width: '100%'
                            }}>
                                <h3 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 800,
                                    color: '#fff',
                                    marginBottom: '5px',
                                    textTransform: 'uppercase',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                }}>{cat.name}</h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: cat.color || 'var(--accent-primary)',
                                    fontWeight: 600,
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase'
                                }}>Explore <span style={{ fontSize: '1.2em' }}>›</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Flashback;
