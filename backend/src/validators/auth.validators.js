const Joi = require('joi');

const registerSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone_number: Joi.string().required(),
  role: Joi.string().valid('Student', 'General', 'Landlord', 'Handyman', 'Transport', 'Admin').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  full_name: Joi.string().optional(),
  phone_number: Joi.string().optional(),
});

const availabilitySchema = Joi.object({
  is_available: Joi.boolean().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  availabilitySchema,
};
