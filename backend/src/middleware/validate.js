const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return res.status(422).json({
      success: false,
      message: errorMessages,
      error: 'Validation failed',
    });
  }
  
  next();
};

module.exports = validate;
