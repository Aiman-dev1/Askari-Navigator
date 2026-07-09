// Thin fetch wrapper for the TowerNav backend.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("towernav_token");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("towernav_user"));
  } catch {
    return null;
  }
}

export function storeSession(token, user) {
  localStorage.setItem("towernav_token", token);
  localStorage.setItem("towernav_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("towernav_token");
  localStorage.removeItem("towernav_user");
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
