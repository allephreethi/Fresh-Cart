import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAppContext } from './context/AppContext'; // Your existing app context
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

import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Help from './pages/Help';
import AccountSettings from './pages/AccountSettings';

import AuthTabs from './components/AuthTabs'; // combined login/signup component

// Protect routes - if user not logged in, redirect to login
function PrivateRoute({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const {
    locationPopupOpen,
    toastMessage,
    toastType,
    wishlistOpen,
    cartOpen,
  } = useAppContext();

  const { isExpanded } = useSidebar();

  // Adjust right margin for panels
  let rightMargin = 'mr-0';
  if (cartOpen) rightMargin = 'mr-96';
  else if (wishlistOpen) rightMargin = 'mr-80';

  return (
    <UserProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          className={`flex flex-col min-h-screen transition-all duration-300 ${
            isExpanded ? 'ml-48' : 'ml-16'
          } ${rightMargin}`}
        >
          <Header />

          <main className="flex-1 p-4 mt-14 pb-16">
            <Routes>
              {/* Protected routes */}
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

              {/* Combined auth route */}
              <Route path="/auth" element={<AuthTabs />} />

              {/* Redirect legacy login/signup routes to /auth */}
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/signup" element={<Navigate to="/auth" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <Footer />

        {/* Panels */}
        <WishlistPanel />
        <NotificationPanel />
        <CartPanel />
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
