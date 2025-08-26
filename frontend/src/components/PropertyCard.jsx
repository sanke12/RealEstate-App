import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img
        src={property.images?.[0].url || "https://via.placeholder.com/300"}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-3">
        <h3 className="text-lg text-gray-200 font-semibold">{property.title}</h3>
        <p className="text-gray-300">₹ {property.price}</p>
        <p className="text-sm text-gray-300">{property.location?.city}</p>
        <Link
          to={`/properties/${property._id}`}
          className="block mt-2 bg-blue-500 text-white text-center py-1 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
