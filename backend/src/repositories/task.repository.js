import { Op } from 'sequelize';
import { Project, Task, TaskAssignee, User } from '../models/index.js';
import { taskSummary } from './serializers.js';

const taskIncludes = [
  { model: Project, as: 'project', attributes: ['id', 'name', 'ownerId'] },
  { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
  { model: User, as: 'assignees', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } },
  { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
];

export const taskRepository = {
  async create({ projectId, title, description, assigneeIds, progress, createdBy, dueDate }) {
    const task = await Task.create({
      projectId,
      title,
      description,
      progress,
      assigneeId: assigneeIds[0],
      createdBy,
      dueDate
    });
    await task.setAssignees(assigneeIds);
    return this.findById(task.id);
  },

  async findById(id) {
    const task = await Task.findByPk(id, { include: taskIncludes });
    return taskSummary(task);
  },

  async listForUser(user, filters = {}) {
    const where = {};

    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.status) where.status = filters.status;

    if (user.role !== 'ADMIN') {
      const assignments = await TaskAssignee.findAll({ where: { userId: user.id }, attributes: ['taskId'] });
      where.id = { [Op.in]: assignments.map((assignment) => assignment.taskId) };
    }

    const tasks = await Task.findAll({
      where,
      include: taskIncludes,
      order: [
        ['dueDate', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });

    return tasks.map(taskSummary);
  },

  async update(id, data) {
    const task = await Task.findByPk(id);
    if (!task) return null;

    const { assigneeIds, ...taskData } = data;
    if (assigneeIds) {
      taskData.assigneeId = assigneeIds[0] ?? null;
    }

    await task.update(taskData);
    if (assigneeIds) {
      await task.setAssignees(assigneeIds);
    }

    return this.findById(id);
  },

  async isAssignedTo(taskId, userId) {
    const assignment = await TaskAssignee.findOne({ where: { taskId, userId } });
    return Boolean(assignment);
  },

  async assignedTaskIds(userId) {
    const assignments = await TaskAssignee.findAll({ where: { userId }, attributes: ['taskId'] });
    return assignments.map((assignment) => assignment.taskId);
  },

  async delete(id) {
    await Task.destroy({ where: { id } });
  }
};
