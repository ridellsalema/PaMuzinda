const Joi = require('joi');

const createTransportSchema = Joi.object({
  vehicle_details: Joi.string().required(),
  route_description: Joi.string().required(),
  pickup_area: Joi.string().required(),
  seat_capacity: Joi.number().integer().min(1).required(),
  available_seats: Joi.number().integer().min(0).max(Joi.ref('seat_capacity')).required(),
});

const updateTransportSchema = Joi.object({
  vehicle_details: Joi.string().optional(),
  route_description: Joi.string().optional(),
  pickup_area: Joi.string().optional(),
  seat_capacity: Joi.number().integer().min(1).optional(),
  available_seats: Joi.number().integer().min(0).optional(),
});

const updateTransportStatusSchema = Joi.object({
  is_active: Joi.boolean().required(),
});

const bookTransportSchema = Joi.object({
  pickup_time: Joi.date().iso().required(),
});

const updateTransportBookingStatusSchema = Joi.object({
  status: Joi.string().valid('Confirmed', 'Cancelled', 'Completed').required(),
});

module.exports = {
  createTransportSchema,
  updateTransportSchema,
  updateTransportStatusSchema,
  bookTransportSchema,
  updateTransportBookingStatusSchema,
};
