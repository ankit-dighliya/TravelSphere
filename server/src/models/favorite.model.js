import mongoose from "mongoose";

// Define Favorite Schema
const favoriteSchema = new mongoose.Schema(
  {
    // User who saved the item
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of saved entity
    targetType: {
      type: String,
      required: true,
      enum: ["Destination", "Hotel", "Attraction"],
    },

    // Reference to the saved entity
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent users from saving the same item multiple times
favoriteSchema.index(
  {
    user: 1,
    targetType: 1,
    target: 1,
  },
  {
    unique: true,
  }
);

// Quickly retrieve a user's favorites
favoriteSchema.index({
  user: 1,
  createdAt: -1,
});


// Create Favorite Model
const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;