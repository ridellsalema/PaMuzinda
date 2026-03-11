const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
      is_student_verified: user.is_student_verified,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Protect from bugs: Database errors (e.g. duplicate email) are caught by global error handler
const register = async (req, res, next) => {
  try {
    const { full_name, email, password, phone_number, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: user, error } = await supabase
      .from('Users')
      .insert([
        { full_name, email, password_hash, phone_number, role }
      ])
      .select()
      .single();

    if (error) throw error; // Pass to global error handler

    delete user.password_hash;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Incorrect credentials and database fetch errors
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'User not found or email invalid',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Incorrect password',
      });
    }

    // Update last_login
    await supabase
      .from('Users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', user.user_id);

    const token = generateToken(user);
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Just a stateless logout
const logout = async (req, res, next) => {
  try {
    // True invalidation would require a token blacklist logic (e.g. storing invalidated tokens in Redis or DB).
    // For now, we rely on the client removing the token from storage.
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout };
