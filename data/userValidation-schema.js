import Joi from "joi";

export const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Email should be a type of text",
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
      "string.min": "Email must be at least 2 characters long",
      "string.max": "Email cannot exceed 50 characters",
      "any.required": "Email is required",
    }),

  password: Joi.string().min(8).optional().messages({
    "string.base": "Password should be a type of text",
    "string.min": "Password must be at least 8 characters long",
  }),

  role: Joi.string().valid("employee", "manager").default("employee").messages({
    "any.only": "Role must be either 'employee' or 'manager'",
  }),

  active: Joi.boolean().default(false),
});

export const passwordResetSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email should be a type of text",
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  oneTimePassword: Joi.string().required().messages({
    "string.base": "Current password should be a type of text",
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),

  newPassword: Joi.string().min(8).required().messages({
    "string.base": "New password should be a type of text",
    "string.empty": "New password is required",
    "string.min": "New password must be at least 8 characters long",
    "any.required": "New password is required",
  }),

  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords must match",
      "any.required": "Please confirm your password",
    }),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email should be a type of text",
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string().required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});
