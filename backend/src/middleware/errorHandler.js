import { ZodError } from 'zod';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { env } from '../config/env.js';

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message
      }))
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ message: 'Resource already exists' });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((error) => ({ path: error.path, message: error.message }))
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    stack: env.nodeEnv === 'production' ? undefined : err.stack
  });
};
