import mongoose from "mongoose";

// Define geographical location schema
const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coordinates) {
          return (
            Array.isArray(coordinates) &&
            coordinates.length === 2 &&
            coordinates[0] >= -180 &&
            coordinates[0] <= 180 &&
            coordinates[1] >= -90 &&
            coordinates[1] <= 90
          );
        },
        message: "Coordinates must contain valid longitude and latitude.",
      },
    },
  },
  { _id: false }
);


// Define Destination Schema
const destinationSchema = new mongoose.Schema(
  {
    // Basic information
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Destination description is required"],
      trim: true,
    },

    // Geographical information
    country: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    location: {
      type: locationSchema,
      default: undefined,
    },

    // Destination categories
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // Travel recommendations
    bestTimeToVisit: {
      type: [String],
      default: [],
    },

    averageBudget: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },


    recommendedDuration: {
      minDays: {
        type: Number,
        min: 1,
      },
      maxDays: {
        type: Number,
        min: 1,
      },
    },

    // Destination images
    coverImage: {
      type: String,
      default: "",
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],

    // Ratings and reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Publication settings
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// Generate slug before validation
destinationSchema.pre("validate", function () {
  if (this.isModified("name") && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

// Validate average budget range
destinationSchema.pre("validate", function () {
  if (
    this.averageBudget?.min !== undefined &&
    this.averageBudget?.max !== undefined &&
    this.averageBudget.max < this.averageBudget.min
  ) {
    this.invalidate(
      "averageBudget.max",
      "Maximum budget must be greater than or equal to minimum budget."
    );
  }
});

// Validate recommended duration range
destinationSchema.pre("validate", function () {
  if (
    this.recommendedDuration?.minDays !== undefined &&
    this.recommendedDuration?.maxDays !== undefined &&
    this.recommendedDuration.maxDays < this.recommendedDuration.minDays
  ) {
    this.invalidate(
      "recommendedDuration.maxDays",
      "Maximum duration must be greater than or equal to minimum duration."
    );
  }
});


// Search index
destinationSchema.index({
  name: "text",
  description: "text",
  country: "text",
  state: "text",
  city: "text",
});

// Geographical search index
destinationSchema.index({
  location: "2dsphere",
});


// Create Destination Model
const Destination = mongoose.model(
  "Destination",
  destinationSchema
);

export default Destination;

