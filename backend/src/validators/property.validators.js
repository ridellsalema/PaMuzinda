const Joi = require('joi');

const createPropertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  address: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  price_per_month: Joi.number().positive().required(),
  property_type: Joi.string().required(),
  sharing_type: Joi.string().required(),
  is_student_only: Joi.boolean().required(),
});

const updatePropertySchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  address: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  price_per_month: Joi.number().positive().optional(),
  property_type: Joi.string().optional(),
  sharing_type: Joi.string().optional(),
  is_student_only: Joi.boolean().optional(),
});

const updatePropertyStatusSchema = Joi.object({
  status: Joi.string().valid('Available', 'Occupied', 'Pending').required(),
});

module.exports = {
  createPropertySchema,
  updatePropertySchema,
  updatePropertyStatusSchema,
};
