const { AppError } = require("../utils/errors");

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
};

const errorHandler = (error, req, res, next) => {
  const isOperational = error instanceof AppError || error?.isOperational;
  const statusCode = isOperational ? error.statusCode || 500 : 500;
  const code = isOperational ? error.code || "INTERNAL_ERROR" : "INTERNAL_ERROR";
  const message =
    isOperational || process.env.NODE_ENV !== "production"
      ? error.message
      : "An unexpected error occurred";

  if (!isOperational) {
    console.error("Unhandled error:", error);
  }

  if (res.headersSent) {
    return next(error);
  }

  return res.status(statusCode).json({
    message,
    error: {
      code,
      message,
      details: isOperational ? error.details || undefined : undefined,
    },
  });
};

module.exports = { notFoundHandler, errorHandler };