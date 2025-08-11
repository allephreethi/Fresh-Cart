import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // adjust path if needed

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { loginUser } = useUser(); // get loginUser from context to set user globally

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response data:", res.data);
      console.log("User object in response:", res.data.user);

      if (
        res.data &&
        res.data.message === "Login successful" &&
        res.data.user
      ) {
        // Save user data to context (global state)
        loginUser(res.data.user);

        // Optionally save to localStorage/sessionStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect to homepage (adjust route as needed)
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }}
      />

      <button
        type="submit"
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Login
      </button>
    </form>
  );
}
