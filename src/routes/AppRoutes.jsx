import { Routes, Route } from "react-router-dom";

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
import ManageOffices from "../pages/ManageOffices";
import ManageFAQs from "../pages/ManageFAQs";
import FloorMaps from "../pages/FloorMaps";
import ChatModeration from "../pages/ChatModeration";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/building-admin" element={<BuildingAdminDashboard />} />
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      <Route path="/navigation" element={<Navigation />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/ai" element={<AIAssistant />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/manage-offices" element={<ManageOffices />} />
      <Route path="/manage-faqs" element={<ManageFAQs />} />
      <Route path="/floor-maps" element={<FloorMaps />} />
      <Route path="/chat-moderation" element={<ChatModeration />} />
    </Routes>
  );
}

export default AppRoutes;