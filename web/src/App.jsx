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
  const { locationPopupOpen, toastMessage, toastType } = useAppContext();
  const { isExpanded } = useSidebar();

  return (
    <BrowserRouter>
      <Sidebar />

      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isExpanded ? 'ml-48' : 'ml-16'
        }`}
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
          </Routes>
        </main>
      </div>

      <div className="w-full">
        <Footer />
      </div>

      <WishlistPanel />
      <NotificationPanel />
      <CartPanel />
      <FloatingCartButton />

      {locationPopupOpen && <LocationPopup />}

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
