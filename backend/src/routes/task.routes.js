import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParamSchema } from '../validators/common.validators.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validators.js';
import { createCommentSchema, taskIdParamSchema } from '../validators/comment.validators.js';

export const taskRoutes = Router();

taskRoutes.use(authenticate);
taskRoutes.get('/', asyncHandler(taskController.list));
taskRoutes.post('/', validate(createTaskSchema), asyncHandler(taskController.create));
taskRoutes.patch('/:id', validate(updateTaskSchema), asyncHandler(taskController.update));
taskRoutes.delete('/:id', validate(idParamSchema), asyncHandler(taskController.remove));
taskRoutes.get('/:id/comments', validate(taskIdParamSchema), asyncHandler(taskController.listComments));
taskRoutes.post('/:id/comments', validate(createCommentSchema), asyncHandler(taskController.addComment));
