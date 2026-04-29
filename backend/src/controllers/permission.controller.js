import { permissionService } from '../services/permission.service.js';

export const permissionController = {
  async list(req, res) {
    res.json(await permissionService.list(req.user));
  },

  async me(req, res) {
    res.json(await permissionService.me(req.user));
  },

  async create(req, res) {
    res.status(201).json(await permissionService.create(req.body, req.user));
  },

  async update(req, res) {
    res.json(await permissionService.update(req.params.role, req.body.permissions, req.user));
  }
};
