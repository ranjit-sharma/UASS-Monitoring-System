// src/routes/user.routes.js
import { Router } from 'express';
import { getUsers, getUser, createUserHandler, updateUserHandler, deleteUser } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from '../validators/user.schema.js';

export const userRouter = Router();

// All user endpoints require authentication and admin role
userRouter.use(authenticate, authorize('admin'));

userRouter.get('/', validate(listUsersQuerySchema, 'query'), getUsers);
userRouter.get('/:id', validate(userIdParamSchema, 'params'), getUser);
userRouter.post('/', validate(createUserSchema), createUserHandler);
userRouter.patch('/:id', validate(userIdParamSchema, 'params'), validate(updateUserSchema), updateUserHandler);
userRouter.delete('/:id', validate(userIdParamSchema, 'params'), deleteUser);

