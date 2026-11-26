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


// Define Hotel Schema
const hotelSchema = new mongoose.Schema(
  {
    // Hotel name
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // URL-friendly hotel name
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // Hotel description
    description: {
      type: String,
      required: [true, "Hotel description is required"],
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

    // Hotel address
    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        required: true,
      },
      state: {
        type: String,
        trim: true,
        default: "",
      },
      country: {
        type: String,
        trim: true,
        required: true,
      },
      postalCode: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // Price per night
    pricePerNight: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // Hotel star classification
    starRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    // Hotel amenities
    amenities: {
      type: [String],
      default: [],
    },

    // Hotel images
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],

    // Contact information
    contact: {
      phone: {
        type: String,
        trim: true,
        default: "",
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        default: "",
      },
    },

    // Official hotel website
    website: {
      type: String,
      trim: true,
      default: "",
    },

    // Guest rating
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Total reviews
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Hotel status
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
hotelSchema.pre("validate", function () {
  if (this.isModified("name") && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});


// Validate hotel price range
hotelSchema.pre("validate", function () {
  if (
    this.pricePerNight?.min !== undefined &&
    this.pricePerNight?.max !== undefined &&
    this.pricePerNight.max < this.pricePerNight.min
  ) {
    this.invalidate(
      "pricePerNight.max",
      "Maximum price must be greater than or equal to minimum price."
    );
  }
});


// Ensure hotel slugs are unique within each destination
hotelSchema.index(
  { destination: 1, slug: 1 },
  { unique: true }
);

// Index for retrieving active hotels by destination
hotelSchema.index({
  destination: 1,
  isActive: 1,
});


// Geographical search index
hotelSchema.index({
  location: "2dsphere",
});


// Create Hotel Model
const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;