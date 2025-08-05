import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FaBell, FaTimes } from 'react-icons/fa';

export default function NotificationPanel() {
  const { notificationsOpen, closeNotifications } = useAppContext();

  if (!notificationsOpen) return null;

  return (
    <div
      className="fixed right-4 top-16 w-80 max-h-[80vh] overflow-y-auto z-50 p-4 rounded-xl shadow-lg transition-transform animate-slide-in"
      style={{
        background: 'linear-gradient(to bottom, white 0%, #E8FFD7 100%)',
        border: '1px solid #93DA97',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-[#347B3F]">
          <FaBell /> Notifications
        </h2>
        <button
          onClick={closeNotifications}
          className="text-gray-600 hover:text-black"
        >
          <FaTimes />
        </button>
      </div>

      {/* Notification List */}
      <ul className="space-y-3">
        <li className="p-3 bg-white/70 border border-[#93DA97] rounded shadow-sm">
          🔔 Your order has been shipped!
        </li>
        <li className="p-3 bg-white/70 border border-[#93DA97] rounded shadow-sm">
          🎁 New offer available in your area.
        </li>
      </ul>
    </div>
  );
}
