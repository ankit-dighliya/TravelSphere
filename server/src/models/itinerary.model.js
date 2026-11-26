import mongoose from "mongoose";

// Define Itinerary Schema
const itinerarySchema = new mongoose.Schema(
  {
    // User who created the itinerary
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Selected destination
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },

    // Itinerary title
    title: {
      type: String,
      required: [true, "Itinerary title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    // Travel dates
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Total travel duration
    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    // Daily travel schedule
    days: [
      {
        // Day number
        dayNumber: {
          type: Number,
          required: true,
          min: 1,
        },

        // Activities planned for this day
        activities: [
          {
            // Activity name
            title: {
              type: String,
              required: true,
              trim: true,
            },

            // Activity description
            description: {
              type: String,
              trim: true,
              default: "",
            },

            // Optional attraction reference
            attraction: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Attraction",
            },

            // Planned activity time
            startTime: {
              type: String,
              default: "",
            },

            // Estimated activity duration in minutes
            duration: {
              type: Number,
              min: 1,
            },
          },
        ],
      },
    ],

    // Estimated travel budget
    budget: {
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

    // Additional travel notes
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // Itinerary status
    status: {
      type: String,
      enum: ["draft", "planned", "completed"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);


// Validate itinerary dates
itinerarySchema.pre("validate", function () {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // Remove time components for date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      this.invalidate(
        "endDate",
        "End date cannot be earlier than start date."
      );
      return;
    }

    // Calculate duration in days, including both dates
    const calculatedDuration =
      Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (this.duration !== calculatedDuration) {
      this.invalidate(
        "duration",
        "Duration must match the selected travel dates."
      );
    }
  }
});

// Validate daily schedule
// Validate daily schedule
itinerarySchema.pre("validate", function () {
  if (this.days && this.duration) {

    // Check for duplicate day numbers
    const dayNumbers = this.days.map((day) => day.dayNumber);

    if (new Set(dayNumbers).size !== dayNumbers.length) {
      this.invalidate(
        "days",
        "Each itinerary day must have a unique day number."
      );
      return;
    }

    // Ensure day numbers do not exceed itinerary duration
    for (const day of this.days) {
      if (day.dayNumber > this.duration) {
        this.invalidate(
          "days",
          "Day number cannot exceed itinerary duration."
        );
        break;
      }
    }
  }
});


// Index for retrieving a user's itineraries
itinerarySchema.index({
  user: 1,
  createdAt: -1,
});

// Index for finding itineraries by destination
itinerarySchema.index({
  destination: 1,
});

// Create Itinerary Model
const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;