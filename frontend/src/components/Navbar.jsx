import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X, Home } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return null; // ⛔ jab tak user load nahi hota kuch mat dikhao
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform"
          >
            <Home className="inline-block w-6 h-6 mr-1" /> RealEstate
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 transition-colors font-medium"
            >
              Home
            </Link>

            {user ? (
              <>
                {/* ✅ Show Dashboard only if role === "seller" */}
                {user.role === "seller" && (
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-yellow-300 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-300 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-yellow-300 transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700 px-4 py-3 space-y-3 animate-fade-in-down">
          <Link
            to="/"
            className="block text-white hover:text-yellow-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {user ? (
            <>
              {/* ✅ Show Dashboard only if role === "seller" */}
              {user.role === "seller" && (
                <Link
                  to="/dashboard"
                  className="block text-white hover:text-yellow-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-white hover:text-yellow-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg shadow-md font-semibold transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
