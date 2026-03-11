const supabase = require('../config/db');

// Protect from bugs: DB query failure
const getUsers = async (req, res, next) => {
  try {
    const { role, is_student_verified, handyman_verified } = req.query;

    let query = supabase
      .from('Users')
      .select('user_id, full_name, email, phone_number, role, is_student_verified, handyman_verified, is_available, last_login, created_at');

    if (role) query = query.eq('role', role);
    if (is_student_verified !== undefined) query = query.eq('is_student_verified', is_student_verified === 'true');
    if (handyman_verified !== undefined) query = query.eq('handyman_verified', handyman_verified === 'true');

    const { data: users, error } = await query;
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Ensure everything but pw hash is sent
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB update failure
const verifyStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_student_verified } = req.body;

    const { data: user, error } = await supabase
      .from('Users')
      .update({ is_student_verified })
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw error;
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Student verification status updated',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Update failure
const verifyHandyman = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { handyman_verified } = req.body;

    const { data: user, error } = await supabase
      .from('Users')
      .update({ handyman_verified })
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw error;
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Handyman verification status updated',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB Schema limit. Note: vehicle_license_url_approved does not strictly exist in Users.
// We'll log the approval as required per prompt, but also return user as is.
const verifyVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vehicle_license_url_approved } = req.body;

    // Log the approval since a dedicated column isn't listed in the strict spec although mentioned here.
    console.log(`[Admin Log] Vehicle license for user ${id} approved_status=${vehicle_license_url_approved}`);

    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) throw error;
    delete user.password_hash;
    // user.vehicle_license_url_approved = vehicle_license_url_approved; // mock dynamic prop if required

    res.status(200).json({
      success: true,
      message: `Vehicle verification logged for user ${id}`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Role constraints checking via array inclusion + fallback DB generic exception handler
const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['Student', 'General', 'Landlord', 'Handyman', 'Transport', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    const { data: user, error } = await supabase
      .from('Users')
      .update({ role })
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw error;
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Admin universal deletion bypasses ownership checking
const deletePropertyAny = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('Properties')
      .delete()
      .eq('property_id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Property removed',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Multiple promise concurrency. Handle errors gracefully inside each promise or globally.
const getStats = async (req, res, next) => {
  try {
    const stats_promises = [
      supabase.from('Users').select('*', { count: 'exact', head: true }),
      supabase.from('Bookings').select('*', { count: 'exact', head: true }),
      supabase.from('Maintenance_Requests').select('*', { count: 'exact', head: true }).neq('status', 'Completed'),
      supabase.from('Transport_Bookings').select('*', { count: 'exact', head: true }),
      supabase.from('Maintenance_Requests').select('created_at, completed_at').eq('status', 'Completed'),
      supabase.from('Users').select('role'),
    ];

    const results = await Promise.all(stats_promises);
    
    // Check for any errors
    for (let result of results) {
      if (result.error) throw result.error;
    }

    const total_users = results[0].count;
    const total_bookings = results[1].count;
    const active_jobs = results[2].count;
    const total_transport_bookings = results[3].count;
    
    // Average maintanence hours
    const completed_maintenance = results[4].data;
    let avg_maintenance_completion_hours = 0;
    if (completed_maintenance.length > 0) {
      let total_hours = 0;
      completed_maintenance.forEach(req => {
        const diff = new Date(req.completed_at) - new Date(req.created_at);
        total_hours += diff / (1000 * 60 * 60);
      });
      avg_maintenance_completion_hours = total_hours / completed_maintenance.length;
    }

    // Role distributions
    const usersList = results[5].data;
    const users_by_role = usersList.reduce((acc, curr) => {
      acc[curr.role] = (acc[curr.role] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {
        total_users,
        total_bookings,
        active_jobs,
        avg_maintenance_completion_hours: parseFloat(avg_maintenance_completion_hours.toFixed(2)),
        total_transport_bookings,
        users_by_role,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  verifyStudent,
  verifyHandyman,
  verifyVehicle,
  updateRole,
  deletePropertyAny,
  getStats,
};
