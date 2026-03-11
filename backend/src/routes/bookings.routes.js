const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookings.controller');

const validate = require('../middleware/validate');
const {
  createBookingSchema,
  updateBookingStatusSchema,
} = require('../validators/booking.validators');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

router.post('/', protect, allowRoles('Student', 'General'), validate(createBookingSchema), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/landlord', protect, allowRoles('Landlord'), getLandlordBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, allowRoles('Landlord'), validate(updateBookingStatusSchema), updateBookingStatus);

module.exports = router;
