import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`api/properties/${id}`);
        setProperty(res.data);
      } catch (error) {
        toast.error("Failed to load property details.");
      }
    };

    fetchProperty();
  }, [id]);

  if (!property)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-pulse text-gray-600">Loading property details...</p>
      </div>
    );

  const handleContact = () => {
    toast.success("Redirecting to WhatsApp Agent Chat 📲");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img
          src={property.images?.[0].url || "https://via.placeholder.com/600"}
          alt={property.title}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
        <div className="grid grid-cols-2 gap-2">
          {property.images?.slice(1, 5).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Property ${i}`}
              className="w-full h-44 object-cover rounded-lg shadow-md hover:scale-105 transition"
            />
          ))}
        </div>
      </div>

      {/* Property Info */}
      <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800">{property.title}</h2>

        <div className="flex items-center justify-between mt-3">
          <span className="text-2xl font-semibold text-indigo-600">
            ₹ {property.price.toLocaleString()}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full shadow-sm">
            {property.status || "Available"}
          </span>
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed">{property.description}</p>

        <div className="mt-6 flex items-center gap-4 text-gray-600">
          <span className="flex items-center gap-2">
            📍 <span>{property.location?.city || "Unknown"}</span>
          </span>
          <span className="flex items-center gap-2">
            🏠 <span>{property.type || "Property"}</span>
          </span>
          <span className="flex items-center gap-2">
            📏 <span>{property.areaSqFt || "N/A"} sq.ft</span>
          </span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 flex justify-end">
        <a
          href={`https://wa.me/${property.agentPhone || "919999999999"}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleContact}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transform hover:scale-105 transition flex items-center gap-2"
        >
          📲 Contact Agent on WhatsApp
        </a>
      </div>
    </div>
  );
}
