const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  createMaintenanceRequest,
  getMyRequests,
  getOpenRequests,
  getRequestById,
  acceptRequest,
  updateRequestStatus,
  getAdminMaintenanceStats,
} = require('../controllers/maintenance.controller');

const validate = require('../middleware/validate');
const {
  createMaintenanceSchema,
  updateMaintenanceStatusSchema,
} = require('../validators/maintenance.validators');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, allowRoles('Student', 'General'), upload.single('issue_photo'), validate(createMaintenanceSchema), createMaintenanceRequest);
router.get('/my', protect, getMyRequests);
router.get('/open', protect, allowRoles('Handyman'), getOpenRequests);
router.get('/admin', protect, allowRoles('Admin'), getAdminMaintenanceStats);
router.get('/:id', protect, getRequestById);
router.put('/:id/accept', protect, allowRoles('Handyman'), acceptRequest);
router.put('/:id/status', protect, allowRoles('Handyman'), validate(updateMaintenanceStatusSchema), updateRequestStatus);

module.exports = router;
