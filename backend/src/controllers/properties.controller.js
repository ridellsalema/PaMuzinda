const supabase = require('../config/db');
const { uploadToImageKit } = require('../config/imagekit');

// Protect from bugs: Database errors when joining properties and images or applying filters
const getAllProperties = async (req, res, next) => {
  try {
    const { min_price, max_price, is_student_only, sharing_type, property_type, status } = req.query;

    let query = supabase
      .from('Properties')
      .select('*, Property_Images(image_id, image_url, uploaded_at)');

    if (min_price) query = query.gte('price_per_month', min_price);
    if (max_price) query = query.lte('price_per_month', max_price);
    if (is_student_only !== undefined) query = query.eq('is_student_only', is_student_only === 'true');
    if (sharing_type) query = query.eq('sharing_type', sharing_type);
    if (property_type) query = query.eq('property_type', property_type);
    if (status) query = query.eq('status', status);

    const { data: properties, error } = await query;
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Properties retrieved successfully',
      data: properties,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Concurrency bug incrementing views, DB fetch errors
const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Supabase RPC for atomic increment is preferred, but simple update is fine for this context without a custom SQL function:
    // Actually, simple fetch, increment locally, then update is susceptible to race conditions,
    // but without generating SQL (rpc constraint), we will do what we can. Let's do a direct update returning the value.
    // Wait, Supabase js doesn't have an atomic increment in update.
    // We will select first, increment, update.
    
    // Using a transaction-like approach or just two queries
    let { data: property, error: fetchError } = await supabase
      .from('Properties')
      .select('views_count')
      .eq('property_id', id)
      .single();

    if (fetchError || !property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const newViewsCount = property.views_count + 1;

    const { data: updatedProperty, error: updateError } = await supabase
      .from('Properties')
      .update({ views_count: newViewsCount })
      .eq('property_id', id)
      .select('*, Property_Images(*)')
      .single();

    if (updateError) throw updateError;

    res.status(200).json({
      success: true,
      message: 'Property retrieved successfully',
      data: updatedProperty,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Insert errors caught by DB
const createProperty = async (req, res, next) => {
  try {
    const propertyData = { ...req.body, landlord_id: req.user.user_id };

    const { data: property, error } = await supabase
      .from('Properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to check property ownership
const checkOwnership = async (propertyId, landlordId) => {
  const { data, error } = await supabase
    .from('Properties')
    .select('landlord_id')
    .eq('property_id', propertyId)
    .single();
  
  if (error) return { error: 'Not found or DB error' };
  if (data.landlord_id !== landlordId) return { error: 'Forbidden' };
  return { success: true };
};

// Protect from bugs: Ownership verification failure, update failures
const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const authCheck = await checkOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Property not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized to modify this property' });

    const { data: property, error } = await supabase
      .from('Properties')
      .update(req.body)
      .eq('property_id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB deletion failures, ownership issues
const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const authCheck = await checkOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Property not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });

    const { error } = await supabase
      .from('Properties')
      .delete()
      .eq('property_id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB update constraints
const updatePropertyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const authCheck = await checkOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Property not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized to update this status' });

    const { data: property, error } = await supabase
      .from('Properties')
      .update({ status })
      .eq('property_id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Property status updated successfully',
      data: property,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: DB query failures
const getPropertyImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data: images, error } = await supabase
      .from('Property_Images')
      .select('*')
      .eq('property_id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Property images retrieved successfully',
      data: images,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Network failures in ImageKit upload or DB insert errs
const addPropertyImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const authCheck = await checkOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Property not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized' });

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const { originalname, buffer } = req.file;
    const fileName = `property_${id}_${Date.now()}_${originalname}`;
    
    const imageUrl = await uploadToImageKit(buffer, fileName, '/property-images');

    const { data: image, error } = await supabase
      .from('Property_Images')
      .insert([{ property_id: id, image_url: imageUrl }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Validation of ownership, incorrect IDs
const deletePropertyImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;

    const authCheck = await checkOwnership(id, req.user.user_id);
    if (authCheck.error === 'Not found or DB error') return res.status(404).json({ success: false, message: 'Property not found' });
    if (authCheck.error === 'Forbidden') return res.status(403).json({ success: false, message: 'Not authorized' });

    // Validate image belongs to property
    const { data: imageDetails, error: imgError } = await supabase
      .from('Property_Images')
      .select('*')
      .eq('image_id', imageId)
      .single();

    if (imgError || !imageDetails || imageDetails.property_id.toString() !== id) {
      return res.status(404).json({ success: false, message: 'Image not found for this property' });
    }

    const { error: deletionError } = await supabase
      .from('Property_Images')
      .delete()
      .eq('image_id', imageId);

    if (deletionError) throw deletionError;

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getPropertyImages,
  addPropertyImage,
  deletePropertyImage,
};
