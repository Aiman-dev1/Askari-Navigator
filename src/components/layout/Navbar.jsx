import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-800 text-white px-8 py-4 flex justify-between">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-cyan-400">
        TowerNav
      </h1>

      {/* Menu */}
      <div className="flex gap-6">

        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>

      </div>

    </nav>
  );
}

export default Navbar;