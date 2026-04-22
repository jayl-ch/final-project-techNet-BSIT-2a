class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad request", details = null) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details = null) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details = null) {
    super(message, 403, "FORBIDDEN", details);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found", details = null) {
    super(message, 404, "NOT_FOUND", details);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict", details = null) {
    super(message, 409, "CONFLICT", details);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};