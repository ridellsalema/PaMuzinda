const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const propertiesRoutes = require('./routes/properties.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const transportRoutes = require('./routes/transport.routes');
const transportBookingsRoutes = require('./routes/transportBookings.routes');
const ratingsRoutes = require('./routes/ratings.routes');
const messagesRoutes = require('./routes/messages.routes');
const adminRoutes = require('./routes/admin.routes');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

// Request logging for debugging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/transport-bookings', transportBookingsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/admin', adminRoutes);



// Global Error Handler
app.use(errorHandler);

module.exports = app;
