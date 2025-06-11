import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js'; // ✅ Import logger
import userRoutes from './routes/Auth.js';
import blogRoutes from './routes/BlogRoutes.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);


// 404 Handler (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
  });

  res.status(500).json({ message: 'Unexpected error occurred' });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname';

mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected');
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err.message);
  });

// Node.js warning handler (e.g. for MongoDB deprecation warnings)
process.on('warning', (warning) => {
  logger.warn(`Process Warning: ${warning.name} - ${warning.message}`);
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
