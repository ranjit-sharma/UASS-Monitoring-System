// src/utils/asyncHandler.js
/**
 * Wraps an async route handler to automatically pass errors to next().
 * Eliminates the need for try/catch in every controller method.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
