import { Op } from 'sequelize';
import { Project, ProjectMember, Task, User } from '../models/index.js';
import { memberSummary, projectSummary } from './serializers.js';

const projectIncludes = [
  { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
  { model: Task, as: 'tasks', attributes: ['id', 'status'] }
];

const projectIdsForMember = async (userId) => {
  const rows = await ProjectMember.findAll({ where: { userId }, attributes: ['projectId'] });
  return rows.map((row) => row.projectId);
};

export const projectRepository = {
  async create({ name, description, ownerId, dueDate }) {
    const project = await Project.create({ name, description, ownerId, dueDate });
    return projectSummary(await this.findRawById(project.id));
  },

  async addMember({ projectId, userId, role }) {
    const [member] = await ProjectMember.upsert({ projectId, userId, role });
    return {
      projectId: member.projectId,
      userId: member.userId,
      role: member.role
    };
  },

  async removeMember(projectId, userId) {
    await ProjectMember.destroy({ where: { projectId, userId } });
  },

  async listForUser(user) {
    const where = {};

    if (user.role !== 'ADMIN') {
      const memberProjectIds = await projectIdsForMember(user.id);
      where[Op.or] = [{ ownerId: user.id }, { id: { [Op.in]: memberProjectIds } }];
    }

    const projects = await Project.findAll({
      where,
      include: projectIncludes,
      order: [['createdAt', 'DESC']]
    });

    return projects.map(projectSummary);
  },

  async findRawById(id) {
    return Project.findByPk(id, { include: projectIncludes });
  },

  async findById(id) {
    return projectSummary(await this.findRawById(id));
  },

  async update(id, data) {
    const project = await Project.findByPk(id);
    if (!project) return null;

    await project.update(data);
    return projectSummary(await this.findRawById(id));
  },

  async delete(id) {
    await Project.destroy({ where: { id } });
  },

  async listMembers(projectId) {
    const rows = await ProjectMember.findAll({
      where: { projectId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }],
      order: [[{ model: User, as: 'user' }, 'name', 'ASC']]
    });

    return rows.map(memberSummary);
  },

  async listAssignableMembers(projectId) {
    const rows = await ProjectMember.findAll({
      where: { projectId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role'],
        where: { role: 'MEMBER' }
      }],
      order: [[{ model: User, as: 'user' }, 'name', 'ASC']]
    });

    return rows.map(memberSummary);
  },

  async isMember(projectId, userId) {
    const row = await ProjectMember.findOne({ where: { projectId, userId } });
    return Boolean(row);
  },

  async idsForUser(user) {
    if (user.role === 'ADMIN') return null;
    const memberProjectIds = await projectIdsForMember(user.id);
    const ownedProjects = await Project.findAll({ where: { ownerId: user.id }, attributes: ['id'] });
    return [...new Set([...memberProjectIds, ...ownedProjects.map((project) => project.id)])];
  }
};
