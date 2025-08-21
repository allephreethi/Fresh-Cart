// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ===== User state =====
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ===== Profile pic state =====
  const [profilePic, setProfilePic] = useState(() => {
    const savedPic = localStorage.getItem("profilePic");
    if (savedPic) return savedPic;
    return user?.profileImage || null;
  });

  // ===== Sync user & profilePic with localStorage =====
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (profilePic) {
      localStorage.setItem("profilePic", profilePic);
    } else {
      localStorage.removeItem("profilePic");
    }
  }, [user, profilePic]);

  // ===== Update user info =====
  const updateUser = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
    if (updated.profileImage) setProfilePic(updated.profileImage);
  };

  // ===== Update profile picture only =====
  const updateProfilePic = (pic) => {
    setProfilePic(pic);
    setUser((prev) => (prev ? { ...prev, profileImage: pic } : prev));
  };

  // ===== Get profile image URL =====
  const getProfileImageUrl = () => {
    const img = profilePic || user?.profileImage;
    if (!img) return `${process.env.PUBLIC_URL}/img/profile.png`;
    return img.startsWith("http") || img.startsWith("data:image")
      ? img
      : `${API_URL}/uploads/profile/${img}`;
  };

  // ===== Login =====
  const loginUser = async (credentials) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setUser(data.user);
      if (data.user?.profileImage) setProfilePic(data.user.profileImage);
      if (data.token) localStorage.setItem("token", data.token);

      return data.user;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  // ===== Logout =====
  const logoutUser = () => {
    setUser(null);
    setProfilePic(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profilePic,
        updateUser,
        updateProfilePic,
        getProfileImageUrl,
        loginUser,
        logoutUser,
        setUser,
        setProfilePic,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
