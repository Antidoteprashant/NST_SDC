import React from 'react';
import { useAdmin } from '../../context/AdminContext';

const AdminAnalytics = () => {
    const { getStats, orders } = useAdmin();
    const stats = getStats();

    // Calculate Dynamic Metrics
    const avgOrderValue = stats.totalOrders > 0
        ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
        : "0.00";

    // Chart Data (Mocking monthly orders distribution for now based on current year)
    const currentYear = new Date().getFullYear();
    const monthlyData = new Array(12).fill(0);

    orders.forEach(order => {
        const d = new Date(order.created_at);
        if (d.getFullYear() === currentYear) {
            monthlyData[d.getMonth()] += parseFloat(order.total_amount) || 0;
        }
    });

    // Get max value for chart scaling
    const maxVal = Math.max(...monthlyData, 100); // minimal scale 100

    return (
        <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', textTransform: 'uppercase' }}>Analytics</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {/* Revenue Chart */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Revenue Overview ({currentYear})</h3>
                    <div style={{
                        height: '300px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: '5px'
                    }}>
                        {monthlyData.map((val, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${(val / maxVal) * 100}%`,
                                background: 'linear-gradient(to top, var(--accent-primary), transparent)',
                                borderRadius: '5px 5px 0 0',
                                opacity: 0.8,
                                position: 'relative',
                                minHeight: '2px' // Show line even if 0
                            }} title={`$${val}`}></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <span>J</span><span>F</span><span>M</span><span>A</span><span>M</span><span>J</span><span>J</span><span>A</span><span>S</span><span>O</span><span>N</span><span>D</span>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Performance Metrics</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span>Conversion Rate</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>N/A (Not Tracked)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span>Avg. Order Value</span>
                            <span style={{ color: '#fff', fontWeight: 'bold' }}>${avgOrderValue}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span>Total Visitors</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>N/A (Not Tracked)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Bounce Rate</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>N/A</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
