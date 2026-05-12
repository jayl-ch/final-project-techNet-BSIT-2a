const adminService = require("../services/admin.service");
const asyncHandler = require("../middlewares/async.handler");

const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listUsers();
  res.status(200).json({ users });
});

module.exports = { listUsers };
