import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import BuildingAdminDashboard from "../pages/BuildingAdminDashboard";
import BuildingAdminFaqs from "../pages/BuildingAdminFaqs";
import BuildingAdminFloorMaps from "../pages/BuildingAdminFloorMaps";
import InfoSheet from "../pages/InfoSheet";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import SuperAdminLogsPage from "../pages/SuperAdminLogsPage";
import BuildingAdminLogsPage from "../pages/BuildingAdminLogsPage";
import Navigation from "../pages/Navigation";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import { useSelector } from "react-redux";

function Protected({ children, roles }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
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
        path="/building-admin/faqs"
        element={
          <Protected roles={["tenant_admin"]}>
            <BuildingAdminFaqs />
          </Protected>
        }
      />
      <Route
        path="/building-admin/floor-maps"
        element={
          <Protected roles={["tenant_admin"]}>
            <BuildingAdminFloorMaps />
          </Protected>
        }
      />
      <Route
        path="/building-admin/info-sheet"
        element={
          <Protected roles={["tenant_admin"]}>
            <InfoSheet />
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
      <Route
        path="/super-admin/logs"
        element={
          <Protected roles={["super_admin"]}>
            <SuperAdminLogsPage />
          </Protected>
        }
      />
      <Route
        path="/building-admin/logs"
        element={
          <Protected roles={["tenant_admin"]}>
            <BuildingAdminLogsPage />
          </Protected>
        }
      />
      <Route path="/navigation" element={<Protected><Navigation /></Protected>} />
      <Route path="/chat" element={<Protected><Chat /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
    </Routes>
  );
}

export default AppRoutes;
