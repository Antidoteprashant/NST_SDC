import React, { useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
// import { categories } from '../data/products'; // Categories stay static for now -> REMOVED
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';

const CategoryPage = () => {
    const { id } = useParams();
    const container = useRef(null);
    const { addToCart } = useCart();
    const { products, categories } = useShop(); // Use dynamic products and categories
    const [likedItems, setLikedItems] = React.useState({});

    const toggleLike = (productId) => {
        setLikedItems(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Get category info and filtred products
    // Match by slug (preferred) or ID
    // Get category info and filtred products
    // Match by slug (preferred) or ID - loosely compare ID to handle string/number differences
    const category = categories.find(c => c.slug === id || c.id == id);
    const categoryProducts = products.filter(p => p.category == category?.id);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.product-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, container);
        return () => ctx.revert();
    }, [id, categoryProducts]); // Re-run anim if products change

    if (!category) return <div className="flex-center full-screen">Category Not Found</div>;

    return (
        <section ref={container} style={{
            minHeight: '100vh',
            padding: '120px 20px',
            background: 'var(--bg-color)',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '2px' }}>&larr; Back to Home</Link>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        marginTop: '20px',
                        color: category.color || '#fff',
                        textTransform: 'uppercase',
                        fontWeight: 800
                    }}>
                        {category.name}
                    </h1>
                </div>

                {categoryProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '40px' }}>
                        No products found in this category yet.
                    </div>
                ) : (

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '40px'
                    }}>
                        {categoryProducts.map((product) => (
                            <div key={product.id} className="product-card glass-panel" style={{
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px'
                            }}>
                                <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        background: `url(${product.image_url || product.image}) center/cover`,
                                        borderRadius: '10px'
                                    }} />
                                </Link>

                                <div>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{product.name}</h3>
                                    </Link>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>${product.price}</p>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {/* Like Button */}
                                    <button
                                        className={`like-button ${likedItems[product.id] ? 'liked' : ''}`}
                                        style={{ flex: 1, padding: '10px' }} // Added padding override for size fit
                                        onClick={() => toggleLike(product.id)}
                                    >
                                        <svg className="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
                                        <svg className="filled" height="32" width="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg>
                                    </button>

                                    {/* Add to Cart Button */}
                                    <button className="button" onClick={() => addToCart(product)} style={{ flex: 2 }}>
                                        <span>Add to cart</span>
                                        <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                                            <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <defs></defs>
                                                <g id="cart">
                                                    <circle r="1.91" cy="20.59" cx="10.07" className="cls-1"></circle>
                                                    <circle r="1.91" cy="20.59" cx="18.66" className="cls-1"></circle>
                                                    <path d="M.52,1.5H3.18a2.87,2.87,0,0,1,2.74,2L9.11,13.91H8.64A2.39,2.39,0,0,0,6.25,16.3h0a2.39,2.39,0,0,0,2.39,2.38h10" className="cls-1"></path>
                                                    <polyline points="7.21 5.32 22.48 5.32 22.48 7.23 20.57 13.91 9.11 13.91" className="cls-1"></polyline>
                                                </g>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryPage;
