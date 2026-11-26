import Destination from "../models/destination.model.js";
import Category from "../models/category.model.js";

// Escape special characters in user-provided search values
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all published destinations
export const getDestinations = async (req, res, next) => {
  try {
    // Get validated query parameters
    const {
      page,
      limit,
      search,
      country,
      state,
      category,
      sort,
    } = req.validatedData.query;

    // Initialize destination filter
    const filter = {
      isPublished: true,
    };

    // Search destinations by name, description, or location
    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    // Filter by country
    if (country) {
      filter.country = {
        $regex: `^${escapeRegex(country)}$`,
        $options: "i",
      };
    }

    // Filter by state
    if (state) {
      filter.state = {
        $regex: `^${escapeRegex(state)}$`,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      const categoryDocument = await Category.findOne({
        slug: category.toLowerCase(),
        isActive: true,
      }).select("_id");

    // Return no results if category does not exist
    if (!categoryDocument) {
       filter._id = null;
    } else {
       filter.categories = categoryDocument._id;
    }
  }
    // Configure destination sorting
    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "rating":
        sortOption = { averageRating: -1 };
        break;

      case "name":
        sortOption = { name: 1 };
        break;

      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }
    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Fetch destinations and count matching records
    const [destinations, totalDestinations] = await Promise.all([
      Destination.find(filter)
        .select(
          "name slug description country state city coverImage categories averageRating reviewCount averageBudget recommendedDuration createdAt"
        )
        .populate("categories", "name slug")
        .sort(sortOption)
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
      message: "Destinations retrieved successfully.",

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