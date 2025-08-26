import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/auth.js";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from "../controllers/propertyController.js";

const router = Router();

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "real-estate", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", protect, upload.array("images", 8), createProperty);
router.put("/:id", protect, upload.array("images", 8), updateProperty);
router.delete("/:id", protect, deleteProperty);

export default router;
