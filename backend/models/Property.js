import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, index: true },
    type: { type: String, enum: ["apartment", "house", "land", "commercial"], required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaSqFt: { type: Number, default: 0 },
    location: {
      address: String,
      city: { type: String, index: true },
      state: String,
      country: { type: String, default: "India" },
      pincode: String,
      // For future: geo indexing
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    images: [
      {
        url: { type: String, required: true },   // Cloudinary secure URL
        public_id: { type: String, required: true } // for deletion/updates
      }
    ], // file paths or URLs
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["available", "sold", "rented"], default: "available" },
    purpose: { type: String, enum: ["rent", "sale"], required: true }
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", description: "text", "location.city": "text" });

export default mongoose.model("Property", propertySchema);
