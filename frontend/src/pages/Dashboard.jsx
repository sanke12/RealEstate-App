import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; 

export default function Dashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);

  // useCallback se wrap kiya
  const fetchProperties = useCallback(async () => {
    try {
      const res = await API.get("api/properties");
      const myProps = res.data.items.filter((p) => p.owner._id === user.id);
      setProperties(myProps);
    } catch (err) {
      toast.error("Failed to fetch properties");
      console.error("Failed to fetch properties:", err);
    }
  }, [user]); // dependency me user

  useEffect(() => {
    if (user) fetchProperties();
  }, [user, fetchProperties]); //  no more warning

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      await API.delete(`api/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success("Property deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
        <Link
          to="/add-property"
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          + Add Property
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {p.title}
              </h3>

              <p className="text-green-600 font-bold text-xl mt-2">
                ₹ {p.price.toLocaleString()}
              </p>

              <div className="mt-2 text-sm text-gray-600">
                <p>{p.location?.city || "Unknown City"}</p>
              </div>

              <span
                className={`mt-3 inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  p.purpose === "sale"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {p.purpose || "N/A"}
              </span>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="border border-gray-400 text-gray-700 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg col-span-3">
            No properties added yet.
          </p>
        )}
      </div>
    </div>
  );
}
