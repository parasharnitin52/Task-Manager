import { taskService } from '../services/task.service.js';

export const taskController = {
  async create(req, res) {
    res.status(201).json(await taskService.create(req.body, req.user));
  },

  async list(req, res) {
    res.json(await taskService.list(req.user, req.query));
  },

  async update(req, res) {
    res.json(await taskService.update(req.params.id, req.body, req.user));
  },

  async remove(req, res) {
    await taskService.remove(req.params.id, req.user);
    res.status(204).send();
  },

  async listComments(req, res) {
    res.json(await taskService.listComments(req.params.id, req.user));
  },

  async addComment(req, res) {
    res.status(201).json(await taskService.addComment(req.params.id, req.body, req.user));
  }
};
