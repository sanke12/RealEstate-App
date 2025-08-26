import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// DB
await connectDB();

// Middlewares
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["*"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" })); // slightly bigger limit for images
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ No need for local static uploads (Cloudinary handles it)

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

// Health check
app.get("/", (req, res) => res.send("Real Estate API is running ✅"));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
