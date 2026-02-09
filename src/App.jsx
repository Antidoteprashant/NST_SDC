<<<<<<< HEAD
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
=======
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';

// Context
import { CartProvider } from './context/CartContext';
import { ShopProvider } from './context/ShopContext';

// Components
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedCheckoutRoute from './components/ProtectedCheckoutRoute';

// Register standard plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div ref={mainRef} className="app-container">
      <ShopProvider>
        <CartProvider>
          <Navbar />
>>>>>>> 1a27a27 (second commit)

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

<<<<<<< HEAD
          {/* Catch all redirect to admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminProvider>
=======
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          </Routes>

          <Footer />
        </CartProvider>
      </ShopProvider>
>>>>>>> 1a27a27 (second commit)
    </div>
  );
}

export default App;
