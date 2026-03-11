/**
 * Global Error Handler Middleware
 *
 * Bugs caught here could be:
 * 1. Database constraint violations (unique, foreign key, check).
 * 2. Database trigger exceptions (e.g., prevent_overbooking).
 * 3. Validation errors outside Joi, logic errors in controllers.
 * 4. ImageKit API failures or network issues.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // Handling Supabase/PostgreSQL Errors
  // Unique violation
  if (err.code === '23505') {
    statusCode = 409;
    message = 'A record with this value already exists.';
  }
  
  // Foreign key violation
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced record does not exist.';
  }

  // Raise Exception (User-defined triggers in PostgreSQL)
  if (err.code === 'P0001') {
    statusCode = 400;
    // err.message contains the trigger text
  }

  // Check violation
  if (err.code === '23514') {
    statusCode = 400;
    message = 'Value is out of allowed range.';
  }

  // Handle ImageKit upload failures (might come through as specific HTTP errors if thrown manually)
  if (err.name === 'ImageKitError' || err.message === 'Image upload failed') {
    statusCode = 502;
    message = 'Image upload failed';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message || err.details || err,
  });
};

module.exports = errorHandler;
