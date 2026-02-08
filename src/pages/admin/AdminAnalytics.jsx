import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { categories } from '../../data/products';

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

    // --- Analytics Calculations ---

    const currentYear = new Date().getFullYear();

    // 1. Monthly Revenue Data
    const monthlyRevenueData = useMemo(() => {
        const data = new Array(12).fill(0);
        orders.forEach(order => {
            const d = new Date(order.created_at);
            if (d.getFullYear() === currentYear) {
                data[d.getMonth()] += parseFloat(order.total_amount) || 0;
            }
        });
        return data;
    }, [orders, currentYear]);

    const maxMonthlyRevenue = Math.max(...monthlyRevenueData, 100);

    // 2. Sales by Category
    const categorySales = useMemo(() => {
        const sales = {};
        // Initialize with 0 for known categories
        categories.forEach(cat => {
            sales[cat.id] = 0;
        });

        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    // Use categoryId if available, otherwise fallback or unknown
                    const catId = item.categoryId || 'unknown';
                    const itemTotal = (parseFloat(item.price) || 0) * (item.quantity || 1);

                    if (sales[catId] !== undefined) {
                        sales[catId] += itemTotal;
                    } else {
                        // accummulate unknown or other categories
                        sales[catId] = (sales[catId] || 0) + itemTotal;
                    }
                });
            }
        });

        // Convert to array for sorting/display
        return Object.entries(sales)
            .map(([id, total]) => ({
                id,
                name: categories.find(c => c.id === id)?.name || id,
                total
            }))
            .sort((a, b) => b.total - a.total); // Sort by highest sales
    }, [orders]);

    const maxCategorySale = Math.max(...categorySales.map(c => c.total), 100);

    // 3. Order Status Counts
    const orderStatusCounts = useMemo(() => {
        const counts = {
            'Confirmed': 0, // Maps to 'Ordered'
            'Processing': 0,
            'Shipped': 0,
            'Delivered': 0
        };

        orders.forEach(order => {
            let status = order.status;
            if (status === 'Ordered') status = 'Confirmed'; // Map Ordered to Confirmed for UI

            if (counts[status] !== undefined) {
                counts[status]++;
            }
        });
        return counts;
    }, [orders]);


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

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '25px' }}>

                {/* Sales by Category */}
                <div className="glass-panel" style={{ padding: '25px', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.1rem' }}>Sales by Category</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {categorySales.slice(0, 5).map(cat => (
                            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{cat.name}</span>
                                        <span style={{ color: '#fff' }}>₹{cat.total.toLocaleString()}</span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '6px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '3px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${(cat.total / maxCategorySale) * 100}%`,
                                            height: '100%',
                                            background: 'var(--accent-primary)',
                                            borderRadius: '3px'
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {categorySales.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No sales data available.</p>}
                    </div>
                </div>

                {/* Order Status */}
                <div className="glass-panel" style={{ padding: '25px', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.1rem' }}>Order Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', height: '80%' }}>
                        {Object.entries(orderStatusCounts).map(([status, count]) => (
                            <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{status}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        height: '20px',
                                        width: '2px',
                                        background: count > 0 ? '#fff' : 'rgba(255,255,255,0.2)'
                                    }}></span>
                                    <span style={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        minWidth: '20px',
                                        textAlign: 'right'
                                    }}>{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Revenue - Full Width */}
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '15px' }}>
                <h3 style={{ marginBottom: '10px', color: '#fff', fontSize: '1.1rem' }}>Monthly Revenue</h3>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <div style={{
                            fontSize: '3.5rem',
                            fontWeight: 'bold',
                            color: 'var(--accent-primary)',
                            lineHeight: 1.1,
                            marginBottom: '5px'
                        }}>
                            ₹{stats.totalRevenue.toLocaleString()}
                        </div>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Business Revenue</p>
                    </div>

                    <div style={{ flex: 1, height: '150px', display: 'flex', alignItems: 'flex-end', gap: '10px', minWidth: '300px' }}>
                        {monthlyRevenueData.map((val, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${(val / maxMonthlyRevenue) * 100}%`,
                                background: 'linear-gradient(to top, rgba(255,255,255,0.1), transparent)',
                                borderRadius: '4px 4px 0 0',
                                position: 'relative',
                                minHeight: '4px',
                                borderTop: '2px solid var(--accent-primary)'
                            }} title={`Method: ${val}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
