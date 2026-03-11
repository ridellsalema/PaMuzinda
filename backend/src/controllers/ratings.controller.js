const supabase = require('../config/db');

// Protect from bugs: Self-rating, duplicate rating
const createRating = async (req, res, next) => {
  try {
    const { target_user_id, rating, comment } = req.body;
    const reviewer_id = req.user.user_id;

    if (target_user_id === reviewer_id) {
      return res.status(400).json({ success: false, message: 'You cannot rate yourself' });
    }

    // Check for duplicate
    const { data: existingRating, error: checkError } = await supabase
      .from('Ratings')
      .select('rating_id')
      .eq('reviewer_id', reviewer_id)
      .eq('target_user_id', target_user_id)
      .single();

    if (existingRating) {
      return res.status(409).json({ success: false, message: 'You have already rated this user' });
    }

    const { data: newRating, error } = await supabase
      .from('Ratings')
      .insert([{ reviewer_id, target_user_id, rating, comment }])
      .select()
      .single();

    if (error) throw error; // Caught by global error handler

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: newRating,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Averages computed perfectly
const getUserRatings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { data: ratings, error } = await supabase
      .from('Ratings')
      .select(`
        *,
        Users:reviewer_id (full_name)
      `)
      .eq('target_user_id', userId);

    if (error) throw error;

    let average_rating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      average_rating = (sum / ratings.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      message: 'User ratings retrieved successfully',
      data: {
        ratings,
        average_rating: parseFloat(average_rating),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRating,
  getUserRatings,
};
