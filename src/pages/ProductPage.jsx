import React, { useLayoutEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
    const { id } = useParams();
    const container = useRef(null);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    // Find product (convert id to number since params are strings)
    const product = products.find(p => p.id === parseInt(id));

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.anim-up', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, container);
        return () => ctx.revert();
    }, [id]);

    if (!product) return <div className="flex-center full-screen">Product Not Found</div>;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Simple feedback
        const btn = document.getElementById('add-btn');
        const originalText = btn.innerText;
        btn.innerText = "Added!";
        setTimeout(() => btn.innerText = originalText, 1000);
    };

    return (
        <section ref={container} style={{
            minHeight: '100vh',
            padding: '120px 20px',
            background: 'var(--bg-color)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="glass-panel" style={{
                maxWidth: '1000px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '50px',
                padding: '40px'
            }}>
                {/* Image Side */}
                <div className="anim-up" style={{
                    aspectRatio: '1',
                    background: `url(${product.image}) center/cover`,
                    borderRadius: '20px'
                }} />

                {/* Info Side */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Link to={`/categories/${product.categoryId}`} className="anim-up" style={{
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: '20px',
                        display: 'block'
                    }}>
                        &larr; Back to {product.categoryId}
                    </Link>

                    <h1 className="anim-up" style={{ fontSize: '3rem', marginBottom: '10px', lineHeight: 1 }}>{product.name}</h1>
                    <p className="anim-up" style={{ fontSize: '2rem', color: '#fff', marginBottom: '30px', fontWeight: 300 }}>${product.price}</p>

                    <p className="anim-up" style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '40px' }}>
                        {product.description}
                        <br /><br />
                        High-quality materials, premium finish. Limited edition collection item suitable for display or daily use.
                    </p>

                    <div className="anim-up" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '5px',
                            padding: '5px'
                        }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: '#fff', padding: '10px', cursor: 'pointer' }}>-</button>
                            <span style={{ padding: '0 15px', color: '#fff' }}>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: '#fff', padding: '10px', cursor: 'pointer' }}>+</button>
                        </div>

                        <button
                            id="add-btn"
                            onClick={handleAddToCart}
                            style={{
                                flex: 1,
                                padding: '15px',
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                borderRadius: '5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                fontSize: '1rem',
                                transition: 'transform 0.2s'
                            }}
                            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductPage;
