import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSettings, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth, homeRouteFor } from "../../context/AuthContext";

function Navbar({ isHome }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  const [menuOpen, setMenuOpen]       = useState(false); // settings dropdown
  const [mobileOpen, setMobileOpen]   = useState(false); // hamburger drawer
  const menuRef = useRef(null);

  const handleLogout = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    logout();
    navigate("/");
  };

  // Close settings dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ─── shared nav link style ─────────────────────────────── */
  const linkCls = "hover:text-gold-400 transition-colors duration-300";
  const mobileLinkCls =
    "block px-6 py-4 text-sm uppercase tracking-widest font-semibold text-gray-200 hover:text-gold-400 hover:bg-slate-800/60 transition-colors border-b border-gold-400/10";

  return (
    <>
      <nav className="bg-slate-900/90 backdrop-blur-md text-white px-6 md:px-8 py-4 flex justify-between items-center border-b border-gold-400/10 shadow-xl sticky top-0 z-50">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-serif font-bold tracking-widest text-gold-400 hover:text-gold-300 transition-colors shrink-0"
        >
          ASKARI TOWER
        </Link>

        {/* ── Desktop nav ──────────────────────────────────── */}
        {isHome ? (

          /* Public / Landing desktop links */
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider font-medium">
            {isLanding && (
              <>
                <a href="/" className={linkCls}>Home</a>
                <a href="#features" className={linkCls}>Features</a>
                <a href="#how-it-works" className={linkCls}>How It Works</a>
                <Link
                  to="/login"
                  className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-5 py-2.5 rounded font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-400/10"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        ) : (

          /* App desktop links */
          <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-wider font-semibold">

            {user?.role !== "tenant_admin" && (
              <Link to={homeRouteFor(user)} className={linkCls}>Dashboard</Link>
            )}

            {user?.role === "user" && (
              <Link to="/navigation" className={linkCls}>Navigation</Link>
            )}

            {user?.role === "super_admin" && (
              <Link to="/super-admin/logs" className={linkCls}>Activity Logs</Link>
            )}

            {user?.role === "tenant_admin" && (
              <>
                <Link to="/building-admin/faqs" className={linkCls}>Manage FAQs</Link>
                <Link to="/building-admin/info-sheet" className={linkCls}>Info Sheet</Link>
                <Link to="/building-admin/floor-maps" className={linkCls}>Floor Maps</Link>
                <Link to="/building-admin/logs" className={linkCls}>User Logs</Link>
              </>
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
                  <div className="absolute right-0 top-full mt-3 w-48 bg-slate-900 border border-gold-400/20 rounded shadow-2xl overflow-hidden z-50">
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

        {/* ── Hamburger button (mobile only) ───────────────── */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gold-400/30 text-gray-300 hover:text-gold-400 hover:border-gold-400 transition-all cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>

      </nav>

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-slate-900 border-l border-gold-400/15 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold-400/15">
          <span className="text-lg font-serif font-bold tracking-widest text-gold-400">ASKARI TOWER</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gold-400 hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex flex-col py-2 overflow-y-auto">

          {isHome ? (
            /* Public / Landing mobile links */
            isLanding && (
              <>
                <a href="/" className={mobileLinkCls} onClick={() => setMobileOpen(false)}>Home</a>
                <a href="#features" className={mobileLinkCls} onClick={() => setMobileOpen(false)}>Features</a>
                <a href="#how-it-works" className={mobileLinkCls} onClick={() => setMobileOpen(false)}>How It Works</a>
                <div className="px-6 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center bg-gold-400 hover:bg-gold-500 text-slate-950 px-5 py-3 rounded font-bold uppercase tracking-wider text-sm transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )
          ) : (
            /* App mobile links */
            <>
              {user && (
                <div className="px-6 py-4 border-b border-gold-400/10 bg-slate-800/40">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Signed in as</p>
                  <p className="text-gold-400 font-serif font-bold text-sm normal-case tracking-normal truncate">
                    {user?.username}
                  </p>
                </div>
              )}

              {user?.role !== "tenant_admin" && (
                <Link to={homeRouteFor(user)} className={mobileLinkCls}>Dashboard</Link>
              )}

              {user?.role === "user" && (
                <Link to="/navigation" className={mobileLinkCls}>Navigation</Link>
              )}

              {user?.role === "super_admin" && (
                <Link to="/super-admin/logs" className={mobileLinkCls}>Activity Logs</Link>
              )}

              {user?.role === "tenant_admin" && (
                <>
                  <Link to="/building-admin/faqs" className={mobileLinkCls}>Manage FAQs</Link>
                  <Link to="/building-admin/info-sheet" className={mobileLinkCls}>Info Sheet</Link>
                  <Link to="/building-admin/floor-maps" className={mobileLinkCls}>Floor Maps</Link>
                  <Link to="/building-admin/logs" className={mobileLinkCls}>User Logs</Link>
                </>
              )}

              <Link
                to="/profile"
                className={mobileLinkCls + " flex items-center gap-3"}
              >
                <FiUser size={14} /> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-4 text-sm uppercase tracking-widest font-semibold text-red-400 hover:text-white hover:bg-red-500 transition-colors border-b border-gold-400/10 cursor-pointer w-full text-left"
              >
                <FiLogOut size={14} /> Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Navbar;
