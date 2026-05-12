const asyncHandler = require("./async.handler");
const { findById } = require("../repositories/student.repo");
const { ForbiddenError, UnauthorizedError } = require("../utils/errors");

const requireDeveloper = asyncHandler(async (req, res, next) => {
  const studentId = req.student?.id;

  if (!studentId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const student = await findById(studentId);

  if (!student) {
    throw new UnauthorizedError("User not authenticated");
  }

  if (student.role !== "developer") {
    throw new ForbiddenError("Developer access required");
  }

  req.developer = { id: student._id, email: student.email };
  return next();
});

module.exports = requireDeveloper;
