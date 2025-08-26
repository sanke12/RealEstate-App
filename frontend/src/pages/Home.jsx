import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import PropertyCard from "../components/PropertyCard";
import toast from "react-hot-toast";
import "../index.css";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const hasShownToast = useRef(false); // ✅ Ref flag

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("api/properties");
        setProperties(data.items);

        if (!hasShownToast.current) { // ✅ toast sirf ek hi baar chalega
          if (data.items.length > 0) {
            toast.success("Properties loaded successfully! 🏠");
          } else {
            toast.info("No properties available right now.");
          }
          hasShownToast.current = true;
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties. Please try again later.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-10 overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-900">
      {/* Section Header */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-3xl md:text-3xl font-bold text-white drop-shadow-lg">
          Explore Properties by City, Price, or Type
        </h1>
        <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
          Explore our latest listings for rent and sale. Find your dream home today!
        </p>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
          {properties.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 relative z-10">
          <p className="text-gray-300 text-lg">No properties available right now.</p>
        </div>
      )}
    </div>
  );
}
