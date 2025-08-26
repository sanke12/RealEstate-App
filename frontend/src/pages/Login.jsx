import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      toast.error(msg); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-sm border border-white/40"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Welcome Back 👋
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
            required
          />

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transform hover:scale-105 transition duration-200"
          >
            Login
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
