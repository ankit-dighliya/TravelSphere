import express from "express";

import { getFeaturedDestinations } from "../controllers/featuredDestinations.controller.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import { getFeaturedDestinationsSchema } from "../validators/featuredDestinations.validator.js";

// Initialize router
const router = express.Router();

// Get featured destinations
router.get(
  "/",
  validateMiddleware(getFeaturedDestinationsSchema),
  getFeaturedDestinations
);

export default router;