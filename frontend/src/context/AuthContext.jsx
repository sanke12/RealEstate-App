import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast"; // ✅ import toast

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await API.post("api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Login successful! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || " Login failed");
      throw err;
    }
  };

  // ✅ REGISTER
  const register = async (name, email, password, role, areaSqFt) => {
    try {
      const { data } = await API.post("api/auth/register", {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("🎉 Account created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("👋 Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
