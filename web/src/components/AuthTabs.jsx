// src/components/AuthTabs.jsx
import React, { useState } from "react";
import LoginForm from "./LoginForm";   // adjust import path
import SignupForm from "./SignupForm"; // adjust import path

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-tabs-container">
      <style>{`
        .auth-tabs-container {
          max-width: 400px;
          margin: 40px auto;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border-radius: 8px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: white;
        }
        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
          gap: 8px;
        }
        .tab-btn {
          flex: 1;
          padding: 12px 0;
          cursor: pointer;
          border: none;
          background: none;
          font-weight: 600;
          font-size: 18px;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: color 0.3s, border-bottom-color 0.3s;
          border-radius: 4px 4px 0 0;
        }
        .tab-btn.active {
          color: #22c55e;
          border-bottom-color: #22c55e;
          font-weight: 700;
          background-color: #e6f4ea;
        }
      `}</style>

      <div className="tabs" role="tablist">
        <button
          className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
          role="tab"
          aria-selected={activeTab === "login"}
          aria-controls="login-panel"
          id="login-tab"
          type="button"
        >
          Login
        </button>
        <button
          className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => setActiveTab("signup")}
          role="tab"
          aria-selected={activeTab === "signup"}
          aria-controls="signup-panel"
          id="signup-tab"
          type="button"
        >
          Sign Up
        </button>
      </div>

      <div
        id="login-panel"
        role="tabpanel"
        aria-labelledby="login-tab"
        hidden={activeTab !== "login"}
      >
        {activeTab === "login" && <LoginForm />}
      </div>

      <div
        id="signup-panel"
        role="tabpanel"
        aria-labelledby="signup-tab"
        hidden={activeTab !== "signup"}
      >
        {activeTab === "signup" && <SignupForm />}
      </div>
    </div>
  );
}
