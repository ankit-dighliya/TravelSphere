import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";


import healthRoutes from "./routes/health.routes.js";
import destinationRoutes from "./routes/destination.routes.js";
import destinationDetailsRoutes from "./routes/destinationDetails.routes.js";
import featuredDestinationsRoutes from "./routes/featuredDestinations.routes.js";

import notFoundMiddleware from "./middleware/notFound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

// Initialize Express
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json({ limit: "10kb" }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// Register API routes
app.use("/api/v1", healthRoutes);

// Destination routes
app.use("/api/v1/destinations/featured", featuredDestinationsRoutes);
app.use("/api/v1/destinations", destinationDetailsRoutes);
app.use("/api/v1/destinations", destinationRoutes);

// Handle unknown routes
app.use(notFoundMiddleware);

// Centralized error handling
app.use(errorMiddleware);

export default app;