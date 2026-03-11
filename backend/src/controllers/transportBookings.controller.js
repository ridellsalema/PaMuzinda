const supabase = require('../config/db');
const { checkTransportOwnership } = require('./transport.controller');

// Protect from bugs: Database Exceptions (caught and transformed by global handler into 400 Bad Request if P0001)
const bookTransport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pickup_time } = req.body;
    const student_id = req.user.user_id;

    // Database Trigger handling overbooking and decrementing automatically
    const { data: booking, error } = await supabase
      .from('Transport_Bookings')
      .insert([{ transport_id: id, student_id, pickup_time, status: 'Pending' }])
      .select()
      .single();

    if (error) throw error; // Global error handler intercepts P0001 (triggers) and returns 400.

    res.status(201).json({
      success: true,
      message: 'Transport booked successfully',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Join failures
const getMyTransportBookings = async (req, res, next) => {
  try {
    const { data: bookings, error } = await supabase
      .from('Transport_Bookings')
      .select(`
        *,
        Transport_Services (route_description, pickup_area)
      `)
      .eq('student_id', req.user.user_id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'My transport bookings retrieved successfully',
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Ownership validation failure
const getServiceBookings = async (req, res, next) => {
  try {
    const { id } = req.params; // transport_id

    const authCheck = await checkTransportOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Service not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized' });

    const { data: bookings, error } = await supabase
      .from('Transport_Bookings')
      .select(`
        *,
        Users:student_id (full_name, phone_number)
      `)
      .eq('transport_id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Service bookings retrieved successfully',
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Authorization of booking relationship
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // booking_id
    const { status } = req.body;

    // Verify booking belongs to a service owned by the provider
    const { data: bookingCheck, error: fetchErr } = await supabase
      .from('Transport_Bookings')
      .select('transport_id')
      .eq('booking_id', id)
      .single();

    if (fetchErr || !bookingCheck) return res.status(404).json({ success: false, message: 'Booking not found' });

    const authCheck = await checkTransportOwnership(bookingCheck.transport_id, req.user.user_id);
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized' });

    const { data: booking, error } = await supabase
      .from('Transport_Bookings')
      .update({ status })
      .eq('booking_id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  bookTransport,
  getMyTransportBookings,
  getServiceBookings,
  updateBookingStatus,
};
