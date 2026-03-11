const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getMe,
  updateMe,
  verifyStudent,
  verifyVehicle,
  updateAvailability,
} = require('../controllers/users.controller');

const validate = require('../middleware/validate');
const { updateProfileSchema, availabilitySchema } = require('../validators/auth.validators');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

// Setup multer memory storage for image uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', protect, getMe);
router.put('/me', protect, validate(updateProfileSchema), updateMe);

router.post(
  '/me/verify-student',
  protect,
  allowRoles('Student'),
  upload.single('student_id'),
  verifyStudent
);

router.post(
  '/me/verify-vehicle',
  protect,
  allowRoles('Transport'),
  upload.single('vehicle_license'),
  verifyVehicle
);

router.put(
  '/me/availability',
  protect,
  allowRoles('Handyman', 'Transport'),
  validate(availabilitySchema),
  updateAvailability
);

module.exports = router;
