// src/modules/users/user.controller.js
import { listUsers, getUserById, createUser, updateUser, deactivateUser, permanentlyDeleteUser } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, buildPagination } from '../utils/response.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, role, isActive } = req.query;
  const { users, total } = await listUsers({ page, limit, role, isActive });
  sendSuccess(res, 200, 'Users retrieved', users, {
    pagination: buildPagination(page, limit, total),
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  sendSuccess(res, 200, 'User retrieved', user);
});

export const createUserHandler = asyncHandler(async (req, res) => {
  const user = await createUser(req.body, req.user._id);
  sendSuccess(res, 201, 'User created', user);
});

export const updateUserHandler = asyncHandler(async (req, res) => {
  const user = await updateUser(req.params.id, req.body, req.user._id);
  sendSuccess(res, 200, 'User updated', user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.query.permanent === 'true') {
    await permanentlyDeleteUser(req.params.id, req.user._id);
    sendSuccess(res, 200, 'User permanently deleted');
  } else {
    const user = await deactivateUser(req.params.id, req.user._id);
    sendSuccess(res, 200, 'User deactivated', user);
  }
});


