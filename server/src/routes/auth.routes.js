// src/routes/auth.routes.js
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, logout, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.schema.js';
import { env } from '../config/env.js';

export const authRouter = Router();

// Rate limit on login to prevent brute-force attacks.
// Disabled in test environment to allow automated test suites to run freely.
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isProduction ? 10 : 1000, // effectively unlimited in dev/test
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.nodeEnv === 'test',
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});

const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.isProduction ? 5 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many registration attempts. Try again later.' },
});

authRouter.post('/login', loginRateLimiter, validate(loginSchema), login);
authRouter.post('/register', registerRateLimiter, validate(registerSchema), register);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, getMe);

