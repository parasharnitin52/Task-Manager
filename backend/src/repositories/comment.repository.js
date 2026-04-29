import { TaskComment, User } from '../models/index.js';
import { commentSummary } from './serializers.js';

export const commentRepository = {
  async create({ taskId, userId, body }) {
    const comment = await TaskComment.create({ taskId, userId, body });
    return this.listForTask(taskId).then((comments) => comments.find((item) => item.id === comment.id));
  },

  async listForTask(taskId) {
    const comments = await TaskComment.findAll({
      where: { taskId },
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email', 'role', 'avatar'] }],
      order: [['createdAt', 'ASC']]
    });

    return comments.map(commentSummary);
  }
};
