import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const ProjectMember = sequelize.define('ProjectMember', {
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'project_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'user_id'
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'MEMBER'),
    allowNull: false,
    defaultValue: 'MEMBER'
  }
}, {
  tableName: 'project_members'
});
