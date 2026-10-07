// src/modules/auth/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { createAuditLog } from './auditLog.service.js';
import { AUDIT_ACTIONS } from '../models/auditLog.model.js';

// Pre-computed bcrypt hash used when no user is found, to ensure constant-time
// password comparison and prevent timing-based user enumeration attacks.
const DUMMY_HASH = '$2b$12$invalidhashusedfortimingprotectiononly00000000000000000';
const BCRYPT_ROUNDS = 12;


/**
 * Signs a JWT with the user's ID as the subject.
 */
function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

/**
 * Authenticates a user by email and password.
 * Returns the signed JWT token and safe user data.
 * Throws ApiError on invalid credentials or inactive account.
 */
export async function loginUser({ email, password, ipAddress }) {
  // Fetch user with passwordHash (normally excluded by select: false)
  const user = await User.findOne({ email }).select('+passwordHash');

  // Always run bcrypt.compare even when user is not found.
  // This prevents timing-based user enumeration: an attacker cannot
  // distinguish "no such user" from "wrong password" by response time.
  const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
  const isMatch = await bcrypt.compare(password, hashToCompare);

  if (!user || !isMatch) {
    await createAuditLog({
      userId: user?._id ?? null,
      action: AUDIT_ACTIONS.LOGIN_FAILURE,
      resource: 'auth',
      metadata: { email, ipAddress },
    });
    // Generic message prevents user enumeration via error messages
    throw ApiError.unauthorized('Invalid email or password');
  }


  if (!user.isActive) {
    throw ApiError.unauthorized('Account is deactivated. Contact an administrator.');
  }

  await createAuditLog({
    userId: user._id,
    action: AUDIT_ACTIONS.LOGIN_SUCCESS,
    resource: 'auth',
    metadata: { ipAddress },
  });

  const token = signToken(user._id);

  return { token, user: user.toJSON() };
}

/**
 * Logs out a user by recording an audit event.
 * The actual cookie clearing is done in the controller.
 */
export async function logoutUser(userId) {
  await createAuditLog({
    userId,
    action: AUDIT_ACTIONS.LOGOUT,
    resource: 'auth',
  });
}

export async function registerUser({ name, email, password, role, ipAddress }) {
  const existingUser = await User.findOne({ email }).select('_id');
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const assignedRole = env.isProduction ? 'viewer' : role;
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: assignedRole,
    isActive: true,
  });

  await createAuditLog({
    userId: user._id,
    action: AUDIT_ACTIONS.USER_CREATED,
    resource: 'users',
    resourceId: user._id.toString(),
    metadata: { email, role: assignedRole, registration: true, ipAddress },
  });

  return {
    token: signToken(user._id),
    user: user.toJSON(),
  };
}
