const supabase = require('../config/db');
const { uploadToImageKit } = require('../config/imagekit');

// Protect from bugs: Database query errors fetching profile
const getMe = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('user_id', req.user.user_id)
      .single();

    if (error) throw error;

    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB update failures
const updateMe = async (req, res, next) => {
  try {
    const { full_name, phone_number } = req.body;
    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (phone_number) updates.phone_number = phone_number;

    const { data: user, error } = await supabase
      .from('Users')
      .update(updates)
      .eq('user_id', req.user.user_id)
      .select()
      .single();

    if (error) throw error;
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Upload failures (returns 502 in error handler) and DB update failures
const verifyStudent = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No student_id file uploaded', error: 'Missing file' });
    }

    const { originalname, buffer } = req.file;
    const fileName = `student_id_${Date.now()}_${originalname}`;
    
    // Upload to ImageKit
    const imageUrl = await uploadToImageKit(buffer, fileName, '/student-ids');

    const { data: user, error } = await supabase
      .from('Users')
      .update({ student_id_url: imageUrl, is_student_verified: false })
      .eq('user_id', req.user.user_id)
      .select()
      .single();

    if (error) throw error;
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Student ID uploaded successfully. Pending admin approval.',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Upload or DB failures
const verifyVehicle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No vehicle_license file uploaded', error: 'Missing file' });
    }

    const { originalname, buffer } = req.file;
    const fileName = `vehicle_license_${Date.now()}_${originalname}`;
    
    // Upload to ImageKit
    const imageUrl = await uploadToImageKit(buffer, fileName, '/vehicle-licenses');

    const { data: user, error } = await supabase
      .from('Users')
      .update({ vehicle_license_url: imageUrl })
      .eq('user_id', req.user.user_id)
      .select()
      .single();

    if (error) throw error;
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Vehicle license uploaded successfully.',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB failures
const updateAvailability = async (req, res, next) => {
  try {
    const { is_available } = req.body;

    const { data: user, error } = await supabase
      .from('Users')
      .update({ is_available })
      .eq('user_id', req.user.user_id)
      .select()
      .single();

    if (error) throw error;
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully.',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  verifyStudent,
  verifyVehicle,
  updateAvailability,
};
