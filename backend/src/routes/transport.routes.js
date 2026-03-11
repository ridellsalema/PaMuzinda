const express = require('express');
const router = express.Router();

const {
  getActiveTransport,
  getTransportById,
  createTransport,
  updateTransport,
  updateTransportStatus,
} = require('../controllers/transport.controller');
const {
  bookTransport,
  getServiceBookings,
} = require('../controllers/transportBookings.controller');

const validate = require('../middleware/validate');
const {
  createTransportSchema,
  updateTransportSchema,
  updateTransportStatusSchema,
  bookTransportSchema,
} = require('../validators/transport.validators');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

// Public
router.get('/', getActiveTransport);
router.get('/:id', getTransportById);

// Protected Transport
router.post('/', protect, allowRoles('Transport'), validate(createTransportSchema), createTransport);
router.put('/:id', protect, allowRoles('Transport'), validate(updateTransportSchema), updateTransport);
router.put('/:id/status', protect, allowRoles('Transport'), validate(updateTransportStatusSchema), updateTransportStatus);

// Nested routes
router.post('/:id/book', protect, allowRoles('Student'), validate(bookTransportSchema), bookTransport);
router.get('/:id/bookings', protect, allowRoles('Transport'), getServiceBookings);

module.exports = router;
