// src/utils/response.js
/**
 * Sends a standardized success JSON response.
 */
export function sendSuccess(res, statusCode, message, data = null, extra = {}) {
  const body = { success: true, message, ...extra };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
}

/**
 * Builds a pagination metadata object.
 */
export function buildPagination(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
