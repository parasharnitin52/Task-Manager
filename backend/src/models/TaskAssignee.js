import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const TaskAssignee = sequelize.define('TaskAssignee', {
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'task_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'user_id'
  }
}, {
  tableName: 'task_assignees'
});
