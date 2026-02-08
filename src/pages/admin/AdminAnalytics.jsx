import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const AdminAnalytics = () => {
    const { getStats, orders } = useAdmin();
    const stats = getStats();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update timestamp every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format timestamp like "Mon, 2 Feb, 06:19:35 pm"
    const formatTimestamp = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;

        return `${dayName}, ${day} ${month}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    };

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
            {/* Header with Title and Live Timestamp */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '5px', textTransform: 'uppercase' }}>Analytics</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>Business insights and metrics</p>
                </div>
                <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {formatTimestamp(currentTime)}
                </div>
            </div>

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
