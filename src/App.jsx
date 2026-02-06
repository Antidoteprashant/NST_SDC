import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import TrackOrderPage from './pages/TrackOrderPage';
import { CartProvider } from './context/CartContext';

import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Register standard plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef(null);

  // ... (useLayoutEffect omitted for brevity unless changing)

  useLayoutEffect(() => {
    // Global animation context
    const ctx = gsap.context(() => {
      // Any global scroll triggers or listeners can go here
    }, mainRef);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Synchronize Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    // This promotes better performance than running two RAF loops
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP gives time in seconds, Lenis needs ms
    });

    // Disable GSAP lag smoothing to prevent stuttering with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div ref={mainRef} className="app-container">
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </div>
  );
}

export default App;
