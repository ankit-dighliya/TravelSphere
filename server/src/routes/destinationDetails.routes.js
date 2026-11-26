import express from "express";

import { getDestinationDetails } from "../controllers/destinationDetails.controller.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import { getDestinationDetailsSchema } from "../validators/destinationDetails.validator.js";

// Initialize router
const router = express.Router();

// Get destination details by slug
router.get(
  "/:slug",
  validateMiddleware(getDestinationDetailsSchema),
  getDestinationDetails
);

export default router;