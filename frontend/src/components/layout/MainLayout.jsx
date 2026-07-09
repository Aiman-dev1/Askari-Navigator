import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout({ children }) {
  const location = useLocation();

  const isHome =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <Navbar isHome={isHome} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default MainLayout;