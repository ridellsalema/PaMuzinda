const supabase = require('../config/db');
const { uploadToImageKit } = require('../config/imagekit');

// Protect from bugs: Verification of active booking, Upload failures
const createMaintenanceRequest = async (req, res, next) => {
  try {
    const { property_id, issue_type, description } = req.body;
    const tenant_id = req.user.user_id;

    // Verify user has an active approved booking for the property
    const { data: booking, error: bError } = await supabase
      .from('Bookings')
      .select('booking_id')
      .eq('property_id', property_id)
      .eq('tenant_id', tenant_id)
      .eq('status', 'Approved')
      .single();

    if (bError || !booking) {
      return res.status(403).json({ success: false, message: 'You do not have an active approved booking for this property' });
    }

    let issue_photo_url = null;

    if (req.file) {
      const { originalname, buffer } = req.file;
      const fileName = `maintenance_${Date.now()}_${originalname}`;
      issue_photo_url = await uploadToImageKit(buffer, fileName, '/maintenance-photos');
    }

    const { data: request, error } = await supabase
      .from('Maintenance_Requests')
      .insert([{ property_id, tenant_id, issue_type, description, issue_photo_url, status: 'Open' }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Query fetch errors
const getMyRequests = async (req, res, next) => {
  try {
    const { data: requests, error } = await supabase
      .from('Maintenance_Requests')
      .select('*')
      .eq('tenant_id', req.user.user_id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Maintenance requests retrieved successfully',
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Query fetch errors searching for null handyman
const getOpenRequests = async (req, res, next) => {
  try {
    const { data: requests, error } = await supabase
      .from('Maintenance_Requests')
      .select('*')
      .eq('status', 'Open')
      .is('handyman_id', null);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Open maintenance requests retrieved successfully',
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB query joins across multiple tables for visibility logic
const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: request, error } = await supabase
      .from('Maintenance_Requests')
      .select(`
        *,
        Properties (address),
        Users:tenant_id (phone_number)
      `)
      .eq('request_id', id)
      .single();

    if (error || !request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    const isTenant = request.tenant_id === req.user.user_id;
    const isHandyman = request.handyman_id === req.user.user_id;
    const isAdmin = req.user.role === 'Admin';

    if (!isTenant && !isHandyman && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance request retrieved successfully',
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Checking if Open before accepting, concurrent accepted status bug
const acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: requestCheck, error: cError } = await supabase
      .from('Maintenance_Requests')
      .select('status')
      .eq('request_id', id)
      .single();

    if (cError || !requestCheck) return res.status(404).json({ success: false, message: 'Request not found' });
    if (requestCheck.status !== 'Open') return res.status(400).json({ success: false, message: 'Request is already assigned or completed' });

    const { data: request, error } = await supabase
      .from('Maintenance_Requests')
      .update({ handyman_id: req.user.user_id, status: 'Assigned', updated_at: new Date().toISOString() })
      .eq('request_id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Maintenance request assigned successfully',
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Updating status restrictions
const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verify assigned handyman
    const { data: requestCheck, error: cError } = await supabase
      .from('Maintenance_Requests')
      .select('handyman_id')
      .eq('request_id', id)
      .single();

    if (cError || !requestCheck) return res.status(404).json({ success: false, message: 'Request not found' });
    if (requestCheck.handyman_id !== req.user.user_id) return res.status(403).json({ success: false, message: 'You are not assigned to this request' });

    const { data: request, error } = await supabase
      .from('Maintenance_Requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('request_id', id)
      .select()
      .single();

    if (error) throw error; // completed_at set by triggers automatically if Completed

    res.status(200).json({
      success: true,
      message: 'Maintenance request status updated successfully',
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Admin analytics calculation via JS instead of SQL functions just in case.
const getAdminMaintenanceStats = async (req, res, next) => {
  try {
    const { data: requests, error } = await supabase
      .from('Maintenance_Requests')
      .select('*');

    if (error) throw error;

    // Calculate time diff in JS for monitoring logic per prompt requirement
    // Usually better in DB but standard JS is safer here.
    const enrichedRequests = requests.map(r => {
      let hours_diff = null;
      if (r.completed_at && r.created_at) {
        hours_diff = (new Date(r.completed_at) - new Date(r.created_at)) / (1000 * 60 * 60);
      }
      return { ...r, hours_diff };
    });

    res.status(200).json({
      success: true,
      message: 'Admin maintenance requests retrieved successfully',
      data: enrichedRequests,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMaintenanceRequest,
  getMyRequests,
  getOpenRequests,
  getRequestById,
  acceptRequest,
  updateRequestStatus,
  getAdminMaintenanceStats,
};
