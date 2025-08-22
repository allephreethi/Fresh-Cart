// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AppContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export function AppProvider({ children }) {
  // =================== STATE ===================
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profilePic, setProfilePic] = useState(() => {
    try {
      return localStorage.getItem("profilePic") || "";
    } catch {
      return "";
    }
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [location, setLocation] = useState({ city: "", lat: null, lng: null });

  // =================== HELPERS ===================
  const resetAppState = useCallback(() => {
    // wipe all user-scoped UI/data
    setUser(null);
    setProfilePic("");

    setCartItems([]);
    setWishlistItems([]);
    setAddresses([]);
    setNotifications([]);

    setCartOpen(false);
    setCheckoutOpen(false);
    setWishlistOpen(false);
    setNotificationsOpen(false);
    setLoginModalOpen(false);
    setLocationPopupOpen(false);

    setLocation({ city: "", lat: null, lng: null });
    // NOTE: do not force-reset theme if you want it global. If theme is user-specific, uncomment:
    // setDarkMode(false);
  }, []);

  // =================== LOCATION ===================
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation not supported", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation((prev) => ({ ...prev, lat: latitude, lng: longitude }));

        try {
          // 1️⃣ Nominatim
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          let city =
            res.data.address.city ||
            res.data.address.town ||
            res.data.address.village ||
            res.data.address.suburb ||
            res.data.address.state_district ||
            res.data.address.state ||
            "";

          if (!city && GOOGLE_KEY) {
            // 2️⃣ Google Maps fallback
            try {
              const gRes = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}`
              );
              const components = gRes.data.results[0]?.address_components || [];
              const cityComponent = components.find((c) => c.types.includes("locality"));
              const districtComponent = components.find((c) => c.types.includes("administrative_area_level_2"));
              const stateComponent = components.find((c) => c.types.includes("administrative_area_level_1"));
              city =
                cityComponent?.long_name ||
                districtComponent?.long_name ||
                stateComponent?.long_name ||
                "";
            } catch (gErr) {
              console.error("❌ Google Maps failed:", gErr.message);
            }
          }

          if (!city) {
            // 3️⃣ BigDataCloud fallback
            try {
              const res2 = await axios.get(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              city = res2.data.city || res2.data.locality || res2.data.principalSubdivision || "Unknown";
            } catch (err2) {
              console.error("❌ BigDataCloud failed:", err2.message);
            }
          }

          setLocation({ lat: latitude, lng: longitude, city });
        } catch (err) {
          console.error("❌ Location fetch failed:", err.message);
          showToast("Failed to fetch location", "error");
        }
      },
      (err) => {
        console.error("❌ Geolocation error:", err.message);
        showToast("Failed to get location", "error");
      }
    );
  };

  // =================== TOAST ===================
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 2000);
  };

  // =================== NOTIFICATIONS ===================
  const addNotification = (message, type = "info") => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearNotifications = () => setNotifications([]);
  const toggleNotifications = (state) => setNotificationsOpen(typeof state === "boolean" ? state : (prev) => !prev);

  // =================== SERVER FETCHERS (user-scoped) ===================
  const fetchCartItems = useCallback(
    async (userId = user?.id) => {
      if (!userId) return setCartItems([]);
      try {
        const res = await axios.get(`${API_URL}/cart/${userId}`);
        setCartItems(res.data || []);
      } catch (err) {
        console.error("❌ Fetch cart failed:", err.response?.data || err.message);
        setCartItems([]);
        showToast("Failed to fetch cart", "error");
      }
    },
    [user?.id]
  );

  const fetchWishlistItems = useCallback(
    async (userId = user?.id) => {
      if (!userId) return setWishlistItems([]);
      try {
        const res = await axios.get(`${API_URL}/wishlist/${userId}`);
        const normalized = (res.data || []).map((item) => ({
          ...item,
          productId: item.ProductId || item.productId,
        }));
        setWishlistItems(normalized);
      } catch (err) {
        console.error("❌ Fetch wishlist failed:", err.response?.data || err.message);
        setWishlistItems([]);
        showToast("Failed to fetch wishlist", "error");
      }
    },
    [user?.id]
  );

  const fetchAddresses = useCallback(
    async (userId = user?.id) => {
      if (!userId) return setAddresses([]);
      try {
        const res = await axios.get(`${API_URL}/addresses/${userId}`);
        setAddresses(res.data || []);
      } catch (err) {
        console.error("❌ Fetch addresses failed:", err.response?.data || err.message);
        setAddresses([]);
      }
    },
    [user?.id]
  );

  const fetchServerNotifications = useCallback(
    async (userId = user?.id) => {
      if (!userId) return setNotifications([]);
      try {
        const res = await axios.get(`${API_URL}/notifications/${userId}`);
        setNotifications(res.data || []);
      } catch (err) {
        console.error("❌ Fetch notifications failed:", err.response?.data || err.message);
        setNotifications([]);
      }
    },
    [user?.id]
  );

  // =================== AUTH ===================
  const loginUser = async (userData) => {
    // 1) ensure clean slate before loading new account (prevents any old flash)
    setCartItems([]);
    setWishlistItems([]);
    setAddresses([]);
    setNotifications([]);

    // 2) set identity and persist
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // 3) UI feedback
    showToast(`Welcome ${userData.name || "User"}!`);
    // Optional: add a local welcome notification; will be replaced by server list when fetched
    // addNotification(`Welcome ${userData.name || "User"}!`, "success");

    // 4) fetch all user-scoped data in parallel
    try {
      await Promise.all([
        fetchCartItems(userData.id),
        fetchWishlistItems(userData.id),
        fetchAddresses(userData.id),
        fetchServerNotifications(userData.id),
      ]);
    } catch {
      // individual fetchers already handle their own errors
    }

    // 5) close any auth modal
    closeLoginModal();
  };

  const logoutUser = () => {
    // remove persisted identity first
    localStorage.removeItem("user");
    localStorage.removeItem("profilePic");

    // reset everything instantly so nothing from previous account is visible
    resetAppState();

    // user feedback (toast only; do NOT add to notifications to keep it clean for next login)
    showToast("Logged out successfully");
  };

  const updateProfilePic = (url) => {
    setProfilePic(url);
    localStorage.setItem("profilePic", url);
    showToast("Profile picture updated");
    // this is user-local UI state; not persisted server-side here
  };

  // =================== CART MUTATIONS ===================
  const addToCart = async (item, quantity = 1) => {
    if (!user) {
      showToast("Please login to add items", "error");
      openLoginModal();
      return;
    }
    try {
      await axios.post(`${API_URL}/cart/add`, {
        userId: user.id,
        productId: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity,
      });

      const existingItem = cartItems.find((i) => i.productId === item.id);
      if (existingItem) {
        setCartItems(
          cartItems.map((i) => (i.productId === item.id ? { ...i, quantity: i.quantity + quantity } : i))
        );
      } else {
        setCartItems([...cartItems, { id: Date.now(), productId: item.id, ...item, quantity }]);
      }

      showToast(`${item.title} added to cart`);
    } catch (err) {
      console.error("❌ Add to cart failed:", err.response?.data || err.message);
      showToast("Failed to add to cart", "error");
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (!user) return;
    if (newQty <= 0) return removeFromCart(productId);

    try {
      await axios.put(`${API_URL}/cart/update`, {
        userId: user.id,
        productId,
        quantity: newQty,
      });
      setCartItems(cartItems.map((i) => (i.productId === productId ? { ...i, quantity: newQty } : i)));
      showToast("Updated quantity in cart", "success");
    } catch (err) {
      console.error("❌ Update quantity failed:", err.response?.data || err.message);
      showToast("Failed to update quantity", "error");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await axios.delete(`${API_URL}/cart/remove/${user.id}/${productId}`);
      setCartItems(cartItems.filter((i) => i.productId !== productId));
      showToast("Item removed from cart", "success");
    } catch (err) {
      console.error("❌ Remove from cart failed:", err.response?.data || err.message);
      showToast("Failed to remove item", "error");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await axios.post(`${API_URL}/cart/checkout`, { userId: user.id });
      setCartItems([]);
      showToast("Cart cleared", "success");
    } catch (err) {
      console.error("❌ Clear cart failed:", err.response?.data || err.message);
      showToast("Failed to clear cart", "error");
    }
  };

  const getQuantityInCart = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  // =================== WISHLIST MUTATIONS ===================
  const toggleWishlistItem = async (item) => {
    if (!user) {
      showToast("Please login to use wishlist", "error");
      openLoginModal();
      return;
    }

    const exists = wishlistItems.find((i) => i.productId === item.id);

    if (exists) {
      try {
        await axios.delete(`${API_URL}/wishlist/remove/${user.id}/${item.id}`);
        setWishlistItems(wishlistItems.filter((i) => i.productId !== item.id));
        showToast(`${item.title} removed from wishlist`, "success");
      } catch (err) {
        console.error("❌ Remove wishlist failed:", err.response?.data || err.message);
        showToast("Failed to remove from wishlist", "error");
      }
    } else {
      try {
        const res = await axios.post(`${API_URL}/wishlist/add`, {
          userId: user.id,
          productId: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
        });

        const newItem = {
          id: res.data?.id || Date.now(),
          productId: res.data?.productId || item.id,
          title: res.data?.title || item.title,
          price: res.data?.price || item.price,
          image: res.data?.image || item.image,
        };

        setWishlistItems((prev) => (prev.some((i) => i.productId === newItem.productId) ? prev : [...prev, newItem]));

        showToast(`${item.title} added to wishlist`, "success");
      } catch (err) {
        console.error("❌ Add wishlist failed:", err.response?.data || err.message);
        showToast("Failed to add to wishlist", "error");
      }
    }
  };

  const isInWishlist = (id) => wishlistItems.some((i) => i.productId === id);

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await axios.delete(`${API_URL}/wishlist/remove/${user.id}/${productId}`);
      setWishlistItems((prev) => prev.filter((i) => i.productId !== productId));
      showToast("Item removed from wishlist", "success");
    } catch (err) {
      console.error("❌ Remove wishlist failed:", err.response?.data || err.message);
      showToast("Failed to remove item", "error");
    }
  };

  const clearWishlist = async () => {
    if (!user) return;
    try {
      await axios.delete(`${API_URL}/wishlist/clear/${user.id}`);
      setWishlistItems([]);
      showToast("Wishlist cleared", "success");
    } catch (err) {
      console.error("❌ Clear wishlist failed:", err.response?.data || err.message);
      showToast("Failed to clear wishlist", "error");
    }
  };

  // =================== MODALS & UI ===================
  const toggleCart = () => setCartOpen((prev) => !prev);
  const toggleCheckout = (value) => setCheckoutOpen(value ?? !checkoutOpen);
  const toggleWishlist = (state) => setWishlistOpen(typeof state === "boolean" ? state : (prev) => !prev);
  const openLocationPopup = () => {
    setLocationPopupOpen(true);
    fetchLocation();
  };
  const closeLocationPopup = () => setLocationPopupOpen(false);
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  // =================== EFFECTS ===================
  // Keep in sync if user is restored/changed (e.g., after refresh or storage change)
  useEffect(() => {
    if (user?.id) {
      // load data for the active session
      fetchCartItems();
      fetchWishlistItems();
      fetchAddresses();
      fetchServerNotifications();
    } else {
      // if no user (e.g., after logout) make sure state is empty
      resetAppState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Optional: react to `storage` events (multi-tab logout/login)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        const next = e.newValue ? JSON.parse(e.newValue) : null;
        if (!next) {
          // someone logged out in another tab
          resetAppState();
        } else {
          // logged in from another tab
          setUser(next);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [resetAppState]);

  // =================== CONTEXT ===================
  return (
    <AppContext.Provider
      value={{
        // Cart
        cartItems,
        setCartItems, // exposed for places like Checkout
        cartOpen,
        toggleCart,
        checkoutOpen,
        toggleCheckout,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getQuantityInCart,
        fetchCartItems,

        // Wishlist
        wishlistItems,
        wishlistOpen,
        toggleWishlist,
        toggleWishlistItem,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlistItems,

        // Addresses
        addresses,
        setAddresses,
        fetchAddresses,

        // Notifications
        notifications,
        notificationsOpen,
        toggleNotifications,
        addNotification,
        removeNotification,
        clearNotifications,
        fetchServerNotifications,

        // Location
        location,
        fetchLocation,
        locationPopupOpen,
        openLocationPopup,
        closeLocationPopup,

        // Auth
        user,
        profilePic,
        loginUser,
        logoutUser,
        updateProfilePic,
        loginModalOpen,
        openLoginModal,
        closeLoginModal,

        // Toast
        toastMessage,
        toastType,
        showToast,

        // UI
        darkMode,
        toggleDarkMode: () => setDarkMode((prev) => !prev),

        // Utilities
        resetAppState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}
