import {
  Home,
  Package,
  ShoppingCart,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const menuItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/account-settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar() {
  const { isExpanded, setHover } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getProfileImageUrl, logoutUser } = useUser();

  const [sidebarHeight, setSidebarHeight] = useState(window.innerHeight - 64);

  // ===== Adjust sidebar height dynamically =====
  useEffect(() => {
    function updateSidebarHeight() {
      const headerHeight = 64;
      const footer = document.getElementById('footer');
      const viewportHeight = window.innerHeight;

      if (!footer) {
        setSidebarHeight(viewportHeight - headerHeight);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const footerTop = footerRect.top;
      const maxHeight = viewportHeight - headerHeight;
      const heightWithoutOverlap = footerTop - headerHeight;

      const newHeight = Math.min(maxHeight, heightWithoutOverlap);
      setSidebarHeight(newHeight > 100 ? newHeight : 100);
    }

    updateSidebarHeight();
    window.addEventListener('scroll', updateSidebarHeight);
    window.addEventListener('resize', updateSidebarHeight);
    return () => {
      window.removeEventListener('scroll', updateSidebarHeight);
      window.removeEventListener('resize', updateSidebarHeight);
    };
  }, []);

  function handleLogout() {
    logoutUser();
    navigate('/login');
  }

  function handleLogin() {
    navigate('/login');
  }

  // ===== Get real-time profile image =====
  const profileImageUrl = user ? getProfileImageUrl() : null;

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        top: 64,
        left: 0,
        zIndex: 10,
        width: isExpanded ? 208 : 56,
        height: sidebarHeight,
        borderRight: '1px solid #e5e7eb',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.3s ease, height 0.3s ease',
        overflowY: 'hidden',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Profile or Login Button */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-2">
        {user ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={profileImageUrl || `${process.env.PUBLIC_URL}/img/profile.png`}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
            style={{ flexShrink: 0 }}
          />
        ) : (
          <button
            onClick={handleLogin}
            className="w-full text-green-600 font-semibold hover:underline"
            aria-label="Login"
          >
            {isExpanded ? 'Login' : '🔑'}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex flex-col flex-1 px-2 py-4 gap-1 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: 'thin', minWidth: 0 }}
      >
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
      {user && (
        <div className="mb-4 px-2" style={{ minWidth: 0 }}>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-100 rounded-md transition-all whitespace-nowrap"
            style={{ minWidth: 0, overflow: 'hidden' }}
            aria-label="Logout"
          >
            <LogOut size={20} />
            {isExpanded && <span className="text-sm truncate">Logout</span>}
          </button>
        </div>
      )}
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
      style={{ minWidth: 0 }}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      {isExpanded ? (
        <span className="truncate" style={{ minWidth: 0 }}>
          {label}
        </span>
      ) : (
        <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}
