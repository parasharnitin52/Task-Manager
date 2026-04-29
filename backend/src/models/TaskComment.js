import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const TaskComment = sequelize.define('TaskComment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'task_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'task_comments'
});
