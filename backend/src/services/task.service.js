import { projectRepository } from '../repositories/project.repository.js';
import { commentRepository } from '../repositories/comment.repository.js';
import { taskRepository } from '../repositories/task.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

const canAccessProject = async (projectId, user) => {
  const project = await projectRepository.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  return user.role === 'ADMIN' || project.ownerId === user.id || await projectRepository.isMember(projectId, user.id);
};

const canManageTask = async (task, user) => {
  if (user.role === 'ADMIN') return true;
  return false;
};

export const taskService = {
  async create(payload, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can create tasks', 403);
    if (!await canAccessProject(payload.projectId, user)) {
      throw new AppError('You do not have access to this project', 403);
    }

    for (const assigneeId of payload.assigneeIds) {
      const assignee = await userRepository.findById(assigneeId);
      if (!assignee) throw new AppError('Assignee not found', 404);
      if (assignee.role === 'ADMIN') throw new AppError('Tasks can only be assigned to non-admin members', 400);
      const isMember = await projectRepository.isMember(payload.projectId, assigneeId);
      if (!isMember) throw new AppError('Assignee must be a project member', 400);
    }

    return taskRepository.create({ ...payload, createdBy: user.id });
  },

  async list(user, filters) {
    return taskRepository.listForUser(user, filters);
  },

  async update(id, payload, user) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('Task not found', 404);

    const canManage = await canManageTask(task, user);
    const isAssigned = await taskRepository.isAssignedTo(id, user.id);
    const isAssigneeProgressOnly = isAssigned && Object.keys(payload).every((key) => ['status', 'progress'].includes(key));

    if (!canManage && !isAssigneeProgressOnly) {
      throw new AppError('You do not have permission to update this task', 403);
    }

    if (payload.assigneeIds) {
      for (const assigneeId of payload.assigneeIds) {
        const assignee = await userRepository.findById(assigneeId);
        if (!assignee) throw new AppError('Assignee not found', 404);
        if (assignee.role === 'ADMIN') throw new AppError('Tasks can only be assigned to non-admin members', 400);
        const isMember = await projectRepository.isMember(task.projectId, assigneeId);
        if (!isMember) throw new AppError('Assignee must be a project member', 400);
      }
    }

    return taskRepository.update(id, payload);
  },

  async remove(id, user) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    if (!await canManageTask(task, user)) throw new AppError('You do not have permission to delete this task', 403);
    await taskRepository.delete(id);
  },

  async listComments(id, user) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    const allowed = user.role === 'ADMIN' || await taskRepository.isAssignedTo(id, user.id);
    if (!allowed) throw new AppError('You do not have access to this task', 403);
    return commentRepository.listForTask(id);
  },

  async addComment(id, payload, user) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('Task not found', 404);
    const allowed = user.role === 'ADMIN' || await taskRepository.isAssignedTo(id, user.id);
    if (!allowed) throw new AppError('You do not have access to this task', 403);
    return commentRepository.create({ taskId: id, userId: user.id, body: payload.body });
  }
};
