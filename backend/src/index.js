import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // ✅ Set a default port

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Frontend URL
    credentials: true, // ✅ Allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Explicitly allow certain methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow headers if needed
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// ✅ Connect to Database Before Starting Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Stop the process if DB fails
  });
