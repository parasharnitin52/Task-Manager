import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

export const userService = {
  async create(user, payload) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can create users', 403);

    const existing = await userRepository.findByEmail(payload.email);
    if (existing) throw new AppError('Email is already registered', 409);

    const passwordHash = await bcrypt.hash(payload.password, env.bcryptSaltRounds);
    return userRepository.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: payload.role
    });
  },

  async updateProfile(user, payload) {
    if (payload.email && payload.email !== user.email) {
      const existing = await userRepository.findByEmail(payload.email);
      if (existing) throw new AppError('Email is already in use', 409);
    }
    const updated = await userRepository.updateProfile(user.id, payload);
    if (!updated) throw new AppError('User not found', 404);
    return updated;
  },

  async changePassword(user, payload) {
    const privateUser = await userRepository.findPrivateById(user.id);
    if (!privateUser) throw new AppError('User not found', 404);

    const valid = await bcrypt.compare(payload.currentPassword, privateUser.passwordHash);
    if (!valid) throw new AppError('Current password is incorrect', 400);

    const passwordHash = await bcrypt.hash(payload.newPassword, env.bcryptSaltRounds);
    await userRepository.updatePassword(user.id, passwordHash);
  },

  async remove(targetUserId, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can delete users', 403);
    if (targetUserId === user.id) throw new AppError('You cannot delete your own account', 400);

    const deleted = await userRepository.delete(targetUserId);
    if (!deleted) throw new AppError('User not found', 404);
  },

  async updateStatus(targetUserId, user, payload) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can update user status', 403);
    if (targetUserId === user.id && payload.isActive === false) {
      throw new AppError('You cannot deactivate your own account', 400);
    }

    const updated = await userRepository.updateStatus(targetUserId, payload.isActive);
    if (!updated) throw new AppError('User not found', 404);
    return updated;
  },

  async updateUser(targetUserId, user, payload) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can edit users', 403);

    const target = await userRepository.findById(targetUserId);
    if (!target) throw new AppError('User not found', 404);

    if (payload.email && payload.email !== target.email) {
      const existing = await userRepository.findByEmail(payload.email);
      if (existing) throw new AppError('Email is already in use', 409);
    }

    const updated = await userRepository.updateProfile(targetUserId, payload);
    return { user: updated };
  }
};
