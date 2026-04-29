import { userRepository } from '../repositories/user.repository.js';
import { userService } from '../services/user.service.js';

export const userController = {
  async create(req, res) {
    res.status(201).json(await userService.create(req.user, req.body));
  },

  async list(_req, res) {
    if (_req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admins can view users' });
    }
    res.json(await userRepository.list({ role: _req.query.role }));
  },

  async updateProfile(req, res) {
    const user = await userService.updateProfile(req.user, req.body);
    res.json({ user });
  },

  async changePassword(req, res) {
    await userService.changePassword(req.user, req.body);
    res.status(204).send();
  },

  async remove(req, res) {
    await userService.remove(req.params.id, req.user);
    res.status(204).send();
  },

  async updateStatus(req, res) {
    res.json(await userService.updateStatus(req.params.id, req.user, req.body));
  },

  async updateUser(req, res) {
    res.json(await userService.updateUser(req.params.id, req.user, req.body));
  }
};
