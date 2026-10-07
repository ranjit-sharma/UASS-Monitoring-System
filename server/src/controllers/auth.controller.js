// src/modules/auth/auth.controller.js
import { loginUser, logoutUser, registerUser } from '../services/auth.service.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'strict' : 'lax',
  maxAge: 8 * 60 * 60 * 1000, // 8 hours in ms â€” matches JWT_EXPIRES_IN default
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;

  const { token, user } = await loginUser({ email, password, ipAddress });

  res.cookie(env.cookieName, token, COOKIE_OPTIONS);

  sendSuccess(res, 200, 'Login successful', user);
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { token, user } = await registerUser({
    name,
    email,
    password,
    role,
    ipAddress: req.ip,
  });

  res.cookie(env.cookieName, token, COOKIE_OPTIONS);
  sendSuccess(res, 201, 'Account created successfully', user);
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user._id);

  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
  });

  sendSuccess(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Authenticated', req.user);
});
