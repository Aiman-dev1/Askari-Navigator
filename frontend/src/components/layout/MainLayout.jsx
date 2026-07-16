import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIAssistantWidget from "../common/AIAssistantWidget";
import { useAuth } from "../../context/AuthContext";

function MainLayout({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isHome =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <Navbar isHome={isHome} />
      <main className="min-h-screen pb-24 sm:pb-28">{children}</main>
      {(location.pathname === "/" || (isAuthenticated && !isHome)) && <AIAssistantWidget />}
      <Footer />
    </>
  );
}

export default MainLayout;
