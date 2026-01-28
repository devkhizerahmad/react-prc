import Joi from "joi";

// Validation schemas
const userSchemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be less than 50 characters long",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  getUserById: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.uuid": "Invalid user ID format",
      "any.required": "User ID is required",
    }),
  }),

  getUserByEmail: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
  }),
};

// Generic validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

// Specific validation middlewares
export const validateSignup = validate(userSchemas.signup);
export const validateLogin = validate(userSchemas.login);
export const validateGetUserById = validate(userSchemas.getUserById);
export const validateGetUserByEmail = validate(userSchemas.getUserByEmail);
