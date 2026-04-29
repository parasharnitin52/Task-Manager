import { projectService } from '../services/project.service.js';

export const projectController = {
  async create(req, res) {
    const project = await projectService.create(req.body, req.user);
    res.status(201).json(project);
  },

  async list(req, res) {
    res.json(await projectService.list(req.user));
  },

  async get(req, res) {
    res.json(await projectService.get(req.params.id, req.user));
  },

  async update(req, res) {
    res.json(await projectService.update(req.params.id, req.body, req.user));
  },

  async remove(req, res) {
    await projectService.remove(req.params.id, req.user);
    res.status(204).send();
  },

  async addMember(req, res) {
    res.status(201).json(await projectService.addMember(req.params.id, req.body, req.user));
  },

  async removeMember(req, res) {
    await projectService.removeMember(req.params.id, req.params.userId, req.user);
    res.status(204).send();
  }
};
