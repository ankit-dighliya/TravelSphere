import AppError from "../utils/AppError.js";

// Validate incoming request data
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body ?? {},
      params: req.params,
      query: req.query,
    });

    // Check validation result
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(
        new AppError(
          `Validation failed: ${errors
            .map((error) => error.message)
            .join(", ")}`,
          400
        )
      );
    }

    // Store validated request data
    req.validatedData = result.data;

    next();
  };
};

export default validateMiddleware;