import Destination from "../models/destination.model.js";
import AppError from "../utils/AppError.js";

// Get destination details by slug
export const getDestinationDetails = async (req, res, next) => {
  try {
    // Get validated destination slug
    const { slug } = req.validatedData.params;

    // Find published destination
    const destination = await Destination.findOne({
      slug,
      isPublished: true,
    })
      .populate("categories", "name slug description image")
      .lean();

    // Check whether destination exists
    if (!destination) {
      return next(
        new AppError("Destination not found.", 404)
      );
    }

    // Send successful response
    res.status(200).json({
      success: true,
      message: "Destination details retrieved successfully.",
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};