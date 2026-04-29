import { Op } from 'sequelize';
import { Project, Task, TaskAssignee, User } from '../models/index.js';
import { projectRepository } from './project.repository.js';
import { taskSummary } from './serializers.js';

const scopedTaskWhere = async (user) => {
  if (user.role === 'ADMIN') return {};
  const assignments = await TaskAssignee.findAll({ where: { userId: user.id }, attributes: ['taskId'] });
  return { id: { [Op.in]: assignments.map((assignment) => assignment.taskId) } };
};

export const dashboardRepository = {
  async getStats(user) {
    const taskWhere = await scopedTaskWhere(user);
    const projectWhere = {};

    if (user.role !== 'ADMIN') {
      const projectIds = await projectRepository.idsForUser(user);
      projectWhere.id = { [Op.in]: projectIds };
    }

    const today = new Date().toISOString().slice(0, 10);
    const [projectCount, taskCount, todoCount, inProgressCount, doneCount, overdueCount, dueTodayCount] = await Promise.all([
      Project.count({ where: projectWhere }),
      Task.count({ where: taskWhere }),
      Task.count({ where: { ...taskWhere, status: 'TODO' } }),
      Task.count({ where: { ...taskWhere, status: 'IN_PROGRESS' } }),
      Task.count({ where: { ...taskWhere, status: 'DONE' } }),
      Task.count({
        where: {
          ...taskWhere,
          status: { [Op.ne]: 'DONE' },
          dueDate: { [Op.lt]: today }
        }
      }),
      Task.count({
        where: {
          ...taskWhere,
          status: { [Op.ne]: 'DONE' },
          dueDate: today
        }
      })
    ]);

    return { projectCount, taskCount, todoCount, inProgressCount, doneCount, overdueCount, dueTodayCount };
  },

  async getOverdueTasks(user) {
    const taskWhere = await scopedTaskWhere(user);
    const tasks = await Task.findAll({
      where: {
        ...taskWhere,
        status: { [Op.ne]: 'DONE' },
        dueDate: { [Op.lt]: new Date().toISOString().slice(0, 10) }
      },
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name'] },
        { model: User, as: 'assignees', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ],
      order: [['dueDate', 'ASC']],
      limit: 10
    });

    return tasks.map(taskSummary);
  },

  async getDistribution(user) {
    if (user.role !== 'ADMIN') return [];

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [{ model: Task, as: 'multiAssignedTasks', attributes: ['id', 'status'], through: { attributes: [] } }],
      order: [['name', 'ASC']]
    });

    return users.map((row) => {
      const data = row.get({ plain: true });
      const tasks = data.multiAssignedTasks ?? [];
      return {
        userId: data.id,
        name: data.name,
        email: data.email,
        total: tasks.length,
        done: tasks.filter((task) => task.status === 'DONE').length,
        inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
        todo: tasks.filter((task) => task.status === 'TODO').length
      };
    });
  }
};
