import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { useSidebar } from './context/SidebarContext';

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

export default function App() {
  const {
    locationPopupOpen,
    toastMessage,
    toastType,
    wishlistOpen,
    cartOpen,
  } = useAppContext();
  const { isExpanded } = useSidebar();

  // Determine the right margin based on panel state
  let rightMargin = 'mr-0';
  if (cartOpen) {
    rightMargin = 'mr-96'; // 24rem for CartPanel
  } else if (wishlistOpen) {
    rightMargin = 'mr-80'; // 20rem for WishlistPanel
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isExpanded ? 'ml-48' : 'ml-16'
        } ${rightMargin}`}
      >
        <Header />
        <main className="flex-1 p-4 mt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:categorySlug" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/help" element={<Help />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <div className="w-full">
        <Footer />
      </div>

      {/* Panels */}
      <WishlistPanel />
      <NotificationPanel />
      <CartPanel />
      <FloatingCartButton />

      {/* Location Popup */}
      {locationPopupOpen && <LocationPopup />}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 text-white px-5 py-3 rounded-xl shadow-lg z-50 animate-fade-in-out transition-all duration-300 ${
            toastType === 'error'
              ? 'bg-gradient-to-r from-red-500 to-red-700'
              : 'bg-gradient-to-r from-green-500 to-green-700'
          }`}
        >
          {toastMessage}
        </div>
      )}
    </BrowserRouter>
  );
}
