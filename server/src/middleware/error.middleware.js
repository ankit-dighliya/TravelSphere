const errorMiddleware = (err, req, res, next) => {
  // Default status code
  const statusCode = err.statusCode || 500;

  // Determine whether error is operational
  const isOperational = err.isOperational || false;

  // Default error message
  let message = "Internal Server Error.";

  // Show operational error messages
  if (isOperational) {
    message = err.message;
  }

  // Log unexpected server errors
  if (!isOperational || statusCode === 500) {
    console.error("SERVER ERROR:", err);
  }

  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message,

    // Include stack trace only in development
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;