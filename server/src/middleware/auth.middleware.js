import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

// Verify user authentication
const authMiddleware = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check whether token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError("Authentication required. Please log in.", 401)
      );
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Check JWT secret configuration
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not configured.");
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    // Retrieve current user from MongoDB
    const user = await User.findById(decoded.id).select("_id role isActive");

    // Check whether user exists
    if (!user) {
      return next(
        new AppError("User account not found.", 401)
      );
    }

    // Check whether user account is active
    if (!user.isActive) {
      return next(
        new AppError("Your account has been deactivated.", 403)
      );
    }

    // Attach authenticated user information
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new AppError("Access token has expired. Please log in again.", 401)
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new AppError("Invalid authentication token.", 401)
      );
    }

    next(error);
  }
};

export default authMiddleware;