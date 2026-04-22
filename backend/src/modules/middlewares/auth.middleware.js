const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnauthorizedError } = require("../utils/errors");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const accessTokenFromCookie = req.cookies?.taskwise_access_token;
  const authHeader = req.headers.authorization;
  const authTokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const token = accessTokenFromCookie || authTokenFromHeader;

  if (!token) {
    return next(new UnauthorizedError("Access token is required"));
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
