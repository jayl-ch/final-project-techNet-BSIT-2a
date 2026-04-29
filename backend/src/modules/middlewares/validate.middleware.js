const { BadRequestError } = require("../utils/errors");

const validateRequest = (validator) => {
  return (req, res, next) => {
    if (typeof validator === "function") {
      const errors = validator(req);

      if (Array.isArray(errors) && errors.length) {
        return next(new BadRequestError("Validation failed", errors));
      }

      return next();
    }

    if (!validator || typeof validator.safeParse !== "function") {
      return next(
        new BadRequestError("Validation failed", [
          "Validator is not configured",
        ]),
      );
    }

    const result = validator.safeParse({
      body: req.body,
      params: req.params,
      cookies: req.cookies,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      return next(new BadRequestError("Validation failed", errors));
    }

    req.validated = result.data;
    return next();
  };
};

module.exports = validateRequest;

