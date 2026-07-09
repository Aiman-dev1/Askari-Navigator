import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) return toast.error("Fill in all fields");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const user = await register(name.trim(), email.trim(), password);
      toast.success(`Account created. Welcome, ${user.username}!`);
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
            Register
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />

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
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            className="w-full border p-3 rounded mb-4"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-cyan-500 text-white p-3 rounded disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-600 font-bold">
              Login
            </Link>
          </p>

        </div>

      </div>
    </MainLayout>
  );
}

export default Register;
