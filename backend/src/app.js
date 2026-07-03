import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", service: "chatzy-api" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled API error:", error.message);
  if (res.headersSent) return next(error);
  return res.status(500).json({ message: "Internal server error" });
});

export default app;
