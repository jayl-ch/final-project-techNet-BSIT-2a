const RefreshToken = require("../models/refresh.token.model");

const createToken = async (payload) => {
  return await RefreshToken.create(payload);
};

const findActiveByTokenHash = async (tokenHash) => {
  return await RefreshToken.findOne({ tokenHash, revokedAt: null });
};

const revokeByTokenHash = async (tokenHash) => {
  return await RefreshToken.findOneAndUpdate(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } },
    { new: true },
  );
};

const revokeByStudentId = async (studentId) => {
  return await RefreshToken.updateMany(
    { studentId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
};

const removeExpired = async () => {
  return await RefreshToken.deleteMany({
    $or: [{ expiresAt: { $lte: new Date() } }, { revokedAt: { $ne: null } }],
  });
};

module.exports = {
  createToken,
  findActiveByTokenHash,
  revokeByTokenHash,
  revokeByStudentId,
  removeExpired,
};