const supabase = require('../config/db');

// Protect from bugs: Logic errors missing condition checks, DB constraint violations
const createBooking = async (req, res, next) => {
  try {
    const { property_id, start_date, end_date } = req.body;
    const tenant_id = req.user.user_id;

    // Check if property is available
    const { data: property, error: pError } = await supabase
      .from('Properties')
      .select('status')
      .eq('property_id', property_id)
      .single();

    if (pError || !property) {
      return res.status(404).json({ success: false, message: 'Property not found', error: pError });
    }

    if (property.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Property is not available for booking' });
    }

    // Check for duplicate pending or approved booking
    const { data: existingBooking, error: bError } = await supabase
      .from('Bookings')
      .select('booking_id')
      .eq('property_id', property_id)
      .eq('tenant_id', tenant_id)
      .in('status', ['Requested', 'Approved']);

    if (existingBooking && existingBooking.length > 0) {
      return res.status(409).json({ success: false, message: 'You already have an active request or booking for this property' });
    }

    // Insert booking
    const { data: newBooking, error } = await supabase
      .from('Bookings')
      .insert([{ property_id, tenant_id, start_date, end_date, status: 'Requested' }])
      .select()
      .single();

    if (error) throw error; // To global error handler

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: newBooking,
    });

  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Join query failures
const getMyBookings = async (req, res, next) => {
  try {
    const { data: bookings, error } = await supabase
      .from('Bookings')
      .select(`
        *,
        Properties (title, address)
      `)
      .eq('tenant_id', req.user.user_id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'My bookings retrieved successfully',
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Complex join queries over role mappings that could fail syntax
const getLandlordBookings = async (req, res, next) => {
  try {
    // Need to find all bookings for properties where landlord_id = req.user.user_id
    // Supabase allows nested selects to filter parent:
    // Workaround since filtering on joined tables in Supabase JS can be tricky: 
    // we get the properties first, then their bookings, or filter bookings by inner joining properties.
    const { data: bookings, error } = await supabase
      .from('Bookings')
      .select(`
        *,
        Properties!inner (title, address, landlord_id),
        Users:tenant_id (full_name, email, is_student_verified)
      `)
      .eq('Properties.landlord_id', req.user.user_id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Landlord bookings retrieved successfully',
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Authorization loopholes checking who is accessing the resource
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: booking, error } = await supabase
      .from('Bookings')
      .select(`
        *,
        Properties (landlord_id, title, address),
        Users:tenant_id (full_name, email, phone_number)
      `)
      .eq('booking_id', id)
      .single();

    if (error || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership/permissions
    const isTenant = booking.tenant_id === req.user.user_id;
    const isLandlord = booking.Properties.landlord_id === req.user.user_id;
    const isAdmin = req.user.role === 'Admin';

    if (!isTenant && !isLandlord && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Enforcing updates only by authorized landlords, relying on Postgres triggers
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verify booking is for a property owned by the landlord
    const { data: booking, error: fetchError } = await supabase
      .from('Bookings')
      .select(`booking_id, Properties (landlord_id)`)
      .eq('booking_id', id)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.Properties.landlord_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    // Updating status. If 'Approved', the DB trigger `update_property_status` fires.
    const { data: updatedBooking, error } = await supabase
      .from('Bookings')
      .update({ status })
      .eq('booking_id', id)
      .select()
      .single();

    if (error) throw error; // Trigger exceptions could be thrown here

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  getBookingById,
  updateBookingStatus,
};
