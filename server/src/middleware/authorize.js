// src/middleware/authorize.js
import { ApiError } from '../utils/ApiError.js';

/**
 * Returns middleware that allows only users with one of the specified roles.
 * Must be used AFTER the authenticate middleware.
 * @param {...string} allowedRoles
 */
export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      // Should not happen if authenticate runs first, but guard anyway
      return next(ApiError.unauthorized());
    }
    const userRole = String(req.user.role || '').trim();
    if (!allowedRoles.includes(userRole)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`
        )
      );
    }
    next();
  };
}


