import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { changePasswordSchema, createUserSchema, updateProfileSchema, updateUserSchema, updateUserStatusSchema } from '../validators/user.validators.js';
import { idParamSchema } from '../validators/common.validators.js';

export const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.post('/', validate(createUserSchema), asyncHandler(userController.create));
userRoutes.get('/', asyncHandler(userController.list));
userRoutes.patch('/me/profile', validate(updateProfileSchema), asyncHandler(userController.updateProfile));
userRoutes.patch('/me/password', validate(changePasswordSchema), asyncHandler(userController.changePassword));
userRoutes.patch('/:id/status', validate(updateUserStatusSchema), asyncHandler(userController.updateStatus));
userRoutes.patch('/:id', validate(updateUserSchema), asyncHandler(userController.updateUser));
userRoutes.delete('/:id', validate(idParamSchema), asyncHandler(userController.remove));
