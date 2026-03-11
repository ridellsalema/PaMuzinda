const Joi = require('joi');

const createRatingSchema = Joi.object({
  target_user_id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional().allow(''),
});

module.exports = {
  createRatingSchema,
};
