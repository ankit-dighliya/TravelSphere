import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check whether MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error("MongoDB connection string is missing.");
    }

    // Connect to MongoDB Atlas
    const connection = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;