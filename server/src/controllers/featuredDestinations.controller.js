import Destination from "../models/destination.model.js";

// Get featured destinations
export const getFeaturedDestinations = async (req, res, next) => {
  try {
    // Get validated pagination parameters
    const { page, limit } = req.validatedData.query;

    // Filter published and featured destinations
    const filter = {
      isPublished: true,
      isFeatured: true,
    };

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Fetch featured destinations and count matching records
    const [destinations, totalDestinations] = await Promise.all([
      Destination.find(filter)
        .select(
          "name slug description country state city coverImage categories averageRating reviewCount averageBudget recommendedDuration createdAt"
        )
        .populate("categories", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Destination.countDocuments(filter),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalDestinations / limit);

    // Send successful response
    res.status(200).json({
      success: true,
      message: "Featured destinations retrieved successfully.",

      data: destinations,

      pagination: {
        currentPage: page,
        totalPages,
        totalDestinations,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};