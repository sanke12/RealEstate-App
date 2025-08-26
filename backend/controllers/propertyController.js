import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";

// Create
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, type, bedrooms, bathrooms, areaSqFt, city, state, address, pincode, purpose } = req.body;

    // Cloudinary images
    const images = (req.files || []).map((f) => ({
      url: f.path,        // Cloudinary URL
      public_id: f.filename // Cloudinary public_id
    }));

    const doc = await Property.create({
      title,
      description,
      price,
      type,
      bedrooms,
      bathrooms,
      areaSqFt,
      purpose,
      location: { city, state, address, pincode },
      images,
      owner: req.user._id
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Create property failed", error: err.message });
  }
};

// Read (list with filters + pagination)
export const getProperties = async (req, res) => {
  try {
    const {
      q, city, minPrice, maxPrice, type, purpose,
      page = 1, limit = 12, sort = "-createdAt"
    } = req.query;

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (city) filter["location.city"] = new RegExp(`^${city}$`, "i");
    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Property.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate("owner", "name email"),
      Property.countDocuments(filter)
    ]);

    res.json({
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Fetch properties failed", error: err.message });
  }
};

// Read (single)
export const getPropertyById = async (req, res) => {
  try {
    const item = await Property.findById(req.params.id).populate("owner", "name email");
    if (!item) return res.status(404).json({ message: "Property not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Fetch property failed", error: err.message });
  }
};

// Update (owner or admin)
export const updateProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: "Property not found" });

    if (prop.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const images = (req.files || []).map((f) => ({
      url: f.path,
      public_id: f.filename
    }));

    const payload = {
      ...req.body,
      ...(req.body.city || req.body.state || req.body.address || req.body.pincode
        ? {
            location: {
              address: req.body.address ?? prop.location.address,
              city: req.body.city ?? prop.location.city,
              state: req.body.state ?? prop.location.state,
              country: req.body.country ?? prop.location.country,
              pincode: req.body.pincode ?? prop.location.pincode,
              coordinates: prop.location.coordinates
            }
          }
        : {})
    };

    if (images.length) {
      payload.$push = { images: { $each: images } };
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update property failed", error: err.message });
  }
};

// Delete (owner or admin)
export const deleteProperty = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: "Property not found" });

    if (prop.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ delete images from Cloudinary
    if (prop.images?.length) {
      for (const img of prop.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await prop.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete property failed", error: err.message });
  }
};
