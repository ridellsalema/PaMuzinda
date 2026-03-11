const express = require('express');
const router = express.Router();

const {
  createRating,
  getUserRatings,
} = require('../controllers/ratings.controller');

const validate = require('../middleware/validate');
const { createRatingSchema } = require('../validators/rating.validators');
const { protect } = require('../middleware/auth');

router.post('/', protect, validate(createRatingSchema), createRating);
router.get('/user/:userId', getUserRatings);

module.exports = router;
