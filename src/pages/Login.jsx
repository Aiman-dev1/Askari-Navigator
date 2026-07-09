import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { useAuth, homeRouteFor } from "../context/AuthContext";

function Login() {
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Enter email and password");
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate(homeRouteFor(user));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    if (!guestName.trim()) return toast.error("Pick a username first");
    setLoading(true);
    try {
      const user = await guestLogin(guestName.trim());
      toast.success(`Welcome, ${user.username}!`);
      navigate("/user");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex justify-center items-center bg-slate-100">

        <div className="bg-white shadow-lg p-8 rounded-xl w-96">

          <h2 className="text-3xl font-bold text-center mb-6">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border p-3 rounded mb-4"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-cyan-500 text-white p-3 rounded disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            No account?{" "}
            <Link to="/register" className="text-cyan-600 font-bold">
              Register
            </Link>
          </p>

          {/* Guest access — friction-free onboarding */}
          <div className="border-t mt-6 pt-6">

            <p className="text-center text-sm text-gray-500 mb-3">
              Just visiting? Continue as a guest
            </p>

            <div className="flex gap-2">

              <input
                type="text"
                placeholder="Pick a username"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuest()}
                className="flex-1 border p-3 rounded"
              />

              <button
                onClick={handleGuest}
                disabled={loading}
                className="bg-slate-800 text-white px-4 rounded disabled:opacity-50"
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
