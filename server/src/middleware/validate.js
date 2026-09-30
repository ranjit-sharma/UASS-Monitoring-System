// src/middleware/validate.js
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Returns an Express middleware that validates a request part against a Zod schema.
 * Compatible with Zod v4 (.issues) and Express 5 (req.query is a readonly getter).
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      // Express 5: req.query is a readonly getter — use Object.defineProperty to override.
      // req.body and req.params are plain writable properties, so direct assignment works.
      if (source === 'query') {
        Object.defineProperty(req, 'query', {
          value: parsed,
          writable: true,
          configurable: true,
        });
      } else {
        req[source] = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Zod v4 uses .issues; v3 used .errors — support both
        const issues = err.issues ?? err.errors ?? [];
        const details = issues.map((e) => ({
          field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
          message: e.message,
        }));
        return next(ApiError.badRequest('Request validation failed', details));
      }
      next(err);
    }
  };
}

