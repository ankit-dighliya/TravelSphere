import express from "express";

import { getDestinations } from "../controllers/destination.controller.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import { getDestinationsSchema } from "../validators/destination.validator.js";

// Initialize router
const router = express.Router();

// Get all published destinations
router.get(
  "/",
  validateMiddleware(getDestinationsSchema),
  getDestinations
);

export default router;