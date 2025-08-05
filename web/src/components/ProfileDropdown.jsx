import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, PackageCheck, Settings, ShoppingBag, HelpCircle } from 'lucide-react';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleToggle = () => setOpen(!open);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleToggle} className="flex items-center gap-1">
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <ul className="text-sm text-gray-700">
            <DropdownItem icon={<PackageCheck size={16} />} to="/orders" label="My Orders" />
            <DropdownItem icon={<ShoppingBag size={16} />} to="/products" label="Products" />
            <DropdownItem icon={<Settings size={16} />} to="/account-settings" label="Account Settings" />
            <DropdownItem icon={<HelpCircle size={16} />} to="/help" label="Help" />
            <DropdownItem icon={<LogOut size={16} />} to="/login" label="Login" />
          </ul>
        </div>
      )}
    </div>
  );
}

function DropdownItem({ icon, to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center px-4 py-2 hover:bg-gray-100"
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Link>
    </li>
  );
}
