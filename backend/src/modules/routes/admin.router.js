const express = require("express");

const adminRouter = express.Router();

const { listUsers } = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireDeveloper = require("../middlewares/developer.middleware");

// LIST USERS (DEVELOPER ONLY)
adminRouter.get("/admin/users", authMiddleware, requireDeveloper, listUsers);

module.exports = adminRouter;
