import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema, signupSchema } from '../validators/auth.validators.js';

export const authRoutes = Router();

authRoutes.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
authRoutes.post('/login', validate(loginSchema), asyncHandler(authController.login));
authRoutes.get('/me', authenticate, asyncHandler(authController.me));
