import { authService } from '../services/auth.service.js';

export const authController = {
  async signup(req, res) {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  },

  async login(req, res) {
    const result = await authService.login(req.body);
    res.json(result);
  },

  async me(req, res) {
    res.json({ user: req.user });
  }
};
