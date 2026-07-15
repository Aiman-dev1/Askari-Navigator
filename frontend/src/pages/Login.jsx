import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { useDispatch } from "react-redux";
import { login, guestLogin, homeRouteFor } from "../store/slices/authSlice";
import heroImg from "../assets/hero.png";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) return toast.error("Enter email and password");
    setLoading(true);
    try {
      const user = await dispatch(login({ email: trimmedEmail, password: trimmedPassword })).unwrap();
      toast.success(`Welcome back, ${user.username}!`);
      navigate(homeRouteFor(user));
    } catch (err) {
      toast.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    const trimmed = guestName.trim();
    if (!trimmed) return toast.error("Pick a username first");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/; // Real CNIC pattern with hyphens
    const passportRegex = /^[A-Z][0-9]{7,9}$/i; // Basic real passport pattern

    const isValidGuest = emailRegex.test(trimmed) || cnicRegex.test(trimmed) || passportRegex.test(trimmed);

    if (!isValidGuest) {
      return toast.error("Please enter a valid Email, CNIC (e.g. 12345-1234567-1), or Passport Number");
    }

    setLoading(true);
    try {
      const user = await dispatch(guestLogin(trimmed)).unwrap();
      toast.success(`Welcome, ${user.username}!`);
      navigate("/user");
    } catch (err) {
      toast.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div 
        className="min-h-screen flex justify-center items-center bg-slate-950 py-12 px-4 relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 17, 0.85), rgba(6, 9, 17, 0.95)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent"></div>

        <div className="glass-card-dark p-10 rounded shadow-2xl w-full max-w-md border border-gold-400/20">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
              MEMBER PORTAL
            </h2>
            <div className="w-12 h-[2px] bg-gold-400 mx-auto mt-2"></div>
            <p className="text-xs text-gray-400 mt-3 uppercase tracking-wider">Askari Corporate Tower</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1 block">Email Address</label>
              <input
                type="email"
                autoComplete="off"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 p-3 rounded focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1 block">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 p-3 rounded focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all text-sm"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gold-400 hover:bg-gold-500 text-slate-950 font-bold p-3.5 rounded disabled:opacity-50 transition-all duration-300 uppercase tracking-widest text-xs mt-6 cursor-pointer shadow-md hover:shadow-gold-400/10"
            >
              {loading ? "Please wait..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 uppercase tracking-wider">
            New corporate client?{" "}
            <Link to="/register" className="text-gold-400 font-bold hover:underline transition-all">
              Register Here
            </Link>
          </p>

          {/* Guest access — friction-free onboarding */}
          <div className="border-t border-white/10 mt-8 pt-8">

            <p className="text-center text-xs text-gold-400/80 mb-4 uppercase tracking-widest font-semibold">
              Visitor Access
            </p>

            <div className="flex gap-2">

              <input
                type="text"
                placeholder="Email, CNIC, or Passport"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuest()}
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-500 p-3 rounded focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all text-sm"
              />

              <button
                onClick={handleGuest}
                disabled={loading}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 rounded disabled:opacity-50 border border-white/10 hover:border-white/20 transition-all uppercase tracking-wider text-xs cursor-pointer"
              >
                Go
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Login;
