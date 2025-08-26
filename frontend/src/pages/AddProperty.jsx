import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast"; 

export default function AddProperty() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    city: "",
    areaSqFt: "",
    purpose: "sale",
    type: "apartment",
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      images.forEach((img) => fd.append("images", img));

      await API.post("api/properties", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Property added successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add property");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Add New Property
        </h2>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Property title"
              className="mt-1 border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="mt-1 border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Area (Sq Ft)
            </label>
            <input
              name="areaSqFt"
              type="number"
              value={form.areaSqFt}
              onChange={handleChange}
              placeholder="e.g. 1200"
              className="mt-1 border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              City
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="mt-1 border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Purpose
            </label>
            <select
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              className="mt-1 border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Property Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFile}
              className="mt-2 w-full text-gray-600"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition duration-300"
        >
          Save Property
        </button>
      </form>
    </div>
  );
}
