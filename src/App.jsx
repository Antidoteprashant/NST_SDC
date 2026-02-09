import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminLogin from './pages/admin/AdminLogin';

// Context
import { AdminProvider } from './context/AdminContext';

// Components
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <div className="app-container">
      <AdminProvider>
        <Routes>
          {/* Redirect root to admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AdminAddProduct />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="logic" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          {/* Catch all redirect to admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminProvider>
    </div>
  );
}

export default App;
