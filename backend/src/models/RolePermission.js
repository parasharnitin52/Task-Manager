import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const RolePermission = sequelize.define('RolePermission', {
  role: {
    type: DataTypes.STRING(80),
    primaryKey: true,
    allowNull: false
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  }
}, {
  tableName: 'role_permissions'
});
