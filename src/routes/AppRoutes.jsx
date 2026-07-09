import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import BuildingAdminDashboard from "../pages/BuildingAdminDashboard";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import Navigation from "../pages/Navigation";
import Chat from "../pages/Chat";
import AIAssistant from "../pages/AIAssistant";
import Profile from "../pages/Profile";
import { useAuth } from "../context/AuthContext";

function Protected({ children, roles }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/user" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<Protected><UserDashboard /></Protected>} />
      <Route
        path="/building-admin"
        element={
          <Protected roles={["tenant_admin"]}>
            <BuildingAdminDashboard />
          </Protected>
        }
      />
      <Route
        path="/super-admin"
        element={
          <Protected roles={["super_admin"]}>
            <SuperAdminDashboard />
          </Protected>
        }
      />
      <Route path="/navigation" element={<Protected><Navigation /></Protected>} />
      <Route path="/chat" element={<Protected><Chat /></Protected>} />
      <Route path="/ai" element={<Protected><AIAssistant /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
    </Routes>
  );
}

export default AppRoutes;
