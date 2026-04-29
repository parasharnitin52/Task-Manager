import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParamSchema } from '../validators/common.validators.js';
import { createProjectSchema, memberSchema, updateProjectSchema } from '../validators/project.validators.js';
import { z } from 'zod';

export const projectRoutes = Router();

const removeMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
    userId: z.string().uuid()
  })
});

projectRoutes.use(authenticate);
projectRoutes.get('/', asyncHandler(projectController.list));
projectRoutes.post('/', validate(createProjectSchema), asyncHandler(projectController.create));
projectRoutes.get('/:id', validate(idParamSchema), asyncHandler(projectController.get));
projectRoutes.patch('/:id', validate(updateProjectSchema), asyncHandler(projectController.update));
projectRoutes.delete('/:id', validate(idParamSchema), asyncHandler(projectController.remove));
projectRoutes.post('/:id/members', validate(memberSchema), asyncHandler(projectController.addMember));
projectRoutes.delete('/:id/members/:userId', validate(removeMemberSchema), asyncHandler(projectController.removeMember));
