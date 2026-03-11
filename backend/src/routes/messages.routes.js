const express = require('express');
const router = express.Router();

const {
  sendMessage,
  getConversations,
  getConversationWithUser,
  getAdminConversationThread,
} = require('../controllers/messages.controller');

const validate = require('../middleware/validate');
const { createMessageSchema } = require('../validators/message.validators');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleGuard');

router.post('/', protect, validate(createMessageSchema), sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/conversation/:userId', protect, getConversationWithUser);

router.get('/admin/:userId1/:userId2', protect, allowRoles('Admin'), getAdminConversationThread);

module.exports = router;
