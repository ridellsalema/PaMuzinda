const Joi = require('joi');

const createMaintenanceSchema = Joi.object({
  property_id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  issue_type: Joi.string().required(),
  description: Joi.string().required(),
});

const updateMaintenanceStatusSchema = Joi.object({
  status: Joi.string().valid('In Progress', 'Completed').required(),
});

module.exports = {
  createMaintenanceSchema,
  updateMaintenanceStatusSchema,
};
