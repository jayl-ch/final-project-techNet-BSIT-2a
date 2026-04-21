const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnauthorizedError } = require("../utils/errors");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError("Authorization header is required"));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new UnauthorizedError("Malformed authorization header"));
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (decoded?.type && decoded.type !== "access") {
      return next(new UnauthorizedError("Invalid access token"));
    }

    req.student = decoded;
    return next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

module.exports = authMiddleware;
