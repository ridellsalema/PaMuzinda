const express = require('express');
const router = express.Router();

const {
  getMyTransportBookings,
  updateBookingStatus,
} = require('../controllers/transportBookings.controller');

const validate = require('../middleware/validate');
const { updateTransportBookingStatusSchema } = require('../validators/transport.validators');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

router.get('/my', protect, allowRoles('Student'), getMyTransportBookings);
router.put('/:id/status', protect, allowRoles('Transport'), validate(updateTransportBookingStatusSchema), updateBookingStatus);

module.exports = router;
