const { BadRequestError } = require("../utils/errors");

const validateRequest = (validator) => {
  return (req, res, next) => {
    const errors = validator(req);

    if (Array.isArray(errors) && errors.length) {
      return next(new BadRequestError("Validation failed", errors));
    }

    return next();
  };
};

module.exports = validateRequest;