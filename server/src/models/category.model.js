import mongoose from "mongoose";

// Define Category Schema
const categorySchema = new mongoose.Schema(
  {
    // Category name
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    // URL-friendly category name
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Category description
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    // Category cover image
    image: {
      type: String,
      default: "",
    },

    // Category status
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
categorySchema.pre("validate", function () {
  if (this.isModified("name") && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});


// Index for active categories
categorySchema.index({ isActive: 1 });


// Create Category Model
const Category = mongoose.model("Category", categorySchema);

export default Category;