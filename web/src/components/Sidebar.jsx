import {
  Home,
  Package,
  ShoppingCart,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { motion } from 'framer-motion';

const menuItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/account-settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar() {
  const { isExpanded, toggleSidebar, setHover } = useSidebar();
  const location = useLocation();

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`fixed top-16 left-0 z-10 h-[calc(100vh-4rem)] border-r bg-white shadow-lg flex flex-col justify-between transition-all duration-300
        ${isExpanded ? 'w-52' : 'w-14'}
      `}
    >
      {/* Profile */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <motion.img
          whileHover={{ scale: 1.1 }}
          src="/img/profile.png"
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 px-2 py-4 gap-1">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <SidebarItem
            key={label}
            to={to}
            icon={<Icon size={20} />}
            label={label}
            isExpanded={isExpanded}
            isActive={location.pathname === to}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="mb-4 px-2">
        <button className="group flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-100 rounded-md transition-all">
          <LogOut size={20} />
          {isExpanded && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}

function SidebarItem({ to, icon, label, isExpanded, isActive }) {
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium
        ${isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-green-50'}
      `}
    >
      <span>{icon}</span>
      {isExpanded ? (
        <span className="truncate">{label}</span>
      ) : (
        <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}
