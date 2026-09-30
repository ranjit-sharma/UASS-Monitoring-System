// src/config/database.js
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export async function connectDatabase(uri) {
  const connectionUri = uri || process.env.MONGODB_URI;

  // Sanitize the URI for logging (hide credentials)
  const safeUri = connectionUri.replace(/\/\/[^@]+@/, '//***:***@');

  try {
    await mongoose.connect(connectionUri, {
      // Prevent NoSQL injection by disabling prototype pollution
      sanitizeFilter: true,
    });
    logger.info({ uri: safeUri }, 'MongoDB connected');
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    throw error;
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});
