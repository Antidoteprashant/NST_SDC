import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useCurrentTime } from '../../hooks/useCurrentTime';

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useAdmin();
    const currentTime = useCurrentTime();

    const handleStatusChange = (id, newStatus) => {
        updateOrderStatus(id, newStatus);
    };

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
                <h1 style={{ fontSize: '2.5rem', margin: 0, textTransform: 'uppercase' }}>Order Management</h1>
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

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Order ID</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Customer</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Type</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Total</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', color: '#fff' }}>{order.id}</td>
                                <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '15px', color: '#fff' }}>{order.customer_name}</td>
                                <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{order.payment_method}</td>
                                <td style={{ padding: '15px', color: '#fff', fontWeight: 'bold' }}>₹{order.total_amount}</td>
                                <td style={{ padding: '15px' }}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '5px',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            border: 'none',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <option value="Ordered">Ordered</option>
                                        <option value="Packed">Packed</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{
                                        padding: '8px 15px',
                                        background: 'var(--accent-primary)',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
