import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch {
      setLoading(false);
      setMessage('Network error');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 320,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
      aria-live="polite"
    >
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoFocus
        style={{ padding: 8, fontSize: 16 }}
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: 8, fontSize: 16 }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: 8, fontSize: 16 }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 20px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          fontWeight: 'bold',
          fontSize: 16,
          borderRadius: 4,
        }}
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
      {message && (
        <p
          style={{
            color: message.includes('successful') ? 'green' : 'red',
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
