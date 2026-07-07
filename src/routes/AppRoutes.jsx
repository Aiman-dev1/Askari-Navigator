import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import BuildingAdminDashboard from "../pages/BuildingAdminDashboard";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/building-admin" element={<BuildingAdminDashboard />} />
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
    </Routes>
  );
}

export default AppRoutes;