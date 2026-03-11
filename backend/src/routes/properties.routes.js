const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getPropertyImages,
  addPropertyImage,
  deletePropertyImage,
} = require('../controllers/properties.controller');

const validate = require('../middleware/validate');
const {
  createPropertySchema,
  updatePropertySchema,
  updatePropertyStatusSchema,
} = require('../validators/property.validators');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/:id/images', getPropertyImages);

// Protected Landlord routes
router.post('/', protect, allowRoles('Landlord'), validate(createPropertySchema), createProperty);
router.put('/:id', protect, allowRoles('Landlord'), validate(updatePropertySchema), updateProperty);
router.delete('/:id', protect, allowRoles('Landlord'), deleteProperty);
router.put('/:id/status', protect, allowRoles('Landlord'), validate(updatePropertyStatusSchema), updatePropertyStatus);

router.post('/:id/images', protect, allowRoles('Landlord'), upload.single('image'), addPropertyImage);
router.delete('/:id/images/:imageId', protect, allowRoles('Landlord'), deletePropertyImage);

module.exports = router;
