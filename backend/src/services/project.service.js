import { projectRepository } from '../repositories/project.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

const canManageProject = async (projectId, user) => {
  if (user.role === 'ADMIN') return true;
  const project = await projectRepository.findById(projectId);
  return project?.ownerId === user.id;
};

export const projectService = {
  async create(payload, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can create projects', 403);
    const project = await projectRepository.create({ ...payload, ownerId: user.id });
    await projectRepository.addMember({ projectId: project.id, userId: user.id, role: 'ADMIN' });
    return project;
  },

  async list(user) {
    return projectRepository.listForUser(user);
  },

  async get(id, user) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError('Project not found', 404);

    const allowed = user.role === 'ADMIN' || project.ownerId === user.id || await projectRepository.isMember(id, user.id);
    if (!allowed) throw new AppError('You do not have access to this project', 403);

    const members = await projectRepository.listMembers(id);
    const assignableMembers = await projectRepository.listAssignableMembers(id);
    return { ...project, members, assignableMembers };
  },

  async update(id, payload, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can update projects', 403);
    const project = await projectRepository.update(id, payload);
    if (!project) throw new AppError('Project not found', 404);
    return project;
  },

  async remove(id, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can delete projects', 403);
    await projectRepository.delete(id);
  },

  async addMember(projectId, payload, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can manage members', 403);
    const targetUser = await userRepository.findById(payload.userId);
    if (!targetUser) throw new AppError('User not found', 404);
    if (targetUser.role === 'ADMIN') throw new AppError('Only non-admin users can be added as project members', 400);
    return projectRepository.addMember({ projectId, userId: payload.userId, role: 'MEMBER' });
  },

  async removeMember(projectId, userId, user) {
    if (user.role !== 'ADMIN') throw new AppError('Only admins can manage members', 403);
    await projectRepository.removeMember(projectId, userId);
  }
};
