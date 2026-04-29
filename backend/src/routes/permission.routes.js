import { Router } from 'express';
import { permissionController } from '../controllers/permission.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRoleSchema, updatePermissionsSchema } from '../validators/permission.validators.js';

export const permissionRoutes = Router();

permissionRoutes.use(authenticate);
permissionRoutes.get('/me', asyncHandler(permissionController.me));
permissionRoutes.get('/', asyncHandler(permissionController.list));
permissionRoutes.post('/', validate(createRoleSchema), asyncHandler(permissionController.create));
permissionRoutes.patch('/:role', validate(updatePermissionsSchema), asyncHandler(permissionController.update));
