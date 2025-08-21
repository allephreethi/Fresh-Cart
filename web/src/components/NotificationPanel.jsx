import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FaBell, FaTimes } from 'react-icons/fa';

export default function NotificationPanel() {
  const {
    notificationsOpen,
    toggleNotifications,
    notifications,
    removeNotification,
  } = useAppContext();

  if (!notificationsOpen) return null;

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800";
      case "error":
        return "bg-red-100 border-red-400 text-red-800";
      case "info":
      default:
        return "bg-blue-100 border-blue-400 text-blue-800";
    }
  };

  return (
    <div
      className="fixed right-4 top-16 w-80 max-h-[80vh] overflow-y-auto z-50 p-4 rounded-xl shadow-lg animate-slide-in transition-transform"
      style={{
        background: 'linear-gradient(to bottom, white 0%, #E8FFD7 100%)',
        border: '1px solid #93DA97',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-[#347B3F]">
          <FaBell /> Notifications
        </h2>
        <button
          onClick={() => toggleNotifications(false)}
          className="text-gray-600 hover:text-black"
        >
          <FaTimes />
        </button>
      </div>

      {/* Notification List */}
      <ul className="space-y-3">
        {notifications.length === 0 && (
          <li className="p-3 bg-white/70 border border-[#93DA97] rounded shadow-sm text-gray-500 text-sm">
            No notifications
          </li>
        )}

        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-3 border rounded shadow-sm flex justify-between items-start animate-fade-in ${getBgColor(notif.type)}`}
          >
            <span>{notif.message}</span>
            <button
              onClick={() => removeNotification(notif.id)}
              className="ml-2 text-gray-400 hover:text-black"
            >
              <FaTimes />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
