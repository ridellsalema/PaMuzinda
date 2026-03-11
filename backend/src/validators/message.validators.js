const Joi = require('joi');

const createMessageSchema = Joi.object({
  receiver_id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  property_id: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow(null),
  message_text: Joi.string().required(),
});

module.exports = {
  createMessageSchema,
};
