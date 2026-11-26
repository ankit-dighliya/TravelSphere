import mongoose from "mongoose";

// Define Image Schema
const imageSchema = new mongoose.Schema(
  {
    // Cloudinary image URL
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },

    // Cloudinary public ID
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
      unique: true,
      trim: true,
    },

    // User who uploaded the image
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of entity associated with the image
    entityType: {
      type: String,
      required: true,
      enum: ["Destination", "Hotel", "Attraction", "Review", "User"],
    },

    // Reference to the associated entity
    entity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "entityType",
    },

    // Image accessibility description
    altText: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    // Image caption
    caption: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    // Primary image indicator
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// Index for retrieving images associated with an entity
imageSchema.index({
  entityType: 1,
  entity: 1,
});

// Index for retrieving images uploaded by a user
imageSchema.index({
  owner: 1,
  createdAt: -1,
});

// Ensure only one primary image per entity
imageSchema.index(
  {
    entityType: 1,
    entity: 1,
    isPrimary: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isPrimary: true,
    },
  }
);


// Create Image Model
const Image = mongoose.model("Image", imageSchema);

export default Image;