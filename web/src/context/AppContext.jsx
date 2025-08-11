// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // =================== STATE ===================
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Cart items from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error parsing cartItems from localStorage', err);
      return [];
    }
  });

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Location
  const [locationData, setLocationData] = useState({
    city: '',
    address: '',
    latitude: null,
    longitude: null,
  });

  // =================== AUTH STATE ===================
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profilePic, setProfilePic] = useState(() => {
    try {
      return localStorage.getItem('profilePic') || '';
    } catch {
      return '';
    }
  });

  // =================== LOGIN MODAL ===================
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  // =================== LOCALSTORAGE SYNC ===================
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (profilePic) {
      localStorage.setItem('profilePic', profilePic);
    } else {
      localStorage.removeItem('profilePic');
    }
  }, [profilePic]);

  // =================== AUTO LOCATION DETECTION ===================
  useEffect(() => {
    let isMounted = true;

    const getLocation = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported by your browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!isMounted) return;

          const { latitude, longitude } = position.coords;
          setLocationData(prev => ({ ...prev, latitude, longitude }));

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              {
                headers: {
                  'User-Agent': 'FreshCart/1.0 (support@freshcart.com)',
                  'Accept-Language': 'en',
                },
              }
            );

            const data = await res.json();
            if (data?.address) {
              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                '';

              setLocationData(prev => ({
                ...prev,
                address: data.display_name,
                city,
              }));
            }
          } catch (err) {
            console.error('Error fetching address:', err);
          }
        },
        (err) => {
          console.error('Geolocation error:', err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // =================== TOAST ===================
  const showToast = (message, type = 'success') => {
    setToastType(type);
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  };

  // =================== AUTH FUNCTIONS ===================
  const loginUser = (userData) => {
    setUser(userData);
    showToast(`Welcome ${userData.name || 'User'}!`, 'success');
    closeLoginModal();
  };

  const logoutUser = () => {
    setUser(null);
    setProfilePic('');
    showToast('Logged out successfully', 'success');
  };

  const updateProfilePic = (newPicUrl) => {
    setProfilePic(newPicUrl);
    showToast('Profile picture updated', 'success');
  };

  // =================== WISHLIST ===================
  const toggleWishlist = (forceState = null) => {
    if (forceState === false) {
      setWishlistOpen(false);
      return;
    }
    if (forceState === true && wishlistItems.length === 0) {
      showToast('Your wishlist is empty!', 'error');
      return;
    }
    setWishlistOpen(prev => !prev);
  };

  const toggleWishlistItem = (item) => {
    setWishlistItems(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        const updated = prev.filter(p => p.id !== item.id);
        if (updated.length === 0) setWishlistOpen(false);
        showToast(`${item.title} removed from wishlist`, 'error');
        return updated;
      } else {
        showToast(`${item.title} added to wishlist`, 'success');
        return [...prev, item];
      }
    });
  };

  const isInWishlist = (id) => wishlistItems.some(item => item.id === id);

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      if (updated.length === 0) setWishlistOpen(false);
      return updated;
    });
    showToast(`Item removed from wishlist`, 'error');
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setWishlistOpen(false);
    showToast('Wishlist cleared', 'error');
  };

  // =================== CART ===================
  const toggleCart = (forceState = null) => {
    if (forceState === false) {
      setCartOpen(false);
      return;
    }
    if (forceState === true && cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    setCartOpen(prev => !prev);
  };

  const addToCart = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    showToast(`${item.title} added to cart`, 'success');
  };

  const updateQuantity = (id, amount) => {
    setCartItems(prev => {
      let removedItem;
      const updatedItems = prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + amount;
            if (newQty > 0) {
              return { ...item, quantity: newQty };
            } else {
              removedItem = item;
              return null;
            }
          }
          return item;
        })
        .filter(Boolean);

      if (removedItem) {
        showToast(`${removedItem.title} removed from cart`, 'error');
      }

      return updatedItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      if (updated.length === 0) setCartOpen(false);
      return updated;
    });
    showToast(`Item removed from cart`, 'error');
  };

  const getQuantityInCart = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // =================== NOTIFICATIONS ===================
  const toggleNotifications = () => {
    setNotificationsOpen(prev => !prev);
  };

  const openNotifications = () => setNotificationsOpen(true);
  const closeNotifications = () => setNotificationsOpen(false);

  // =================== LOCATION POPUP ===================
  const openLocationPopup = () => setLocationPopupOpen(true);
  const closeLocationPopup = () => setLocationPopupOpen(false);

  // =================== DARK MODE ===================
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // =================== CONTEXT VALUE ===================
  return (
    <AppContext.Provider
      value={{
        // Wishlist
        wishlistOpen,
        toggleWishlist,
        wishlistItems,
        toggleWishlistItem,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,

        // Cart
        cartOpen,
        toggleCart,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        getQuantityInCart,

        // Notifications
        notificationsOpen,
        openNotifications,
        closeNotifications,
        toggleNotifications,

        // Location
        locationPopupOpen,
        openLocationPopup,
        closeLocationPopup,
        locationData,
        setLocationData,

        // Toast
        toastMessage,
        toastType,
        showToast,

        // Dark Mode
        darkMode,
        toggleDarkMode,

        // Auth
        user,
        profilePic,
        loginUser,
        logoutUser,
        updateProfilePic,

        // Login Modal
        loginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
