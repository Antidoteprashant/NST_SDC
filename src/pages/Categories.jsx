import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Categories = () => {
    const { categories } = useShop();
    const container = useRef(null);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (categories.length === 0) return;

        let ctx = gsap.context(() => {
            gsap.from('.category-card', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.categories-grid',
                    start: "top 85%"
                }
            });

            gsap.from('.page-title', {
                y: -30,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out"
            });
        }, container);

        return () => ctx.revert();
    }, [categories]);

    return (
        <section ref={container} className="flex-center" style={{
            minHeight: '100vh',
            padding: '120px 20px 60px', // Top padding for navbar
            flexDirection: 'column',
            background: 'var(--bg-color)',
            position: 'relative',
        }}>
            <h1 className="page-title" style={{
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                marginBottom: '60px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '-2px',
                background: 'linear-gradient(to right, #fff, #888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Collections
            </h1>

            {categories.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Loading categories...</div>
            ) : (
                <div className="categories-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    width: '100%',
                    maxWidth: '1400px'
                }}>
                    {categories.map((cat, i) => (
                        <div key={cat.id} className="category-card glass-panel" style={{
                            height: '300px',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                        }}
                            onClick={() => navigate(`/categories/${cat.slug || cat.id}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = `0 20px 40px rgba(255, 255, 255, 0.1)`;
                                e.currentTarget.querySelector('.cat-bg').style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.querySelector('.cat-bg').style.transform = 'scale(1)';
                            }}
                        >
                            {/* Background Image */}
                            <div className="cat-bg" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${cat.cover_image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                filter: 'brightness(0.6)'
                            }} />

                            {/* Content */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                padding: '30px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                zIndex: 2
                            }}>
                                <h3 style={{
                                    fontSize: '2rem',
                                    color: '#fff',
                                    marginBottom: '10px',
                                    textTransform: 'uppercase',
                                    fontWeight: 800
                                }}>{cat.name}</h3>
                                <span style={{
                                    color: cat.color || '#fff',
                                    fontSize: '0.9rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    fontWeight: 600
                                }}>Explore &rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Categories;
