import mongoose from "mongoose";

// Define Review Schema
const reviewSchema = new mongoose.Schema(
  {
    // User who submitted the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of entity being reviewed
    targetType: {
      type: String,
      required: true,
      enum: ["Destination", "Hotel", "Attraction"],
    },

    // Reference to the reviewed entity
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },

    // User rating
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },

    // Review title
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    // Detailed review
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    // Review images
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],

    // Review moderation status
    status: {
      type: String,
      enum: ["pending", "published", "rejected"],
      default: "pending",
    },

    // Whether the user's visit has been verified
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// Index for retrieving reviews of a destination, hotel, or attraction
reviewSchema.index({
  targetType: 1,
  target: 1,
  createdAt: -1,
});

// Prevent a user from submitting multiple reviews
// for the same destination, hotel, or attraction
reviewSchema.index(
  {
    user: 1,
    targetType: 1,
    target: 1,
  },
  {
    unique: true,
  }
);


// Create Review Model
const Review = mongoose.model("Review", reviewSchema);

export default Review;