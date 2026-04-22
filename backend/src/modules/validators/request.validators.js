const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isEmail = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const isObjectId = (value) => {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
};

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const collect = (checks) => {
  return checks.filter(Boolean);
};

const validateRegister = (req) => {
  const { name, email, password } = req.body || {};

  return collect([
    !isNonEmptyString(name) && "Name is required",
    !isEmail(email) && "Valid email is required",
    !isNonEmptyString(password) && "Password is required",
    isNonEmptyString(password) && password.length < 6 && "Password must be at least 6 characters",
  ]);
};

const validateLogin = (req) => {
  const { email, password } = req.body || {};

  return collect([
    !isEmail(email) && "Valid email is required",
    !isNonEmptyString(password) && "Password is required",
  ]);
};

const validateRefreshPayload = (req) => {
  const bodyRefreshToken = req.body?.refreshToken;
  const cookieRefreshToken = req.cookies?.taskwise_refresh_token;
  const refreshToken = bodyRefreshToken || cookieRefreshToken;

  return collect([!isNonEmptyString(refreshToken) && "Refresh token is required"]);
};

const validateProfileUpdate = (req) => {
  const { name, email, currentPassword, newPassword } = req.body || {};
  const hasName = typeof name === "string";
  const hasEmail = typeof email === "string";
  const hasNewPassword = typeof newPassword === "string" && newPassword.length > 0;

  return collect([
    !hasName && !hasEmail && !hasNewPassword && "At least one profile field must be provided",
    hasName && !isNonEmptyString(name) && "Name cannot be empty",
    hasEmail && !isEmail(email) && "Email must be valid",
    hasNewPassword && newPassword.length < 6 && "New password must be at least 6 characters",
    hasNewPassword && !isNonEmptyString(currentPassword) && "Current password is required to change password",
  ]);
};

const validateCreateGroup = (req) => {
  const { name, inviteCode } = req.body || {};

  return collect([
    !isNonEmptyString(name) && "Group name is required",
    typeof inviteCode === "string" && inviteCode.trim().length > 0 && inviteCode.trim().length < 4 &&
      "Invite code must be at least 4 characters when provided",
  ]);
};

const validateJoinGroup = (req) => {
  const { code } = req.body || {};
  return collect([!isNonEmptyString(code) && "Invite code is required"]);
};

const validateCreateTask = (req) => {
  const { name, deadline, difficulty, status } = req.body || {};

  return collect([
    !isNonEmptyString(name) && "Task name is required",
    !isValidDate(deadline) && "Valid deadline is required",
    difficulty !== undefined && ![1, 2, 3, 4, 5].includes(Number(difficulty)) && "Difficulty must be 1-5",
    status !== undefined && !["pending", "in-progress", "completed"].includes(status) && "Status is invalid",
  ]);
};

const validateUpdateTask = (req) => {
  const { id } = req.params || {};
  const { name, deadline, difficulty, status, subject } = req.body || {};

  return collect([
    !isObjectId(id) && "Task id is invalid",
    name !== undefined && !isNonEmptyString(name) && "Task name cannot be empty",
    subject !== undefined && typeof subject !== "string" && "Subject must be a string",
    deadline !== undefined && !isValidDate(deadline) && "Deadline must be a valid date",
    difficulty !== undefined && ![1, 2, 3, 4, 5].includes(Number(difficulty)) && "Difficulty must be 1-5",
    status !== undefined && !["pending", "in-progress", "completed"].includes(status) && "Status is invalid",
  ]);
};

const validateAssignTask = (req) => {
  const { taskId, assignedTo, groupId } = req.body || {};

  return collect([
    !isObjectId(taskId) && "taskId is invalid",
    !isObjectId(assignedTo) && "assignedTo is invalid",
    !isObjectId(groupId) && "groupId is invalid",
  ]);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateRefreshPayload,
  validateProfileUpdate,
  validateCreateGroup,
  validateJoinGroup,
  validateCreateTask,
  validateUpdateTask,
  validateAssignTask,
};