import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { useDispatch } from "react-redux";
import { register } from "../store/slices/authSlice";
import heroImg from "../assets/hero.png";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) return toast.error("Fill in all fields");
    if (/^\d+$/.test(trimmedName)) return toast.error("Enter a valid name");
    if (trimmedPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const user = await dispatch(register({ username: trimmedName, email: trimmedEmail, password: trimmedPassword })).unwrap();
      toast.success(`Account created. Welcome, ${user.username}!`);
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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-widest transition-all">
              REGISTRATION
            </h2>
            <div className="w-12 h-[2px] bg-gold-400 mx-auto mt-2"></div>
            <p className="text-xs text-gray-400 mt-3 uppercase tracking-wider">Join Askari Corporate Tower</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 p-3 rounded focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1 block">Email Address</label>
              <input
                type="email"
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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 p-3 rounded focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all text-sm"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gold-400 hover:bg-gold-500 text-slate-950 font-bold p-3.5 rounded disabled:opacity-50 transition-all duration-300 uppercase tracking-widest text-xs mt-6 cursor-pointer shadow-md hover:shadow-gold-400/10"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 uppercase tracking-wider">
            Already have an account?{" "}
            <Link to="/login" className="text-gold-400 font-bold hover:underline transition-all">
              Sign In
            </Link>
          </p>

        </div>

      </div>
    </MainLayout>
  );
}

export default Register;
