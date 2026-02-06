import React, { useRef, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, getCartCount } = useCart();
    const container = useRef(null);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.cart-item, .cart-summary', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, container);
        return () => ctx.revert();
    }, []);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;

        // Simulate checkout
        clearCart();
        alert("Thank you for your purchase!");
        navigate('/');
    };

    return (
        <section ref={container} style={{
            minHeight: '100vh',
            padding: '120px 20px',
            background: 'var(--bg-color)',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{ maxWidth: '1000px', width: '100%' }}>
                <h1 style={{
                    fontSize: '3rem',
                    marginBottom: '40px',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                }}>Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '20px' }}>Your cart is empty</h2>
                        <Link to="/categories" style={{
                            color: 'var(--accent-primary)',
                            textDecoration: 'underline',
                            fontSize: '1.2rem'
                        }}>
                            Browse Collections
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {/* Cart Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cart.map(item => (
                                <div key={item.id} className="cart-item glass-panel" style={{
                                    padding: '20px',
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '10px',
                                        background: `url(${item.image}) center/cover`
                                    }} />

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>${item.price}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--glass-border)', borderRadius: '5px', padding: '5px' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px' }}
                                        >-</button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px' }}
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ff4d4d',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            padding: '10px'
                                        }}
                                        title="Remove Item"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary / Checkout */}
                        <div className="cart-summary" style={{ height: 'fit-content' }}>
                            <div className="glass-panel" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Order Summary</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-muted)' }}>
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        background: '#fff',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CartPage;
