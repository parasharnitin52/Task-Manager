import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

const signToken = (user) =>
  jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn
  });

export const authService = {
  async signup(payload) {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, env.bcryptSaltRounds);
    const user = await userRepository.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: 'ADMIN'
    });

    return { user, token: signToken(user) };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account is inactive. Contact an admin.', 403);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const { passwordHash, ...safeUser } = user;
    return { user: safeUser, token: signToken(user) };
  }
};
