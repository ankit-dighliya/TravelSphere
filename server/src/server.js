// Load environment variables
import "dotenv/config";

// Import Express application
import app from "./app.js";

// Import database connection
import connectDB from "./config/database.js";

// Define server port
const PORT = process.env.PORT || 5000;

// Start application
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server after database connection
    app.listen(PORT, () => {
      console.log(`TravelSphere API is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

  } catch (error) {
    console.error("Unable to start TravelSphere:", error.message);
    process.exit(1);
  }
};

// Execute application
startServer();