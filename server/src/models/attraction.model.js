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


// Define Attraction Schema
const attractionSchema = new mongoose.Schema(
  {
    // Attraction name
    name: {
      type: String,
      required: [true, "Attraction name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // URL-friendly attraction name
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // Attraction description
    description: {
      type: String,
      required: [true, "Attraction description is required"],
      trim: true,
    },

    // Parent destination
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: [true, "Destination reference is required"],
    },

    // Geographical information
    location: {
      type: locationSchema,
      required: true,
    },

    // Attraction category
    category: {
      type: String,
      enum: [
        "Adventure",
        "Historical",
        "Religious",
        "Nature",
        "Wildlife",
        "Entertainment",
        "Other",
      ],
      default: "Other",
    },

    // Entry fee
    entryFee: {
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // Visiting hours
    openingTime: {
      type: String,
      default: "",
    },

    closingTime: {
      type: String,
      default: "",
    },

    // Recommended visiting periods
    bestTimeToVisit: {
      type: [String],
      default: [],
    },

    // Attraction images
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],

    // Rating information
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Attraction status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before validation
attractionSchema.pre("validate", function () {
  if (this.isModified("name") && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

// Ensure attraction slugs are unique within each destination
attractionSchema.index(
  { destination: 1, slug: 1 },
  { unique: true }
);

// Geographical search index
attractionSchema.index({
  location: "2dsphere",
});

// Create Attraction Model
const Attraction = mongoose.model("Attraction", attractionSchema);

export default Attraction;