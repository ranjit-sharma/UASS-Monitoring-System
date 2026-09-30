// src/middleware/errorHandler.js
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

/**
 * Converts Mongoose and other well-known errors into ApiError instances.
 */
function normalizeError(err) {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.badRequest('Validation failed', details);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return ApiError.conflict(`${field} already exists`);
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid value for field: ${err.path}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token expired');
  }

  return err;
}

/**
 * Global Express error handler. Must have 4 parameters to be recognized by Express.
 */
export function globalErrorHandler(err, req, res, _next) {
  const normalized = normalizeError(err);

  const statusCode = normalized.statusCode || 500;
  const message = normalized.message || 'Internal server error';
  const isOperational = normalized.isOperational === true;

  if (!isOperational || statusCode >= 500) {
    logger.error(
      { err: normalized, req: { method: req.method, url: req.url } },
      'Unhandled error'
    );
  }

  const body = {
    success: false,
    message,
  };

  if (normalized.details) {
    body.details = normalized.details;
  }

  // Only include stack trace in development
  if (!env.isProduction && !isOperational) {
    body.stack = normalized.stack;
  }

  res.status(statusCode).json(body);
}

/**
 * Middleware for routes that do not match any defined route.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
}
