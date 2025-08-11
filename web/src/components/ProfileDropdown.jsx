import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, PackageCheck, Settings, ShoppingBag, HelpCircle, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const fileInputRef = useRef();

  const { profilePic, updateProfilePic, logoutUser, user } = useAppContext();

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfilePic(reader.result); // Save to context (and localStorage)
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleToggle} className="flex items-center gap-1">
        <img
          src={profilePic || "https://i.pravatar.cc/40"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-50">
          <div className="flex flex-col items-center py-4 border-b">
            <div className="relative">
              <img
                src={profilePic || "https://i.pravatar.cc/80"}
                alt="Profile Large"
                className="w-16 h-16 rounded-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full"
              >
                <Camera size={14} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <p className="mt-2 font-medium">{user?.name || 'Guest User'}</p>
          </div>

          <ul className="text-sm text-gray-700">
            <DropdownItem icon={<PackageCheck size={16} />} to="/orders" label="My Orders" />
            <DropdownItem icon={<ShoppingBag size={16} />} to="/products" label="Products" />
            <DropdownItem icon={<Settings size={16} />} to="/account-settings" label="Account Settings" />
            <DropdownItem icon={<HelpCircle size={16} />} to="/help" label="Help" />
            <li>
              <button
                onClick={() => {
                  logoutUser();
                  setOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <LogOut size={16} />
                <span className="ml-2">Logout</span>
              </button>
            </li>
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
