import mongoose from "mongoose";

// Define RouteOption Schema
const routeOptionSchema = new mongoose.Schema(
  {
    // Destination associated with this route
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },

    // Mode of transportation
    transportMode: {
      type: String,
      required: true,
      enum: ["Flight", "Train", "Bus", "Car", "Bike"],
    },

    // Journey starting point
    startingPoint: {
      type: String,
      required: true,
      trim: true,
    },

    // Journey arrival point
    arrivalPoint: {
      type: String,
      required: true,
      trim: true,
    },

    // Estimated journey distance in kilometres
    distance: {
      type: Number,
      min: 0,
    },

    // Estimated journey duration in hours
    duration: {
      type: Number,
      required: true,
      min: 0.1,
    },

    // Estimated travel cost
    cost: {
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

    // Advantages of this travel option
    advantages: {
      type: [String],
      default: [],
    },

    // Disadvantages of this travel option
    disadvantages: {
      type: [String],
      default: [],
    },

    // Travel experience description
    experience: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Travel recommendation
    recommendation: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Route availability status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate travel cost range
routeOptionSchema.pre("validate", function () {
  if (
    this.cost?.min !== undefined &&
    this.cost?.max !== undefined &&
    this.cost.max < this.cost.min
  ) {
    this.invalidate(
      "cost.max",
      "Maximum travel cost must be greater than or equal to minimum travel cost."
    );
  }
});

// Index for retrieving route options by destination
routeOptionSchema.index({
  destination: 1,
  isActive: 1,
});

// Index for filtering routes by transportation mode
routeOptionSchema.index({
  transportMode: 1,
});

// Create RouteOption Model
const RouteOption = mongoose.model(
  "RouteOption",
  routeOptionSchema
);

export default RouteOption;

