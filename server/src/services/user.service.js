// src/modules/users/user.service.js
import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { createAuditLog } from './auditLog.service.js';
import { AUDIT_ACTIONS } from '../models/auditLog.model.js';

const BCRYPT_ROUNDS = 12;

export async function listUsers({ page, limit, role, isActive }) {
  const filter = {};
  if (role !== undefined) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive;

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return { users, total };
}

export async function getUserById(id) {
  const user = await User.findById(id).lean();
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function createUser({ name, email, password, role }, actorId) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.create({ name, email, passwordHash, role });

  await createAuditLog({
    userId: actorId,
    action: AUDIT_ACTIONS.USER_CREATED,
    resource: 'users',
    resourceId: user._id.toString(),
    metadata: { name, email, role },
  });

  return user.toJSON();
}

export async function updateUser(id, updates, actorId) {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User not found');

  const previousRole = user.role;
  const previousIsActive = user.isActive;

  Object.assign(user, updates);
  await user.save();

  // Log role changes separately for security visibility
  if (updates.role && updates.role !== previousRole) {
    await createAuditLog({
      userId: actorId,
      action: AUDIT_ACTIONS.ROLE_CHANGED,
      resource: 'users',
      resourceId: id,
      metadata: { from: previousRole, to: updates.role },
    });
  }

  if (updates.isActive === false && previousIsActive === true) {
    await createAuditLog({
      userId: actorId,
      action: AUDIT_ACTIONS.USER_DEACTIVATED,
      resource: 'users',
      resourceId: id,
    });
  } else {
    await createAuditLog({
      userId: actorId,
      action: AUDIT_ACTIONS.USER_UPDATED,
      resource: 'users',
      resourceId: id,
      metadata: updates,
    });
  }

  return user.toJSON();
}

export async function deactivateUser(id, actorId) {
  if (id === actorId.toString()) {
    throw ApiError.badRequest('You cannot deactivate your own account');
  }
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true }
  );
  if (!user) throw ApiError.notFound('User not found');

  await createAuditLog({
    userId: actorId,
    action: AUDIT_ACTIONS.USER_DEACTIVATED,
    resource: 'users',
    resourceId: id,
  });

  return user.toJSON();
}

export async function permanentlyDeleteUser(id, actorId) {
  if (id === actorId.toString()) {
    throw ApiError.badRequest('You cannot delete your own account');
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) throw ApiError.notFound('User not found');

  await createAuditLog({
    userId: actorId,
    action: AUDIT_ACTIONS.USER_DEACTIVATED,
    resource: 'users',
    resourceId: id,
    metadata: { permanentDelete: true, deletedEmail: user.email },
  });
}


