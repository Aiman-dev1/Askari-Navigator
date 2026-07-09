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
    <nav className="bg-slate-900 text-white px-10 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">

      {/* Logo */}
      <Link
        to="/"
        className="text-3xl font-bold text-cyan-400"
      >
        TowerNav
      </Link>

      {isHome ? (

        // Public Navbar

        

        <div className="flex items-center gap-8">

          <a href="/" className="hover:text-cyan-400">
            Home
          </a>

          <a href="#features" className="hover:text-cyan-400">
            Features
          </a>

          {/* <a href="#about" className="hover:text-cyan-400">
            About
          </a> */}

          <Link to="/login" className="hover:text-cyan-400">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg"
          >
            Get Started
          </Link>

        </div>

      ) : (

        // App Navbar

        <div className="flex items-center gap-6 text-sm">

          <Link to="/user">Dashboard</Link>

          {/* <Link to="/directory">Directory</Link> */}

          <Link to="/navigation">Navigation</Link>

          <Link to="/chat">Chat</Link>

          <Link to="/ai">AI</Link>

          <Link to="/profile">Profile</Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg cursor-pointer"
          >
            Logout
          </button>

        </div>

      )}

    </nav>
  );
}

export default Navbar;