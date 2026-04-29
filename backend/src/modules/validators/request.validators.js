const { z } = require("zod");

const objectId = (message) => z.string().regex(/^[a-f\d]{24}$/i, message);

const optionalNumber = (schema) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    schema.optional(),
  );

const optionalString = (schema) =>
  z.preprocess(
    (value) => (value === null ? undefined : value),
    schema.optional(),
  );

const validateRegister = z
  .object({
    body: z.object({
      name: z.string().trim().min(1, "Name is required"),
      email: z.string().trim().email("Valid email is required"),
      password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
  })
  .passthrough();

const validateLogin = z
  .object({
    body: z.object({
      email: z.string().trim().email("Valid email is required"),
      password: z.string().min(1, "Password is required"),
    }),
  })
  .passthrough();

const validateGoogleLogin = z
  .object({
    body: z.object({
      idToken: z.string().trim().min(1, "Google ID token is required"),
    }),
  })
  .passthrough();

const validateRefreshPayload = z
  .object({
    body: z.object({
      refreshToken: optionalString(z.string().trim()),
    }),
    cookies: z.object({
      taskwise_refresh_token: optionalString(z.string().trim()),
    }),
  })
  .superRefine((data, ctx) => {
    const bodyRefreshToken = data.body?.refreshToken;
    const cookieRefreshToken = data.cookies?.taskwise_refresh_token;
    const refreshToken = bodyRefreshToken || cookieRefreshToken;

    if (!refreshToken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Refresh token is required",
        path: ["body", "refreshToken"],
      });
    }
  })
  .passthrough();

const validateProfileUpdate = z
  .object({
    body: z.object({
      name: optionalString(z.string()),
      email: optionalString(z.string().trim().email("Email must be valid")),
      currentPassword: optionalString(z.string()),
      newPassword: optionalString(z.string()),
    }),
  })
  .superRefine((data, ctx) => {
    const { name, email, currentPassword, newPassword } = data.body || {};
    const hasName = typeof name === "string";
    const hasEmail = typeof email === "string";
    const hasNewPassword =
      typeof newPassword === "string" && newPassword.length > 0;

    if (!hasName && !hasEmail && !hasNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one profile field must be provided",
        path: ["body"],
      });
    }

    if (hasName && name.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name cannot be empty",
        path: ["body", "name"],
      });
    }

    if (hasNewPassword && newPassword.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password must be at least 6 characters",
        path: ["body", "newPassword"],
      });
    }

    if (
      hasNewPassword &&
      (!currentPassword || currentPassword.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current password is required to change password",
        path: ["body", "currentPassword"],
      });
    }
  })
  .passthrough();

const validateCreateGroup = z
  .object({
    body: z.object({
      name: z.string().trim().min(1, "Group name is required"),
      inviteCode: optionalString(z.string()),
    }),
  })
  .superRefine((data, ctx) => {
    const inviteCode = data.body?.inviteCode;

    if (typeof inviteCode === "string") {
      const trimmedInviteCode = inviteCode.trim();

      if (trimmedInviteCode.length > 0 && trimmedInviteCode.length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invite code must be at least 4 characters when provided",
          path: ["body", "inviteCode"],
        });
      }
    }
  })
  .passthrough();

const validateJoinGroup = z
  .object({
    body: z.object({
      code: z.string().trim().min(1, "Invite code is required"),
    }),
  })
  .passthrough();

const validateCreateTask = z
  .object({
    body: z.object({
      name: z.string().trim().min(1, "Task name is required"),
      deadline: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.coerce
          .date({
            invalid_type_error: "Valid deadline is required",
            required_error: "Valid deadline is required",
          })
          .refine(
            (value) => !Number.isNaN(value.getTime()),
            "Valid deadline is required",
          ),
      ),
      difficulty: optionalNumber(
        z.coerce
          .number()
          .int()
          .min(1, "Difficulty must be 1-5")
          .max(5, "Difficulty must be 1-5"),
      ),
      status: optionalString(
        z.enum(["pending", "in-progress", "completed"], {
          message: "Status is invalid",
        }),
      ),
    }),
  })
  .passthrough();

const validateUpdateTask = z
  .object({
    params: z.object({
      id: objectId("Task id is invalid"),
    }),
    body: z.object({
      name: optionalString(
        z.string().trim().min(1, "Task name cannot be empty"),
      ),
      subject: optionalString(
        z.string({ invalid_type_error: "Subject must be a string" }),
      ),
      deadline: optionalString(
        z.coerce
          .date({
            invalid_type_error: "Deadline must be a valid date",
            required_error: "Deadline must be a valid date",
          })
          .refine(
            (value) => !Number.isNaN(value.getTime()),
            "Deadline must be a valid date",
          ),
      ),
      difficulty: optionalNumber(
        z.coerce
          .number()
          .int()
          .min(1, "Difficulty must be 1-5")
          .max(5, "Difficulty must be 1-5"),
      ),
      status: optionalString(
        z.enum(["pending", "in-progress", "completed"], {
          message: "Status is invalid",
        }),
      ),
    }),
  })
  .passthrough();

const validateAssignTask = z
  .object({
    body: z.object({
      taskId: objectId("taskId is invalid"),
      assignedTo: objectId("assignedTo is invalid"),
      groupId: objectId("groupId is invalid"),
    }),
  })
  .passthrough();

module.exports = {
  validateRegister,
  validateLogin,
  validateGoogleLogin,
  validateRefreshPayload,
  validateProfileUpdate,
  validateCreateGroup,
  validateJoinGroup,
  validateCreateTask,
  validateUpdateTask,
  validateAssignTask,
};
