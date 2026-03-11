const supabase = require('../config/db');

// Protect from bugs: Query defaults
const getActiveTransport = async (req, res, next) => {
  try {
    const { data: transport, error } = await supabase
      .from('Transport_Services')
      .select(`
        *,
        Users:provider_id (full_name, phone_number)
      `)
      .eq('is_active', true);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Active transport services retrieved successfully',
      data: transport,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Query failure
const getTransportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: transport, error } = await supabase
      .from('Transport_Services')
      .select(`
        *,
        Users:provider_id (full_name, phone_number)
      `)
      .eq('transport_id', id)
      .single();

    if (error || !transport) {
      return res.status(404).json({ success: false, message: 'Transport service not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Transport service retrieved successfully',
      data: transport,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Insertion failure
const createTransport = async (req, res, next) => {
  try {
    const provider_id = req.user.user_id;
    const transportData = { ...req.body, provider_id, is_active: true };

    const { data: transport, error } = await supabase
      .from('Transport_Services')
      .insert([transportData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Transport service created successfully',
      data: transport,
    });
  } catch (err) {
    next(err);
  }
};

// Helper: check ownership
const checkTransportOwnership = async (transportId, providerId) => {
  const { data, error } = await supabase
    .from('Transport_Services')
    .select('provider_id')
    .eq('transport_id', transportId)
    .single();
  
  if (error) return { error: 'Not found or DB error' };
  if (data.provider_id !== providerId) return { error: 'Forbidden' };
  return { success: true };
};

// Protect from bugs: Ownership verification failure
const updateTransport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const authCheck = await checkTransportOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Service not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized' });

    const { data: transport, error } = await supabase
      .from('Transport_Services')
      .update(req.body)
      .eq('transport_id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Transport service updated successfully',
      data: transport,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB restrictions
const updateTransportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const authCheck = await checkTransportOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Service not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized' });

    const { data: transport, error } = await supabase
      .from('Transport_Services')
      .update({ is_active })
      .eq('transport_id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Transport status updated successfully',
      data: transport,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActiveTransport,
  getTransportById,
  createTransport,
  updateTransport,
  updateTransportStatus,
  checkTransportOwnership,
};
