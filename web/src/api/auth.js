const API_BASE = "http://localhost:5000/api/auth";

export async function signup(name, email, password) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).error || "Failed to signup");
  }
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).error || "Failed to login");
  }
  return res.json();
}
