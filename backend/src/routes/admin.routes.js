const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  verifyStudent,
  verifyHandyman,
  verifyVehicle,
  updateRole,
  deletePropertyAny,
  getStats,
} = require('../controllers/admin.controller');

const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

// All admin routes are protected by Admin role
router.use(protect, allowRoles('Admin'));

router.get('/users', getUsers);
router.get('/users/:id', getUserById);

// Joi schemas could also be used here, but for simple booleans/strings we can inline validation in controller or create quick schema
router.put('/users/:id/verify-student', verifyStudent);
router.put('/users/:id/verify-handyman', verifyHandyman);
router.put('/users/:id/verify-vehicle', verifyVehicle);
router.put('/users/:id/role', updateRole);

router.delete('/properties/:id', deletePropertyAny);

router.get('/stats', getStats);

module.exports = router;
