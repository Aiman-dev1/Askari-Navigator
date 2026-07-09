import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar({ isHome }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md text-white px-8 py-4 flex justify-between items-center border-b border-gold-400/10 shadow-xl sticky top-0 z-50">

      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-serif font-bold tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
      >
        ASKARI TOWER
      </Link>

      {isHome ? (

        // Public Navbar

        <div className="flex items-center gap-8 text-sm uppercase tracking-wider font-medium">

          <a href="/" className="hover:text-gold-400 transition-colors duration-300">
            Home
          </a>

          <a href="#features" className="hover:text-gold-400 transition-colors duration-300">
            Features
          </a>

          <Link to="/login" className="hover:text-gold-400 transition-colors duration-300">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-5 py-2.5 rounded font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-400/10"
          >
            Get Started
          </Link>

        </div>

      ) : (

        // App Navbar

        <div className="flex items-center gap-6 text-sm uppercase tracking-wider font-semibold">

          <Link to="/user" className="hover:text-gold-400 transition-colors duration-300">Dashboard</Link>

          <Link to="/navigation" className="hover:text-gold-400 transition-colors duration-300">Navigation</Link>

          <Link to="/chat" className="hover:text-gold-400 transition-colors duration-300">Chat</Link>

          <Link to="/ai" className="hover:text-gold-400 transition-colors duration-300">AI</Link>

          <Link to="/profile" className="hover:text-gold-400 transition-colors duration-300">Profile</Link>

          <button
            onClick={handleLogout}
            className="border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded transition-all duration-300 cursor-pointer uppercase tracking-wider text-xs font-bold"
          >
            Logout
          </button>

        </div>

      )}

    </nav>
  );
}

export default Navbar;