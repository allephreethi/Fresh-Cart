// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAppContext } from './context/AppContext';
import { useSidebar } from './context/SidebarContext';
import { UserProvider, useUser } from './context/UserContext';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WishlistPanel from './components/WishlistPanel';
import NotificationPanel from './components/NotificationPanel';
import LocationPopup from './components/LocationPopup';
import Footer from './components/Footer';
import FloatingCartButton from './components/FloatingCartButton';
import CartPanel from './components/CartPanel';
import Checkout from './pages/Checkout';

import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Help from './pages/Help';
import AccountSettings from './pages/AccountSettings';

import AuthTabs from './components/AuthTabs'; // combined login/signup component

// Private route wrapper
function PrivateRoute({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const { locationPopupOpen, toastMessage, toastType, wishlistOpen, cartOpen, checkoutOpen } =
    useAppContext();
  const { isExpanded } = useSidebar();

  // Calculate dynamic right margin based on open panels
  const panelWidth = 384; // 96 * 4 = 24rem for cart/checkout
  let rightOffset = 0;
  if (checkoutOpen) rightOffset = panelWidth;
  else if (cartOpen) rightOffset = panelWidth;
  else if (wishlistOpen) rightOffset = 320; // 80 * 4 = 20rem

  return (
    <UserProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <motion.div
          animate={{ marginRight: rightOffset }}
          transition={{ type: 'tween', duration: 0.3 }}
          className={`flex flex-col min-h-screen transition-all duration-300 ${
            isExpanded ? 'ml-48' : 'ml-16'
          }`}
        >
          <Header />

          <main className="flex-1 p-4 mt-14 pb-16">
            <Routes>
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                }
              />
              <Route
                path="/products/:categorySlug"
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <PrivateRoute>
                    <Help />
                  </PrivateRoute>
                }
              />
              <Route
                path="/account-settings"
                element={
                  <PrivateRoute>
                    <AccountSettings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />

              {/* Auth Routes */}
              <Route path="/auth" element={<AuthTabs />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/signup" element={<Navigate to="/auth" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </motion.div>

        {/* Footer */}
        <Footer />

        {/* Panels */}
        <WishlistPanel />
        <NotificationPanel />
        <CartPanel />
        <Checkout />
        <FloatingCartButton />

        {/* Location Permission Popup */}
        {locationPopupOpen && <LocationPopup />}

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-fade-in-out transition-all duration-300 ${
              toastType === 'error'
                ? 'bg-gradient-to-r from-red-500 to-red-700'
                : 'bg-gradient-to-r from-green-500 to-green-700'
            }`}
            role="alert"
            aria-live="polite"
          >
            {toastMessage}
          </div>
        )}
      </BrowserRouter>
    </UserProvider>
  );
}
