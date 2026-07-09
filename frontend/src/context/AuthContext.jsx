import { createContext, useContext, useState } from "react";
import { api, storeSession, clearSession, getStoredUser, getToken } from "../lib/api";
import { disconnectSocket } from "../lib/socket";

const AuthContext = createContext(null);

// Default building for this deployment (seeded as "Apex Tower")
export const DEFAULT_TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || "apex-tower";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const finishLogin = (data) => {
    storeSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) =>
    finishLogin(await api.post("/auth/login", { email, password }));

  const register = async (username, email, password) =>
    finishLogin(
      await api.post("/auth/register", {
        username,
        email,
        password,
        tenantSlug: DEFAULT_TENANT_SLUG,
      })
    );

  const guestLogin = async (username) =>
    finishLogin(await api.post("/auth/guest", { username, tenantSlug: DEFAULT_TENANT_SLUG }));

  const logout = () => {
    disconnectSocket();
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!getToken(), login, register, guestLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Where to send a user after login, based on their role
export function homeRouteFor(user) {
  if (user?.role === "super_admin") return "/super-admin";
  if (user?.role === "tenant_admin") return "/building-admin";
  return "/user";
}
