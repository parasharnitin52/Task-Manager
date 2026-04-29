import { permissionRepository } from '../repositories/permission.repository.js';
import { AppError } from '../utils/AppError.js';

export const permissionService = {
  async list(user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can view role permissions', 403);
    return permissionRepository.list();
  },

  async update(role, permissions, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can manage role permissions', 403);
    return permissionRepository.update(role, permissions);
  },

  async me(user) {
    return permissionRepository.getByRole(user.role);
  },

  async create(payload, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can create roles', 403);
    const result = await permissionRepository.create(payload.role, payload.permissions);
    if (!result.created) throw new AppError('Role already exists', 409);
    return result.role;
  }
};
