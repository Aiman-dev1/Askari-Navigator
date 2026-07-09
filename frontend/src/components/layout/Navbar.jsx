import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth, homeRouteFor } from "../../context/AuthContext";

function Navbar({ isHome }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

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

          <Link to={homeRouteFor(user)} className="hover:text-gold-400 transition-colors duration-300">Dashboard</Link>

          {user?.role === "user" && (
            <Link to="/navigation" className="hover:text-gold-400 transition-colors duration-300">Navigation</Link>
          )}

          {/* Greeting + settings dropdown */}
          <div className="flex items-center gap-3 pl-4 border-l border-gold-400/20" ref={menuRef}>

            <span className="text-gold-400 font-serif normal-case tracking-normal text-sm">
              Hi, <span className="font-bold">{user?.username}</span>
            </span>

            <div className="relative">

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  menuOpen
                    ? "border-gold-400 text-gold-400 bg-slate-800"
                    : "border-gold-400/30 text-gray-300 hover:text-gold-400 hover:border-gold-400"
                }`}
              >
                <FiSettings size={16} className={menuOpen ? "rotate-90 transition-transform duration-300" : "transition-transform duration-300"} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-slate-900 border border-gold-400/20 rounded shadow-2xl overflow-hidden">

                  <div className="px-4 py-3 border-b border-gold-400/10">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Signed in as</p>
                    <p className="text-gold-400 font-serif font-bold text-sm truncate normal-case tracking-normal">
                      {user?.username}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider text-gray-300 hover:bg-slate-800 hover:text-gold-400 transition-colors"
                  >
                    <FiUser size={14} />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <FiLogOut size={14} />
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      )}

    </nav>
  );
}

export default Navbar;
