import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}

export default MainLayout;