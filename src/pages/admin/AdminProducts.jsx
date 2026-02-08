import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/products';
import { useCurrentTime } from '../../hooks/useCurrentTime';

const AdminProducts = () => {
    const { products, deleteProduct } = useAdmin();
    const navigate = useNavigate();
    const currentTime = useCurrentTime();

    return (
        <div>
            {/* Header with Title, Timestamp, and Actions */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <h1 style={{ fontSize: '2.5rem', margin: 0, textTransform: 'uppercase' }}>Products</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
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
                    <button
                        onClick={() => navigate('/admin/products/add')}
                        // better: use navigate from hook
                        style={{
                            padding: '12px 25px',
                            background: 'var(--accent-primary)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}>+ Add Product</button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Name</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Category</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Price</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Stock</th>
                            <th style={{ padding: '15px', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', color: '#fff', fontWeight: 'bold' }}>{product.name}</td>
                                <td style={{ padding: '15px', color: 'var(--text-muted)' }}>
                                    {categories.find(c => c.id === product.category)?.name || product.category}
                                </td>
                                <td style={{ padding: '15px', color: '#fff' }}>${product.price}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ color: product.stock < 10 ? 'red' : '#fff' }}>
                                        {product.stock} units
                                    </span>
                                </td>
                                <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                    <button style={{
                                        padding: '5px 10px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}>Edit</button>

                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        style={{
                                            padding: '5px 10px',
                                            background: 'rgba(255,0,0,0.2)',
                                            color: '#ff4444',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
