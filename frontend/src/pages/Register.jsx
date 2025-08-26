import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; 

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form.name, form.email, form.password, form.role);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
       const msg = err.response?.data?.message || "Registration failed. Try again.";
       toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-sm border border-white/40"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Create Account ✨
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200 bg-white"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transform hover:scale-105 transition duration-200 disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
