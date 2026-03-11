const Joi = require('joi');

const createBookingSchema = Joi.object({
  property_id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
});

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('Approved', 'Denied').required(),
});

module.exports = {
  createBookingSchema,
  updateBookingStatusSchema,
};
