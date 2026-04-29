import { User, RolePermission } from '../models/index.js';
import { publicUser, toPlain } from './serializers.js';

export const userRepository = {
  async create({ name, email, passwordHash, role }) {
    const user = await User.create({ name, email, passwordHash, role });
    const perms = await RolePermission.findOne({ where: { role } });
    const result = { ...user.get({ plain: true }), permissions: perms?.permissions };
    return publicUser(result);
  },

  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    const perms = await RolePermission.findByPk(user.role);
    return { ...toPlain(user), permissions: perms?.permissions };
  },

  async findPrivateById(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    const perms = await RolePermission.findByPk(user.role);
    return { ...toPlain(user), permissions: perms?.permissions };
  },

  async findById(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    const perms = await RolePermission.findByPk(user.role);
    const result = { ...user.get({ plain: true }), permissions: perms?.permissions };
    return publicUser(result);
  },

  async list(filters = {}) {
    const where = {};
    if (filters.role) where.role = filters.role;

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'avatar', 'isActive', 'createdAt'],
      order: [['name', 'ASC']]
    });
    return users.map(publicUser);
  },

  async updateProfile(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data);
    return publicUser(user);
  },

  async updateStatus(id, isActive) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update({ isActive });
    return publicUser(user);
  },

  async updatePassword(id, passwordHash) {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.update({ passwordHash });
    return true;
  },

  async delete(id) {
    return User.destroy({ where: { id } });
  }
};
