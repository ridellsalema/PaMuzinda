const supabase = require('../config/db');

// Protect from bugs: Invalid foreign keys will be caught by global error handler
const sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, property_id, message_text } = req.body;
    const sender_id = req.user.user_id;

    if (sender_id == receiver_id) {
      return res.status(400).json({ success: false, message: 'You cannot message yourself' });
    }

    const { data: message, error } = await supabase
      .from('Messages')
      .insert([{ sender_id, receiver_id, property_id, message_text }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Advanced aggregations simulated effectively using JS
const getConversations = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    // Supabase lacks complex 'GROUP BY' in JS SDK. Fetch all user messages, then compute locally.
    const { data: messages, error } = await supabase
      .from('Messages')
      .select(`
        *,
        Sender:sender_id (full_name),
        Receiver:receiver_id (full_name)
      `)
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
      .order('sent_at', { ascending: false });

    if (error) throw error;

    const conversationsMap = {};

    messages.forEach((msg) => {
      const partnerId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
      const partnerName = msg.sender_id === user_id ? msg.Receiver?.full_name : msg.Sender?.full_name;
      
      if (!conversationsMap[partnerId]) {
        conversationsMap[partnerId] = {
          partner_id: partnerId,
          partner_name: partnerName,
          latest_message: msg.message_text,
          sent_at: msg.sent_at,
        };
      }
    });

    const conversations = Object.values(conversationsMap);

    res.status(200).json({
      success: true,
      message: 'Conversations retrieved successfully',
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Ascending query order
const getConversationWithUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { user_id: currentUserId } = req.user;

    const { data: messages, error } = await supabase
      .from('Messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
      .order('sent_at', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Message thread retrieved successfully',
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

// Protect from bugs: Asc order
const getAdminConversationThread = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.params;

    const { data: messages, error } = await supabase
      .from('Messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('sent_at', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Admin message thread retrieved successfully',
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getConversationWithUser,
  getAdminConversationThread,
};
