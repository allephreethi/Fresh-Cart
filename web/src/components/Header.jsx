// src/components/Header.jsx
import {
  Bell,
  Heart,
  MapPin,
  ChevronDown,
  Search,
  X,
  Menu,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext";
import { useAppContext } from "../context/AppContext";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityName, setCityName] = useState("Detecting...");

  const searchInputRef = useRef(null);
  const { toggleSidebar } = useSidebar();
  const { toggleWishlist, toggleNotifications, openLocationPopup } = useAppContext();
  const { user, getProfileImageUrl, logoutUser } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  // ===== Search debounce =====
  useEffect(() => {
    if (!isSearchFocused) return;
    const delayDebounce = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      } else if (location.pathname.startsWith("/products")) {
        navigate("/products");
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, isSearchFocused, location.pathname, navigate]);

  // ===== Get user location (city) =====
  useEffect(() => {
    if (!navigator.geolocation) {
      setCityName("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const addr = data.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            addr.state_district ||
            addr.state ||
            "Unknown";

          setCityName(city);
        } catch (error) {
          console.error("Error fetching city:", error);
          setCityName("Unknown");
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setCityName("Unknown");
      },
      { timeout: 10000 }
    );
  }, []);

  // ===== Dynamic Profile Image URL =====
  const profileImageUrl = getProfileImageUrl();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md shadow z-50 border-b px-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <img
          src={`${process.env.PUBLIC_URL}/img/logo.png`}
          alt="Logo"
          className="h-8 sm:h-9 w-auto"
        />
        <motion.button
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-green-600"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </motion.button>
        <button className="hidden sm:inline-block ml-1 px-3 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-green-700 via-green-500 to-lime-400 hover:from-green-600 hover:to-lime-300 transition-all">
          Premium++
        </button>
      </div>

      {/* Center: Search */}
      <div className="relative flex-grow max-w-md mx-2 hidden sm:block">
        <Search
          className="absolute left-3 top-2.5 text-gray-400 cursor-pointer hover:text-green-600"
          size={18}
          onClick={() => searchInputRef.current?.focus()}
        />
        {searchQuery && (
          <X
            onClick={() => {
              setSearchQuery("");
              if (location.pathname.startsWith("/products")) navigate("/products");
            }}
            className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-red-500"
            size={18}
          />
        )}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search groceries, brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={`pl-10 pr-8 py-2 w-full rounded-full border ${
            isSearchFocused ? "border-green-500" : "border-gray-300"
          } text-sm bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Heart
          size={20}
          onClick={() => toggleWishlist(true)}
          className="text-gray-600 hover:text-green-600 cursor-pointer"
        />
        <Bell
          size={20}
          onClick={() => toggleNotifications(true)}
          className="text-gray-600 hover:text-green-600 cursor-pointer"
        />
        <div
          onClick={openLocationPopup}
          className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-green-600 cursor-pointer text-sm"
        >
          <MapPin size={18} />
          <span className="hidden md:inline">{cityName}</span>
        </div>

        {/* Profile */}
        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onMouseEnter={() => user && setDropdownOpen(true)}
          onMouseLeave={() => user && setDropdownOpen(false)}
          onClick={() => {
            if (!user) {
              const hasSignedUp = localStorage.getItem("hasSignedUp") === "true";
              navigate(hasSignedUp ? "/login" : "/signup");
            }
          }}
        >
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 object-cover"
          />
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {user ? user.name : "Login"}
          </span>
          {user && <ChevronDown className="text-gray-500" size={16} />}

          <AnimatePresence>
            {user && isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-48 bg-white border rounded shadow-md z-50"
              >
                <ul className="text-sm text-gray-700 divide-y">
                  <li>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account-settings"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Help
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logoutUser();
                        setDropdownOpen(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
