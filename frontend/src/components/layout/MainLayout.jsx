import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIAssistantWidget from "../common/AIAssistantWidget";

function MainLayout({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isHome =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <Navbar isHome={isHome} />
      <main>{children}</main>
      {(location.pathname === "/" || (isAuthenticated && !isHome)) && <AIAssistantWidget />}
      <Footer />
    </>
  );
}

export default MainLayout;
