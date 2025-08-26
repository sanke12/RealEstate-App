import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";
import PrivateRoute from "./components/PrivateRoute";
import PropertyEdit from "./pages/Dashboard";
import { Toaster } from "react-hot-toast"; // Import Toaster

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-property"
            element={
              <PrivateRoute>
                <AddProperty />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-property/:id"
            element={
              <PrivateRoute>
                <PropertyEdit />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* ✅ Global toaster */}
        <Toaster position="top-right" reverseOrder={false} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
