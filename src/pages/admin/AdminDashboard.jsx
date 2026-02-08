import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useCurrentTime } from '../../hooks/useCurrentTime';

const StatCard = ({ title, value, icon, gradient, delay }) => (
    <div className="stat-card glass-panel" style={{
        padding: '30px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '200px',
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%), ${gradient}`,
        border: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <h3 style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '600',
                margin: 0
            }}>{title}</h3>
            <span style={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</span>
        </div>

        <p style={{
            fontSize: '4rem',
            fontWeight: '800',
            margin: '10px 0 0 0',
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-2px',
            textShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>{value}</p>

        {/* Decorative Circle */}
        <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            filter: 'blur(20px)'
        }} />
    </div>
);

const AdminDashboard = () => {
    const { getStats, orders } = useAdmin();
    const stats = getStats();
    const currentTime = useCurrentTime();

    // Add GSAP animation on mount
    React.useEffect(() => {
        // Simple fade in for now, assuming GSAP is available globally or imported
        // Since we didn't import gsap here, we'll just rely on CSS transitions if possible or add import
    }, []);

    return (
        <div>
            {/* Header with Title and Live Timestamp */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    margin: 0,
                    textTransform: 'uppercase',
                    fontWeight: '900',
                    background: 'linear-gradient(to right, #fff, #888)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Dashboard</h1>
                <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {currentTime}
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '50px' }}>
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue}`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                    gradient="linear-gradient(135deg, rgba(0,255,100,0.1), rgba(0,0,0,0))"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
                    gradient="linear-gradient(135deg, rgba(0,150,255,0.1), rgba(0,0,0,0))"
                />
                <StatCard
                    title="Pending"
                    value={stats.pendingOrders}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                    gradient="linear-gradient(135deg, rgba(255,200,0,0.1), rgba(0,0,0,0))"
                />
                <StatCard
                    title="Products"
                    value={stats.totalProducts}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>}
                    gradient="linear-gradient(135deg, rgba(255,0,100,0.1), rgba(0,0,0,0))"
                />
            </div>

            {/* Recent Orders */}
            <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', color: '#fff' }}>Recent Activity</h2>
            <div className="glass-panel" style={{
                padding: '0', // Removed padding for cleaner list look
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                            <th style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 5).map((order, i) => (
                            <tr key={order.id} style={{
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                transition: 'background 0.3s'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '20px', color: '#fff', fontFamily: 'monospace', fontSize: '1.1rem' }}>{order.id}</td>
                                <td style={{ padding: '20px', color: '#fff', fontWeight: 'bold' }}>{order.customer_name}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{
                                        padding: '8px 15px',
                                        borderRadius: '50px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        background:
                                            order.status === 'Delivered' ? 'rgba(0, 255, 100, 0.15)' :
                                                order.status === 'Pending' ? 'rgba(255, 200, 0, 0.15)' :
                                                    'rgba(255, 255, 255, 0.1)',
                                        color:
                                            order.status === 'Delivered' ? '#00ff64' :
                                                order.status === 'Pending' ? '#ffcc00' :
                                                    '#fff',
                                        border: `1px solid ${order.status === 'Delivered' ? 'rgba(0, 255, 100, 0.3)' :
                                            order.status === 'Pending' ? 'rgba(255, 200, 0, 0.3)' :
                                                'rgba(255, 255, 255, 0.2)'
                                            }`
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{order.total_amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
