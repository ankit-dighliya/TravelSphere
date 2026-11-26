import AppError from "../utils/AppError.js";

// Restrict access to administrators
const adminMiddleware = (req, res, next) => {
  // Check whether the user is authenticated
  if (!req.user) {
    return next(
      new AppError("Authentication required.", 401)
    );
  }

  // Check whether the user has administrator privileges
  if (req.user.role !== "admin") {
    return next(
      new AppError(
        "Access denied. Administrator privileges required.",
        403
      )
    );
  }

  next();
};

export default adminMiddleware;